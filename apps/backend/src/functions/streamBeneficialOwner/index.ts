const { TABLE_BENEFICIAL_OWNER, TABLE_ENTITY, TABLE_ENTITY_BENEFICIAL_OWNER } =
  process.env;
import { VerificationStatus } from '/opt/API';
import { appSyncRequest } from '/opt/appsync';
import { batchGet, queryRecords } from '/opt/dynamoDB';
import { updateEntity as UPDATE_ENTITY } from '/opt/graphql/mutations';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';

export const handler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  for (let i = 0; i < event.Records.length; i++) {
    const data = event.Records[i];

    // beneficial owner created
    if (data.eventName === 'INSERT' && data?.dynamodb?.NewImage) {
      const beneficialOwner = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );

      console.log('beneficial owner: ', beneficialOwner);
    }

    // beneficial owner updated
    if (data.eventName === 'MODIFY' && data?.dynamodb?.NewImage) {
      const newBeneficialOwner = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );
      const oldBeneficialOwner = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      );

      console.log('newBeneficialOwner: ', newBeneficialOwner);
      console.log('oldBeneficialOwner: ', oldBeneficialOwner);

      const isNowVerified =
        oldBeneficialOwner.verificationStatus !== VerificationStatus.PASS &&
        newBeneficialOwner.verificationStatus !==
          VerificationStatus.PASS_MANUAL &&
        (newBeneficialOwner.verificationStatus === VerificationStatus.PASS ||
          newBeneficialOwner.verificationStatus ===
            VerificationStatus.PASS_MANUAL);

      const isNowNotVerified =
        (oldBeneficialOwner.verificationStatus === VerificationStatus.PASS ||
          oldBeneficialOwner.verificationStatus ===
            VerificationStatus.PASS_MANUAL) &&
        newBeneficialOwner.verificationStatus !== VerificationStatus.PASS &&
        newBeneficialOwner.verificationStatus !==
          VerificationStatus.PASS_MANUAL;

      // if beneficial owner is now verified
      if (isNowVerified) {
        // get entity beneficial owners
        let entityBeneficialOwners = [];
        try {
          entityBeneficialOwners = await queryRecords({
            tableName: TABLE_ENTITY_BENEFICIAL_OWNER ?? '',
            indexName: 'entityBeneficialOwnersByBeneficialOwner',
            keys: {
              beneficialOwnerId: newBeneficialOwner.id,
            },
          });
          console.log('entityBeneficialOwners: ', entityBeneficialOwners);
        } catch (err: any) {
          console.log('ERROR get entity beneficial owners: ', err);
        }

        // batch get all entities beneficial owner is linked to
        if (entityBeneficialOwners?.length > 0) {
          let entities;
          try {
            entities = await batchGet({
              tableName: TABLE_ENTITY ?? '',
              keys: entityBeneficialOwners.map((entityBeneficialOwner) => ({
                id: entityBeneficialOwner.entityId,
              })),
            });
            console.log('entities: ', entities);
          } catch (err: any) {
            console.log('ERROR batch get entities: ', err);
          }

          if (entities && entities?.length > 0) {
            for (const entity of entities) {
              // if not verified yet, check if all beneficial owners for the entity are now verified
              if (
                entity.verificationStatus !== VerificationStatus.PASS &&
                entity.pepCheckStatus !== VerificationStatus.PASS_MANUAL
              ) {
                // get entity beneficial owners links to find beneficial owners
                let entityBeneficialOwners = [];
                try {
                  entityBeneficialOwners = await queryRecords({
                    tableName: TABLE_ENTITY_BENEFICIAL_OWNER ?? '',
                    indexName: 'entityBeneficialOwnersByEntity',
                    keys: {
                      entityId: entity.id,
                    },
                  });
                  console.log(
                    'entityBeneficialOwners: ',
                    entityBeneficialOwners
                  );
                } catch (err: any) {
                  console.log('ERROR query beneficial owners: ', err);
                }

                // get all beneficial owners  from entity beneficial owners
                let beneficialOwners;
                try {
                  const keys = entityBeneficialOwners.map(
                    ({ beneficialOwnerId }: { beneficialOwnerId: string }) => ({
                      id: beneficialOwnerId,
                    })
                  );
                  console.log('beneficialOwners keys: ', keys);
                  beneficialOwners = await batchGet({
                    tableName: TABLE_BENEFICIAL_OWNER ?? '',
                    keys,
                  });
                  console.log('beneficialOwners: ', beneficialOwners);
                } catch (err: any) {
                  console.log('ERROR get beneficial owners: ', err);
                }

                // check if all beneficial owners are verified
                if (beneficialOwners && beneficialOwners?.length > 0) {
                  const allVerified = beneficialOwners.every(
                    (beneficialOwner) =>
                      beneficialOwner.verificationStatus ===
                        VerificationStatus.PASS ||
                      beneficialOwner.verificationStatus ===
                        VerificationStatus.PASS_MANUAL
                  );
                  console.log('allVerified: ', allVerified);

                  if (allVerified) {
                    // update entity verification status
                    //try {
                    //  await updateRecord(
                    //    TABLE_ENTITY ?? '',
                    //    {
                    //      id: entity.id,
                    //    },
                    //    {
                    //      verificationStatus: VerificationStatus.PASS,
                    //    }
                    //  );
                    //} catch (err: any) {
                    //  console.log('ERROR update entity: ', err);
                    //}

                    const input = {
                      id: entity.id,
                      verificationStatus: VerificationStatus.PASS,
                      updatedAt: new Date().toISOString(),
                    };
                    const body = {
                      query: UPDATE_ENTITY,
                      variables: {
                        input,
                      },
                    };

                    try {
                      const result = await appSyncRequest(body);
                      if (typeof result.body === 'string') {
                        console.log('Updated entity: ', result.body);
                      }
                    } catch (err: any) {
                      console.log('ERROR update entity: ', err);
                    }
                  }
                }
              }
            }
          }
        }
      }
      //TODO: reverse of verification
      else if (isNowNotVerified) {
        //
      }
    }
  }
};

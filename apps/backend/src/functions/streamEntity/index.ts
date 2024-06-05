const {
  TABLE_AUTOCOMPLETE_RESULT,
  TABLE_BENEFICIAL_OWNER,
  TABLE_ENTITY,
  TABLE_ENTITY_BENEFICIAL_OWNER,
} = process.env;

import { abrLookupByAbn } from '/opt/abr';
import { BeneficialOwner, VerificationStatus, EntityType } from '/opt/API';
import { createRecord, updateRecord } from '/opt/dynamoDB';
import { FrankieOneEntityTypeMap, initApi } from '/opt/frankieone';
import {
  EntityObject,
  EnumAddressType,
  EnumEntityType,
  EnumKVPType,
} from '/opt/frankieone/frankieone.types';
import {
  CreateZaiAuthTokenResponse,
  createZaiCompany,
  CreateZaiCompanyRequest,
  createZaiUser,
  initZai,
  updateZaiCompany,
  UpdateZaiCompanyRequest,
} from '/opt/zai';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

//TODO: types in this file
//TODO: some refactoring on DB calls. Can DB calls be reduced?
//TODO: some refactoring, duplication of db calls, etc.

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  const frankieOne = initApi();

  for (let i = 0; i < event.Records.length; i++) {
    const data = event.Records[i];

    // record created
    if (data.eventName === 'INSERT' && data?.dynamodb?.NewImage) {
      const entity = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );
      console.log('entity: ', entity);
      let updateEntityParams = {};

      // create individual entity for KYC
      if (entity.type === EntityType.INDIVIDUAL) {
        //TODO: for sole trader?
        const beneficialOwnerId = randomUUID();

        // create individual frankieone entity
        const frankieOneEntityParams: EntityObject = {
          entityType: EnumEntityType.INDIVIDUAL,
          entityProfile: 'auto',
          name: {
            displayName: entity.name, // TODO: is this required?
            givenName: entity.firstName,
            familyName: entity.lastName,
          },
          extraData: [
            {
              kvpKey: 'customer_reference',
              kvpValue: beneficialOwnerId,
              kvpType: EnumKVPType.IdExternal,
            },
            {
              kvpKey: 'Admiin.AdmiinVerifyType',
              kvpValue: 'ENTITY',
              kvpType: EnumKVPType.GeneralString,
            },
            //TODO: IS this required for individual? as frankieone entity could belong to multiple entities
            {
              kvpKey: 'Admiin.entityId',
              kvpValue: entity.id,
              kvpType: EnumKVPType.IdExternal,
            },
            {
              kvpKey: 'consent.general',
              kvpValue: 'true',
              kvpType: EnumKVPType.GeneralBool,
            },
            {
              kvpKey: 'consent.docs',
              kvpValue: 'true',
              kvpType: EnumKVPType.GeneralBool,
            },
          ],
        };

        if (entity.address) {
          frankieOneEntityParams.addresses = [
            {
              addressType: EnumAddressType.PLACE_OF_BUSINESS,
              unitNumber: entity.address.unitNumber,
              streetNumber: entity.address.streetNumber,
              streetName: entity.address.streetName,
              streetType: entity.address.streetType,
              town: entity.address.city,
              suburb: entity.address.city,
              state: entity.address.state,
              postalCode: entity.address.postalCode,
              country: entity.address.country,
            },
          ];
        }

        let createFrankieOneEntity;
        try {
          console.log('frankieOneEntityParams: ', frankieOneEntityParams);
          createFrankieOneEntity = await frankieOne.entity.createEntity(
            frankieOneEntityParams
          );
          console.log(
            'createFrankieOneEntity: ',
            JSON.stringify(createFrankieOneEntity)
          );
        } catch (err: any) {
          console.log('ERROR createFrankieOneEntity: ', JSON.stringify(err));
        }

        // create beneficial owner for individual / sole trader with frankieone info, which is used for KYC
        if (createFrankieOneEntity?.data.entity.entityId) {
          const createdAt = new Date().toISOString();
          const beneficialOwner: Partial<BeneficialOwner> = {
            id: beneficialOwnerId,
            firstName: entity.firstName,
            lastName: entity.lastName,
            name: `${entity.firstName} ${entity.lastName}`,
            providerEntityId: createFrankieOneEntity.data.entity.entityId,
            verificationStatus: VerificationStatus.UNCHECKED,
            createdBy: entity.owner,
            createdAt,
            updatedAt: createdAt,
            __typename: 'BeneficialOwner',
          };

          try {
            await createRecord(TABLE_BENEFICIAL_OWNER ?? '', beneficialOwner);
          } catch (err: any) {
            console.log('ERROR createRecord TABLE_BENEFICIAL_OWNER: ', err);
          }

          const entityBeneficialOwner = {
            id: randomUUID(),
            entityId: entity.id,
            beneficialOwnerId,
            createdAt,
            updatedAt: createdAt,
            __typename: 'EntityBeneficialOwner',
            owner: entity.owner,
          };
          try {
            await createRecord(
              TABLE_ENTITY_BENEFICIAL_OWNER ?? '',
              entityBeneficialOwner
            );
          } catch (err: any) {
            console.log(
              'ERROR createRecord TABLE_ENTITY_BENEFICIAL_OWNER: ',
              err
            );
          }

          // update entity with frankieOne entity id
          updateEntityParams = {
            ...updateEntityParams,
            gstRegistered: false,
            frankieOneEntityId: createFrankieOneEntity.data.entity.entityId,
            ubosCreated: true,
          };
        }
      }

      // non-individual entity
      else {
        let abrDetails;
        if (entity.taxNumber) {
          try {
            abrDetails = await abrLookupByAbn(entity.taxNumber);
            console.log('abrDetails: ', abrDetails);
          } catch (err) {
            console.log('ERROR abrLookupByAbn: ', err);
          }
        }

        if (abrDetails) {
          updateEntityParams = {
            ...updateEntityParams,
            gstRegistered: !!abrDetails?.gst,
          };
        }

        // Create autocomplete result for bpay entities
        if (entity.type === EntityType.BPAY) {
          const sanitisedEmail = entity.email.replace(/\+.+@/, '@');
          const [username, domain] = sanitisedEmail.split('@');
          const zaiEmail = `${username}+${entity.id}@${domain}`; // make unique email address for Zai (as email for users must be unique)
          try {
            const zaiUserData = {
              id: entity.owner,
              first_name: entity.firstName,
              last_name: entity.lastName,
              email: zaiEmail,
              //mobile: newUser.phone, //TODO: what to do here? Mobile is unique in Zai
              country: 'AUS',
            };

            console.log('zaiUserData: ', zaiUserData);
            const response = await createZaiUser(
              zaiAuthToken?.access_token,
              zaiUserData
            );
            console.log('Zai user response: ', JSON.stringify(response));
          } catch (err) {
            console.log('ERROR create zai user: ', err);
          }

          try {
            const createdAt = new Date().toISOString();
            await createRecord(TABLE_AUTOCOMPLETE_RESULT ?? '', {
              id: entity.id,
              value: entity.id,
              label: entity.name,
              type: 'ENTITY',
              searchName: entity.name.toLowerCase(),
              createdAt,
              metadata: {
                payoutMethod: entity.type === 'BPAY' ? 'BPAY' : 'EFT',
                subCategory: entity.subCategory,
              },
              updatedAt: createdAt,
              __typename: 'AutocompleteResult',
            });
          } catch (err) {
            console.log('ERROR createRecord TABLE_AUTOCOMPLETE_RESULT: ', err);
          }

          //TODO: zai user for BPAY entity?
        }
        // create frankieone entity for non-individual entity
        else {
          const entityType = FrankieOneEntityTypeMap[entity.type as EntityType];
          const frankieOneEntityParams: EntityObject = {
            //entityId: entity.id,
            entityType,
            entityProfile: 'auto',
            extraData: [
              //{
              //  kvpKey: 'ABN',
              //  kvpValue: abrDetails.abn,
              //  kvpType: EnumKVPType.IdExternal,
              //},
              {
                kvpKey: 'Admiin.entityId',
                kvpValue: entity.id,
                kvpType: EnumKVPType.IdExternal,
              },
              {
                kvpKey: 'customer_reference',
                kvpValue: entity.id,
                kvpType: EnumKVPType.IdExternal,
              },
              {
                kvpKey: 'Admiin.AdmiinVerifyType',
                kvpValue: 'ENTITY',
                kvpType: EnumKVPType.GeneralString,
              },
              //TODO: do we need to add consent for company entity too?
            ],
            organisationData: {
              registeredName: entity.name,
            },
          };

          if (abrDetails?.abn) {
            frankieOneEntityParams?.extraData?.push({
              kvpKey: 'ABN',
              kvpValue: abrDetails.abn,
              kvpType: EnumKVPType.IdExternal,
            });
          }

          if (abrDetails?.acn) {
            frankieOneEntityParams?.extraData?.push({
              kvpKey: 'ACN',
              kvpValue: abrDetails.acn,
              kvpType: EnumKVPType.IdExternal,
            });
          }

          let createFrankieOneEntity;
          try {
            console.log('frankieOneEntityParams: ', frankieOneEntityParams);
            createFrankieOneEntity = await frankieOne.entity.createEntity(
              frankieOneEntityParams
            );
            console.log(
              'createFrankieOneEntity: ',
              JSON.stringify(createFrankieOneEntity)
            );
          } catch (err: any) {
            console.log('ERROR createFrankieOneEntity: ', JSON.stringify(err));
          }

          // update entity with frankieOne entity id
          if (createFrankieOneEntity?.data.entity.entityId) {
            updateEntityParams = {
              ...updateEntityParams,
              frankieOneEntityId: createFrankieOneEntity.data.entity.entityId,
            };
          }
        }

        // Create company with zai
        //if (entity.taxNumber) {
        // create zai company if non-individual and has ABN

        // create zai company
        if (entity.taxNumber) {
          const zaiEntity: CreateZaiCompanyRequest = {
            name: entity.name,
            legal_name: entity.name, //TODO: need to collect legal trading name?
            tax_number: entity.taxNumber,
            //email: entity.email, //TODO: add user email to entity?
            //mobile: entity.mobile, //TODO: add user mobile to entity?
            user_id: entity.owner,
            country: 'AUS',
            //custom_descriptor: //TODO: allow user to add custom descriptor or generate one on behalf?
          };

          if (entity.address) {
            zaiEntity.address_line1 = entity.address.address1;
            //zaiEntity.address_line2 = entity.address.address2;
            zaiEntity.city = entity.address.city;
            zaiEntity.state = entity.address.state;
            zaiEntity.zip = entity.address.postalCode;
            zaiEntity.country = entity.address.country; //TODO: need to collect country code?
          }

          console.log('create zai entity: ', zaiEntity);

          // create zai company
          let zaiCompany;
          try {
            zaiCompany = await createZaiCompany(
              zaiAuthToken?.access_token,
              zaiEntity
            );
            console.log('createZaiCompany: ', zaiCompany);
          } catch (err) {
            console.log('ERROR createZaiCompany: ', err);
          }

          // update entity record if new data created
          if (
            zaiCompany?.companies?.id
            //|| createFrankieOneEntity?.data.entity.entityId
          ) {
            updateEntityParams = {
              ...updateEntityParams,
              zaiCompanyId: zaiCompany?.companies?.id,
            };
          }
          //}
        }
      }

      if (Object.keys(updateEntityParams).length > 0) {
        updateEntityParams = {
          ...updateEntityParams,
          updatedAt: new Date().toISOString(),
        };
        let updatedEntity;
        try {
          updatedEntity = await updateRecord(
            TABLE_ENTITY ?? '',
            { id: entity.id },
            updateEntityParams
          );

          console.log('Updated entity: ', updatedEntity);
        } catch (err: any) {
          console.log('ERROR updateRecord TABLE_ENTITY: ', err);
        }
      }
    }

    // record updated
    if (
      data.eventName === 'MODIFY' &&
      data?.dynamodb?.NewImage &&
      data?.dynamodb?.OldImage
    ) {
      const newEntity = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );
      const oldEntity = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      );
      console.log('newEntity: ', newEntity);
      console.log('oldEntity: ', oldEntity);

      // update zai company if non-individual and has ABN
      if (newEntity.taxNumber && newEntity.type !== EntityType.INDIVIDUAL) {
        const zaiEntity: UpdateZaiCompanyRequest = {
          name: newEntity.name,
          legal_name: newEntity.name, //TODO: need to collect legal trading name?
          tax_number: newEntity.taxNumber,
          //email: newEntity.email, //TODO: add user email to entity?
          //mobile: newEntity.mobile, //TODO: add user mobile to entity?
          user_id: newEntity.owner,
          country: 'AUS',
          //custom_descriptor: //TODO: allow user to add custom descriptor or generate one on behalf?
        };

        if (newEntity.address) {
          zaiEntity.address_line1 = newEntity.address.address1;
          //zaiEntity.address_line2 = newEntity.address.address2;
          zaiEntity.city = newEntity.address.city;
          zaiEntity.state = newEntity.address.state;
          zaiEntity.zip = newEntity.address.postalCode;
          zaiEntity.country = newEntity.address.country; //TODO: need to collect country code?
        }

        console.log('zaiEntity: ', zaiEntity);

        try {
          const zaiCompany = await updateZaiCompany(
            zaiAuthToken?.access_token,
            newEntity.zaiCompanyId,
            zaiEntity
          );
          console.log('updateZaiCompany: ', zaiCompany);
        } catch (err) {
          console.log('ERROR updateZaiCompany: ', err);
        }

        //TODO: this is adding address, should it be updating?
        if (
          newEntity.frankieOneEntityId &&
          newEntity.address &&
          !oldEntity.address
        ) {
          // update frankieone entity
          const updateFrankieOneEntity: EntityObject = {
            addresses: [
              {
                addressType: EnumAddressType.PLACE_OF_BUSINESS,
                unitNumber: newEntity.address.unitNumber,
                streetNumber: newEntity.address.streetNumber,
                streetName: newEntity.address.streetName,
                streetType: newEntity.address.streetType,
                town: newEntity.address.city,
                suburb: newEntity.address.city,
                state: newEntity.address.state,
                postalCode: newEntity.address.postalCode,
                country: newEntity.address.country,
              },
            ],
          };

          try {
            console.log('updateFrankieOneEntity: ', updateFrankieOneEntity);
            const response = await frankieOne.entity.updateEntity(
              newEntity.frankieOneEntityId,
              updateFrankieOneEntity
            );
            console.log('frankieOne.entity.updateEntity response: ', response);
          } catch (err: any) {
            console.log('ERROR updateFrankieOneEntity: ', err);
          }
        }
      }
    }
  }
};

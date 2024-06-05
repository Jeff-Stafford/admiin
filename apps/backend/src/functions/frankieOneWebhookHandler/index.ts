const { TABLE_BENEFICIAL_OWNER, TABLE_ENTITY_BENEFICIAL_OWNER, TABLE_ENTITY } =
  process.env;
import { EntityType, UpdateEntityInput, VerificationStatus } from '/opt/API';
import { appSyncRequest } from '/opt/appsync';
import { createRecord, getRecord } from '/opt/dynamoDB';
import { initApi } from '/opt/frankieone';
import { EnumKVPType } from '/opt/frankieone/frankieone.types';
import {
  updateEntity as UPDATE_ENTITY,
  updateBeneficialOwner as UPDATE_BENEFICIAL_OWNER,
} from '/opt/graphql/mutations';
import { randomUUID } from 'crypto';

// Type for state change update
type StateChangeUpdate = {
  checkId: string;
  entityId: string;
  function: string;
  functionResult: string;
  notificationType: string;
  requestId: string;
};

// Type for risk level change
type RiskLevelChange = {
  entityId: string;
  function: string;
  functionResult: 'EntityRiskChange';
  notificationType: string;
  requestId: string;
  message: string;
};

type UpdateCheckEntity = {
  entityId: string;
  entityCustomerReference: string;
  function: 'UpdateCheckEntity';
  functionResult: string;
  notificationType: string;
  requestId: string;
};

type CheckOrganisation = {
  entityId: string;
  function: 'CheckOrganisation';
  functionResult: string;
  notificationType: string;
  requestId: string;
  checkId: string;
};

interface FrankieOneHandlerEvent {
  webhookEvent: {
    payload:
      | StateChangeUpdate
      | RiskLevelChange
      | UpdateCheckEntity
      | CheckOrganisation;
  };
}

const getOwnershipResult = (
  retrieveResult: any,
  kvpKey: string
): string | undefined => {
  const { entityId, ownershipDetails } = retrieveResult.ownershipQueryResult;
  const result = ownershipDetails[entityId].organisation.extraData.find(
    (data: any) => data.kvpKey === kvpKey
  );

  return result?.kvpValue;
};

export const handler = async (event: FrankieOneHandlerEvent) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const {
    webhookEvent: { payload },
  } = event;

  const frankieOne = initApi();
  console.log('payload: ', payload);

  const requestId = payload.requestId;
  let retrieveResult;

  //if (
  //  payload.function === 'BusinessOwnershipQuery' ||
  //  payload.function === 'UpdateCheckEntity' ||
  //  payload.function === 'EntityRiskChange' ||
  //  payload.function === 'EntityStatusChange') {
  try {
    const data = await frankieOne.retrieve.retrieveResult(requestId);
    if (data.data.payload) {
      retrieveResult = JSON.parse(data.data.payload); //TODO: api type was Record<string, any> however turns out to be a string
    }
    console.log('Retrieved result: ', JSON.stringify(retrieveResult));
  } catch (err: any) {
    console.log('ERROR frankieOne.retrieve.retrieveResult: ', err);
  }
  //}

  let admiinEntityId;
  let ultimateBeneficialOwners;
  let updateEntityParams: Partial<UpdateEntityInput> = {
    //TODO: type for update entity
  };
  // verification of UBO / Frankieone entity has changed
  if (payload.function === 'UpdateCheckEntity') {
    console.log('UpdateCheckEntity');
    const entityCustomerReference = payload.entityCustomerReference;
    console.log('entityCustomerReference: ', entityCustomerReference);

    const entityProfileResult = retrieveResult?.entityProfileResult;
    console.log('entityProfileResult: ', entityProfileResult);
    //const frankieOneEntityId = retrieveResult?..entityProfileResult.entityId
    const actionRecommended = entityProfileResult?.actionRecommended;
    // const addressResults = entityProfileResult?.addressResults;
    // const checkResults = entityProfileResult?.checkResults;
    // const checkType = entityProfileResult?.checkType;
    // const documentResults = entityProfileResult?.documentResults;
    const frankieOneEntityId = entityProfileResult?.entityId;
    console.log('frankieOneEntityId: ', frankieOneEntityId);
    //const manualIntervention = entityProfileResult?.manualIntervention;
    const latestCheckDate = entityProfileResult?.latestCheckDate;
    //const riskLevel = entityProfileResult?.riskLevel;

    const updateBeneficialOwnerRecord = {
      verificationStatus:
        VerificationStatus[actionRecommended as VerificationStatus],
      id: entityCustomerReference,
      lastCheckedAt: latestCheckDate,
    };

    //let updatedBeneficialOwner;
    //try {
    //  updatedBeneficialOwner = await updateRecord(
    //    TABLE_BENEFICIAL_OWNER ?? '',
    //    { id: entityCustomerReference },
    //    updateBeneficialOwnerRecord
    //  );
    //  console.log('updatedBeneficialOwner: ', updatedBeneficialOwner);
    //} catch (err: any) {
    //  console.log('ERROR update beneficial owner: ', err);
    //}

    console.log('updateBeneficialOwnerRecord: ', updateBeneficialOwnerRecord);

    const body = {
      query: UPDATE_BENEFICIAL_OWNER,
      variables: {
        input: updateBeneficialOwnerRecord,
      },
    };

    try {
      const result = await appSyncRequest(body);
      if (typeof result.body === 'string') {
        //return JSON.parse(result.body);
        console.log('Updated beneficial owner: ', result.body);
      }
    } catch (err: any) {
      console.log('ERROR update beneficial owner: ', err);
    }
    //
    //let updatedBeneficialOwner;
    //try {
    //  updatedBeneficialOwner = await updateBeneficialOwner(
    //    updateBeneficialOwnerRecord
    //  );
    //  console.log('updatedBeneficialOwner: ', updatedBeneficialOwner);
    //} catch (err) {
    //  console.log('ERROR update beneficial owner: ', err);
    //}

    if (
      actionRecommended === VerificationStatus.PASS ||
      actionRecommended === VerificationStatus.PASS_MANUAL
    ) {
      let frankieOneEntity;
      try {
        frankieOneEntity = await frankieOne.entity.queryEntity(
          frankieOneEntityId
        );
        console.log('frankieOneEntity: ', JSON.stringify(frankieOneEntity));
      } catch (err: any) {
        console.log('ERROR frankieOne.entity.queryEntity: ', err);
      }

      admiinEntityId = frankieOneEntity?.data?.entity?.extraData?.find(
        (data: any) => data.kvpKey === 'Admiin.entityId'
      )?.kvpValue;
      console.log('admiinEntityId: ', admiinEntityId);

      const verifyType = frankieOneEntity?.data?.entity?.extraData?.find(
        (data: any) => data.kvpKey === 'Admiin.AdmiinVerifyType'
      )?.kvpValue;
      console.log('verifyType: ', verifyType);

      if (admiinEntityId) {
        let entity;
        try {
          entity = await getRecord(TABLE_ENTITY ?? '', {
            id: admiinEntityId,
          });
        } catch (err: any) {
          console.log('ERROR get entity: ', err);
        }

        // if individual or sole trader and passed - mark entity as verified
        if (
          entity.type === EntityType.INDIVIDUAL ||
          entity.type === EntityType.SOLE_TRADER
        ) {
          const firstName = frankieOneEntity?.data?.entity?.name?.givenName;
          const lastName = frankieOneEntity?.data?.entity?.name?.familyName;
          updateEntityParams = {
            ...updateEntityParams,
            verificationStatus: VerificationStatus.PASS,
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            contact: {
              ...entity.contact,
              firstName,
              lastName,
            },
            legalName: `${firstName} ${lastName}`,
            //verifiedAt: //TODO: necessary?
          };

          //try {
          //  const updatedEntity = await updateRecord(
          //    TABLE_ENTITY ?? '',
          //    { id: entity.id },
          //    updateEntityParams
          //  );
          //  console.log('updatedEntity: ', updatedEntity);
          //} catch (err: any) {
          //  console.log('ERROR update entity: ', err);
          //}
        }
      }
    }
  }

  // OWNERSHIP QUERY - UBOs RETRIEVED
  else if (payload.function === 'BusinessOwnershipQuery') {
    console.log('BusinessOwnershipQuery');
    const frankieOneEntityId = retrieveResult.ownershipQueryResult.entityId;
    console.log('frankieOneEntityId: ', frankieOneEntityId);

    // TODO: inform user that ubo look up has occurred and is now ready for verification
    if (retrieveResult?.uboResponse) {
      console.log('uboResponse: ', retrieveResult.uboResponse);

      //const flags = retrieveResult.uboResponse.flags;

      const blockingEntityDetails =
        retrieveResult.ownershipQueryResult.blockingEntityDetails;
      console.log('blockingEntityDetails: ', blockingEntityDetails);

      // If there was a fatal error in processing, it will appear here
      //const errorMessage = retrieveResult.uboResponse.error_message;

      //The company's registered office.
      //const registeredOffice = retrieveResult.uboResponse.registered_office;

      //const placeOfBusiness = retrieveResult.uboResponse.place_of_business;

      // If there are any corporate owners of a company with a controlling interest,
      // then these are listed here
      //const nonIndividualBeneficialOwners =
      retrieveResult.uboResponse.non_individual_beneficial_owners;

      // Directors and optionally, company secretaries are listed here.
      //They too can be KYC/AML check as well, and the summary provided below.
      //const officeholders = retrieveResult.uboResponse.officeholders;

      // If the business has been checked for sanctions or adverse media, then the
      // summary of those details are given here. Full details of the screening
      // are given in the check results and can also be seen in the Frankie portal.
      // const businessScreeningResult =
      //   retrieveResult.uboResponse.business_screening_result;

      // This section will list all those individuals who have been determined to
      // have a controlling interest in the company of 25% or more.
      ultimateBeneficialOwners =
        retrieveResult.uboResponse.ultimate_beneficial_owners;

      const legalName =
        retrieveResult.uboResponse.business_details.registered_name;
      console.log('legalName: ', legalName);
      console.log(
        'ultimateBeneficialOwners: ',
        JSON.stringify(ultimateBeneficialOwners)
      );

      admiinEntityId = getOwnershipResult(retrieveResult, 'Admiin.entityId');
      console.log('admiinEntityId: ', admiinEntityId);
      const verifyType = getOwnershipResult(
        retrieveResult,
        'Admiin.AdmiinVerifyType'
      );
      console.log('verifyType: ', verifyType);

      if (!ultimateBeneficialOwners || ultimateBeneficialOwners?.length === 0) {
        console.log('NO UBOS FOR ENTITY');
      } else {
        for (let i = 0; i < ultimateBeneficialOwners.length; i++) {
          const frankieOneUbo = ultimateBeneficialOwners[i];
          console.log('ubo: ', frankieOneUbo);
          const createdAt = new Date().toISOString();
          const entityBeneficialOwner = {
            id: randomUUID(),
            entityId: admiinEntityId,
            beneficialOwnerId: frankieOneUbo.entityId,
            createdAt,
            updatedAt: createdAt,
          };

          console.log('entityBeneficialOwner: ', entityBeneficialOwner);
          try {
            await createRecord(
              TABLE_ENTITY_BENEFICIAL_OWNER ?? '',
              entityBeneficialOwner,
              'attribute_not_exists(entityId) AND attribute_not_exists(beneficialOwnerId)'
            );
          } catch (err: any) {
            console.log('ERROR create entity beneficial owner: ', err);
          }

          // create UBO record
          const beneficialOwnerParams = {
            id: frankieOneUbo.entityId,
            providerEntityId: frankieOneUbo.entityId,
            name: frankieOneUbo.name,
            verificationStatus: VerificationStatus.UNCHECKED,
            createdAt,
            updatedAt: createdAt,
            __typename: 'BeneficialOwner',
          };

          console.log('beneficialOwnerParams: ', beneficialOwnerParams);

          try {
            await createRecord(
              TABLE_BENEFICIAL_OWNER ?? '',
              beneficialOwnerParams,
              'attribute_not_exists(id)'
            );
          } catch (err: any) {
            console.log('ERROR create beneficial owner: ', err);
            if (err.code === 'ConditionalCheckFailedException') {
              //TODO: err.code doesn't work, need to access error code some other way
              console.log('existing beneficial owner');
            }
          }

          // update frankie one ubo / entity with Admiin reference number
          try {
            const updatedFrankieOneUbo = await frankieOne.entity.updateEntity(
              frankieOneUbo.entityId,
              {
                extraData: [
                  //{
                  //  kvpKey: 'customer_reference',
                  //  kvpValue: beneficialOwnerParams.id,
                  //  kvpType: EnumKVPType.IdExternal,
                  //},
                  {
                    kvpKey: 'Admiin.AdmiinVerifyType',
                    kvpValue: 'UBO',
                    kvpType: EnumKVPType.GeneralString,
                  },
                ],
              }
            );

            console.log('updatedFrankieOneUbo: ', updatedFrankieOneUbo);
          } catch (err: any) {
            console.log('ERROR update frankieone ubo: ', err);
          }
        }
      }

      updateEntityParams = {
        ...updateEntityParams,
        legalName,
        ubosCreated: true, //TODO: should be enum? e.g.  not_created, created, no_ubos
        numUbosCreated: ultimateBeneficialOwners?.length ?? 0,
      };
    }

    // TRIGGER AML check
    // NOTE: This will only return check details for an Australian Organisation that has previously called:
    let checkOrganisationResponse;
    try {
      checkOrganisationResponse = await frankieOne.business.checkOrganisation(
        frankieOneEntityId,
        {
          //TODO: likely this will be used to verify UBOs? Also AML check?
        }
      );

      console.log(
        'amlResponse: ',
        checkOrganisationResponse?.data ?? checkOrganisationResponse
      );
    } catch (err: any) {
      console.log(
        'ERROR frankieOne.business.businessAMLCheck: ',
        JSON.stringify(err)
      );
      throw new Error(`${err?.error?.errorCode}: ${err?.error?.errorMsg}`);
    }
  }

  // ORGANISATION CHECK - PEP
  else if (payload.function === 'CheckOrganisation') {
    console.log('CheckOrganisation');
    if (retrieveResult?.organisationCheckResult?.entityCheckResults) {
      const frankieOneEntityId =
        retrieveResult?.organisationCheckResult?.entityId;
      admiinEntityId = getOwnershipResult(retrieveResult, 'customer_reference');
      console.log('frankieOneEntityId: ', frankieOneEntityId);
      console.log('admiinEntityId: ', admiinEntityId);

      const entityProfileResult =
        retrieveResult?.organisationCheckResult?.entityCheckResults?.[
          frankieOneEntityId
        ]?.entityProfileResult;
      console.log('entityProfileResult: ', entityProfileResult);

      if (entityProfileResult?.checkType === 'pep') {
        updateEntityParams = {
          ...updateEntityParams,
          pepCheckStatus: entityProfileResult?.actionRecommended,
        };
      } else {
        console.log('CheckOrganisation CHECKTYPE NOT HANDLED');
      }
    }
  }

  //TODO: what to do with this?
  else if (payload.function === 'EntityRiskChange') {
    //
  }
  // UNHANDLED
  else {
    console.log('UNHANDLED FUNCTION: ', payload.function);
  }

  //let entity;
  //try {
  //  entity = await getRecord(TABLE_ENTITY ?? '', { id: admiinEntityId });
  //  console.log('entity: ', entity);
  //} catch (err: any) {
  //  console.log('ERROR get entity: ', err);
  //}

  //TODO: call update mutation from IAM instead of insert into DB
  //updateEntityParams = {
  //  ...updateEntityParams,
  //  id: admiinEntityId,
  //  updatedAt: new Date().toISOString()
  //};

  //TODO: conditional check? / only update if entity exists
  if (Object.keys(updateEntityParams).length > 1 && admiinEntityId) {
    console.log('updateEntityParams: ', updateEntityParams);
    const input = {
      ...updateEntityParams,
      id: admiinEntityId,
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

    //try {
    //  updatedEntity = await updateEntity({
    //    ...updateEntityParams,
    //    id: admiinEntityId,
    //    updatedAt: new Date().toISOString(),
    //  } as UpdateEntityInput);
    //  console.log('updatedEntity: ', updatedEntity);
    //} catch (err: any) {
    //  console.log('ERROR update entity: ', err);
    //}
  }

  // TODO: https://apidocs.frankiefinancial.com/docs/business-ownership-issues-list
  const issuesList = retrieveResult?.issues_list;
  console.log('issuesList: ', issuesList);
};

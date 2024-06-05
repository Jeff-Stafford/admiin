const { TABLE_ENTITY, TABLE_ENTITY_USER, TABLE_USER } = process.env;
import { EntityType, VerificationStatus } from '/opt/API';
import {
  CreateZaiAuthTokenResponse,
  createZaiUser,
  getZaiUserWallet,
  initZai,
  updateZaiUser,
} from '/opt/zai';
import { getWalletAccountNppDetails } from '/opt/zai/walletAccounts';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { createRecord, updateRecord } from '/opt/dynamoDB';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { generateEntityEmail } from '/opt/entity';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  for (let i = 0; i < event.Records.length; i++) {
    const data = event.Records[i];

    // UPDATE RECORD TRIGGERED
    if (
      data.eventName === 'MODIFY' &&
      data?.dynamodb?.NewImage &&
      data?.dynamodb?.OldImage
    ) {
      const newUser = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );
      const oldUser = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      );
      console.log('newUser: ', newUser);
      console.log('oldUser: ', oldUser);

      // ENTITY - Create individual entity and entity user records
      if (
        !oldUser.firstName &&
        newUser.firstName &&
        !oldUser.lastName &&
        newUser.lastName
      ) {
        const name = `${newUser.firstName} ${newUser.lastName}`;
        const createdAt = new Date().toISOString();
        const entityData = {
          id: newUser.id, //set individual entity as the user's ID
          owner: newUser.id,
          ocrEmail: generateEntityEmail(name ?? ''),
          paymentMethodId: null,
          searchName: name.toLowerCase() ?? '',
          phone: newUser.phone,
          type: EntityType.INDIVIDUAL,
          name,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          contact: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
          },
          ubosCreated: null,
          verificationStatus: VerificationStatus.UNCHECKED,
          createdAt,
          updatedAt: createdAt,
        };

        const entityUserData = {
          id: randomUUID(),
          owner: newUser.id,
          entityId: entityData.id,
          entitySearchName: entityData.searchName,
          searchName: name,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: 'OWNER',
          userId: newUser.id,
          verificationStatus: VerificationStatus.UNCHECKED,
          createdBy: newUser.id,
          createdAt,
          updatedAt: createdAt,
        };

        console.log('entityData: ', entityData);
        console.log('entityUserData: ', entityUserData);
        const requests = [
          createRecord(TABLE_ENTITY ?? '', entityData),
          createRecord(TABLE_ENTITY_USER ?? '', entityUserData),
        ];

        try {
          const entityResponses = await Promise.all(requests);
          console.log('Entity responses: ', entityResponses);
        } catch (err) {
          console.log('ERROR create entity: ', err);
        }
      }

      // ZAI - create zai user
      if (
        !newUser.zaiUserId &&
        newUser.firstName &&
        newUser.lastName &&
        newUser.email
      ) {
        let zaiUser;

        const sanitisedEmail = newUser.email.replace(/\+.+@/, '@');
        const [username, domain] = sanitisedEmail.split('@');
        const zaiEmail = `${username}+${newUser.id}@${domain}`; // make unique email address for Zai (as email for users must be unique)
        try {
          const zaiUserData = {
            id: newUser.id,
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            email: zaiEmail,
            //mobile: newUser.phone, //TODO: what to do here? Mobile is unique in Zai
            country: 'AUS',
            ip_address: newUser.ipAddress,
          };
          console.log('zaiUserData: ', zaiUserData);
          const response = await createZaiUser(
            zaiAuthToken?.access_token,
            zaiUserData
          );
          console.log('Zai user response: ', response);
          zaiUser = response.users;
        } catch (err) {
          console.log('ERROR create zai user: ', err);
        }

        // update user record with new zai user id
        if (zaiUser?.id) {
          let zaiUserWallet;
          try {
            zaiUserWallet = await getZaiUserWallet(
              zaiAuthToken?.access_token,
              zaiUser.id
            );
            console.log('zaiUserWallet: ', zaiUserWallet);
          } catch (err: any) {
            console.log('ERROR get zai user wallet: ', err);
          }

          let walletAccountNppDetails;
          try {
            walletAccountNppDetails = await getWalletAccountNppDetails(
              zaiAuthToken?.access_token,
              zaiUserWallet?.wallet_accounts?.id ?? ''
            );
            console.log('walletAccountNppDetails: ', walletAccountNppDetails);
          } catch (err: any) {
            console.log('ERROR get wallet account npp details: ', err);
          }

          //TODO: also store payId?
          try {
            await updateRecord(
              TABLE_USER ?? '',
              {
                id: newUser.id,
              },
              {
                zaiUserId: zaiUser.id,
                zaiUserWalletId: zaiUserWallet?.wallet_accounts?.id ?? null,
                zaiNppCrn:
                  walletAccountNppDetails?.wallet_accounts?.npp_details
                    ?.reference ?? null,
              }
            );
          } catch (err: any) {
            console.log('ERROR get user: ', err);
          }
        }
      }

      // ZAI - update zai user
      else if (
        newUser.firstName !== oldUser.firstName ||
        newUser.lastName !== oldUser.lastName
      ) {
        const zaiUpdateUserParams = {
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          ipAddress: newUser.ipAddress,
        };

        try {
          const zaiUser = await updateZaiUser(
            zaiAuthToken?.access_token,
            newUser.id,
            zaiUpdateUserParams
          );
          console.log('zaiUser: ', zaiUser);
        } catch (err: any) {
          console.log('ERROR get user: ', err);
        }
      }
    }
  }
};

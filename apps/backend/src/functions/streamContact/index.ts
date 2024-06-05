const { TABLE_CONTACT } = process.env;
import { BankAccountType, BankHolderType } from '/opt/API';
import { updateRecord } from '/opt/dynamoDB';
import {
  BankAccounts,
  CreateBankRequest,
  CreateZaiAuthTokenResponse,
  createZaiBankAccount,
  createZaiUser,
  getZaiUserWallet,
  initZai,
} from '/opt/zai';
import { getWalletAccountNppDetails } from '/opt/zai/walletAccounts';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBStreamHandler } from 'aws-lambda';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

//TODO: types in this file
//TODO: contact type with hidden backend / zai fields

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  for (let i = 0; i < event.Records.length; i++) {
    const data = event.Records[i];

    // record created
    if (data.eventName === 'INSERT' && data?.dynamodb?.NewImage) {
      const contact = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );

      console.log('contact: ', contact);

      // ZAI - create zai user
      if (
        !contact.zaiUserId &&
        contact.firstName &&
        contact.lastName &&
        contact.email
      ) {
        let zaiUser;

        const sanitisedEmail = contact.email.replace(/\+.+@/, '@');
        const [username, domain] = sanitisedEmail.split('@');
        const zaiEmail = `${username}+${contact.id}@${domain}`; // make unique email address for Zai (as email for users must be unique)
        try {
          const zaiUserData = {
            id: contact.id,
            first_name: contact.firstName,
            last_name: contact.lastName,
            email: zaiEmail,
            //mobile: contact.phone, //TODO: what to do here? Mobile is unique in Zai
            country: 'AUS',
            //ip_address: contact.ipAddress,
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

        if (zaiUser?.id) {
          // create zai bank account
          let bankAccount: BankAccounts | null = null;
          if (contact?.bank?.accountNumber) {
            const bank: CreateBankRequest = {
              user_id: contact.id,
              bank_name: contact.bank.bankName ?? '', // TODO: generate based on bsb?
              account_name:
                contact.bank.accountName ??
                contact.companyName ??
                `${contact.firstName} ${contact.lastName}`,
              account_number: contact.bank.accountNumber,
              routing_number: contact.bank.routingNumber,
              account_type: contact.bank.accountType ?? BankAccountType.savings,
              holder_type: contact.bank.holderType ?? BankHolderType.business,
              country: 'AUS',
            };

            try {
              const data = await createZaiBankAccount(
                zaiAuthToken?.access_token,
                bank
              );
              bankAccount = data.bank_accounts;
              console.log('bankAccount: ', bankAccount);
            } catch (err: any) {
              console.log('ERROR create zai bank account: ', err);
            }
          }

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

          // update user record with new zai user id
          const updateContactData: any = {
            zaiUserId: zaiUser.id,
            zaiUserWalletId: zaiUserWallet?.wallet_accounts?.id ?? null,
            zaiNppCrn:
              walletAccountNppDetails?.wallet_accounts?.npp_details
                ?.reference ?? null,
          };

          if (bankAccount) {
            updateContactData.bank = {
              ...contact.bank,
              id: bankAccount.id,
            };
          }

          try {
            await updateRecord(
              TABLE_CONTACT ?? '',
              {
                id: contact.id,
              },
              updateContactData
            );
          } catch (err: any) {
            console.log('ERROR update contact: ', err);
          }
        }
      }
    }
    // contact has been updated
    else if (data.eventName === 'MODIFY' && data?.dynamodb?.NewImage) {
      const newContact = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      );
      const oldContact = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      );

      console.log('contact: ', newContact);

      // ZAI - update zai user
      if (
        newContact.zaiUserId &&
        newContact.bank?.accountNumber !== oldContact.bank?.accountNumber
      ) {
        // create zai bank account
        let bankAccount: BankAccounts | null = null;
        const bank: CreateBankRequest = {
          user_id: newContact.id,
          bank_name: newContact.bank.bankName ?? '', // TODO: generate based on bsb?
          account_name:
            newContact.bank.accountName ??
            newContact.companyName ??
            `${newContact.firstName} ${newContact.lastName}`,
          account_number: newContact.bank.accountNumber,
          routing_number: newContact.bank.routingNumber,
          account_type: newContact.bank.accountType ?? BankAccountType.savings,
          holder_type: newContact.bank.holderType ?? BankHolderType.business,
          country: 'AUS',
        };

        try {
          const data = await createZaiBankAccount(
            zaiAuthToken?.access_token,
            bank
          );
          bankAccount = data.bank_accounts;
          console.log('bankAccount: ', bankAccount);
        } catch (err: any) {
          console.log('ERROR create zai bank account: ', err);
        }

        if (bankAccount) {
          const updateData = {
            bank: {
              ...newContact.bank,
              id: bankAccount.id,
            },
          };

          try {
            await updateRecord(
              TABLE_CONTACT ?? '',
              {
                id: newContact.id,
              },
              updateData
            );
          } catch (err: any) {
            console.log('ERROR update contact: ', err);
          }
        }
      }
    }
  }
};

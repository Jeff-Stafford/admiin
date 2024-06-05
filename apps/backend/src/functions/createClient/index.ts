const {
  AUTH_USERPOOLID,
  FUNCTION_CREATEUSER,
  TABLE_ENTITY_USER,
  TABLE_ENTITY,
  REGION,
} = process.env;
import {
  Entity,
  EntityUserRole,
  OnboardingStatus,
  VerificationStatus,
} from '/opt/API';
import { generate5DigitNumber } from '/opt/code';
import {
  CognitoUserProps,
  createCognitoUser,
  getCognitoUser,
} from '/opt/cognito';
import { createRecord, getRecord } from '/opt/dynamoDB';
import { validateEntityUser } from '/opt/zai';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';

const lambda = new LambdaClient({ apiVersion: '2015-03-31', region: REGION });
const generateEntityEmail = (name: string) => {
  // Convert name to an array and use reduce to filter and accumulate only alphanumeric characters
  const subdomainFriendly = name.split('').reduce((acc, char) => {
    const isAlphanumeric =
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      (char >= '0' && char <= '9');
    return isAlphanumeric ? acc + char.toLowerCase() : acc;
  }, '');

  const uniqueString = generate5DigitNumber();
  return `${subdomainFriendly}_${uniqueString}@docs.admiin.com`;
};

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  console.log('EVENT RECEIVED: ', JSON.stringify(ctx));
  const {
    sub,
    claims: {
      given_name: accountantFirstName,
      family_name: accountantFamilyName,
    },
  } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { client, entity, entityId } = input;
  const createdAt = new Date().toISOString();

  console.log('input: ', input);
  console.log('sub: ', sub);

  const [entityUser, accountantEntity] = await Promise.all([
    getRecord(TABLE_ENTITY_USER ?? '', { userId: sub, entityId }),
    getRecord(TABLE_ENTITY ?? '', { id: entityId }),
  ]);

  console.log('entityUser: ', entityUser);
  console.log('entity: ', entity);

  validateEntityUser(entityUser);

  if (!accountantEntity?.clientsEnabled) {
    throw new Error('CLIENTS_NOT_ENABLED');
  }

  // check existing cognito user
  let cognitoUser;
  try {
    cognitoUser = await getCognitoUser(AUTH_USERPOOLID ?? '', client.email);
    console.log('Existing cognito user: ', cognitoUser);
  } catch (err: any) {
    if (err.code !== 'UserNotFoundException') {
      //TODO: not working? potentialy __type === UserNotFoundException
      console.log('err get cognito user: ', err);
      //throw new Error(err.message);
    }
  }

  // create cognito if not
  if (!cognitoUser) {
    const cognitoParams: CognitoUserProps = {
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone, //TODO: see what happens for new user when ?
    };

    //if (client.phone) {
    //  cognitoParams.phone = client.phone;
    //}

    try {
      const { User } = await createCognitoUser(
        AUTH_USERPOOLID ?? '',
        cognitoParams
      );
      cognitoUser = User;
      console.log('New cognito user: ', cognitoUser);
    } catch (err: any) {
      console.log('ERROR create cognito user: ', err);
      throw new Error(err.message);
    }

    const userAttributes = {
      sub: cognitoUser?.Username,
      email: client.email,
      given_name: client.firstName,
      family_name: client.lastName,
    };

    const params = {
      FunctionName: FUNCTION_CREATEUSER,
      InvocationType: InvocationType.RequestResponse, // | RequestResponse | DryRun - event = not wait for response
      Payload: Buffer.from(
        JSON.stringify({
          userPoolId: AUTH_USERPOOLID,
          userAttributes,
          userName: cognitoUser?.Username,
          onboardingStatus: OnboardingStatus.COMPLETED,
        })
      ),
    };

    try {
      const command = new InvokeCommand(params);
      await lambda.send(command);
    } catch (err: any) {
      console.log('ERROR invoke create user function: ', err);
      throw new Error(err.message);
    }
  }

  if (!cognitoUser?.Username) {
    throw new Error('UNABLE_CREATION_CLIENT_USER');
  }

  const requests = [];

  if (entity && Object.entries(entity).length > 0) {
    const newEntityId = randomUUID();
    // create company entity
    const companyEntity: Entity = {
      id: newEntityId,
      type: entity.type,
      owner: sub,
      address: entity.address,
      paymentMethodId: null,
      name: entity.name,
      searchName: entity.name.toLowerCase() ?? '',
      phone: entity.phone,
      contact: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        __typename: 'EntityContact',
      },
      ubosCreated: null,
      verificationStatus: VerificationStatus.UNCHECKED,
      clientsEnabled: false,
      createdAt,
      updatedAt: createdAt,
      createdBy: sub,
      ocrEmail: generateEntityEmail(input.name ?? ''),
      __typename: 'Entity',
    };

    if (entity.taxNumber) {
      companyEntity.taxNumber = entity.taxNumber;
    }

    requests.push(createRecord(TABLE_ENTITY ?? '', companyEntity));

    // create entity user
    // add accountant entity user

    // create accountant entity user for new entity
    const entityUserParams = {
      id: randomUUID(),
      entityId: newEntityId,
      userId: sub,
      firstName: accountantFirstName,
      lastName: accountantFamilyName,
      role: EntityUserRole.ACCOUNTANT,
      entitySearchName: companyEntity?.name.toLowerCase() ?? '',
      searchName:
        `${accountantFirstName} ${accountantFamilyName}`.toLowerCase() ?? '',
      createdBy: sub,
      createdAt,
      updatedAt: createdAt,
    };

    requests.unshift(createRecord(TABLE_ENTITY_USER ?? '', entityUserParams));

    // new user - create as owner entity user
    const ownerEntityUserParams = {
      id: randomUUID(),
      entityId: newEntityId,
      userId: cognitoUser?.Username,
      firstName: client.firstName,
      lastName: client.lastName,
      role: EntityUserRole.OWNER,
      entitySearchName: companyEntity?.name.toLowerCase() ?? '',
      searchName: `${client.firstName} ${client.lastName}`.toLowerCase() ?? '',
      createdBy: sub,
      createdAt,
      updatedAt: createdAt,
    };

    requests.push(createRecord(TABLE_ENTITY_USER ?? '', ownerEntityUserParams));
  }

  // create individual entity
  //const individualEntity: Entity = {
  //  id: cognitoUser.Username,
  //  type: EntityType.INDIVIDUAL,
  //  owner: cognitoUser.Username,
  //  paymentMethodId: null,
  //  name: client.name,
  //  searchName: client.name.toLowerCase() ?? '',
  //  phone: client.phone,
  //  contact: {
  //    firstName: client.firstName,
  //    lastName: client.lastName,
  //    email: client.email,
  //    phone: client.phone,
  //    __typename: 'EntityContact',
  //  },
  //  ubosCreated: null,
  //  verificationStatus: VerificationStatus.UNCHECKED,
  //  clientsEnabled: false,
  //  createdAt,
  //  updatedAt: createdAt,
  //  ocrEmail: generateEntityEmail(input.name ?? ''),
  //  __typename: 'Entity',
  //};
  //
  //requests.push(createRecord(TABLE_ENTITY ?? '', individualEntity));

  // individual entity user
  //const individualEntityUserParams = {
  //  id: randomUUID(),
  //  entityId: individualEntity.id,
  //  userId: sub,
  //  firstName: client.firstName,
  //  lastName: client.lastName,
  //  role: EntityUserRole.ACCOUNTANT,
  //  entitySearchName: individualEntity?.name.toLowerCase() ?? '',
  //  searchName: `${client.firstName} ${client.lastName}`.toLowerCase() ?? '',
  //  createdBy: sub,
  //  createdAt,
  //  updatedAt: createdAt,
  //};
  //
  //requests.unshift(
  //  createRecord(TABLE_ENTITY_USER ?? '', individualEntityUserParams)
  //);

  //const individualOwnerEntityUserParams = {
  //  id: randomUUID(),
  //  entityId: individualEntity.id,
  //  userId: cognitoUser.Username,
  //  firstName: client.firstName,
  //  lastName: client.lastName,
  //  role: EntityUserRole.OWNER,
  //  entitySearchName: individualEntity?.name.toLowerCase() ?? '',
  //  searchName: `${client.firstName} ${client.lastName}`.toLowerCase() ?? '',
  //  createdBy: sub,
  //  createdAt,
  //  updatedAt: createdAt,
  //};

  //requests.push(
  //  createRecord(TABLE_ENTITY_USER ?? '', individualOwnerEntityUserParams)
  //);

  try {
    const response = await Promise.all(requests);
    console.log('RESPONSE: ', response);
    return response[0];
  } catch (err: any) {
    console.log('ERROR create entity user: ', err);
    throw new Error(err.message);
  }
};

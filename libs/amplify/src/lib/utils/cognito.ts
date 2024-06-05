import { Auth } from 'aws-amplify';
export const updateUserAttributes = async (
  oldUserData: Record<string, string>,
  newUserData: Record<string, any>
) => {
  // update cognito attributes if required
  if (
    newUserData.firstName !== oldUserData.firstName ||
    newUserData.lastName !== oldUserData.lastName
  ) {
    let oldUserData;

    try {
      oldUserData = await Auth.currentAuthenticatedUser();
    } catch (err) {
      console.log('ERROR get auth oldUserData: ', err);
    }

    if (newUserData.firstName !== oldUserData.firstName) {
      try {
        await Auth.updateUserAttributes(oldUserData, {
          given_name: newUserData.firstName,
        });
      } catch (err) {
        console.log('ERROR update oldUserData attribute given_name: ', err);
      }
    }

    if (newUserData.lastName !== oldUserData.lastName) {
      try {
        await Auth.updateUserAttributes(oldUserData, {
          family_name: newUserData.lastName,
        });
      } catch (err) {
        console.log('ERROR update oldUserData attribute family_name: ', err);
      }
    }
  }
};

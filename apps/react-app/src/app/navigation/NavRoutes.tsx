import { gql, useQuery } from '@apollo/client';
import { WBBox } from '@admiin-com/ds-web';
import React, { lazy, Suspense, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DrawerLayout, UnAuthLayout } from '../components';
import Account from '../pages/Account/Account';
import Notifications from '../pages/Notifications/Notifications';
import Security from '../pages/Security/Security';
import Support from '../pages/Support/Support';
import XeroContacts from '../pages/XeroContacts/XeroContacts';
import XeroTransactions from '../pages/XeroTransactions/XeroTransactions';
import { PATHS } from './paths';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import { OnboardingLayout } from '../components';
import { PaymentMethods } from '../pages/PaymentMethods/PaymentMethods';
import { TaskDetail } from '../pages/TaskDetail/TaskDetail';
import ReceivingAccounts from '../pages/ReceivingAccounts/ReceivingAccounts';
import Users from '../pages/Users/Users';
import GuestPayment from '../components/GuestPayment/GuestPayment';

const ConversationDetail = lazy(
  () => import('../pages/Conversations/ConversationDetail')
);
const Integrations = lazy(() => import('../pages/Integrations/Integrations'));
const Interests = lazy(() => import('../pages/Interests/Interests'));

const OnboardingBusiness = lazy(
  () => import('../pages/OnboardingBusiness/OnboardingBusiness')
);
const OnboardingCreationLoader = lazy(
  () => import('../pages/OnboardingCreationLoader/OnboardingCreationLoader')
);

const OnboardingPlans = lazy(
  () => import('../pages/OnboardingPlans/OnboardingPlans')
);
const Plans = lazy(() => import('../pages/Plans/Plans'));
const TeamCreateUpdate = lazy(
  () => import('../pages/TeamCreateUpdate/TeamCreateUpdate')
);
const OnboardingName = lazy(
  () => import('../pages/OnboardingName/OnboardingName')
);
const OnboardingProfileImage = lazy(
  () => import('../pages/OnboardingProfileImage/OnboardingProfileImage')
);
const Rewards = lazy(() => import('../pages/Rewards/Rewards'));
const TeamUserCreateUpdate = lazy(
  () => import('../pages/TeamUserCreateUpdate/TeamUserCreateUpdate')
);
const Templates = lazy(() => import('../pages/Templates/Templates'));

const UserUpdate = lazy(() => import('../pages/UserUpdate/UserUpdate'));
const ChangePassword = lazy(
  () => import('../pages/ChangePassword/ChangePassword')
);
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Contacts = lazy(() => import('../pages/Contacts/Contacts'));
const Clients = lazy(() => import('../pages/Clients/Clients'));
const TaskBox = lazy(() => import('../pages/TaskBox/TaskBox'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
const ResetPassword = lazy(
  () => import('../pages/ResetPassword/ResetPassword')
);
const Settings = lazy(() => import('../pages/Settings/Settings'));
const SignIn = lazy(() => import('../pages/SignIn/SignIn'));
const SignUp = lazy(() => import('../pages/SignUp/SignUp'));
const User = lazy(() => import('../pages/User/User'));
const Team = lazy(() => import('../pages/Team/Team'));
const XeroRedirect = lazy(() => import('../pages/XeroRedirect/XeroRedirect'));

export const NavRoutes = () => {
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const isLoggedIn = useMemo(
    () => loggedInData?.isLoggedIn || false,
    [loggedInData]
  );

  return (
    <Routes>
      <Route path={PATHS.payTask} element={<GuestPayment />} />
      <Route path={PATHS.xeroRedirect} element={<XeroRedirect />} />
      <Route element={<UnAuthLayout />}>
        {!isLoggedIn && <Route path={PATHS.root} element={<SignIn />} />}
        <Route path={PATHS.resetPassword} element={<ResetPassword />} />
        <Route path={PATHS.signIn} element={<SignIn />} />
        <Route path={PATHS.signUp} element={<SignUp />} />
      </Route>

      <Route element={<OnboardingLayout />}>
        <Route path={PATHS.onboardingName} element={<OnboardingName />} />
        <Route
          path={PATHS.onboardingProfileImage}
          element={<OnboardingProfileImage />}
        />
        <Route
          path={PATHS.onboardingBusiness}
          element={<OnboardingBusiness />}
        />
        <Route
          path={PATHS.onboardingComplete}
          element={<OnboardingCreationLoader />}
        />
        <Route path={PATHS.onboardingPlans} element={<OnboardingPlans />} />
      </Route>

      {/*<Route element={<ConversationLayout />}>*/}
      <Route element={<DrawerLayout />}>
        {isLoggedIn && <Route path={PATHS.root} element={<Dashboard />} />}
        <Route path={PATHS.changePassword} element={<ChangePassword />} />
        <Route path={PATHS.dashboard} element={<Dashboard />} />
        <Route path={PATHS.contacts} element={<Contacts />} />
        <Route path={PATHS.clients} element={<Clients />} />
        <Route path={PATHS.taskBox} element={<TaskBox />}>
          <Route path={PATHS.taskBoxDetail} element={<TaskDetail />} />
        </Route>

        <Route path={PATHS.settings} element={<Settings />}>
          <Route path={PATHS.account} index element={<Account />} />
          <Route
            path={PATHS.settingsChangePassword}
            element={<ChangePassword />}
          />
          <Route path={PATHS.security} element={<Security />} />
          <Route path={PATHS.notifications} element={<Notifications />} />
          <Route path={PATHS.users} element={<Users />} />
          <Route path={PATHS.paymentMethods} element={<PaymentMethods />} />
          <Route
            path={PATHS.receivingAccounts}
            element={<ReceivingAccounts />}
          />

          <Route path={PATHS.support} element={<Support />} />
          <Route path={PATHS.integrations} element={<Integrations />} />
        </Route>

        <Route path="tags">
          <Route
            index
            element={
              <Suspense fallback={<WBBox />}>
                <Interests />
              </Suspense>
            }
          />
        </Route>
        <Route path={PATHS.templates}>
          <Route index element={<Templates />} />
        </Route>
        <Route path="user">
          <Route index element={<User />} />
          <Route path="view" element={<User />} />
          <Route path="view/:userId" element={<User />} />
          <Route path="update/:userId" element={<UserUpdate />} />
        </Route>
        <Route path="conversations" element={<ConversationDetail />} />
        <Route
          path="conversations/:conversationId"
          element={<ConversationDetail />}
        />
        <Route path={PATHS.team}>
          <Route path=":teamId" element={<Team />} />
          <Route path="create" element={<TeamCreateUpdate />} />
          <Route path="update/:teamId" element={<TeamCreateUpdate />} />
          <Route path=":teamId/users" element={<TeamUserCreateUpdate />} />
        </Route>
        <Route path={PATHS.plans}>
          <Route index element={<Plans />} />
        </Route>
        <Route path={PATHS.rewards}>
          <Route index element={<Rewards />} />
        </Route>
      </Route>

      <Route path={PATHS.xeroTransactions} element={<XeroTransactions />} />
      <Route path={PATHS.xeroContacts} element={<XeroContacts />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

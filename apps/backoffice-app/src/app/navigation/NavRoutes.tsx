import { gql, useQuery } from '@apollo/client';
import React, { lazy, useMemo } from 'react';
import ChangePassword from '../pages/ChangePassword/ChangePassword';
import { Notifications } from '../pages/Notifications/Notifications';
import Settings from '../pages/Settings/Settings';
import { Route, Routes } from 'react-router-dom';
import Options from '../pages/Options/Options';
import { PATHS } from './paths';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import { AdminLayout, UnAuthLayout } from '../components';
const AdminCreateUpdate = lazy(
  () => import('../pages/AdminCreateUpdate/AdminCreateUpdate')
);
const Admins = lazy(() => import('../pages/Admins/Admins'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
//const ProductCreateUpdate = lazy(
//  () => import('../pages/ProductCreateUpdate/ProductCreateUpdate')
//);
//const Products = lazy(() => import('../pages/Products/Products'));
//const ProductView = lazy(() => import('../pages/ProductView/ProductView'));
const ResetPassword = lazy(
  () => import('../pages/ResetPassword/ResetPassword')
);
const SignIn = lazy(() => import('../pages/SignIn/SignIn'));
const TranslationDetails = lazy(
  () => import('../pages/TranslationDetails/TranslationDetails')
);
const Translations = lazy(() => import('../pages/Translations/Translations'));
const Users = lazy(() => import('../pages/Users/Users'));
const OptionCreateUpdate = lazy(
  () => import('../pages/OptionCreateUpdate/OptionCreateUpdate')
);

export const NavRoutes = () => {
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const isLoggedIn = useMemo(
    () => loggedInData?.isLoggedIn || false,
    [loggedInData]
  );

  return (
    <Routes>
      <Route element={<UnAuthLayout />}>
        {!isLoggedIn && <Route path={PATHS.root} element={<SignIn />} />}
        <Route path={PATHS.resetPassword} element={<ResetPassword />} />
        <Route path={PATHS.signIn} element={<SignIn />} />
      </Route>

      <Route element={<AdminLayout />}>
        {isLoggedIn && <Route path={PATHS.root} element={<Dashboard />} />}
        <Route path={PATHS.dashboard} element={<Dashboard />} />
        <Route path={PATHS.notifications} element={<Notifications />} />
        <Route path={PATHS.settings} element={<Settings />} />
        <Route path={PATHS.changePassword} element={<ChangePassword />} />
        <Route path={PATHS.admins}>
          <Route index element={<Admins />} />
          <Route path="create" element={<AdminCreateUpdate />} />
          <Route path="update/:adminId" element={<AdminCreateUpdate />} />
        </Route>
        {/*<Route path={PATHS.products}>*/}
        {/*  <Route index element={<Products />} />*/}
        {/*  <Route path="create" element={<ProductCreateUpdate />} />*/}
        {/*  <Route path="view/:productId" element={<ProductView />} />*/}
        {/*  <Route path="update/:productId" element={<ProductCreateUpdate />} />*/}
        {/*</Route>*/}
        <Route path={PATHS.translations}>
          <Route index element={<Translations />} />
          <Route path=":translationId" element={<TranslationDetails />} />
        </Route>
        <Route path={PATHS.tags}>
          <Route index element={<Options />} />
          <Route path="create/:group" element={<OptionCreateUpdate />} />
        </Route>

        <Route path={PATHS.users}>
          <Route index element={<Users />} />
          {/*<Route path="update/:adminId" element={<AdminCreateUpdate />} />*/}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

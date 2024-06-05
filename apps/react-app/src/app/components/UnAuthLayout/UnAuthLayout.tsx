import { WBBox } from '@admiin-com/ds-web';
import { Outlet } from 'react-router-dom';

export const UnAuthLayout = () => {
  return (
    <WBBox height="100vh">
      {/* <NavBar navRight={<ChangeLanguage />} /> */}
      {/* <PageContainer sx={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}> */}
      <Outlet />
      {/* </PageContainer> */}
    </WBBox>
  );
};

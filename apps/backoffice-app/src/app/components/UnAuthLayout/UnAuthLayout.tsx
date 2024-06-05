import { WBBox } from '@admiin-com/ds-web';
import { Outlet } from 'react-router-dom';
import { NAVBAR_HEIGHT } from '../../constants/config';
import { ChangeLanguage } from '../ChangeLanguage/ChangeLanguage';
import { NavBar } from '../NavBar/NavBar';
import { PageContainer } from '../PageContainer/PageContainer';

export const UnAuthLayout = () => {
  return (
    <WBBox height="100vh">
      <NavBar navRight={<ChangeLanguage />} />
      <PageContainer sx={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}>
        <Outlet />
      </PageContainer>
    </WBBox>
  );
};

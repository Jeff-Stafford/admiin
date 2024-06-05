import { gql, useQuery } from '@apollo/client';
import { WBBox, WBIconButton, WBToolbar } from '@admiin-com/ds-web';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo } from 'react';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { useClientContext } from '../../components/ApolloClientProvider/ApolloClientProvider';
import { getOnboardingPath } from '../../helpers/onboarding';
import { SvgIcon } from '@mui/material';
import CardIcon from '../../../assets/icons/cardview.svg';
import ListIcon from '../../../assets/icons/listview.svg';
import { useTranslation } from 'react-i18next';
import { API } from 'aws-amplify';
import {
  EntityList,
  EntityListView,
} from '../../components/EntityList/EntityList';
import { EntityCreateModal } from '../EntityCreateModal/EntityCreateModal';
import MainLayout from '../../components/MainLayout/MainLayout';
import ToolbarLayout from '../../components/ToolbarLayout/ToolbarLayout';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { output } = useClientContext();
  const { data: subData } = useQuery(gql(GET_SUB));
  const { data: userData } = useQuery(gql(GET_USER), {
    variables: {
      id: subData?.sub,
    },
    skip: !subData?.sub,
  });
  const user = useMemo(() => userData?.getUser || {}, [userData]);

  useEffect(() => {
    if (user?.id) {
      navigate(getOnboardingPath(user), { replace: true });
    }
  }, [user, navigate]);

  const [listViewMode, setListViewMode] = React.useState<EntityListView>(
    EntityListView.CARD_VIEW
  );

  const [open, setModalOpen] = React.useState(false);

  const handleClickOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const updateIdentityId = async () => {
      try {
        await API.post(output.restApiName, '/identity-id', {
          body: {},
        });
      } catch (e) {
        console.log('POST call failed: ', e);
      }
    };

    if (!user?.identityId && output?.restApiName) {
      updateIdentityId();
    }
  }, [user?.identityId, output?.restApiName]);

  const gridIcons = (
    <WBBox>
      <WBIconButton onClick={() => setListViewMode(EntityListView.CARD_VIEW)}>
        <SvgIcon
          viewBox="0 0 18 18"
          sx={{
            opacity: listViewMode === EntityListView.CARD_VIEW ? 1 : 0.3,
            fontSize: 18,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardIcon />
        </SvgIcon>
      </WBIconButton>
      <WBIconButton onClick={() => setListViewMode(EntityListView.TABLE_VIEW)}>
        <SvgIcon
          viewBox="0 0 18 18"
          fontSize="small"
          sx={{
            fontSize: 18,
            display: 'flex',
            opacity: listViewMode === EntityListView.TABLE_VIEW ? 1 : 0.3,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ListIcon />
        </SvgIcon>
      </WBIconButton>
    </WBBox>
  );
  return (
    <MainLayout
      gridType="Left"
      toolbarComponent={
        <>
          <ToolbarLayout
            rightIcon={
              <WBBox display={{ xs: 'none', sm: 'block' }}>{gridIcons}</WBBox>
            }
            addTitle={t('newEntity', { ns: 'dashboard' })}
            title={t('dashboard', { ns: 'dashboard' })}
            onAddClick={handleClickOpen}
          >
            <WBToolbar
              sx={{
                display: { xs: 'inline', sm: 'none' },
                textAlign: 'center',
                width: '100%',
                mt: 2,
              }}
            >
              {gridIcons}
            </WBToolbar>
            <WBToolbar sx={{ pb: 22 }} />
          </ToolbarLayout>
          <WBBox
            sx={{
              flexGrow: 1,
              m: 6,
              mt: { sm: -20, xs: -26 },
              zIndex: 1200,
            }}
          >
            <EntityCreateModal open={open} handleCloseModal={handleClose} />
            <EntityList mode={listViewMode} />
          </WBBox>
          <EntityCreateModal open={open} handleCloseModal={handleClose} />
        </>
      }
    ></MainLayout>
  );
};

export default Dashboard;

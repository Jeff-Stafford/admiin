import { gql, useQuery } from '@apollo/client';
import { WBBox, useSnackbar } from '@admiin-com/ds-web';
import { Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  CSGetSub as GET_SUB,
  OnboardingStatus,
} from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { getOnboardingPath } from '../../helpers/onboarding';
import { useMediaQuery, useTheme } from '@mui/material';
import { useTasks } from '../../hooks/useTasks/useTasks';
import { TaskFilter } from './TaskFilter';
import { TasksSelectDisplay } from './TasksSelectDisplay';
import TasksView from '../TasksView/TasksView';
import { useTaskSelection } from './hooks/useTaskSelection';
import PaymentContainer from '../../components/PaymentContainer/PaymentContainer';
import { TaskPayment } from '../TaskDetail/TaskPayment';
import MainLayout, {
  MainLayoutGridType,
} from '../../components/MainLayout/MainLayout';
import { TaskList } from '../../components/TaskList/TaskList';

export const TaskBoxContext = React.createContext<any>(null);

const TaskBox = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: subData } = useQuery(gql(GET_SUB));
  const { data: userData } = useQuery(gql(GET_USER), {
    variables: {
      id: subData?.sub,
    },
    skip: !subData?.sub,
  });
  const user = useMemo(() => userData?.getUser || {}, [userData]);
  const pdfSignatureRef = useRef(null);

  useEffect(() => {
    if (user?.id && user.onboardingStatus !== OnboardingStatus.COMPLETED) {
      navigate(getOnboardingPath(user), { replace: true });
    }
  }, [user, navigate]);

  const isDownLg = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    tasks,
    loading,
    error,
    directionFilter,
    statusFilter,
    hasDeclinedPayment,
    setDirectionFilter,
    dueCount,
    tasksInbox,
    dueTasks,
    scheduledCount,
    totalNumber,
    hasNextPage,
    handleLoadMore,
    setStatusFilter,
  } = useTasks({ syncUrl: true });

  const showSnackbar = useSnackbar();

  React.useEffect(() => {
    if (error) {
      showSnackbar({
        message: error?.message ?? '',
        horizontal: 'right',
        vertical: 'bottom',
        severity: 'error',
      });
    }
  }, [error]);

  const [multiShow, setMultiShow] = React.useState<boolean>(false);

  const taskSelection: any = useTaskSelection();
  const {
    selectedTasks,
    setSelectedTasks,
    detailView,
    selectedTask,
    setSelectedTask,
  } = taskSelection ?? {};

  // React.useEffect(() => {
  //   setSelectedTask(null);
  //   setSelectedTasks([]);
  // }, [statusFilter, directionFilter]);

  const isMultiViewMode =
    (multiShow && isDownLg) ||
    (!detailView && !isDownLg && selectedTasks.length > 0);

  const showMode = detailView || isMultiViewMode ? 'DETAIL' : 'LIST';

  const gridType: MainLayoutGridType = useMemo(() => {
    let gridType = 'All';
    if (isDownLg && showMode === 'LIST') gridType = 'Left';
    else if (isDownLg && showMode === 'DETAIL') gridType = 'Right';
    return gridType as MainLayoutGridType;
  }, [isDownLg, showMode]);

  const [isListView, setListView] = React.useState<boolean>(false);
  const [selectedSignatureKey, setSelectedSignatureKey] =
    React.useState<string>('');

  const handleViewMode = (isListView: boolean) => {
    console.log("Taskbox")
    setSelectedTask(null);
    setListView(isListView);
  };

  return (
    <TaskBoxContext.Provider
      value={{
        pdfSignatureRef,
        multiShow: isMultiViewMode,
        setMultiShow,
        directionFilter,
        loading,
        isListView,
        statusFilter,
        tasksInbox,
        setStatusFilter,
        dueCount,
        dueTasks,
        tasks,
        scheduledCount,
        hasNextPage,
        handleLoadMore,
        totalNumber,
        hasDeclinedPayment,
        setListView: handleViewMode,
        ...taskSelection,
        selectedSignatureKey,
        setSelectedSignatureKey,
      }}
    >
      <MainLayout
        gridType={gridType}
        onBackToLeft={() => {
          if (selectedTask) setSelectedTask(null);
          if (multiShow) setMultiShow(false);
        }}
        toolbarComponent={
          <>
            <TaskFilter
              directionFilter={directionFilter}
              statusFilter={statusFilter}
              setDirectionFilter={setDirectionFilter}
              setStatusFilter={setStatusFilter}
              tasks={tasks}
            />
            <WBBox
              sx={{
                flexGrow: 1,
                p: 4,
              }}
              mt={-8}
            >
              <WBBox display={{ xs: 'none', lg: 'block' }}>
                <TasksSelectDisplay
                  tasks={tasks}
                  selectedTasks={selectedTasks}
                  setSelectedTasks={setSelectedTasks}
                />
              </WBBox>
              <TaskList
                type={isListView ? 'list' : 'card'}
                tasks={tasks}
                loading={loading}
                hasNextPage={hasNextPage}
                handleLoadMore={handleLoadMore}
                directionFilter={directionFilter}
              />
            </WBBox>
          </>
        }
      >
        <PaymentContainer>
          <WBBox height="100%">
            {detailView ? (
              <Outlet />
            ) : isMultiViewMode ? (
              <TasksView tasks={selectedTasks} />
            ) : null}
            {(selectedTask || isMultiViewMode) &&
            directionFilter === 'RECEIVING' &&
            selectedTask?.status !== 'DRAFT' ? (
              <TaskPayment />
            ) : null}
          </WBBox>
        </PaymentContainer>
      </MainLayout>
    </TaskBoxContext.Provider>
  );
};

export const useTaskBoxContext = () => {
  const context = React.useContext(TaskBoxContext);
  return context ?? {};
};

export default TaskBox;

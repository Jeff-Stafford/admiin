import {
  WBButton,
  WBFlex,
  WBList,
  WBNoResults,
  WBStack,
  WBToggleButtonGroup,
} from '@admiin-com/ds-web';
import { Task, TaskDirection } from '@admiin-com/ds-graphql';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TaskItem } from '../TaskItem/TaskItem';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import { TaskCard } from '../TaskCard/TaskCard';
import { useInfiniteScroll } from '@admiin-com/ds-hooks';
import { Stack } from '@mui/material';
interface TaskListProps {
  tasks?: Task[];
  directionFilter?: string;
  loading?: boolean;
  type: 'list' | 'card';
  hasNextPage?: boolean;
  handleLoadMore?: () => void;
}

export const TaskList = ({
  tasks,
  directionFilter,
  loading = false,
  type,
  handleLoadMore,
  hasNextPage,
}: TaskListProps) => {
  const { t } = useTranslation();
  const {
    selectedTasks,
    multiSelect,
    setMultiShow,
    selectedTask: value,
    setSelectedTask,
  } = useTaskBoxContext();
  const handleChange = React.useCallback(
    (task: Task | null) => {
      if (task && value?.id === task?.id) {
        setSelectedTask(null);
        return;
      }
      if (selectedTasks.length > 0) return;
      setSelectedTask(task);
    },
    [setSelectedTask, selectedTasks, value]
  );

  const lastElementRef = useInfiniteScroll({
    fetchMore: handleLoadMore,
    loading,
    hasNextPage: hasNextPage ?? false,
  });
  const listRef = React.useRef<any>(null); // Ref for the list container

  if (tasks?.length === 0 && !loading)
    return (
      <WBNoResults
        sx={{ mt: 5 }}
        title={t(
          directionFilter === TaskDirection.RECEIVING
            ? 'noReceivingTasksTitle'
            : 'noSendingTasksTitle',
          { ns: 'taskbox' }
        )}
        description={t(
          directionFilter === TaskDirection.RECEIVING
            ? 'noReceivingTasksDescription'
            : 'noSendingTasksDescription',
          { ns: 'taskbox' }
        )}
      />
    );
  if (type === 'list')
    return (
      <WBList ref={listRef}>
        {tasks?.map((task, index) => (
          <TaskItem
            ref={index === tasks.length - 1 ? lastElementRef : null}
            value={task}
            selected={task?.id === value?.id}
            onChange={handleChange}
            direction={directionFilter as TaskDirection}
            key={task.id}
          />
        ))}{' '}
        {loading ? (
          <>
            <TaskItem value={null} />
            <TaskItem value={null} />
          </>
        ) : null}
      </WBList>
    );
  if (type === 'card')
    return (
      <Stack spacing={3} sx={{ my: 1 }}>
        <WBToggleButtonGroup
          orientation="vertical"
          fullWidth
          value={value}
          onChange={(_e: any, task: Task | null) => handleChange(task)}
          exclusive
          ref={listRef}
        >
          {tasks?.map((task, index) => (
            <TaskCard
              ref={index === tasks.length - 1 ? lastElementRef : null}
              onChecked={multiSelect}
              checked={!!selectedTasks.find((t: Task) => t.id === task.id)}
              selected={task.id === value?.id}
              task={task}
              fullWidth
              direction={directionFilter as TaskDirection}
              key={task.id}
            />
          ))}
          {loading ? (
            <>
              <TaskCard task={null} />
              <TaskCard task={null} />
            </>
          ) : null}
        </WBToggleButtonGroup>
        {selectedTasks.length > 0 ? (
          <WBFlex
            sx={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              background: 'transparent',
              width: '100%',
              paddingBottom: 4,
              pointerEvents: 'none',
              display: { xs: 'flex', lg: 'none' },
              color: 'common.black',
            }}
            justifyContent={'center'}
          >
            <WBButton
              color="inherit"
              sx={{
                px: 10,
                pointerEvents: 'auto',
                bgcolor: 'success.main',
                boxShadow: '0 8.5px 12.5px -9.5px #8c51ff',
              }}
              onClick={setMultiShow}
            >
              {t('review', { ns: 'taskbox' })}&nbsp;
              <b>
                {t('items', {
                  ns: 'taskbox',
                  count: selectedTasks.length,
                })}
              </b>
            </WBButton>
          </WBFlex>
        ) : null}
      </Stack>
    );
};

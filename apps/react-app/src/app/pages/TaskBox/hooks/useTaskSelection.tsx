import { Task, getTask } from '@admiin-com/ds-graphql';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';

export const useTaskSelection = () => {
  const { id } = useParams();
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: getTaskData, loading } = useQuery(gql(getTask), {
    variables: {
      id,
      entityId,
    },
    skip: !id || !entityId,
  });

  const task = React.useMemo(
    () =>
      getTaskData?.getTask
        ? { ...getTaskData?.getTask, amount: getTaskData?.getTask.amount / 100 }
        : null,
    [getTaskData]
  );

  const [selectedTasks, setSelectedTasks] = React.useState<Array<Task>>([]);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const multiSelect = (task: Task) => {
    const index = selectedTasks.findIndex((t) => t.id === task.id);
    let updated = [];
    if (index >= 0) {
      updated = [
        ...selectedTasks.slice(0, index),
        ...selectedTasks.slice(index + 1),
      ];
    } else updated = selectedTasks.concat(task);
    setSelectedTasks(updated);
    if (updated.length > 0) handleTaskSelection(null);
  };

  const searchString = searchParams.toString();

  // React.useEffect(() => {
  //   setSelectedTasks([]);
  //   // if (!loading) setSelectedTask(null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [entityId, direction]);

  const handleTaskSelection = React.useCallback(
    (task: Task | null) => {
      navigate(`/taskbox/${task?.id ?? ''}?${searchString}`);
      setSelectedTask(task);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchString]
  );

  React.useEffect(() => {
    if (!loading) setSelectedTask(task);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return {
    selectedTasks,
    setSelectedTasks,
    selectedTask,
    loadingTask: loading,
    detailView: !!id,
    setSelectedTask: handleTaskSelection,
    multiSelect,
  };
};

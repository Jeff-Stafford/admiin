import { gql, useMutation } from '@apollo/client';
import { Task, updateTask as UPDATE_TASK } from '@admiin-com/ds-graphql';
import { UseMutationTuple } from '../useCreateContact/useCreateContact';
export const useUpdateTask = (
  task: Task | null
): [UseMutationTuple[0], { error: UseMutationTuple[1]['error'] }] => {
  const [updateTask, data] = useMutation(gql(UPDATE_TASK));

  return [updateTask, { error: data.error }];
};

import {
  createTaskPayment as CREATE_TASK_PAYMENT,
  // Contact,
  // ContactStatus,
  // ContactType,
} from '@admiin-com/ds-graphql';
import { gql, useMutation } from '@apollo/client';

export const useCreateTaskPayment = () => {
  const [createTaskPayment, data] = useMutation(gql(CREATE_TASK_PAYMENT));
  return [createTaskPayment, data];
};

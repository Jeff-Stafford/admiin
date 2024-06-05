import { Task } from '@admiin-com/ds-graphql';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import TaskBreakDownBody from '../TaskBreakDownBody/TaskBreakDownBody';

/* eslint-disable-next-line */
export interface TaskBreakDownModalProps {
  tasks: Task[];
  open: boolean;
  onClose: () => void;
}

export function TaskBreakDownModal(props: TaskBreakDownModalProps) {
  return (
    <SimpleDrawDlg
      open={props.open}
      handleClose={props.onClose}
      noPadding
      maxWidth={'xs'}
    >
      <TaskBreakDownBody tasks={props.tasks} task={null} />
    </SimpleDrawDlg>
  );
}

export default TaskBreakDownModal;

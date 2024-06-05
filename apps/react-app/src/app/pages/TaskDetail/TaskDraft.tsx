import {
  Task,
  TaskDirection,
  TaskStatus,
  UpdateTaskStatus,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBButton,
  WBFlex,
  WBGrid,
  WBLink,
  WBTextField,
  WBTypography,
  useSnackbar,
} from '@admiin-com/ds-web';
import { Paper, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';
import NoteTypeSelect, {
  NoteType,
} from '../../components/NoteTypeSelect/NoteTypeSelect';
import { TaskActivity } from './TaskActivity';
import { useTaskBoxContext } from '../TaskBox/TaskBox';
import { gql, useMutation } from '@apollo/client';
import { updateTask as UPDATE_TASK } from '@admiin-com/ds-graphql';
import { TaskCreation } from '../TaskCreation/TaskCreation';
interface TaskDraftProps {
  task: Task;
}
export const TaskDraft = ({ task }: TaskDraftProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [note, setNote] = React.useState<string>();
  const { isCreatedBy } = useTaskProperty(task);
  const { setSelectedTask } = useTaskBoxContext();

  React.useEffect(() => {
    setNote(
      task.direction === TaskDirection.SENDING
        ? task.noteForSelf || ''
        : task.noteForOther || ''
    );
    setIsEdit(false);
  }, [task]);
  const [noteType, setNoteType] = React.useState<NoteType>(NoteType.FOR_OTHER);

  React.useEffect(() => {
    console.log('noteType', noteType);
    setNote(
      noteType === NoteType.TO_SELF
        ? task.noteForSelf || ''
        : task.noteForOther || ''
    );
  }, [noteType, task]);

  const handleChangeNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const handleChangeEditMode = () => {
    if (!isEdit) setIsEdit(true);
    else {
      // TODO: mutation task note

      setIsEdit(false);
    }
  };
  const showSnackbar = useSnackbar();
  const [isAchiving, setIsAchiving] = React.useState<boolean>(false);
  const [updateTask] = useMutation(gql(UPDATE_TASK));
  const [open, setModalOpen] = React.useState(false);
  const handleClose = () => {
    setModalOpen(false);
  };

  const handleArchiveTask = async () => {
    if (isAchiving) return;
    if (task) {
      try {
        setIsAchiving(true);
        await updateTask({
          variables: {
            input: {
              id: task.id,
              entityId: task.entityId,
              status: UpdateTaskStatus.ARCHIVED,
              dueAt: task.dueAt,
            },
          },
        });
        showSnackbar({
          message: t('taskArchived', { ns: 'taskbox' }),
          severity: 'success',
          horizontal: 'center',
          vertical: 'bottom',
        });
        setSelectedTask(null);
      } catch (error: any) {
        showSnackbar({
          title: t('taskArchivedFailed', { ns: 'taskbox' }),
          message: error?.message,
          severity: 'error',
          horizontal: 'right',
          vertical: 'bottom',
        });
      } finally {
        setIsAchiving(false);
      }
    }
  };

  const handleEditTask = () => {
    // TODO: handle Edit task

    setModalOpen(true);
  };
  const handleRemoveDraft = () => {
    // TODO: handle Remove draft
    handleArchiveTask();
  };

  const isDraft = task.status === TaskStatus.DRAFT;

  // if (task.status !== TaskStatus.DRAFT) return null;
  const editButton = (
    <WBButton
      sx={{
        fontSize: theme.typography.body2.fontSize,
        px: 8,
        width: { xs: '60%', sm: 'auto' },
      }}
      // disabled={abnQueryLoading}
      // loading={loading}
      type="button"
      onClick={handleEditTask}
    >
      {t('edit', { ns: 'taskbox' })}
    </WBButton>
  );
  return (
    <>
      <WBTypography fontWeight="bold" fontSize={'h2.fontSize'}>
        {t('notes', { ns: 'taskbox' })}
      </WBTypography>
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          mt: 2,
          mb: 10,
          fontWeight: 'bold',
          fontSize: 'body2.fontSize',
          boxShadow: '0 11px 19px -8.5px #636363',
          bgcolor: theme.palette.background.default,
        }}
      >
        <WBFlex
          mb={1}
          alignItems={'center'}
          justifyContent={'space-between'}
          width={'100%'}
        >
          {isCreatedBy && (
            <WBBox>
              <NoteTypeSelect onChange={setNoteType} value={noteType} />
            </WBBox>
          )}
          <WBFlex sx={{ flexGrow: 1 }} justifyContent={'flex-end'}>
            {isDraft && (
              <WBLink onClick={handleChangeEditMode} component={'button'}>
                {t(!isEdit ? 'edit' : 'save', { ns: 'taskbox' })}
              </WBLink>
            )}
          </WBFlex>
        </WBFlex>
        {!isEdit ? (
          <WBTypography
            sx={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
            component={'pre'}
          >
            {note}
          </WBTypography>
        ) : (
          <WBTextField
            variant="standard"
            value={note}
            multiline
            onChange={handleChangeNote}
          />
        )}
      </Paper>
      {isDraft ? (
        <WBFlex
          mx={{
            xs: -4,
            md: -6,
            lg: -8,
          }}
          sx={{
            position: 'sticky',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            flexGrow: 1,
            bottom: 0,
            left: 0,
          }}
        >
          <WBFlex
            sx={{
              my: 3,
              display: { xs: 'flex', sm: 'none' },
              justifyContent: 'center',
            }}
          >
            {editButton}
          </WBFlex>
          <WBFlex
            sx={{
              bgcolor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
              py: { xs: 4, sm: 2 },
            }}
          >
            <WBBox sx={{ display: { xs: 'none', sm: 'block' } }}>
              {editButton}
            </WBBox>
            <WBLink
              ml={{ xs: 0, sm: 3 }}
              variant="body2"
              underline="always"
              color={theme.palette.common.white}
              onClick={handleRemoveDraft}
            >
              {t('removeDraft', { ns: 'taskbox' })}
            </WBLink>
          </WBFlex>
        </WBFlex>
      ) : null}
      {!isDraft &&
      task?.activity?.items?.length &&
      task?.activity?.items?.length > 0 ? (
        <TaskActivity task={task} />
      ) : null}
      <TaskCreation open={open} handleCloseModal={handleClose} task={task} />
    </>
  );
};

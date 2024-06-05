import React from 'react';
import {
  WBIconButton,
  WBToggleButtonGroup,
  WBToolbar,
  WBChip,
  WBDivider,
  WBFlex,
  WBStack,
  WBSvgIcon,
  WBTextField,
  WBTooltip,
  useSnackbar,
  WBBox,
  WBLink,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import EmailIcon from '../../../assets/icons/email.svg';
import SortIcon from '../../../assets/icons/sort.svg';
import SearchIcon from '../../../assets/icons/search.svg';
import {
  FormControlLabel,
  Switch,
  ToggleButton,
  alpha,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useClipboard } from '@admiin-com/ds-hooks';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
import { TaskCreation } from '../TaskCreation/TaskCreation';
import { Task, TaskDirection } from '@admiin-com/ds-graphql';
import { TasksSelectDisplay } from './TasksSelectDisplay';
import { useTaskBoxContext } from './TaskBox';
import ToolbarLayout from '../../components/ToolbarLayout/ToolbarLayout';
import { useTasks } from '../../hooks/useTasks/useTasks';

// Todo: Change Icon and Color of this Switch

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 80,
  height: 34,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(0px)',
    '&.Mui-checked': {
      color: theme.palette.common.black,
      transform: 'translateX(30px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10"><path fill="${encodeURIComponent(
          '#000000'
        )}" d="M1.066.253H9.4a.833.833 0 1 1 0 1.666H1.066a.834.834 0 0 1 0-1.666zm0 4H9.4a.833.833 0 1 1 0 1.666H1.066a.834.834 0 0 1 0-1.666zm0 3.666H9.4a.834.834 0 0 1 0 1.666H1.066a.833.833 0 1 1 0-1.666z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: `rgba(255, 255, 255, 0.3)`,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.common.white,
    width: 48,
    height: 32,
    borderRadius: 16,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14"><path fill="${encodeURIComponent(
        '#000'
      )}" d="M.844.253h8.333a.833.833 0 1 1 0 1.666H.844a.834.834 0 0 1 0-1.666zm7.5 3.332c.92 0 1.667.747 1.667 1.668v3.332c0 .921-.746 1.668-1.667 1.668H1.677c-.92 0-1.666-.747-1.666-1.668V5.253c0-.922.746-1.668 1.666-1.668h6.667zm0 1.668H1.677v3.332h6.667V5.253zm-7.5 6.666h8.333a.834.834 0 0 1 0 1.666H.844a.833.833 0 1 1 0-1.666z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: `rgba(255, 255, 255, 0.3)`,
    borderRadius: 32 / 2,
  },
}));

interface TaskFilterProps {
  directionFilter: TaskDirection;
  statusFilter: any;
  tasks?: Task[];
  setDirectionFilter: (direction: TaskDirection) => void;
  setStatusFilter: (status: any) => void;
}

export const TaskFilter = (props: TaskFilterProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));

  const [open, setModalOpen] = React.useState(false);
  const taskContext = useTaskBoxContext();

  const handleClickOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
  };
  const { entity } = useSelectedEntity();
  const [, copy] = useClipboard();
  const showSnackbar = useSnackbar();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListView(event.target.checked);
  };
  const handleClickEmail = async () => {
    if (entity?.ocrEmail) {
      await copy(entity?.ocrEmail as unknown as string);
      showSnackbar({
        message: 'Email copied',
        horizontal: 'right',
        vertical: 'bottom',
        severity: 'success',
      });
    }
  };

  const [isSearch, setIsSearch] = React.useState<boolean>(false);

  const { dueCount, scheduledCount, totalNumber } = useTasks({
    direction: TaskDirection.RECEIVING,
    isCompleted: 'INCOMPLETE',
  });

  const {
    selectedTasks,
    setSelectedTask,
    setSelectedTasks,
    isListView,
    setListView,
    hasDeclinedPayment,
  } = taskContext ?? {};

  const handleChangeStatusFilter = (value: any) => {
    props.setStatusFilter(value);
    console.log('TaskFilter');
    setSelectedTask(null);
    setSelectedTasks([]);
  };

  const handleChangeDirection = (direction: TaskDirection) => {
    props.setDirectionFilter(direction);
    console.log('TaskFilter');

    setSelectedTask(null);
    setSelectedTasks([]);
  };

  return (
    <>
      <ToolbarLayout
        title={t('taskbox', { ns: 'taskbox' })}
        onAddClick={handleClickOpen}
      >
        <WBToolbar
          sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}
        >
          <WBToggleButtonGroup
            value={props.directionFilter}
            sx={{
              color: 'black',
            }}
            exclusive
            onChange={(e, value) => {
              value && handleChangeDirection(value);
            }}
          >
            {[TaskDirection.RECEIVING, TaskDirection.SENDING].map((filter) => (
              <ToggleButton
                sx={{
                  backgroundColor: 'transparent',
                  color: alpha(theme.palette.common.white, 0.4),
                  '&.Mui-selected, &.Mui-selected:hover': {
                    backgroundColor: theme.palette.common.white,
                    color: theme.palette.common.black,
                    boxShadow: '0 6px 8.5px -6px rgba(0, 0, 0, 0.34)',
                    opacity: 1,
                  },
                  border: 0,
                  marginRight: { xs: 1, sm: 2 },
                  paddingLeft: { xs: 2, sm: 4 },
                  paddingRight: { xs: 2, sm: 4 },
                  ...theme.typography.button,
                  fontWeight: 'bold',
                  // Add this rule to target the last ToggleButton in the group
                  '&:last-child': {
                    marginRight: 0,
                  },
                }}
                value={filter}
                key={filter}
              >
                {t(filter, { ns: 'taskbox' })}
                {filter === TaskDirection.RECEIVING && totalNumber > 0
                  ? ` (${totalNumber})`
                  : null}
              </ToggleButton>
            ))}
          </WBToggleButtonGroup>
          <WBStack direction={'row'}>
            <WBTooltip
              title={
                <>
                  {t('forwardBillTo1', { ns: 'taskbox' })}
                  <WBLink
                    sx={{ fontWeight: 'bold' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickEmail();
                    }}
                  >
                    {entity?.ocrEmail}{' '}
                  </WBLink>
                  {t('forwardBillTo2', { ns: 'taskbox' })}
                </>
              }
            >
              <WBIconButton onClick={handleClickEmail}>
                <WBSvgIcon
                  viewBox="0 0 18 18"
                  fontSize="small"
                  sx={{
                    fontSize: 18,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <EmailIcon />
                </WBSvgIcon>
              </WBIconButton>
            </WBTooltip>
            <WBDivider
              orientation="vertical"
              flexItem
              light
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
                mx: 0.5,
                alignSelf: 'center',
                height: theme.spacing(3),
              }}
              variant="middle"
            />
            <WBIconButton>
              <WBSvgIcon
                viewBox="0 0 18 18"
                fontSize="small"
                sx={{
                  fontSize: 18,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <SortIcon />
              </WBSvgIcon>
            </WBIconButton>
            <WBIconButton onClick={() => setIsSearch((prev) => !prev)}>
              <WBSvgIcon
                viewBox="0 0 18 18"
                fontSize="small"
                sx={{
                  fontSize: 18,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <SearchIcon />
              </WBSvgIcon>
            </WBIconButton>
          </WBStack>
        </WBToolbar>
        <WBToolbar
          sx={{
            mt: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflowX: { xs: 'scroll', xl: 'hidden' },
          }}
        >
          {selectedTasks.length > 0 && downLg ? (
            <TasksSelectDisplay
              tasks={props.tasks}
              selectedTasks={selectedTasks}
              setSelectedTasks={setSelectedTasks}
            />
          ) : (
            <>
              {isSearch ? (
                <WBFlex mr={4} width={'100%'}>
                  <WBTextField
                    variant="outlined"
                    leftIcon={'Search'}
                    placeholder="Search"
                    // value={searchName}
                    // onChange={onSearch}
                    InputProps={{
                      sx: {
                        ...theme.typography.body2,
                        fontWeight: 'bold',
                        color: theme.palette.common.white,
                      },
                    }}
                    fullWidth
                  />
                </WBFlex>
              ) : (
                <WBStack
                  direction="row"
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={{ height: '100%' }}
                >
                  {['Due', 'Scheduled', 'Completed'].map((value) => (
                    <WBChip
                      key={value}
                      label={
                        <WBFlex alignItems={'center'}>
                          {t(value, {
                            ns: 'taskbox',
                          })}
                          {value === 'Due' &&
                          dueCount > 0 &&
                          props.directionFilter === 'RECEIVING'
                            ? ` (${dueCount})`
                            : null}

                          {value === 'Scheduled' &&
                          scheduledCount > 0 &&
                          props.directionFilter === 'RECEIVING'
                            ? ` (${scheduledCount})`
                            : null}
                          {value === 'Scheduled' && hasDeclinedPayment && (
                            <WBBox
                              ml={1}
                              borderRadius="100%"
                              width="10px"
                              height="10px"
                              bgcolor="error.main"
                            />
                          )}
                        </WBFlex>
                      }
                      onClick={() => handleChangeStatusFilter(value)}
                      color="light"
                      sx={{
                        px: 1,
                        mb: 0,
                        fontSize: '13px',
                        fontWeight: 'bold',
                        backgroundColor:
                          props.statusFilter !== value
                            ? 'rgba(255, 255, 255, 0.3)'
                            : undefined,
                        color:
                          props.statusFilter !== value
                            ? 'rgba(0, 0, 0, 0.3)'
                            : undefined,
                      }}
                    />
                  ))}
                </WBStack>
              )}
              <FormControlLabel
                sx={{ mr: 0, display: { xs: 'none', sm: 'flex' } }}
                control={
                  <MaterialUISwitch
                    sx={{ m: 1 }}
                    // defaultChecked
                    value={isListView}
                    onChange={handleChange}
                  />
                }
                label={''}
              />
            </>
          )}
        </WBToolbar>
      </ToolbarLayout>

      {open ? (
        <TaskCreation open={open} handleCloseModal={handleClose} />
      ) : null}
    </>
  );
};

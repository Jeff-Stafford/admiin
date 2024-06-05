import { Task } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBCard,
  WBFlex,
  WBLink,
  WBSvgIcon,
  useMediaQuery,
} from '@admiin-com/ds-web';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import CheckIcon from '../../../assets/icons/checkicon.svg';

interface TasksSelectDisplayProps {
  selectedTasks: Array<Task>;
  tasks?: Task[];
  setSelectedTasks: (tasks: Array<Task>) => void;
}
export const TasksSelectDisplay = ({
  selectedTasks,
  setSelectedTasks,
  tasks,
}: TasksSelectDisplayProps) => {
  const { t } = useTranslation();
  const length = selectedTasks.length;
  const theme = useTheme();
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));
  if (selectedTasks.length === 0) return null;
  const selectAll = () => {
    if (tasks) setSelectedTasks(tasks);
  };
  const selectedAll = tasks?.length === selectedTasks.length;

  const content = (
    <WBFlex justifyContent={'space-between'}>
      <WBFlex justifyContent={'space-between'} alignItems={'center'}>
        <WBFlex
          bgcolor={downLg ? 'common.white' : 'success.main'}
          width="24px"
          height="24px"
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            if (!selectedAll) {
              selectAll();
            } else {
              setSelectedTasks([]);
            }
          }}
        >
          {selectedTasks.length === tasks?.length ? (
            <WBSvgIcon
              fontSize="small"
              color={
                downLg ? theme.palette.primary.main : theme.palette.common.black
              }
            >
              <CheckIcon />
            </WBSvgIcon>
          ) : (
            <WBBox width="10px" height="2px" bgcolor={'common.black'} />
          )}
        </WBFlex>
        <WBBox ml={2}>
          <strong>
            {t('item', {
              ns: 'taskbox',
              count: length,
            })}
          </strong>{' '}
          {t('selected', {
            ns: 'taskbox',
          })}
        </WBBox>
      </WBFlex>
      <WBBox>
        <WBLink
          underline="always"
          onClick={() => setSelectedTasks([])}
          fontWeight={'bold'}
          color={'inherit'}
        >
          {t('clear', { ns: 'taskbox' })}
        </WBLink>
      </WBBox>
    </WBFlex>
  );

  return downLg ? (
    <WBBox
      p={0.5}
      display={{ xs: 'block', sm: 'block', md: 'block', lg: 'none' }}
      sx={{
        bgcolor: 'transparent',
        width: '100%',
        color: 'common.white',
      }}
    >
      {content}
    </WBBox>
  ) : (
    <WBBox p={0.5} mb={3} display={{ xs: 'none', lg: 'block' }}>
      <WBCard
        sx={{
          px: 3,
          py: 2,
          bgcolor: { xs: 'transparent', sm: 'background.paper' },
        }}
      >
        {content}
      </WBCard>
    </WBBox>
  );
};

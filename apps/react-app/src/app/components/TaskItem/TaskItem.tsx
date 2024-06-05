import { Task, TaskDirection, TaskType } from '@admiin-com/ds-graphql';
import {
  WBFlex,
  WBListItem,
  WBListItemButton,
  WBSkeleton,
  WBTypography,
} from '@admiin-com/ds-web';
import { alpha, useTheme } from '@mui/material';
import React from 'react';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { useContact } from '../../hooks/useContact/useContact';
import TaskBadge from '../TaskBadge/TaskBadge';
import { useTranslation } from 'react-i18next';

interface TaskItemProps {
  value: Task | null;
  onChange?: (task: Task | null) => void;
  direction?: TaskDirection;
  selected?: boolean;
}
export const TaskItem = React.forwardRef<any, TaskItemProps>(
  ({ value: task, onChange, selected = false, direction }, ref) => {
    const { contactLoading, contact } = useContact(task);
    const { t } = useTranslation();
    const theme = useTheme();

    return (
      <WBListItem
        ref={ref}
        sx={{
          py: 0,
          px: 0,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.grey[300]}`,
        }}
      >
        <WBListItemButton
          sx={{
            pt: 2.6,
            px: 4,
            pb: 0,
            bgcolor: selected ? alpha('#7367e7', 0.1) : 'inherit',
          }}
          onClick={() => onChange && onChange(task)}
        >
          <WBFlex
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 2.6,
            }}
            flexDirection={{
              lg: 'column',
              sm: 'column',
              md: 'row',
              xs: 'column',
              xl: 'row',
            }}
            width="100%"
          >
            <WBFlex
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              flex={1}
              width="100%"
            >
              {contactLoading || task === null ? (
                <WBSkeleton variant="circular" width={40} height={40} />
              ) : (
                <WBTypography variant="h5" fontWeight="bold" mb={0}>
                  {contact ? (
                    contact.searchName
                  ) : contactLoading ? (
                    <WBSkeleton width={80}></WBSkeleton>
                  ) : null}
                </WBTypography>
              )}
              <WBTypography
                flexGrow={1}
                mx={3}
                color={'text.secondary'}
                fontWeight={'medium'}
                textAlign={'left'}
              >
                {task ? task.reference : <WBSkeleton width={80}></WBSkeleton>}
              </WBTypography>
            </WBFlex>
            <WBFlex
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              flex={1}
              width="100%"
            >
              {task ? (
                <>
                  <TaskBadge task={task} direction={direction} listView />
                  {task.type === TaskType.SIGN_ONLY ? (
                    t('signatureRequired', { ns: 'taskbox' })
                  ) : (
                    <CurrencyNumber
                      number={task.amount ?? 0}
                      fontSize={'h5.fontSize'}
                    />
                  )}
                </>
              ) : (
                <WBSkeleton width={'100%'} height={90} />
              )}
            </WBFlex>
          </WBFlex>
        </WBListItemButton>
      </WBListItem>
    );
  }
);

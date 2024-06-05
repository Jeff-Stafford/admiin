import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { Task, TaskDirection, TaskType } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBCard,
  WBCardContent,
  WBFlex,
  WBSkeleton,
  WBSvgIcon,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  ToggleButton,
  ToggleButtonProps,
  styled,
  useTheme,
} from '@mui/material';
import React from 'react';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { useContact } from '../../hooks/useContact/useContact';
import CheckIcon from '../../../assets/icons/checkicon.svg';
import TaskBadge from '../TaskBadge/TaskBadge';
import PayIDStatus from '../PayIDStatus/PayIDStatus';
import { isPayIDTask } from '../../helpers/payments';
import { useTranslation } from 'react-i18next';

const SelectorButton = styled(ToggleButton)(({ theme }) => ({
  padding: '4px',
  marginBottom: theme.spacing(3),
  '&.Mui-selected ': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  backgroundColor: 'transparent',
  border: 0,
}));

interface TaskCardProps extends Omit<ToggleButtonProps, 'value'> {
  task: Task | null;
  onChecked?: (task: Task) => void;
  checked?: boolean;
  direction?: TaskDirection;
}
export const TaskCard = React.forwardRef<any, TaskCardProps>(
  ({ task, onChecked, checked = false, direction, ...props }, ref) => {
    const { t } = useTranslation();
    const { contactLoading, contact } = useContact(task);
    const [hovered, setHovered] = React.useState<boolean>(false);

    const theme = useTheme();

    const handleChecked = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      event.stopPropagation();
      if (task && onChecked) onChecked(task);
      setHovered(false);
    };

    return (
      <SelectorButton value={(task ?? {}) as any} {...props} ref={ref}>
        <WBCard
          sx={{
            boxShadow: '0 16px 27px -15px rgba(5, 8, 11, 0.27)',
            borderRadius: 0,
            px: { xs: 1, md: 3 },
            py: { xs: 1, md: 2 },
            width: '100%',
          }}
        >
          <WBCardContent>
            <WBFlex
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {contactLoading || task === null ? (
                <WBSkeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ m: 1 }}
                />
              ) : (
                <>
                  <WBBox
                    minWidth="40px"
                    height="40px"
                    sx={{
                      bgcolor: theme.palette.grey[800],
                      '&:hover': {
                        bgcolor: theme.palette.grey[700],
                      },
                    }}
                    m={1}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleChecked}
                  >
                    {checked ? (
                      <WBFlex
                        width={'40px'}
                        height={'100%'}
                        bgcolor={theme.palette.success.main}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <WBSvgIcon fontSize="small">
                          <CheckIcon />
                        </WBSvgIcon>
                      </WBFlex>
                    ) : contact ? (
                      !hovered ? (
                        <WBS3Avatar
                          companyName={contact.searchName}
                          fontSize="h6.fontSize"
                        />
                      ) : null
                    ) : null}
                  </WBBox>
                  <WBFlex
                    flexGrow={1}
                    flexDirection={['column', 'column', 'row', 'column', 'row']}
                    justifyContent={'space-between'}
                    alignItems={{
                      xs: 'start',
                      sm: 'end',
                      md: 'center',
                      lg: 'end',
                      xl: 'center',
                    }}
                  >
                    <WBTypography
                      variant="h3"
                      fontWeight="bold"
                      mb={0}
                      ml={2}
                      textAlign={{ xs: 'left', lg: 'right', xl: 'left' }}
                    >
                      {contact ? (
                        contact.searchName
                      ) : contactLoading ? (
                        <WBSkeleton width={80}></WBSkeleton>
                      ) : null}
                    </WBTypography>

                    {isPayIDTask(task) ? (
                      <PayIDStatus payment={task?.payments?.items?.[0]} />
                    ) : (
                      <WBTypography
                        color={'text.secondary'}
                        fontWeight={'medium'}
                        ml={2}
                        noWrap
                        mt={{ xs: 1, md: 0 }}
                      >
                        {task ? (
                          task.reference
                        ) : (
                          <WBSkeleton width={80}></WBSkeleton>
                        )}
                      </WBTypography>
                    )}
                  </WBFlex>
                </>
              )}
            </WBFlex>
            {task ? (
              <WBFlex
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                mt={3}
              >
                <TaskBadge task={task} direction={direction} />
                {task.type === TaskType.SIGN_ONLY ? (
                  t('signatureRequired', { ns: 'taskbox' })
                ) : (
                  <CurrencyNumber
                    number={task.amount ?? 0}
                    fontSize={{ xs: 'h3.fontSize', md: 'h2.fontSize' }}
                  />
                )}
              </WBFlex>
            ) : (
              <WBSkeleton width={'100%'} height={90} />
            )}
          </WBCardContent>
        </WBCard>
      </SelectorButton>
    );
  }
);

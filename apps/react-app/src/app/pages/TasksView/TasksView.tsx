import { Task, TaskType } from '@admiin-com/ds-graphql';
import { WBFlex, WBStack, WBTypography, useTheme } from '@admiin-com/ds-web';
import { TaskDetailCard } from '../../components/TaskDetailCard/TaskDetailCard';
import PaymentDetail from '../../components/PaymentDetail/PaymentDetail';
import { PaymentDetailSelector } from '../../components/PaymentDetailSelector/PaymentDetailSelector';
import { useTranslation } from 'react-i18next';
import SortPay from '../../../assets/icons/sort-pay.svg';

export interface TasksViewProps {
  tasks: Task[];
}

export function TasksView({ tasks }: TasksViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <>
      <WBFlex
        my={4}
        justifyContent={'space-between'}
        flexDirection={['column', 'row']}
      >
        <WBFlex
          alignItems={'center'}
          flex={1}
          width={['80%', '100%']}
          justifyContent={['space-between', 'start']}
        >
          <WBTypography variant="body1" mr={1} fontWeight={'medium'}>
            {t('sort', { ns: 'taskbox' })}
          </WBTypography>
          <PaymentDetailSelector
            type="Custom"
            icon={<SortPay />}
            bgcolor="#3d47ff"
            options={Object.values(TaskType).map((type: string) => ({
              value: type,
              label: t(type, { ns: 'taskbox' }),
            }))}
            value={TaskType.SIGN_PAY}
            fontColor={theme.palette.text.primary}
          />
        </WBFlex>
        <WBFlex
          alignItems={'center'}
          width={['80%', '100%']}
          flex={1}
          justifyContent={['space-between', 'end']}
        >
          <WBTypography variant="body1" mr={1} fontWeight={'medium'}>
            {t('bulkAction', { ns: 'taskbox' })}
          </WBTypography>
          <PaymentDetail task={null} type="Type" bulkData={tasks}>
            <PaymentDetailSelector
              bgcolor="#3d47ff"
              fontColor={theme.palette.text.primary}
            />
          </PaymentDetail>
        </WBFlex>
      </WBFlex>
      <WBStack direction={'column'} spacing={1} sx={{ minHeight: '100%' }}>
        {tasks.map((task) => (
          <TaskDetailCard task={task} key={task.id} />
        ))}
      </WBStack>
    </>
  );
}

export default TasksView;

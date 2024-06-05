import {
  WBCard,
  WBCardContent,
  WBFlex,
  WBGrid,
  WBSvgIcon,
  WBTypography,
  useTheme,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import SendBillIconLight from '../../../assets/icons/send-bill.svg';
import ReceiveBillIconLight from '../../../assets/icons/receive-bill.svg';
import SendBillIconDark from '../../../assets/icons/send-bill-dark.svg';
import ReceiveBillIconDark from '../../../assets/icons/receive-bill-dark.svg';
import { useTaskCreationContext } from '../TaskCreation/TaskCreation';
import { TaskDirection } from '@admiin-com/ds-graphql';

/* eslint-disable-next-line */
export interface BillDirectionProps {}

interface BillDirectionCardProps {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  onClick: () => void;
}
function BillDirectionCard(props: BillDirectionCardProps) {
  return (
    <WBCard
      sx={{
        boxShadow: '0 12px 47px -15px rgba(5, 8, 11, 0.27)',
        height: '100%',
        cursor: 'pointer',
      }}
      onClick={props.onClick}
    >
      <WBCardContent>
        <WBFlex flexDirection={'column'} justifyContent={'center'} p={2}>
          <WBFlex justifyContent={'center'} p={2}>
            <WBSvgIcon fontSize="medium" viewBox="0 0 27 27">
              {props.icon}
            </WBSvgIcon>
          </WBFlex>
          <WBTypography
            textAlign="center"
            variant="h5"
            mt={1}
            fontWeight={'bold'}
          >
            {props.title}
          </WBTypography>
          <WBTypography textAlign="center" variant="body2" mt={2}>
            {props.subTitle}
          </WBTypography>
        </WBFlex>
      </WBCardContent>
    </WBCard>
  );
}

export function BillDirection(props: BillDirectionProps) {
  const theme = useTheme();
  const mode = theme.palette.mode; // 'light' or 'dark'

  const { t } = useTranslation();
  const { setPage, setTaskDirection } = useTaskCreationContext();
  return (
    <WBFlex justifyContent={'space-around'} mt={[2, 3, 10]}>
      <WBGrid
        container
        spacing={[2, 4]}
        padding={[0, 5]}
        alignItems={'stretch'}
        justifyContent={'center'}
        direction="row"
      >
        <WBGrid xs={12} sm={8} md={6}>
          <BillDirectionCard
            icon={
              mode === 'dark' ? <SendBillIconDark /> : <SendBillIconLight />
            }
            title={t('sendTitle', { ns: 'taskbox' })}
            subTitle={t('sendSubTitle', { ns: 'taskbox' })}
            onClick={() => {
              setTaskDirection(TaskDirection.SENDING);
              setPage('Add');
            }}
          />
        </WBGrid>

        <WBGrid xs={12} sm={8} md={6}>
          <BillDirectionCard
            icon={
              mode === 'dark' ? (
                <ReceiveBillIconDark />
              ) : (
                <ReceiveBillIconLight />
              )
            }
            title={t('receiveTitle', { ns: 'taskbox' })}
            onClick={() => {
              setTaskDirection(TaskDirection.RECEIVING);
              setPage('Add');
            }}
            subTitle={t('receiveSubTitle', { ns: 'taskbox' })}
          />
        </WBGrid>
      </WBGrid>
    </WBFlex>
  );
}

export default BillDirection;

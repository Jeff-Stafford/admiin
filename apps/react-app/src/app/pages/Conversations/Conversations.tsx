import { WBBox, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { NAVBAR_HEIGHT } from '../../constants/config';
import ConversationDetail from './ConversationDetail';
import { ConversationList } from './ConversationList';

const Conversations = () => {
  const { t } = useTranslation();
  return (
    <WBFlex flex={1} height={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
      <WBBox
        sx={{
          flex: {
            xs: 3,
            sm: 4,
            md: 3,
          },
          borderRight: '1px solid lightgrey',
          overflow: 'hidden',
        }}
      >
        <WBFlex
          sx={{ borderBottom: '1px solid grey' }}
          height="73px"
          alignItems="center"
          justifyContent="center"
        >
          <WBTypography
            variant="h3"
            m={0}
            display={{
              xs: 'none',
              sm: 'block',
            }}
          >
            {t('chatsTitle', { ns: 'conversations' })}
          </WBTypography>
        </WBFlex>
        <ConversationList />
      </WBBox>
      <WBFlex
        flexDirection="column"
        sx={{
          flex: {
            xs: 9,
            sm: 8,
            md: 9,
          },
        }}
      >
        <ConversationDetail />
      </WBFlex>
    </WBFlex>
  );
};

export default Conversations;

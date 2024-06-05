import { WBBox } from '@admiin-com/ds-web';
import { styled, useTheme } from '@mui/material';
import {
  getUser as GET_USER,
  createPaymentMethodToken as CREATE_ZAI_PAYMENTMETHOD_TOKEN,
  ZaiTokenType,
  PaymentMethod,
} from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client';
import React from 'react';
import { FormError } from '../FormError/FormError';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';

export const HosteadField = styled(WBBox)(({ theme }) => ({
  // height: '40px',
  // padding: '0 12px',

  borderBottom: '2px solid rgba(0, 0, 0, 1)',
  transition: 'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

  height: '48px',
  '&::after': {
    left: 0,
    bottom: 0,
    content: '""',
    position: 'absolute',
    right: 0,
    transform: 'scaleX(0)',
    transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    pointerEvents: 'none',
    WebkitTransform: 'scaleX(0)', // For Safari
    WebkitTransition:
      '-webkit-transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms', // For Safari
  },
  '&.hosted-field-invalid': {
    borderColor: theme.palette.error.main,
  },
  '&.hosted-field-valid': {
    borderColor: theme.palette.common.black,
  },
  '&.hosted-field-focus': {
    borderColor: '#CC9FFA',
    boxShadow: '0px 1px 12px rgba(33, 0, 150, 0ccform 0.25)',
  },
}));
export const Error = FormError;

export function useHostedFields({
  isGuest = false,
  taskId,
  entityId,
}: {
  isGuest?: boolean;
  taskId?: string;
  entityId?: string;
}) {
  const theme = useTheme();

  const fieldStyles = {
    input: {
      'font-size': '1rem',
      'line-height': '1.4375em',
      'font-weight': 400,
      'font-family': `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Nexa", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      color: theme.palette.text.primary,
      'box-sizing': 'border-box',
      position: 'relative',
      cursor: 'text',
      display: 'inline-flex',
      'align-items': 'center',
      width: '100%',
      'max-height': '48px',
      padding: '0px',
      // 'font-family': 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      'letter-spacing': '0.02em',
    },
    // '& .field-container': {

    // },
    '.invalid': {
      color: theme.palette.text.primary,
    },
    '::placeholder': {
      color: '#757575',
    },
    '.invalid .card-icon': {
      color: '#CC0001',
    },
  };

  const [createPaymentMethodToken] = useMutation(
    gql(CREATE_ZAI_PAYMENTMETHOD_TOKEN)
  );
  const [token, setToken] = React.useState<any>(null);
  const [user_id, setUserId] = React.useState<string | null>(null);

  const { data: subData } = useQuery(gql(GET_SUB));

  const [getUser] = useLazyQuery(gql(GET_USER), {
    variables: {
      id: subData?.sub,
    },
  });
  const fetchTokenUserId = React.useCallback(async () => {
    const tokenData = await createPaymentMethodToken({
      variables: {
        input: {
          tokenType: ZaiTokenType.card,
          isGuest,
          ...(isGuest && { taskId, entityId }),
        },
      },
    });
    const token = tokenData?.data?.createPaymentMethodToken.token;

    if (!isGuest) {
      const userData = await getUser();
      const user_id = isGuest
        ? tokenData?.data?.createPaymentMethodToken.userId
        : userData?.data?.getUser?.zaiUserId;
      setUserId(user_id);
    }
    setToken(token);
  }, [createPaymentMethodToken, isGuest, getUser]);

  React.useEffect(() => {
    fetchTokenUserId();
  }, [fetchTokenUserId]);

  return { fieldStyles, token, user_id, fetchTokenUserId };
}

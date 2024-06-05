import { gql, useMutation } from '@apollo/client';
import {
  DynamicInputType,
  WBDynamicForm,
  WBTypography,
} from '@admiin-com/ds-web';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
import { createPushNotification as CREATE_PUSH_NOTIFICATION } from '@admiin-com/ds-graphql';
//type: DynamicInputType;
//label?: string;
//name: string;
//placeholder?: string;
//defaultValue?: string;
//options?: { value: string | number; label: string; group?: string }[];
//rules?: any; //TODO: rules type

const inputs = [
  {
    label: 'Title',
    placeholder: '',
    name: 'title',
    type: DynamicInputType.text,
    defaultValue: '',
    rules: {
      required: 'Enter a title',
    },
  },
  {
    label: 'Message',
    placeholder: '',
    name: 'message',
    type: DynamicInputType.text,
    defaultValue: '',
    rules: {
      required: 'Enter a message',
    },
  },
];

export const Notifications = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>();
  const [createPushNotification, { loading }] = useMutation(
    gql(CREATE_PUSH_NOTIFICATION)
  );

  const onSubmit = async (data: any) => {
    console.log('data: ', data);
    try {
      const response = await createPushNotification({
        variables: {
          input: data,
        },
      });
      console.log('createPushNotification: ', response);
      formRef?.current?.resetForm();
    } catch (err) {
      console.log('ERROR create push notification');
    }
  };

  return (
    <PageContainer>
      <WBTypography variant="h1">
        {t('notificationsTitle', { ns: 'backoffice' })}
      </WBTypography>
      <WBDynamicForm
        ref={formRef}
        inputs={inputs}
        btnTitle={t('submitTitle', { ns: 'common' })}
        loading={loading}
        onSubmit={onSubmit}
      />
    </PageContainer>
  );
};

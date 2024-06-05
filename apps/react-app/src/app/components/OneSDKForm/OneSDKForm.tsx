import { WBBox } from '@admiin-com/ds-web';
import styled from '@emotion/styled';

/* eslint-disable-next-line */
// import { oneSdkIndividual } from '@frankieone/one-sdk';
import React from 'react';

interface OneSDKFormProps {
  token?: string | null;
}

const OneSDKForm = React.forwardRef(({ token }: OneSDKFormProps, ref) => {
  return <WBBox ref={ref} style={{ width: '100%', height: '100%' }} />;
});

export default OneSDKForm;

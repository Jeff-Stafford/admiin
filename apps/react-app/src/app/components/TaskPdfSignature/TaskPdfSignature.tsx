import { Task, TaskGuest } from '@admiin-com/ds-graphql';
import { gql, useMutation } from '@apollo/client';
import React from 'react';
import {
  createTaskDocumentUrl as CREATE_TASK_DOCUMENT_URL,
  createTaskDocumentUrlGuest as CREATE_TASK_DOCUMENT_URL_GUEST,
} from '@admiin-com/ds-graphql';
import { WBFlex } from '@admiin-com/ds-web';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import PdfViewer from '../PdfViewer/PdfViewer';

/* eslint-disable-next-line */
export interface TaskPdfSignatureProps {
  task: Task | TaskGuest | null;
  minHeight?: any;
  isGuest?: boolean;
}

export function TaskPdfSignature({
  task,
  minHeight = '630px',
  isGuest,
}: TaskPdfSignatureProps) {
  const context = useTaskBoxContext();

  const [createTaskDocumentUrl] = useMutation(gql(CREATE_TASK_DOCUMENT_URL));
  const [createTaskDocumentUrlGuest] = useMutation(
    gql(CREATE_TASK_DOCUMENT_URL_GUEST)
  );
  const [documentUrl, setDocumentUrl] = React.useState<string>('');

  const { pdfSignatureRef } = context ?? {};
  React.useEffect(() => {
    const fetchDocumentUrl = async () => {
      if (task?.documents?.[0]?.key) {
        try {
          setDocumentUrl('');
          const getTaskDocumentUrl = !isGuest
            ? createTaskDocumentUrl
            : createTaskDocumentUrlGuest;
          const documentUrlData = await getTaskDocumentUrl({
            variables: {
              input: {
                taskId: task.id,
                entityId: task.entityId,
              },
            },
          });
          setDocumentUrl(
            isGuest
              ? documentUrlData?.data?.createTaskDocumentUrlGuest?.url
              : documentUrlData?.data?.createTaskDocumentUrl?.url
          );
        } catch (err) {
          console.log('ERROR CREATING DOCUMENT URL', err);
        }
      } else setDocumentUrl('');
    };

    fetchDocumentUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTaskDocumentUrl, task?.documents?.[0]?.key]);
  return (
    <WBFlex flex={1} sx={{ minHeight }}>
      {task?.annotations && documentUrl && task.documents?.[0]?.key ? (
        <PdfViewer
          ref={pdfSignatureRef ?? null}
          annotations={task.annotations}
          documentUrl={documentUrl}
        />
      ) : null}
    </WBFlex>
  );
}

export default TaskPdfSignature;

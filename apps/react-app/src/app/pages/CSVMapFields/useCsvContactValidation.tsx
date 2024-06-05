import React from 'react';
import { REGEX } from '@admiin-com/ds-common';
import { CSVMapFormData } from './CsvMapFields';

import Papa from 'papaparse';
export type FailedRowDetail = {
  no: number;
  value: string;
  message: string;
};
interface useValidateContactDataProps {
  file?: File;
  fields: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    companyName?: string;
  };
}

export function useCsvContactValidation({
  file,
  fields,
}: useValidateContactDataProps) {
  const [successedRow, setSuccessedRow] = React.useState<number>(0);
  const [failedRowDetails, setFailedRowDetail] = React.useState<
    Array<FailedRowDetail>
  >([]);
  const [failedCount, setFailedCount] = React.useState<number>(0);

  const [fieldNames, setFieldNames] = React.useState<string[]>([]);

  const validateContactData = ({
    firstName,
    lastName,
    phone,
    email,
    companyName,
  }: CSVMapFormData) => {
    const errors: Array<any> = [];
    if (companyName === '' && lastName === '' && firstName === '') {
      errors.push({
        field: 'companyName',
        message: 'Company name or first and last name is required',
      });
    }
    if (companyName === '' && lastName === '' && firstName !== '') {
      errors.push({
        field: 'lastName',
        message: 'LastName name is required',
      });
    }
    if (companyName === '' && lastName !== '' && firstName === '') {
      errors.push({
        field: 'firstName',
        message: 'FirstName name is required',
      });
    }
    if (email === '') {
      errors.push({
        field: 'email',
        message: 'Email is missing',
      });
    } else if (!REGEX.EMAIL.test(email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
      });
    }

    //if (phone !== '') {
    //  if (!matchIsValidTel(phone))
    //    errors.push({
    //      field: 'phone',
    //      message: 'Invalid phone number',
    //    });
    //}
    return errors;
  };

  //
  React.useEffect(() => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const records = result.data;
          if (records.length > 0) {
            let succeedRecordCount = 0;
            let failedRecordCount = 0;
            const errorsReport: Array<FailedRowDetail> = [];
            records.forEach((record: any, index) => {
              const firstName =
                fields.firstName && fields.firstName !== 'Ignore column'
                  ? record?.[fields.firstName]
                  : '';
              const lastName =
                fields.lastName && fields.lastName !== 'Ignore column'
                  ? record?.[fields.lastName]
                  : '';
              const phone =
                fields.phone && fields.phone !== 'Ignore column'
                  ? record?.[fields.phone]
                  : '';
              const email =
                fields.email && fields.email !== 'Ignore column'
                  ? record?.[fields.email]
                  : '';
              const companyName =
                fields.companyName && fields.companyName !== 'Ignore column'
                  ? record?.[fields.companyName]
                  : '';
              const errors = validateContactData({
                firstName,
                lastName,
                phone,
                email,
                companyName,
              });
              if (errors.length > 0) {
                for (const error of errors) {
                  const field = fields[error.field as keyof CSVMapFormData];
                  errorsReport.push({
                    no: index,
                    value: field ? record?.[field] : '',
                    message: error.message,
                  });
                }
                failedRecordCount++;
              } else {
                succeedRecordCount++;
              }
            });
            setSuccessedRow(succeedRecordCount);
            setFailedCount(failedRecordCount);
            setFailedRowDetail(errorsReport);
          }
        },
      });
    }
  }, [file, fields]);

  //
  React.useEffect(() => {
    if (file) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (result: any) => {
          const records = result.data;
          if (records.length > 0) {
            const fieldNames: string[] = records[0];
            setFieldNames(fieldNames);
          }
        },
      });
    }
  }, [file]);

  return { successedRow, failedRowDetails, failedCount, fieldNames };
}

import { gql, useLazyQuery } from '@apollo/client';
import {
  XeroInvoiceStatus,
  xeroListTransactions as XERO_LIST_TRANSACTIONS,
} from '@admiin-com/ds-graphql';
import { WBBox, WBDataGrid, WBSelect, WBTypography } from '@admiin-com/ds-web';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';

export function XeroTransactions() {
  const { t } = useTranslation();
  const [page] = useState(1); // Xero pagination starts with page 1
  const [transactions, setTransactions] = useState([]);
  const [xeroListTransactions, { loading }] = useLazyQuery(
    gql(XERO_LIST_TRANSACTIONS),
    {
      fetchPolicy: 'cache-and-network',
    }
  );
  const [statuses, setStatuses] = useState<XeroInvoiceStatus[]>([]);

  const columns: GridColDef[] = [
    {
      field: 'invoiceNumber',
      headerName: t('invoiceNumber', { ns: 'xero' }),
      valueGetter: (params: GridValueGetterParams) =>
        params.row.invoiceNumber || '-',
    },
    { field: 'status', headerName: t('invoiceStatus', { ns: 'xero' }) },
    { field: 'amountPaid', headerName: t('amountPaid', { ns: 'xero' }) },
    {
      field: 'amountDue',
      headerName: t('amountDue', { ns: 'xero' }),
      editable: true,
    },
    { field: 'total', headerName: t('total', { ns: 'xero' }) },
    { field: 'totalTax', headerName: t('totalTax', { ns: 'xero' }) },
  ];

  useEffect(() => {
    const searchTransactions = async () => {
      let transactionsData;
      try {
        transactionsData = await xeroListTransactions({
          variables: {
            page,
            statuses,
          },
        });
        const { data } = transactionsData;
        console.log('transactions: ', data.xeroListTransactions);
        setTransactions(data.xeroListTransactions);
      } catch (err) {
        console.log('ERROR list transactions: ', err);
      }
    };

    searchTransactions();
  }, [statuses, page, xeroListTransactions]); //TODO: implement pagination with page
  return (
    <PageContainer>
      <WBTypography variant="h1">
        {t('xeroTransactions', { ns: 'xero' })}
      </WBTypography>
      <WBBox width={340}>
        <WBSelect
          label={t('status', { ns: 'common' })}
          value={statuses}
          onChange={(e) =>
            setStatuses(e?.target?.value as unknown as XeroInvoiceStatus[])
          }
          options={[
            {
              label: XeroInvoiceStatus.DRAFT,
              value: XeroInvoiceStatus.DRAFT,
            },
            {
              label: XeroInvoiceStatus.SUBMITTED,
              value: XeroInvoiceStatus.SUBMITTED,
            },
            {
              label: XeroInvoiceStatus.AUTHORISED,
              value: XeroInvoiceStatus.AUTHORISED,
            },
            {
              label: XeroInvoiceStatus.PAID,
              value: XeroInvoiceStatus.PAID,
            },
            {
              label: XeroInvoiceStatus.DELETED,
              value: XeroInvoiceStatus.DELETED,
            },
            {
              label: XeroInvoiceStatus.VOIDED,
              value: XeroInvoiceStatus.VOIDED,
            },
          ]}
          margin="dense"
          multiple
        ></WBSelect>
      </WBBox>
      <WBDataGrid
        getRowId={(row) => row.invoiceID}
        columns={columns}
        rows={transactions}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 }, //TODO: check if over 100 records returned from api
          },
        }}
        density="compact"
        pageSizeOptions={[20, 100]}
        checkboxSelection
        loading={loading}
        onRowSelectionModelChange={(params) => {
          console.log('selected rows: ', params);
        }}
        onRowEditCommit={(params) => console.log('onRowEditCommit: ', params)}
        onCellEditStart={(params) => console.log('onCellEditStart: ', params)}
        onCellEditStop={(params) => console.log('onCellEditStop: ', params)}
        onPaginationModelChange={(params) =>
          console.log('onPaginationModelChange: ', params)
        }
      />

      {/*<WBTableContainer>*/}
      {/*  <WBTable*/}
      {/*    aria-label="Xero transactions table"*/}
      {/*  >*/}
      {/*    <WBTableHead>*/}
      {/*      <WBTableCell>*/}
      {/*        {t('invoiceNumber', { ns: 'xero' })}*/}
      {/*      </WBTableCell>*/}
      {/*      <WBTableCell>*/}
      {/*        {t('invoiceStatus', { ns: 'xero' })}*/}
      {/*      </WBTableCell>*/}
      {/*      <WBTableCell>*/}
      {/*        {t('amountPaid', { ns: 'xero' })}*/}
      {/*      </WBTableCell>*/}
      {/*      <WBTableCell>*/}
      {/*        {t('amountDue', { ns: 'xero' })}*/}
      {/*      </WBTableCell>*/}
      {/*      <WBTableCell>*/}
      {/*        {t('total', { ns: 'xero' })}*/}
      {/*      </WBTableCell>*/}
      {/*      <WBTableCell>*/}
      {/*        {t('totalTax', { ns: 'xero' })}*/}
      {/*      </WBTableCell>*/}
      {/*    </WBTableHead>*/}

      {/*    <WBInfiniteScroll*/}
      {/*      items={transactions}*/}
      {/*      renderItem={({ item }: {*/}
      {/*        item: XeroInvoice*/}
      {/*      }) => <WBTableRow>*/}
      {/*        <WBTableCell>{item.invoiceNumber || '-'}</WBTableCell>*/}
      {/*        <WBTableCell>{item.status}</WBTableCell>*/}
      {/*        <WBTableCell>{item.amountPaid}</WBTableCell>*/}
      {/*        <WBTableCell>{item.amountDue}</WBTableCell>*/}
      {/*        <WBTableCell>{item.total}</WBTableCell>*/}
      {/*        <WBTableCell>{item.totalTax}</WBTableCell>*/}
      {/*      </WBTableRow>}*/}
      {/*      isFetching={loading}*/}
      {/*      hasMoreItems={false}*/}
      {/*      fetchNextPage={() => setPage(page + 1)}*/}
      {/*    />*/}

      {/*  </WBTable>*/}
      {/*</WBTableContainer>*/}
    </PageContainer>
  );
}

export default XeroTransactions;

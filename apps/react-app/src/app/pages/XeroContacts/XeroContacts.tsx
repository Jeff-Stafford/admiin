import { gql, useLazyQuery } from '@apollo/client';
import { xeroListContacts as XERO_LIST_CONTACTS } from '@admiin-com/ds-graphql';
import { WBDataGrid, WBTypography } from '@admiin-com/ds-web';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';

export function XeroContacts() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1); // Xero pagination starts with page 1
  const [contacts, setContacts] = useState([]);
  const [xeroListContacts, { loading }] = useLazyQuery(
    gql(XERO_LIST_CONTACTS),
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('contactName', { ns: 'xero' }) },
    { field: 'emailAddress', headerName: t('emailAddress', { ns: 'xero' }) },
    { field: 'contactNumber', headerName: t('contactNumber', { ns: 'xero' }) },
    { field: 'contactStatus', headerName: t('contactStatus', { ns: 'xero' }) },
  ];

  useEffect(() => {
    const searchContacts = async () => {
      let contactsData;
      try {
        contactsData = await xeroListContacts({
          variables: {
            page,
            //statuses
          },
        });
        const { data } = contactsData;
        console.log('contacts: ', data.xeroListContacts);
        setContacts(data.xeroListContacts);
      } catch (err) {
        console.log('ERROR list contacts: ', err);
      }
    };

    searchContacts();
  }, [page, xeroListContacts]); //TODO: implement pagination with page
  return (
    <PageContainer>
      <WBTypography variant="h1">
        {t('xeroContacts', { ns: 'xero' })}
      </WBTypography>
      {/*<WBBox width={340}>*/}
      {/*  <WBSelect*/}
      {/*    label={t('status', { ns: 'common' })}*/}
      {/*    value={statuses}*/}
      {/*    onChange={(e) => setStatuses(e?.target?.value as XeroCon)}*/}
      {/*    options={[*/}
      {/*      {*/}
      {/*        label: XeroInvoiceStatus.DRAFT,*/}
      {/*        value: XeroInvoiceStatus.DRAFT*/}
      {/*      },*/}
      {/*      {*/}
      {/*        label: XeroInvoiceStatus.SUBMITTED,*/}
      {/*        value: XeroInvoiceStatus.SUBMITTED*/}
      {/*      },*/}
      {/*      {*/}
      {/*        label: XeroInvoiceStatus.AUTHORISED,*/}
      {/*        value: XeroInvoiceStatus.AUTHORISED*/}
      {/*      },*/}
      {/*      {*/}
      {/*        label: XeroInvoiceStatus.PAID,*/}
      {/*        value: XeroInvoiceStatus.PAID*/}
      {/*      },*/}
      {/*      {*/}
      {/*        label: XeroInvoiceStatus.DELETED,*/}
      {/*        value: XeroInvoiceStatus.DELETED*/}
      {/*      },*/}
      {/*      {*/}
      {/*        label: XeroInvoiceStatus.VOIDED,*/}
      {/*        value: XeroInvoiceStatus.VOIDED*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*    margin="dense"*/}
      {/*    multiple*/}
      {/*  >*/}

      {/*  </WBSelect>*/}
      {/*</WBBox>*/}
      <WBDataGrid
        getRowId={(row) => row.contactID}
        columns={columns}
        rows={contacts}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 }, //TODO: check if over 100 records returned from api
          },
        }}
        density="compact"
        pageSizeOptions={[100]}
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
      {/*    aria-label="Xero contacts table"*/}
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
      {/*      items={contacts}*/}
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

export default XeroContacts;

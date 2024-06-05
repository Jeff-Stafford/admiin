import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  WBBox,
  WBButton,
  WBFlex,
  WBIcon,
  WBIconButton,
  WBTable,
  WBTableBody,
  WBTableCell,
  WBTableContainer,
  WBTableHead,
  WBTableRow,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Admin } from '@admiin-com/ds-graphql';
import { PageContainer, Link } from '../../components';
import { listAdmins } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

const Admins = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: adminsData, refetch } = useQuery(gql(listAdmins));
  const adminList: Admin[] = useMemo(
    () => adminsData?.listAdmins?.items || [],
    [adminsData]
  );

  //const parentRef = React.useRef<HTMLDivElement>(null);

  //const rowVirtualizer = useVirtualizer({
  //  count: adminList.length,
  //  getScrollElement: () => parentRef.current,
  //  estimateSize: () => 125,
  //});

  return (
    <PageContainer>
      <WBFlex flexDirection="column">
        <WBFlex p={2}>
          <WBBox flex={1}>
            <WBIconButton
              icon="Refresh"
              size="small"
              type="button"
              onClick={refetch}
            />
          </WBBox>
          <WBBox flex={1} textAlign="right">
            <WBButton
              startIcon={<WBIcon name="Add" size="small" />}
              onClick={() => navigate(PATHS.adminCreate)}
              size="small"
              type="button"
            >
              {t('adminTitle', { ns: 'common' })}
            </WBButton>
          </WBBox>
        </WBFlex>
        <WBTableContainer>
          <WBTable
            //sx={{ minWidth: 650 }}
            aria-label="Admin table"
          >
            <WBTableHead>
              <WBTableRow>
                <WBTableCell>
                  {t('firstNameTitle', { ns: 'common' })}
                </WBTableCell>
                <WBTableCell>
                  {t('lastNameTitle', { ns: 'common' })}
                </WBTableCell>
                <WBTableCell>{t('roleTitle', { ns: 'common' })}</WBTableCell>
              </WBTableRow>
            </WBTableHead>
            <WBTableBody>
              {adminList?.map((admin) => (
                <WBTableRow
                  key={admin.id}
                  //sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <WBTableCell>
                    <Link to={`${PATHS.adminUpdate}/${admin.id}`}>
                      {admin.firstName}
                    </Link>
                  </WBTableCell>
                  <WBTableCell>{admin.lastName}</WBTableCell>
                  <WBTableCell>{admin.role}</WBTableCell>
                </WBTableRow>
              ))}
            </WBTableBody>
          </WBTable>
        </WBTableContainer>
        {/*<WBFlex*/}
        {/*  ref={parentRef}*/}
        {/*  sx={{*/}
        {/*    height: `auto`,*/}
        {/*    width: `100%`,*/}
        {/*    overflow: "auto",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Box*/}
        {/*    sx={{*/}
        {/*      height: rowVirtualizer.getTotalSize(),*/}
        {/*      width: "100%",*/}
        {/*      position: "relative",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {rowVirtualizer.getVirtualItems().map((virtualRow: any) => (*/}
        {/*      <WBFlex*/}
        {/*        key={virtualRow.index}*/}
        {/*        ref={virtualRow.measureElement}*/}
        {/*        style={{*/}
        {/*          position: "absolute",*/}
        {/*          top: 0,*/}
        {/*          left: 0,*/}
        {/*          width: "100%",*/}
        {/*          transform: `translateY(${virtualRow.start}px)`,*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <Box flex={1}>{adminList[virtualRow.index]?.firstName}</Box>*/}
        {/*        <Box flex={1}>{adminList[virtualRow.index]?.lastName}</Box>*/}
        {/*        <Box flex={1}>{adminList[virtualRow.index]?.role}</Box>*/}
        {/*        <Box flex={1}>*/}
        {/*          <Link*/}
        {/*            to={`${PATHS.adminUpdate}/${*/}
        {/*              adminList[virtualRow.index]?.id*/}
        {/*            }`}*/}
        {/*          >*/}
        {/*            {t("viewTitle", { ns: "common" })}*/}
        {/*          </Link>*/}
        {/*        </Box>*/}
        {/*      </WBFlex>*/}
        {/*    ))}*/}
        {/*  </Box>*/}
        {/*</WBFlex>*/}
      </WBFlex>
    </PageContainer>
  );
};

export default Admins;

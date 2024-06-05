import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  WBBox,
  WBFlex,
  WBIconButton,
  WBTable,
  WBTableBody,
  WBTableCell,
  WBTableContainer,
  WBTableHead,
  WBTableRow,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { User } from '@admiin-com/ds-graphql';
import { PageContainer, Link } from '../../components';
import { listUsers } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

const Users = () => {
  const { t } = useTranslation();
  const { data: usersData, refetch } = useQuery(gql(listUsers));
  const users: User[] = useMemo(
    () => usersData?.listUsers?.items || [],
    [usersData]
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
                <WBTableCell>
                  {t('userTypeTitle', { ns: 'common' })}
                </WBTableCell>
                <WBTableCell>{t('emailTitle', { ns: 'common' })}</WBTableCell>
                <WBTableCell>{t('phoneTitle', { ns: 'common' })}</WBTableCell>
                <WBTableCell>
                  {t('onboardingStatusTitle', { ns: 'common' })}
                </WBTableCell>
              </WBTableRow>
            </WBTableHead>
            <WBTableBody>
              {users?.map((user) => (
                <WBTableRow
                  key={user.id}
                  //sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <WBTableCell>
                    <Link to={`${PATHS.adminUpdate}/${user.id}`}>
                      {user.firstName}
                    </Link>
                  </WBTableCell>
                  <WBTableCell>{user.lastName}</WBTableCell>
                  <WBTableCell>{user.userType}</WBTableCell>
                  <WBTableCell>{user.email}</WBTableCell>
                  <WBTableCell>{user.phone}</WBTableCell>
                  <WBTableCell>{user.onboardingStatus}</WBTableCell>
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

export default Users;

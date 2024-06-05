import { EntityUser } from '@admiin-com/ds-graphql';
import { WBChip, WBFlex } from '@admiin-com/ds-web';
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ActionDisplay from '../ActionDisplay/ActionDisplay';
import React from 'react';
import RemoveEntityUserModal from '../RemoveEntityUserModal/RemoveEntityUserModal';

/* eslint-disable-next-line */
export interface EntityUserTableProps {
  users: EntityUser[];
  loading: boolean;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default,
    fontWeight: 'bold',
    boxShadow: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.root}`]: {
    borderBottom: 0,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  borderBottom: 0,
}));

export function EntityUserTable({ users, loading }: EntityUserTableProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              {t('firstName', { ns: 'settings' })}
            </StyledTableCell>
            <StyledTableCell>
              {t('lastName', { ns: 'settings' })}
            </StyledTableCell>
            {/*<StyledTableCell>{t('email', { ns: 'settings' })}</StyledTableCell>*/}
            <StyledTableCell>{t('role', { ns: 'settings' })}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ '& .MuiTableCell-root': { border: 0 } }}>
          {loading ? (
            <>
              <TableRow>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                {/*<TableCell>*/}
                {/*  <Skeleton width={'100%'} />*/}
                {/*</TableCell>*/}
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                <TableCell>
                  <Skeleton width={'100%'} />
                </TableCell>
                {/*<TableCell>*/}
                {/*  <Skeleton width={'100%'} />*/}
                {/*</TableCell>*/}
              </TableRow>
            </>
          ) : null}
          {users?.map((user) => (
            <StyledTableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              {/*<TableCell>{'sdaf.com'}</TableCell>*/}
              <TableCell>
                <WBFlex justifyContent={'space-between'}>
                  <WBChip
                    label={t(user.role ?? '', { ns: 'settings' })}
                    sx={{
                      margin: 0,
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      bgcolor: 'common.black',
                      color: 'common.white',
                    }}
                  />
                  {user.role !== 'OWNER' ? (
                    <ActionDisplay
                      items={[
                        {
                          title: t('removeEntityUser', { ns: 'settings' }),
                          color: 'error.main',
                          action: () => {
                            handleClickOpen();
                          },
                        },
                      ]}
                    >
                      <RemoveEntityUserModal
                        entityUser={user}
                        open={open}
                        handleClose={handleClose}
                      />
                    </ActionDisplay>
                  ) : null}
                </WBFlex>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EntityUserTable;

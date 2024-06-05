import { Entity } from '@admiin-com/ds-graphql';
import { useUserEntities } from '../../hooks/useUserEntities/useUserEntities';
import { EntityCardList } from './EntityCardList/EntityCardList';
import { EntityTableList } from './EntityTableList/EntityTableList';
import React from 'react';

export enum EntityListView {
  CARD_VIEW,
  TABLE_VIEW,
}
interface EntityListProps {
  mode: EntityListView;
}
export type AmountData = {
  entity?: Entity | null;
  inboxAmount?: number;
  outboxAmount?: number;
};

export const TotalAmountContext = React.createContext<any>(null);

export function EntityList(props: EntityListProps) {
  const { userEntities, loading } = useUserEntities({ notAccountant: true });

  const [amounts, setAmounts] = React.useState<AmountData[]>([]);

  return (
    <TotalAmountContext.Provider value={{ amounts, setAmounts }}>
      {props.mode === EntityListView.CARD_VIEW ? (
        <EntityCardList entities={userEntities} loading={loading} />
      ) : (
        <EntityTableList entities={userEntities} loading={loading} />
      )}
    </TotalAmountContext.Provider>
  );
}

export const useAmounts = () => {
  const context = React.useContext(TotalAmountContext);
  const { amounts } = context;
  const inboxAmount = amounts.reduce(
    (amount: number, item: AmountData) => amount + (item?.inboxAmount || 0),
    0
  );
  const outboxAmount = amounts.reduce(
    (amount: number, item: AmountData) => amount + (item?.outboxAmount || 0),
    0
  );
  return [inboxAmount, outboxAmount];
};

export const useAddAmount = () => {
  const context = React.useContext(TotalAmountContext);
  const { setAmounts } = context;
  const addAmount = React.useCallback(
    ({ inboxAmount, entity, outboxAmount }: AmountData) => {
      setAmounts((amounts: AmountData[]) => [
        ...amounts.filter((item) => item?.entity?.id !== entity?.id),
        {
          inboxAmount:
            inboxAmount ??
            amounts.find((item) => item?.entity?.id === entity?.id)
              ?.inboxAmount,
          outboxAmount:
            outboxAmount ??
            amounts.find((item) => item?.entity?.id === entity?.id)
              ?.outboxAmount,
          entity,
        },
      ]);
    },
    [setAmounts]
  );
  return addAmount;
};

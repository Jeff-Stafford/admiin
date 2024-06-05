import { WBLink, WBMenuItem, WBSelect } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';

/* eslint-disable-next-line */

export enum NoteType {
  TO_SELF = 'TO_SELF',
  FOR_OTHER = 'FOR_OTHER',
}
export interface NoteTypeSelectProps {
  value: NoteType;
  onChange: (value: NoteType) => void;
}

export function NoteTypeSelect({ value, onChange }: NoteTypeSelectProps) {
  const { t } = useTranslation();
  return (
    <WBSelect
      InputProps={{
        disableUnderline: true,
        margin: 'dense',
        size: 'small',
        sx: {
          height: '20px',
          '& .MuiSelect-select': {
            paddingRight: '4px !important',
          },
        },
      }}
      // size="small"
      SelectProps={{
        renderValue(value: any) {
          return (
            <WBLink underline="always" component={'button'}>
              {t(value, { ns: 'taskbox' })}
            </WBLink>
          );
        },
        margin: 'dense',
        size: 'small',
      }}
      value={value}
    >
      {Object.keys(NoteType).map((value) => (
        <WBMenuItem
          value={value}
          key={value}
          onClick={() => onChange(value as NoteType)}
        >
          <WBLink component={'button'}>{t(value, { ns: 'taskbox' })}</WBLink>
        </WBMenuItem>
      ))}
    </WBSelect>
  );
}

export default NoteTypeSelect;

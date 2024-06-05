import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { alpha, styled } from '@mui/material';
import { WBBox, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  selectedDay: dayjs.Dayjs;
  dueDay: dayjs.Dayjs;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'selectedDay' && prop !== 'dueDay',
})<CustomPickerDayProps>(({ theme, selectedDay, dueDay, day }) => ({
  borderRadius: '6px',
  // today
  ...(day.isSame(dayjs(), 'day') && {
    fontWeight: 'bold',
    backgroundColor: theme.palette.grey[300],
    borderColor: theme.palette.grey[300],
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[300],
      borderColor: theme.palette.grey[300],
    },
    '&:not': {
      borderColor: theme.palette.grey[300],
    },
  }),
  // due date
  ...(day.isSame(dueDay, 'day') && {
    fontWeight: 'bold',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.error.main,
      borderColor: theme.palette.error.main,
    },
  }),
  // between due date and selected date
  ...(day.isAfter(dueDay, 'day') &&
    day.isBefore(selectedDay, 'day') && {
      fontWeight: 'bold',
      borderRadius: 0,
      backgroundColor: alpha(theme.palette.error.main, 0.2),
      borderColor: alpha(theme.palette.error.main, 0.2),
      '&:hover, &:focus': {
        backgroundColor: alpha(theme.palette.error.main, 0.2),
        borderColor: alpha(theme.palette.error.main, 0.2),
      },
    }),
  // selected date
  ...(day.isSame(selectedDay, 'day') && {
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    },
  }),
  '&:not': {
    borderWidth: 0,
  },
})) as React.ComponentType<CustomPickerDayProps>;

function Day(
  props: PickersDayProps<Dayjs> & {
    selectedDay?: Dayjs | null;
    dueDate?: Dayjs | null;
  }
) {
  const { day, selectedDay, dueDate, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      selectedDay={selectedDay || new Dayjs()}
      dueDay={dueDate || new Dayjs()}
    />
  );
}

interface DayPickerProps {
  dueDate: Date;
  onChange: (date: Date) => void;
  value: Date;
}

export default function DayPicker({
  dueDate,
  value: scheduledAt,
  onChange,
}: DayPickerProps) {
  const [dueDay] = React.useState<Dayjs | null>(dayjs(dueDate));
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(scheduledAt));

  React.useEffect(() => {
    setValue(dayjs(scheduledAt));
  }, [scheduledAt]);

  const { t } = useTranslation();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        sx={{
          '.MuiPickersCalendarHeader-label': {
            color: 'primary.main',
            fontSize: 'h5.fontSize',
            fontWeight: 'bold',
          },
          '& .MuiDateCalendar-root': {
            height: undefined,
          },
          '& .MuiPickersSlideTransition-root': {
            minHeight: undefined,
          },
          '.MuiPickersDay-today': {
            borderColor: 'transparent',
          },
          '.MuiDayCalendar-weekDayLabel': {
            fontWeight: 'medium',
          },
        }}
        value={value}
        dayOfWeekFormatter={(_day, weekday) => `${weekday.format('dd')}`}
        onChange={(newValue) => {
          if (newValue) onChange(newValue?.toDate());
          setValue(newValue);
        }}
        showDaysOutsideCurrentMonth
        slots={{ day: Day }}
        slotProps={{
          day: (ownerState) =>
            ({
              selectedDay: value,
              dueDate: dueDay,
              // onPointerEnter: () => setDueDay(ownerState.day),
              // onPointerLeave: () => setDueDay(null),
            } as any),
        }}
      />
      <WBFlex justifyContent={'end'} alignItems={'center'}>
        <WBBox
          sx={{ borderRadius: '100%', bgcolor: 'error.main' }}
          mr={1}
          width="14px"
          height="14px"
        ></WBBox>
        <WBTypography variant="body2" fontWeight={'medium'}>
          {t('dueAt', { ns: 'taskbox' })}
        </WBTypography>
      </WBFlex>
      <WBFlex justifyContent={'center'} mt={3}>
        {value?.isSame(dueDay, 'day') || value?.isAfter(dueDay, 'day') ? (
          <WBTypography
            textAlign="center"
            fontWeight={'medium'}
            color={t(
              value?.isSame(dueDay, 'day') ? 'warning.main' : 'error.main'
            )}
            variant="body2"
          >
            {t(
              value?.isSame(dueDay, 'day')
                ? 'dateSelectedOnDueDate'
                : 'dateSelectedAfterDueDate',
              { ns: 'taskbox' }
            )}
          </WBTypography>
        ) : null}
      </WBFlex>
    </LocalizationProvider>
  );
}

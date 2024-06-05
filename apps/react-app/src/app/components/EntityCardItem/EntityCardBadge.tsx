import { WBBadge, WBTypography } from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';

interface EntityCardBadgeProps {
  amount: number;
  color:
    | 'primary'
    | 'secondary'
    | 'default'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  onClick?: (event: any) => void;
}
export function EntityCardBadge({
  amount,
  color,
  onClick,
}: EntityCardBadgeProps) {
  const theme = useTheme();
  const amountContent = (
    <WBTypography
      component="div"
      sx={{
        display: 'flex',
        borderRadius: '3px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '2rem',
        height: '2rem',
        color: theme.palette.common.black,
        backgroundColor: theme.palette.common.white,
      }}
      variant="body2"
      fontWeight="bold"
      onClick={(event: any) => {
        event.stopPropagation();
        onClick && onClick(event);
      }}
    >
      {amount}
    </WBTypography>
  );
  return amount > 0 ? (
    <WBBadge color={color} component="div" variant="dot" badgeContent="">
      {amountContent}
    </WBBadge>
  ) : (
    amountContent
  );
}

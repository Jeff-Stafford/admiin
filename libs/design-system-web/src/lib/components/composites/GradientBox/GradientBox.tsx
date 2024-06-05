import { styled } from '@mui/material/styles';
import { Box, BoxProps as MUIBoxProps } from '@mui/material';
import { wbBackground } from '../../../keyframes';

// Styled component using the `styled` utility
const StyledGradientBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh', // Adjust height as needed
  bgcolor: theme.palette.background.default,
  width: '100%', // Ensure this is a string
  position: 'absolute',
  background:
    'linear-gradient(135deg, #c1c7f6 10%,  #561dd8 20%, #667eea 30%, #96a2ef 35%, #561dd8 45%)', // Adjust the colors and angle to match your gradient
  // background:
  //   'linear-gradient(135deg, #F17C58, #E94584, #24AADB, #27DBB1, #FFDC18, #FF3706)',
  backgroundSize: '200% 300%',
  animation: `${wbBackground} 15s linear  infinite`,
  animationDirection: 'alternate',
}));

// Component that uses the styled GradientBox
export const GradientBox = (props: MUIBoxProps) => {
  // You can now use StyledGradientBox as a regular component and pass all props
  return <StyledGradientBox {...props} />;
};

import { euclidA } from '@/styles/fonts/fonts';
import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material/styles';


const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#84cec1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#655dff',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: euclidA.style.fontFamily
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true // removes the button default box-shadow
      },
      styleOverrides: {
        contained: {
          borderRadius: '12px',
          textTransform: 'capitalize',
        },
        outlined: {
          borderRadius: '12px',
          textTransform: 'capitalize',
          background: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
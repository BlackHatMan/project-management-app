import { createTheme } from '@mui/material';
const theme = createTheme({
  palette: {
    primary: {
      main: '#6585F3',
      light: '#484b68',
      dark: '#0F23F5',
      contrastText: '#172B4D',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#686970',
    },
  },
  typography: {
    fontFamily: ['Open Sans', 'sans-serif'].join(','),
  },
});

export { theme };

import { createMuiTheme } from '@material-ui/core/styles'

export default createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#FDF9F3',
      // dark: will be calculated from palette.primary.main,
      contrastText: '#000000DE',
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066FF',
      main: '#0044FF',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#FFCC00',
    },
    // error: will use the default color
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiAppBar: {
      root: {
        background: '#fff',
      },
    },
  },
})
import { createMuiTheme } from '@material-ui/core/styles';
import { blueGrey, teal } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[600],
    },
    secondary: {
      main: blueGrey[600],
    },
  },
});

export default theme;

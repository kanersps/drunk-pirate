import './App.css';
import Game from "./Game";
import {Container, createMuiTheme, CssBaseline, ThemeProvider} from "@material-ui/core";


function App() {
    const theme = createMuiTheme({
        palette: {
            type: "dark"
        }
    });

  return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
        <Container  className="App">
          <Game />
        </Container >
      </ThemeProvider>
  );
}

export default App;

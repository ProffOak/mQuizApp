import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import UserProvider from './Services/UserContext';
import NavBar from './Components/NavBar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import CreateGame from './Components/CreateGame';
import SpotifyProvider from './Services/Spotify';
import Game from './Components/Game';



function App() {
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Nunito', 
        'sans-serif' 
      ].join(','),
  },});


 


  return (
    <div className='gradient-background'>
      <ThemeProvider theme={theme}>
        <Container maxWidth="md"  disableGutters={true}>
        <SpotifyProvider>
            <UserProvider>
              <BrowserRouter>
              <NavBar></NavBar>
                <Switch>
                  <Route exact path='/' component={LandingPage} />
                  <Route path='/create-game' component={CreateGame}/>
                  <Route path='/game/:id' component={Game}/>
                </Switch>
              </BrowserRouter>
              </UserProvider>
          </SpotifyProvider>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;

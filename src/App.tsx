import React, { useContext, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Game from './pages/game/index'
import Home from './pages/home/index'
import Page404 from './pages/common/Page404'
import useMediaQuery from '@mui/material/useMediaQuery'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeContext } from './contexts/themeContext'
import MenuAppBar from './components/common/NavBar'
import GameSettingsContextProvider from './contexts/gameSettingsContext'
import Music from './components/audio/Music'
import SignIn from './pages/authentication/Signin'
import SignUp from './pages/authentication/Signup'
import UserContextProvider from './contexts/userContext'
import AuthProvider from './contexts/authContext'

function App() {
  const { theme: appTheme } = useContext(ThemeContext)
  const prefersDarkMode =
    localStorage.getItem('isDarkTheme') === 'true' ??
    useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: appTheme === 'dark' ? 'dark' : 'light',
          primary: {
            main: '#F56F54',
            contrastText: '#fff',
          },
          secondary: {
            main: '#F3C18E',
          },
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 1000,
            lg: 1100,
            xl: 1536,
          },
        },
      }),
    [prefersDarkMode]
  )

  useEffect(() => {
    // save default values to localstorage if they are not available
    if (!window.localStorage.getItem('musicOn'))
      window.localStorage.setItem('musicOn', 'false')
    if (!window.localStorage.getItem('soundEffectOn'))
      window.localStorage.setItem('soundEffectOn', 'false')
    if (!window.localStorage.getItem('musicTrack'))
      window.localStorage.setItem('musicTrack', '1')
    if (!window.localStorage.getItem('background'))
      window.localStorage.setItem('background', '0')
    if (!window.localStorage.getItem('language'))
      window.localStorage.setItem('language', '0')
    if (!window.localStorage.getItem('isDarkTheme'))
      window.localStorage.setItem('isDarkTheme', 'false')

    document.body.classList.add(
      `page-background-${window.localStorage.getItem('background')}`
    )
  }, [])

  return (
    <BrowserRouter>
      <UserContextProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <GameSettingsContextProvider>
              <CssBaseline />
              <MenuAppBar />
              <Music />
              <div style={{ marginTop: '90px' }}>
                <div className='page-background'>
                  <Switch>
                    <Route path='/' component={Home} exact />
                    <Route path='/signin' component={SignIn} exact />
                    <Route path='/signup' component={SignUp} exact />
                    <Route path='/game' component={Game} exact />
                    <Route path='/404' component={Page404} />
                    <Redirect from='*' to='/404' />
                  </Switch>
                </div>
              </div>
            </GameSettingsContextProvider>
          </ThemeProvider>
        </AuthProvider>
      </UserContextProvider>
    </BrowserRouter>
  )
}

export default App

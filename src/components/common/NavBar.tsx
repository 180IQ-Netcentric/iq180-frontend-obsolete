import React, { useState, useContext, useEffect, useRef } from 'react'
import AppBar from '@mui/material/AppBar'

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'

import AccountCircle from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import SchoolIcon from '@mui/icons-material/School'
import SettingsIcon from '@mui/icons-material/Settings'
import { GameSettingsContext } from '@/contexts/gameSettingsContext'
import { Backdrop, Fade, Modal } from '@mui/material'
import GameContainer from '../containers/GameContainer'
import GameSettings from '@/pages/gameSettings'
import GearImg from '../../assets/images/gear.png'
import { setCookie } from '@/utils/cookie'
import { UserContext } from '@/contexts/userContext'
import { AuthContext } from '@/contexts/authContext'
import { useHistory } from 'react-router'

export default function MenuAppBar() {
  const { showSettings } = useContext(GameSettingsContext)
  const { clearUser } = useContext(UserContext)
  const { isUser, setToken } = useContext(AuthContext)
  const history = useHistory()
  const anchor = useRef(null)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [elevation, setElevation] = useState(0)
  const [openSettings, setOpenSettings] = useState(showSettings)
  const [showMenu, setShowMenu] = useState(false)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setShowMenu(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    setShowMenu(false)
    setToken('')
    setCookie('token', null, 0)
    clearUser()
  }

  const handleSignIn = () => {
    setShowMenu(false)
    history.push('/signin')
  }

  const shouldShowSignIn = () => {
    return !isUser
  }

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        setElevation(4)
      } else {
        setElevation(0)
      }
    })
  }, [])

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className='MuiToolbar-center' elevation={elevation}>
          <Container maxWidth='lg'>
            <Toolbar>
              <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                sx={{ mr: 2 }}
                onClick={() => history.push('/')}
              >
                <SchoolIcon />
              </IconButton>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                IQ180
              </Typography>

              <div>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={() => setOpenSettings(true)}
                  color='inherit'
                >
                  <SettingsIcon />
                </IconButton>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleMenu}
                  color='inherit'
                  id='asdf'
                  ref={anchor}
                >
                  {/* {isUser ? <UserAvatar text={user?.username ?? ':)'} />: <AccountCircle />} */}
                  {isUser ? <AccountCircle /> : <LoginIcon />}
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{ marginTop: '48px' }}
                  open={Boolean(anchorEl) && showMenu}
                  onClose={handleClose}
                >
                  {shouldShowSignIn() && (
                    <MenuItem onClick={handleSignIn}>Sign In</MenuItem>
                  )}
                  {!shouldShowSignIn() && (
                    <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                  )}
                </Menu>
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openSettings}>
          <Box sx={{ marginTop: '90px' }}>
            <GameContainer>
              <img className='gear-background' src={GearImg} alt='Settings' />
              <GameSettings onClose={() => setOpenSettings(false)} />
            </GameContainer>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

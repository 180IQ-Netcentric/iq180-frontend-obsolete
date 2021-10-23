import React, { useContext, useEffect } from 'react'
import { Button, Switch } from '@mui/material'
import GameToggleButton from '../../components/buttons/GameToggleButton'
import GameContainer from '../../components/containers/GameContainer'
import PlayerInfoCard from '../../components/cards/PlayerInfoCard'
import { UserContext } from '../../contexts/userContext'
import { useHistory } from 'react-router'
import withUserGuard from '../../guards/user.guard'
import { SocketContext } from '../../contexts/socketContext'
import socketIOClient from 'socket.io-client'
import { userToUserInfo } from '../../utils/userToUserInfo'

const Lobby = () => {
  const { user } = useContext(UserContext)
  const { setSocketOpen } = useContext(SocketContext)
  const { joinRoom } = useContext(SocketContext)
  const {
    socket,
    setSocket,
    settings,
    setSettings,
    updateSettings,
    playerInfos,
    startGame,
  } = useContext(SocketContext)
  const history = useHistory()

  const DIGITS_COUNT_OPTION = [2, 3, 4, 5]
  // const [selectedDigitsCount, setSelectedDigitsCount] = useState(settings?.digit ?? 5)
  const ROUNDS_COUNT_OPTION = [1, 3, 5, 7]
  // const [selectedRoundsCount, setSelectedRoundsCount] = useState(settings?.round ?? 3)
  const TIME_LMIT_OPTION = [30, 60, 90, 120]

  const onSettingsChange = (change: any) => {
    if (settings) {
      const newSettings = { ...settings, ...change }
      setSettings(newSettings)
      updateSettings(newSettings)
    }
  }

  const leaveLobby = () => {
    history.push('/')
    socket?.emit('disconnectUser', user)
  }

  const beginGame = () => {
    history.push('/')
    startGame()
  }

  useEffect(() => {
    if (!socket) {
      const newSocket = socketIOClient(
        `${import.meta.env.VITE_APP_API_URL}` ?? 'http://localhost:3001'
      )
      setSocket(newSocket)
      setSocketOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!socket) return
    if (user) joinRoom(userToUserInfo(user))
  }, [socket])

  return (
    <GameContainer>
      <div className='game-padding'>
        <div className='settings-header'>
          <h1>Match Settings</h1>
          <Button onClick={leaveLobby}>Leave Lobby</Button>
        </div>
        <hr />
        <div className='match-container'>
          <div className='match-settings'>
            <h3>Number of Digits</h3>
            <div>
              <div className='settings-toggle-item'>
                {DIGITS_COUNT_OPTION.map((digit) => (
                  <GameToggleButton
                    key={digit}
                    item={digit}
                    matcher={settings?.digit ?? 5}
                    toggleCallback={(num) => onSettingsChange({ digit: num })}
                  >
                    {digit}
                  </GameToggleButton>
                ))}
              </div>

              <h3>Number of Round</h3>
              <div className='settings-toggle-item'>
                {ROUNDS_COUNT_OPTION.map((round) => (
                  <GameToggleButton
                    key={round}
                    item={round}
                    matcher={settings?.round ?? 3}
                    toggleCallback={(num) => onSettingsChange({ round: num })}
                  >
                    {round}
                  </GameToggleButton>
                ))}
              </div>

              <h3>Time limit</h3>
              <div className='settings-toggle-item'>
                {TIME_LMIT_OPTION.map((limit) => (
                  <GameToggleButton
                    key={limit}
                    item={limit}
                    matcher={settings?.timeLimit}
                    toggleCallback={(time) =>
                      onSettingsChange({ timeLimit: time })
                    }
                  >
                    {`${limit} s`}
                  </GameToggleButton>
                ))}
              </div>
              <div className='empty-space' />
              <div className='settings-item'>
                <span>VS Mode</span>
                <Switch
                  checked={!settings?.isClassicMode}
                  onChange={() =>
                    onSettingsChange({
                      isClassicMode: !settings?.isClassicMode,
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
              <div className='settings-item'>
                <span>Classic</span>
                <Switch
                  checked={settings?.isClassicMode}
                  onChange={() =>
                    onSettingsChange({
                      isClassicMode: !settings?.isClassicMode,
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
            </div>
          </div>
          <div className='player-info-container'>
            <div className='player-info'>
              {user && (
                <PlayerInfoCard
                  player={playerInfos ? playerInfos[0] : undefined}
                />
              )}
            </div>
            <div className='player-info'>
              {user && (
                <PlayerInfoCard
                  player={playerInfos ? playerInfos[1] : undefined}
                />
              )}
            </div>
            <Button
              variant='contained'
              size='large'
              sx={{ borderRadius: '15px' }}
              className='game-start-button game-start-button-match'
              onClick={beginGame}
            >
              Start!
            </Button>
          </div>
        </div>
      </div>
    </GameContainer>
  )
}

export default withUserGuard(Lobby)

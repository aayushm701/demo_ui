import { useEffect, useState } from 'react'

const lanePositions = ['18%', '50%', '82%']
const obstacleTypes = ['rock', 'person']

function App() {
  const [carLane, setCarLane] = useState(1)
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const handleKey = (event) => {
      if (!playing && event.key === 'Enter') {
        startGame()
        return
      }

      if (event.key === 'ArrowLeft') {
        setCarLane((current) => Math.max(0, current - 1))
      }

      if (event.key === 'ArrowRight') {
        setCarLane((current) => Math.min(2, current + 1))
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [playing])

  useEffect(() => {
    if (!playing) return

    const tick = setInterval(() => {
      setObstacles((current) =>
        current
          .map((item) => ({ ...item, top: item.top + item.speed }))
          .filter((item) => item.top < 108)
      )
      setScore((value) => value + 1)
      setDistance((value) => +(value + 0.15).toFixed(1))
    }, 70)

    return () => clearInterval(tick)
  }, [playing])

  useEffect(() => {
    if (!playing) return

    const spawn = setInterval(() => {
      setObstacles((current) => [
        ...current,
        {
          id: Date.now() + Math.random(),
          type: obstacleTypes[Math.random() < 0.35 ? 1 : 0],
          lane: Math.floor(Math.random() * 3),
          top: -18,
          speed: Math.random() * 0.4 + 1.3,
        },
      ])
    }, 1050)

    return () => clearInterval(spawn)
  }, [playing])

  useEffect(() => {
    if (!playing) return
    const hit = obstacles.some(
      (item) => item.lane === carLane && item.top > 74 && item.top < 92
    )
    if (hit) {
      setPlaying(false)
      setGameOver(true)
    }
  }, [obstacles, carLane, playing])

  const startGame = () => {
    setCarLane(1)
    setScore(0)
    setDistance(0)
    setObstacles([])
    setGameOver(false)
    setPlaying(true)
  }

  return (
    <div className="page-shell">
      <div className="scene">
        <section className="info-panel">
          <div>
            <span className="badge">Playground</span>
            <h1>Car Dash</h1>
            <p>
              Drive fast, avoid rocks and pedestrians, and push your distance as far
              as possible. Use arrow keys or the controls to keep the road clear.
            </p>
          </div>

          <div className="status-panel">
            <div className="status-card">
              <span>Score</span>
              <strong>{score}</strong>
            </div>
            <div className="status-card">
              <span>Distance</span>
              <strong>{distance} m</strong>
            </div>
            <div className="status-card highlight">
              <span>{gameOver ? 'Game over' : playing ? 'Live' : 'Ready'}</span>
              <strong>{gameOver ? 'Press Start' : playing ? 'Keep going' : 'Hit Start'}</strong>
            </div>
          </div>
        </section>

        <section className="game-card">
          <div className="road-scene">
            <div className="road-shade" />
            <div className="road-lines">
              {[...Array(5)].map((_, index) => (
                <div className="road-line" key={index} />
              ))}
            </div>

            {obstacles.map((item) => (
              <div
                key={item.id}
                className={`obstacle ${item.type}`}
                style={{ left: lanePositions[item.lane], top: `${item.top}%` }}
              >
                <div className="obstacle-icon">
                  {item.type === 'rock' ? '🪨' : '🚶'}
                </div>
              </div>
            ))}

            <div className="car" style={{ left: lanePositions[carLane] }}>
              <div className="car-top" />
              <div className="car-body" />
              <div className="wheel left" />
              <div className="wheel right" />
            </div>

            {gameOver && (
              <div className="game-overlay">
                <div className="game-over-box">
                  <h2>Crash!</h2>
                  <p>You made it {distance} meters. Try again to beat your best run.</p>
                  <button className="primary-button" onClick={startGame}>
                    Restart
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="game-actions">
            <button className="primary-button" onClick={startGame}>
              {playing ? 'Restart Game' : 'Start Game'}
            </button>
            <div className="control-hint">
              <span>Controls</span>
              <div className="action-buttons">
                <button onClick={() => setCarLane((current) => Math.max(0, current - 1))}>
                  ←
                </button>
                <button onClick={() => setCarLane((current) => Math.min(2, current + 1))}>
                  →
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App

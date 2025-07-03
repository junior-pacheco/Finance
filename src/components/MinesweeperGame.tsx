"use client"

import { useState, useEffect, useCallback } from "react"
import { Router, useNavigate } from "react-router-dom"

type CellState = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

type GameState = "playing" | "won" | "lost"

const ROWS = 6
const COLS = 6
const MINES = 5


export default function MinesweeperGame() {
  const [board, setBoard] = useState<CellState[][]>([])
  const [gameState, setGameState] = useState<GameState>("playing")
  const [minesLeft, setMinesLeft] = useState(0)
  const [time, setTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (gameStarted && gameState === "playing") {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStarted, gameState])

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard: CellState[][] = Array(ROWS)
      .fill(null)
      .map(() =>
        Array(COLS)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          })),
      )

    // Place mines randomly
    let minesPlaced = 0
    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS)
      const col = Math.floor(Math.random() * COLS)
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    // Calculate neighbor mines
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr
              const nc = c + dc
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
                count++
              }
            }
          }
          newBoard[r][c].neighborMines = count
        }
      }
    }

    setBoard(newBoard)
    setGameState("playing")
    setMinesLeft(MINES)
    setTime(0)
    setGameStarted(false)
  }, [])

  useEffect(() => {
    initializeBoard()
  }, [initializeBoard])

  // Reveal cell and adjacent empty cells
  const revealCell = useCallback(
    (row: number, col: number) => {
      if (gameState !== "playing") return

      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => r.map((c) => ({ ...c })))

        if (!gameStarted) setGameStarted(true)

        const reveal = (r: number, c: number) => {
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return
          if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) return

          newBoard[r][c].isRevealed = true

          if (newBoard[r][c].isMine) {
            setGameState("lost")
            // Reveal all mines
            for (let i = 0; i < ROWS; i++) {
              for (let j = 0; j < COLS; j++) {
                if (newBoard[i][j].isMine) {
                  newBoard[i][j].isRevealed = true
                }
              }
            }
            return
          }

          // If cell has no neighboring mines, reveal adjacent cells
          if (newBoard[r][c].neighborMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                reveal(r + dr, c + dc)
              }
            }
          }
        }

        reveal(row, col)
        return newBoard
      })
    },
    [gameState, gameStarted],
  )

  // Toggle flag
  const toggleFlag = useCallback(
    (row: number, col: number) => {
      if (gameState !== "playing") return

      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => r.map((c) => ({ ...c })))

        if (!newBoard[row][col].isRevealed) {
          newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
          setMinesLeft((prev) => prev + (newBoard[row][col].isFlagged ? -1 : 1))
        }

        return newBoard
      })
    },
    [gameState],
  )

  // Check win condition
  useEffect(() => {
    if (gameState === "playing" && board.length > 0) {
      let revealedCount = 0
      const totalSafeCells = ROWS * COLS - MINES

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (board[r][c].isRevealed && !board[r][c].isMine) {
            revealedCount++
          }
        }
      }

      if (revealedCount === totalSafeCells) {
        setGameState("won")
      }
    }
  }, [board, gameState])

  const getCellContent = (cell: CellState) => {
    if (cell.isFlagged) {
      return <span className="text-red-500 text-lg">🚩</span>
    }

    if (!cell.isRevealed) {
      return null
    }

    if (cell.isMine) {
      return <span className="text-red-600 text-lg">💣</span>
    }

    if (cell.neighborMines > 0) {
      const colors = [
        "", // 0
        "text-blue-600", // 1
        "text-green-600", // 2
        "text-red-600", // 3
        "text-purple-600", // 4
        "text-yellow-600", // 5
        "text-pink-600", // 6
        "text-gray-800", // 7
        "text-gray-900", // 8
      ]
      return <span className={`font-bold text-sm ${colors[cell.neighborMines]}`}>{cell.neighborMines}</span>
    }

    return null
  }

  const getCellStyle = (cell: CellState) => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return "bg-red-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]"
      }
      return "bg-gray-50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]"
    }
    return "bg-gray-100 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)] hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.8)]"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getGridCols = () => "grid-cols-9"
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
              onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)] active:scale-95 transition-all duration-200 text-gray-700 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="#785DC8" d="m2.36 11.23l8.31 7.57c.61.56 1.6.12 1.6-.71v-3.63c0-.35.29-.64.64-.64h15.86c.66 0 1.19-.53 1.19-1.19V8.42c0-.66-.53-1.19-1.19-1.19H12.91c-.35 0-.64-.29-.64-.64V2.96c0-.83-.99-1.27-1.6-.71L2.36 9.82a.946.946 0 0 0 0 1.41m13.97 17.53l-2.54-6.95c-.16-.49-.62-.81-1.13-.81s-.97.32-1.12.79l-2.57 6.98c-.18.48.07 1 .55 1.18c.1.03.21.05.32.05c.37 0 .73-.23.86-.6l.41-1.13c.04.01.08.01.12.01h2.87c.03 0 .07 0 .1-.01l.41 1.12c.18.48.7.73 1.18.55c.47-.17.71-.7.54-1.18m-4.54-2.32l.87-2.38l.86 2.38zm-3.56-2.73c0 .53-.15 1.02-.41 1.43a2.7 2.7 0 0 1 1.07 2.15c0 1.38-1.05 2.54-2.4 2.69c-.04.01-.09.02-.13.01c-.06.01-.12.01-.18.01H2.92a.92.92 0 0 1-.92-.93v-7.16c0-.5.41-.91.92-.91h2.6c.1 0 .19 0 .27.01l.19.03c1.28.22 2.25 1.34 2.25 2.67m-2.7-.87H3.84v1.74h1.68c.48 0 .88-.39.88-.87a.87.87 0 0 0-.87-.87m-1.69 3.57v1.74h2.35a.87.87 0 0 0 0-1.74zm18.76 1.94a3.308 3.308 0 0 1-6.17-1.66v-2.38c0-1.83 1.48-3.31 3.31-3.31c1.18 0 2.28.64 2.87 1.65c.26.44.1 1-.33 1.26c-.44.26-1 .11-1.26-.33a1.5 1.5 0 0 0-1.28-.74c-.8 0-1.47.66-1.47 1.47v2.38c0 .81.67 1.47 1.47 1.47c.53 0 1.01-.28 1.28-.74c.26-.43.81-.59 1.26-.33c.42.26.58.82.32 1.26m4.63-3.48l2.6 3.68c.29.42.2.99-.23 1.29c-.42.29-.99.19-1.28-.22l-2.41-3.42l-.69.69v2.2c0 .51-.41.92-.92.92s-.92-.41-.92-.92v-7.17c0-.51.41-.92.92-.92s.92.41.92.92v2.37l3.01-3.02c.36-.36.94-.36 1.3 0s.36.94 0 1.3z"/></svg>
          </button>
        </div>

      <div className="bg-gray-100 rounded-3xl shadow-[20px_20px_40px_rgba(0,0,0,0.1),-20px_-20px_40px_rgba(255,255,255,0.8)] p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-700 mb-4 drop-shadow-sm">Buscaminas</h1>

          {/* Stats */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-gray-100 rounded-2xl shadow-[inset_8px_8px_16px_rgba(0,0,0,0.1),inset_-8px_-8px_16px_rgba(255,255,255,0.8)] p-4 min-w-[100px]">
              <p className="text-sm text-gray-500 mb-1">Minas</p>
              <p className="text-xl font-bold text-gray-700">{minesLeft}</p>
            </div>
            <div className="bg-gray-100 rounded-2xl shadow-[inset_8px_8px_16px_rgba(0,0,0,0.1),inset_-8px_-8px_16px_rgba(255,255,255,0.8)] p-4 min-w-[100px]">
              <p className="text-sm text-gray-500 mb-1">Tiempo</p>
              <p className="text-xl font-bold text-gray-700">{formatTime(time)}</p>
            </div>
          </div>
        </div>

        {/* Game Status */}
        {gameState === "won" && (
          <div className="bg-green-100 rounded-2xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-4 mb-6">
            <p className="text-green-700 font-bold text-center text-lg">🎉 ¡Felicitaciones! ¡Ganaste!</p>
            <p className="text-green-600 text-sm text-center mt-1">Tiempo: {formatTime(time)}</p>
          </div>
        )}

        {gameState === "lost" && (
          <div className="bg-red-100 rounded-2xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-4 mb-6">
            <p className="text-red-700 font-bold text-center text-lg">💥 ¡Boom! Pisaste una mina</p>
            <p className="text-red-600 text-sm text-center mt-1">¡Inténtalo de nuevo!</p>
          </div>
        )}

        {/* Game Board */}
        <div className="bg-gray-100 rounded-3xl shadow-[inset_12px_12px_24px_rgba(0,0,0,0.1),inset_-12px_-12px_24px_rgba(255,255,255,0.8)] p-6 mb-6 overflow-auto">
          <div className={`grid ${getGridCols()} gap-1 w-fit mx-auto`}>
            {board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-all duration-150 cursor-pointer
                    ${getCellStyle(cell)}
                    ${gameState !== "playing" ? "cursor-not-allowed" : ""}
                  `}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    toggleFlag(r, c)
                  }}
                  disabled={gameState !== "playing"}
                >
                  {getCellContent(cell)}
                </button>
              )),
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="text-center space-y-4">
          <button
            onClick={initializeBoard}
            className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all duration-200"
          >
            🔄 Nuevo Juego
          </button>

          <div className="bg-gray-100 rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-4">
            <p className="text-gray-600 text-sm mb-2 font-medium">📋 Instrucciones:</p>
            <div className="text-gray-500 text-xs space-y-1">
              <p>
                <strong>Clic izquierdo:</strong> Revelar celda
              </p>
              <p>
                <strong>Clic derecho:</strong> Colocar/quitar bandera 🚩
              </p>
              <p>
                <strong>Objetivo:</strong> Revelar todas las celdas sin minas
              </p>
              <p>
                <strong>Números:</strong> Indican cuántas minas hay alrededor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

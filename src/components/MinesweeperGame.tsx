"use client"

import { useState, useEffect, useCallback } from "react"

type CellState = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

type GameState = "playing" | "won" | "lost"

const ROWS = 9
const COLS = 9
const MINES = 10

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-3xl shadow-[20px_20px_40px_rgba(0,0,0,0.1),-20px_-20px_40px_rgba(255,255,255,0.8)] p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-700 mb-4 drop-shadow-sm">💣 Buscaminas Neomórfico</h1>

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
                    w-6 h-6 rounded-lg flex items-center justify-center font-bold transition-all duration-150 cursor-pointer
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

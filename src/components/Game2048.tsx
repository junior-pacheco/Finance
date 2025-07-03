"use client"

import { Button } from "@nextui-org/react"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"

type Board = (number | null)[][]
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

const BOARD_SIZE = 4
const INITIAL_BOARD: Board = Array(BOARD_SIZE)
  .fill(null)
  .map(() => Array(BOARD_SIZE).fill(null))

export default function Game2048() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  // Cargar mejor puntuación del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("2048-best-score")
    if (saved) setBestScore(Number.parseInt(saved))
  }, [])

  // Guardar mejor puntuación
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem("2048-best-score", score.toString())
    }
  }, [score, bestScore])

  const addRandomTile = useCallback((currentBoard: Board): Board => {
    const emptyCells: [number, number][] = []

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (currentBoard[i][j] === null) {
          emptyCells.push([i, j])
        }
      }
    }

    if (emptyCells.length === 0) return currentBoard

    const newBoard = currentBoard.map((row) => [...row])
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const value = Math.random() < 0.9 ? 2 : 4

    newBoard[randomCell[0]][randomCell[1]] = value
    return newBoard
  }, [])

  const initializeGame = useCallback(() => {
    let newBoard = INITIAL_BOARD.map((row) => [...row])
    newBoard = addRandomTile(newBoard)
    newBoard = addRandomTile(newBoard)
    setBoard(newBoard)
    setScore(0)
    setGameOver(false)
    setGameWon(false)
  }, [addRandomTile])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const moveLeft = (currentBoard: Board): { board: Board; scoreGained: number; moved: boolean } => {
    const newBoard: Board = []
    let scoreGained = 0
    let moved = false

    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = currentBoard[i].filter((cell) => cell !== null)
      const newRow: (number | null)[] = []

      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          const mergedValue = (row[j] as number) * 2
          newRow.push(mergedValue)
          scoreGained += mergedValue
          if (mergedValue === 2048 && !gameWon) {
            setGameWon(true)
          }
          j++ // Skip next element as it's merged
        } else {
          newRow.push(row[j])
        }
      }

      while (newRow.length < BOARD_SIZE) {
        newRow.push(null)
      }

      newBoard.push(newRow)

      // Check if row changed
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (currentBoard[i][j] !== newRow[j]) {
          moved = true
        }
      }
    }

    return { board: newBoard, scoreGained, moved }
  }

  const rotateBoard = (board: Board): Board => {
    const newBoard: Board = []
    for (let i = 0; i < BOARD_SIZE; i++) {
      newBoard.push([])
      for (let j = 0; j < BOARD_SIZE; j++) {
        newBoard[i][j] = board[BOARD_SIZE - 1 - j][i]
      }
    }
    return newBoard
  }

  const move = (direction: Direction) => {
    if (gameOver) return

    let currentBoard = board.map((row) => [...row])
    let rotations = 0

    // Rotate board to make all moves equivalent to left move
    switch (direction) {
      case "UP":
        rotations = 3
        break
      case "RIGHT":
        rotations = 2
        break
      case "DOWN":
        rotations = 1
        break
      case "LEFT":
        rotations = 0
        break
    }

    // Rotate board
    for (let i = 0; i < rotations; i++) {
      currentBoard = rotateBoard(currentBoard)
    }

    // Move left
    const { board: movedBoard, scoreGained, moved } = moveLeft(currentBoard)

    // Rotate back
    let finalBoard = movedBoard
    for (let i = 0; i < (4 - rotations) % 4; i++) {
      finalBoard = rotateBoard(finalBoard)
    }

    if (moved) {
      const boardWithNewTile = addRandomTile(finalBoard)
      setBoard(boardWithNewTile)
      setScore((prev) => prev + scoreGained)

      // Check game over
      if (isGameOver(boardWithNewTile)) {
        setGameOver(true)
      }
    }
  }

  const isGameOver = (currentBoard: Board): boolean => {
    // Check for empty cells
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (currentBoard[i][j] === null) return false
      }
    }

    // Check for possible merges
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const current = currentBoard[i][j]
        if (
          (j < BOARD_SIZE - 1 && current === currentBoard[i][j + 1]) ||
          (i < BOARD_SIZE - 1 && current === currentBoard[i + 1][j])
        ) {
          return false
        }
      }
    }

    return true
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          move("UP")
          break
        case "ArrowDown":
          e.preventDefault()
          move("DOWN")
          break
        case "ArrowLeft":
          e.preventDefault()
          move("LEFT")
          break
        case "ArrowRight":
          e.preventDefault()
          move("RIGHT")
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [board, gameOver])

  const getTileStyle = (value: number | null) => {
    if (!value)
      return "bg-gray-100 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]"

    const styles: { [key: number]: string } = {
      2: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]",
      4: "bg-gradient-to-br from-blue-200 to-blue-300 text-blue-900 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]",
      8: "bg-gradient-to-br from-orange-200 to-orange-300 text-orange-900 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]",
      16: "bg-gradient-to-br from-orange-300 to-orange-400 text-orange-900 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]",
      32: "bg-gradient-to-br from-red-300 to-red-400 text-red-900 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]",
      64: "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.6)]",
      128: "bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]",
      256: "bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]",
      512: "bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.6)]",
      1024: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.6)]",
      2048: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.6)] animate-pulse",
    }

    return (
      styles[value] ||
      "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.6)]"
    )
  }

  const getFontSize = (value: number | null) => {
    if (!value) return ""
    if (value < 100) return "text-2xl"
    if (value < 1000) return "text-xl"
    return "text-lg"
  }
  const navigate = useNavigate()

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
                {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
              onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)] active:scale-95 transition-all duration-200 text-gray-700 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="#785DC8" d="m2.36 11.23l8.31 7.57c.61.56 1.6.12 1.6-.71v-3.63c0-.35.29-.64.64-.64h15.86c.66 0 1.19-.53 1.19-1.19V8.42c0-.66-.53-1.19-1.19-1.19H12.91c-.35 0-.64-.29-.64-.64V2.96c0-.83-.99-1.27-1.6-.71L2.36 9.82a.946.946 0 0 0 0 1.41m13.97 17.53l-2.54-6.95c-.16-.49-.62-.81-1.13-.81s-.97.32-1.12.79l-2.57 6.98c-.18.48.07 1 .55 1.18c.1.03.21.05.32.05c.37 0 .73-.23.86-.6l.41-1.13c.04.01.08.01.12.01h2.87c.03 0 .07 0 .1-.01l.41 1.12c.18.48.7.73 1.18.55c.47-.17.71-.7.54-1.18m-4.54-2.32l.87-2.38l.86 2.38zm-3.56-2.73c0 .53-.15 1.02-.41 1.43a2.7 2.7 0 0 1 1.07 2.15c0 1.38-1.05 2.54-2.4 2.69c-.04.01-.09.02-.13.01c-.06.01-.12.01-.18.01H2.92a.92.92 0 0 1-.92-.93v-7.16c0-.5.41-.91.92-.91h2.6c.1 0 .19 0 .27.01l.19.03c1.28.22 2.25 1.34 2.25 2.67m-2.7-.87H3.84v1.74h1.68c.48 0 .88-.39.88-.87a.87.87 0 0 0-.87-.87m-1.69 3.57v1.74h2.35a.87.87 0 0 0 0-1.74zm18.76 1.94a3.308 3.308 0 0 1-6.17-1.66v-2.38c0-1.83 1.48-3.31 3.31-3.31c1.18 0 2.28.64 2.87 1.65c.26.44.1 1-.33 1.26c-.44.26-1 .11-1.26-.33a1.5 1.5 0 0 0-1.28-.74c-.8 0-1.47.66-1.47 1.47v2.38c0 .81.67 1.47 1.47 1.47c.53 0 1.01-.28 1.28-.74c.26-.43.81-.59 1.26-.33c.42.26.58.82.32 1.26m4.63-3.48l2.6 3.68c.29.42.2.99-.23 1.29c-.42.29-.99.19-1.28-.22l-2.41-3.42l-.69.69v2.2c0 .51-.41.92-.92.92s-.92-.41-.92-.92v-7.17c0-.51.41-.92.92-.92s.92.41.92.92v2.37l3.01-3.02c.36-.36.94-.36 1.3 0s.36.94 0 1.3z"/></svg>
          </button>
        </div>
      <div className=" p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-700 mb-4 drop-shadow-sm">2048 Neomórfico</h1>

          <div className="flex justify-between gap-4 mb-4">
            <div className="bg-gray-100 rounded-2xl shadow-[inset_8px_8px_16px_rgba(0,0,0,0.1),inset_-8px_-8px_16px_rgba(255,255,255,0.8)] p-4 flex-1">
              <p className="text-sm text-gray-500 mb-1">Puntuación</p>
              <p className="text-xl font-bold text-gray-700">{score}</p>
            </div>
            <div className="bg-gray-100 rounded-2xl shadow-[inset_8px_8px_16px_rgba(0,0,0,0.1),inset_-8px_-8px_16px_rgba(255,255,255,0.8)] p-4 flex-1">
              <p className="text-sm text-gray-500 mb-1">Mejor</p>
              <p className="text-xl font-bold text-gray-700">{bestScore}</p>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-gray-100 rounded-3xl shadow-[inset_12px_12px_24px_rgba(0,0,0,0.1),inset_-12px_-12px_24px_rgba(255,255,255,0.8)] p-4 mb-6">
          <div className="grid grid-cols-4 gap-3">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`
                    aspect-square rounded-2xl flex items-center justify-center font-bold transition-all duration-200
                    ${getTileStyle(cell)}
                    ${getFontSize(cell)}
                  `}
                >
                  {cell && <span className="drop-shadow-sm">{cell}</span>}
                </div>
              )),
            )}
          </div>
        </div>

        {/* Game Status */}
        {gameWon && !gameOver && (
          <div className="bg-emerald-100 rounded-2xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-4 mb-4">
            <p className="text-emerald-700 font-bold text-center">🎉 ¡Ganaste! ¡Llegaste a 2048!</p>
            <p className="text-emerald-600 text-sm text-center mt-1">Puedes continuar jugando</p>
          </div>
        )}

        {gameOver && (
          <div className="bg-red-100 rounded-2xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-4 mb-4">
            <p className="text-red-700 font-bold text-center">😔 ¡Juego Terminado!</p>
            <p className="text-red-600 text-sm text-center mt-1">Puntuación final: {score}</p>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          <Button
            onClick={initializeGame}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all duration-200"
          >
            Nuevo Juego
          </Button>

          {/* Mobile Controls */}
          <div className="grid grid-cols-3 gap-2 md:hidden">
            <div></div>
            <Button
              onClick={() => move("UP")}
              className="aspect-square bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all duration-200"
            >
              ↑
            </Button>
            <div></div>
            <Button
              onClick={() => move("LEFT")}
              className="aspect-square bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all duration-200"
            >
              ←
            </Button>
            <Button
              onClick={() => move("DOWN")}
              className="aspect-square bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all duration-200"
            >
              ↓
            </Button>
            <Button
              onClick={() => move("RIGHT")}
              className="aspect-square bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)] transition-all duration-200"
            >
              →
            </Button>
          </div>

          <div className="bg-gray-100 rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-3">
            <p className="text-gray-500 text-xs text-center">
              <span className="hidden md:inline">Usa las flechas del teclado para mover las fichas</span>
              <span className="md:hidden">Usa los botones para mover las fichas</span>
            </p>
            <p className="text-gray-400 text-xs text-center mt-1">Combina números iguales para llegar a 2048</p>
          </div>
        </div>
      </div>
    </div>
  )
}

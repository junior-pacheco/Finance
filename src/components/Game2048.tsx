"use client"

import { Button } from "@nextui-org/react"
import { useState, useEffect, useCallback } from "react"

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-3xl shadow-[20px_20px_40px_rgba(0,0,0,0.1),-20px_-20px_40px_rgba(255,255,255,0.8)] p-8 max-w-md w-full">
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

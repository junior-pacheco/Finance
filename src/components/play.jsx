"use client"

import { useState, useEffect } from "react"

const THEMES = {
  animales: {
    name: "Animales",
    icon: "🐾",
    cards: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
  },
  comida: {
    name: "Comida",
    icon: "🍕",
    cards: ["🍕", "🍔", "🍟", "🌮", "🍣", "🍰", "🍦", "🍓"],
  },
  espacio: {
    name: "Espacio",
    icon: "🚀",
    cards: ["🚀", "🛸", "🌟", "🌙", "🪐", "☄️", "🌍", "👽"],
  },
  naturaleza: {
    name: "Naturaleza",
    icon: "🌸",
    cards: ["🌸", "🌺", "🌻", "🌹", "🌷", "🌿", "🍀", "🌳"],
  },
  deportes: {
    name: "Deportes",
    icon: "⚽",
    cards: ["⚽", "🏀", "🎾", "🏈", "🏐", "🏓", "🏸", "🥎"],
  },
  musica: {
    name: "Música",
    icon: "🎵",
    cards: ["🎵", "🎶", "🎸", "🎹", "🥁", "🎺", "🎷", "🎤"],
  },
  caritas: {
    name: "Caritas",
    icon: "😊",
    cards: ["😀", "😅", "😂", "😍", "😎", "😭", "😡", "🥶"],
  },
  banderas: {
    name: "Banderas",
    icon: "🚩",
    cards: ["🇨🇴", "🇺🇸", "🇫🇷", "🇧🇷", "🇯🇵", "🇲🇽", "🇦🇷", "🇮🇹"],
  },
  numeros: {
    name: "Números",
    icon: "🔢",
    cards: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"],
  },
}


export default function MemoryGame() {
  const [currentTheme, setCurrentTheme] = useState("animales")
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [moves, setMoves] = useState(0)
  // const [matches, setMatches] = useState(0)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  // Timer
  useEffect(() => {
    let interval = null
    if (gameStarted && !isGameComplete) {
      interval = setInterval(() => {
        setTimeElapsed((time) => time + 1)
      }, 1000)
    } else if (!gameStarted) {
      setTimeElapsed(0)
    }
    return () => clearInterval(interval)
  }, [gameStarted, isGameComplete])

  // Inicializar el juego
  const initializeGame = () => {
    const themeCards = THEMES[currentTheme].cards
    const shuffledCards = [...themeCards, ...themeCards]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    // setMatches(0)
    setScore(0)
    setIsGameComplete(false)
    setIsChecking(false)
    setGameStarted(false)
    setTimeElapsed(0)
  }

  // Inicializar al cargar el componente
  useEffect(() => {
    initializeGame()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme])

  // Manejar clic en carta
  const handleCardClick = (cardId) => {
    if (!gameStarted) setGameStarted(true)

    if (isChecking || flippedCards.length >= 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Voltear la carta
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

    // Si se voltearon 2 cartas, verificar si coinciden
    if (newFlippedCards.length === 2) {
      setIsChecking(true)
      setMoves((prev) => prev + 1)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      setTimeout(() => {
        if (firstCard?.emoji === secondCard?.emoji) {
          // Las cartas coinciden
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c)))
          // setMatches((prev) => prev + 1)
          setScore((prev) => prev + Math.max(100 - moves * 5, 10))
        } else {
          // Las cartas no coinciden
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c)))
        }

        setFlippedCards([])
        setIsChecking(false)
      }, 1000)
    }
  }

  // Verificar si el juego está completo
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsGameComplete(true)
      setGameStarted(false)
      const timeBonus = Math.max(300 - timeElapsed * 2, 0)
      setScore((prev) => prev + timeBonus)
    }
  }, [cards, timeElapsed])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

return (
  <div className="min-h-screen flex justify-center items-center bg-gray-100" style={{ backgroundColor: "#f0f0f3" }}>
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row md:items-start md:justify-center gap-8">
      
      {/* Panel Izquierdo (Header, Stats, Temática, Botón, Victoria) */}
      <div className="md:max-w-sm w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
            style={{
              background: "#f0f0f3",
              boxShadow: "20px 20px 40px #d1d1d4, -20px -20px 40px #ffffff",
            }}
          >
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Juego de Memoria</h1>
          <p className="text-gray-600 text-sm">Encuentra todos los pares</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl text-center" style={{
            background: "#f0f0f3",
            boxShadow: "inset 8px 8px 16px #d1d1d4, inset -8px -8px 16px #ffffff",
          }}>
            <div className="text-2xl font-bold text-gray-800">{moves}</div>
            <div className="text-xs text-gray-600 font-medium">MOVIMIENTOS</div>
          </div>
          <div className="p-4 rounded-2xl text-center" style={{
            background: "#f0f0f3",
            boxShadow: "inset 8px 8px 16px #d1d1d4, inset -8px -8px 16px #ffffff",
          }}>
            <div className="text-2xl font-bold text-gray-800">{formatTime(timeElapsed)}</div>
            <div className="text-xs text-gray-600 font-medium">TIEMPO</div>
          </div>
        </div>

        {/* Temática */}
        <div className="p-4 rounded-3xl" style={{
          background: "#f0f0f3",
          boxShadow: "12px 12px 24px #d1d1d4, -12px -12px 24px #ffffff",
        }}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">TEMÁTICA</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(THEMES).map(([key, themeData]) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key)}
                className={`p-3 rounded-2xl transition-all duration-200 ${
                  currentTheme === key ? "transform scale-95" : ""
                }`}
                style={{
                  background: "#f0f0f3",
                  boxShadow:
                    currentTheme === key
                      ? "inset 6px 6px 12px #d1d1d4, inset -6px -6px 12px #ffffff"
                      : "6px 6px 12px #d1d1d4, -6px -6px 12px #ffffff",
                }}
              >
                <div className="text-xl mb-1">{themeData.icon}</div>
                <div className="text-xs text-gray-700 font-medium">{themeData.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Victoria */}
        {isGameComplete && (
          <div className="p-6 rounded-3xl text-center" style={{
            background: "#f0f0f3",
            boxShadow: "12px 12px 24px #d1d1d4, -12px -12px 24px #ffffff",
          }}>
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¡Excelente!</h3>
            <p className="text-gray-600 text-sm mb-3">Completaste en {moves} movimientos</p>
            <div className="text-lg font-bold text-gray-800">{score} puntos</div>
          </div>
        )}

        {/* Botón Nuevo Juego */}
        <div className="text-center">
          <button
            onClick={initializeGame}
            className="px-8 py-4 rounded-2xl font-semibold text-gray-800 transition-all duration-200 active:scale-95"
            style={{
              background: "#f0f0f3",
              boxShadow: "8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff",
            }}
            onMouseDown={(e) => e.target.style.boxShadow = "inset 8px 8px 16px #d1d1d4, inset -8px -8px 16px #ffffff"}
            onMouseUp={(e) => e.target.style.boxShadow = "8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff"}
            onMouseLeave={(e) => e.target.style.boxShadow = "8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff"}
          >
            🔄 Nuevo Juego
          </button>
        </div>
      </div>

      {/* Panel Derecho (Tablero) */}
      <div className="w-full max-w-lg md:max-w-lg 2xl:max-w-2xl">
        <div className="p-6 rounded-3xl" style={{
          background: "#f0f0f3",
          boxShadow: "12px 12px 24px #d1d1d4, -12px -12px 24px #ffffff",
        }}>
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={isChecking || card.isMatched}
                className={`
                  aspect-square rounded-2xl text-3xl font-bold
                  transition-all duration-300 flex items-center justify-center
                  ${isChecking || card.isMatched ? "cursor-not-allowed" : "cursor-pointer active:scale-95"}
                `}
                style={{
                  background: "#f0f0f3",
                  boxShadow:
                    card.isFlipped || card.isMatched
                      ? "inset 6px 6px 12px #d1d1d4, inset -6px -6px 12px #ffffff"
                      : "6px 6px 12px #d1d1d4, -6px -6px 12px #ffffff",
                  color: card.isFlipped || card.isMatched ? "#333" : "#888",
                  opacity: card.isMatched ? 0.6 : 1,
                }}
                onMouseDown={(e) => {
                  if (!card.isFlipped && !card.isMatched && !isChecking) {
                    e.target.style.boxShadow = "inset 6px 6px 12px #d1d1d4, inset -6px -6px 12px #ffffff"
                  }
                }}
                onMouseUp={(e) => {
                  if (!card.isFlipped && !card.isMatched) {
                    e.target.style.boxShadow = "6px 6px 12px #d1d1d4, -6px -6px 12px #ffffff"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!card.isFlipped && !card.isMatched) {
                    e.target.style.boxShadow = "6px 6px 12px #d1d1d4, -6px -6px 12px #ffffff"
                  }
                }}
              >
                {card.isFlipped || card.isMatched ? card.emoji : "?"}
              </button>
            ))}
          </div>
        </div>

        {/* Instrucciones */}
            <div className="mt-8 text-center">
              <div className={`inline-flex items-center bg-purple-500 gap-2 px-4 py-2 rounded-full`}>
                <span className="text-lg">💡</span>
                <span className="text-sm font-medium">Haz clic en dos cartas para encontrar los pares</span>
              </div>
            </div>
      </div>
    </div>
  </div>
)

}
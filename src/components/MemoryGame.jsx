"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()

return (
  <div className="min-h-screen flex justify-center items-center bg-gray-100" style={{ backgroundColor: "#f0f0f3" }}>
          {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
              onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)] active:scale-95 transition-all duration-200 text-gray-700 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="#785DC8" d="m2.36 11.23l8.31 7.57c.61.56 1.6.12 1.6-.71v-3.63c0-.35.29-.64.64-.64h15.86c.66 0 1.19-.53 1.19-1.19V8.42c0-.66-.53-1.19-1.19-1.19H12.91c-.35 0-.64-.29-.64-.64V2.96c0-.83-.99-1.27-1.6-.71L2.36 9.82a.946.946 0 0 0 0 1.41m13.97 17.53l-2.54-6.95c-.16-.49-.62-.81-1.13-.81s-.97.32-1.12.79l-2.57 6.98c-.18.48.07 1 .55 1.18c.1.03.21.05.32.05c.37 0 .73-.23.86-.6l.41-1.13c.04.01.08.01.12.01h2.87c.03 0 .07 0 .1-.01l.41 1.12c.18.48.7.73 1.18.55c.47-.17.71-.7.54-1.18m-4.54-2.32l.87-2.38l.86 2.38zm-3.56-2.73c0 .53-.15 1.02-.41 1.43a2.7 2.7 0 0 1 1.07 2.15c0 1.38-1.05 2.54-2.4 2.69c-.04.01-.09.02-.13.01c-.06.01-.12.01-.18.01H2.92a.92.92 0 0 1-.92-.93v-7.16c0-.5.41-.91.92-.91h2.6c.1 0 .19 0 .27.01l.19.03c1.28.22 2.25 1.34 2.25 2.67m-2.7-.87H3.84v1.74h1.68c.48 0 .88-.39.88-.87a.87.87 0 0 0-.87-.87m-1.69 3.57v1.74h2.35a.87.87 0 0 0 0-1.74zm18.76 1.94a3.308 3.308 0 0 1-6.17-1.66v-2.38c0-1.83 1.48-3.31 3.31-3.31c1.18 0 2.28.64 2.87 1.65c.26.44.1 1-.33 1.26c-.44.26-1 .11-1.26-.33a1.5 1.5 0 0 0-1.28-.74c-.8 0-1.47.66-1.47 1.47v2.38c0 .81.67 1.47 1.47 1.47c.53 0 1.01-.28 1.28-.74c.26-.43.81-.59 1.26-.33c.42.26.58.82.32 1.26m4.63-3.48l2.6 3.68c.29.42.2.99-.23 1.29c-.42.29-.99.19-1.28-.22l-2.41-3.42l-.69.69v2.2c0 .51-.41.92-.92.92s-.92-.41-.92-.92v-7.17c0-.51.41-.92.92-.92s.92.41.92.92v2.37l3.01-3.02c.36-.36.94-.36 1.3 0s.36.94 0 1.3z"/></svg>
          </button>
        </div>
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
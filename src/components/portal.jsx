"use client"

import { useNavigate } from "react-router-dom"

const GAMES = [
  {
    id: "Game2048",
    name: "2048 Neomórfico", 
    description: "Combina números para llegar a 2048",
    icon: "🎯",
    color: "from-blue-400 to-blue-600",
    stats: "Desliza y combina fichas numéricas"
  },
  {
    id: "MemoryGame",
    name: "Memory Game",
    description: "Encuentra todos los pares de cartas",
    icon: "🧠",
    color: "from-purple-400 to-purple-600", 
    stats: "Ejercita tu memoria y concentración"
  },
    {
    id: "MinesweeperGame",
    name: "Buscaminas",
    description: "Encuentra todas las minas ocultas",
    icon: "💣",
    color: "from-red-400 to-red-600",
    stats: "Lógica y estrategia para evitar las minas",
  },
]

export default function Portal() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-700 mb-4 drop-shadow-sm">
            Portal de Juegos Neomórfico
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Disfruta de una colección de juegos clásicos con un diseño moderno y elegante
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="bg-gray-100 rounded-3xl p-8 shadow-[20px_20px_40px_rgba(0,0,0,0.1),-20px_-20px_40px_rgba(255,255,255,0.8)] hover:shadow-[15px_15px_30px_rgba(0,0,0,0.1),-15px_-15px_30px_rgba(255,255,255,0.8)] transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/${game.id}`)}
            >
              {/* Game Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.1),inset_-8px_-8px_16px_rgba(255,255,255,0.8)] flex items-center justify-center group-hover:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] transition-all duration-300">
                  <span className="text-3xl">{game.icon}</span>
                </div>
              </div>

              {/* Game Info */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-700 mb-2">{game.name}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <div className="bg-gray-100 rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-3">
                  <p className="text-sm text-gray-500">{game.stats}</p>
                </div>
              </div>

              {/* Play Button */}
              <div className="flex justify-center">
                <button className={`px-8 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r ${game.color} shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)] active:scale-95 transition-all duration-200`}>
                  Jugar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

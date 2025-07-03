"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"

const GAMES = [
  {
    id: "Game2048",
    name: "2048 Neomórfico",
    description: "Combina números para llegar a 2048",
    icon: "🎯",
    color: "from-blue-400 to-blue-600",
    stats: "Desliza y combina fichas numéricas",
    longDescription: "El clásico juego de 2048 con un toque neumórfico. Desliza las fichas para combinar números idénticos y alcanzar la ficha de 2048. ¡Un desafío para tu mente y reflejos!"
  },
  {
    id: "MemoryGame",
    name: "Memory Game",
    description: "Encuentra todos los pares de cartas",
    icon: "🧠",
    color: "from-purple-400 to-purple-600",
    stats: "Ejercita tu memoria y concentración",
    longDescription: "Pon a prueba tu memoria con este adictivo juego. Voltea las cartas y encuentra todos los pares antes de que se agote el tiempo. Perfecto para todas las edades."
  },
  {
    id: "MinesweeperGame",
    name: "Buscaminas",
    description: "Encuentra todas las minas ocultas",
    icon: "💣",
    color: "from-red-400 to-red-600",
    stats: "Lógica y estrategia para evitar las minas",
    longDescription: "Un clásico atemporal que desafía tu lógica y deducción. Despeja el campo de juego sin detonar ninguna mina. Cada movimiento cuenta en esta emocionante aventura."
  },
]

export default function Portal() {
  const navigate = useNavigate()
  // State to manage which game's details are currently expanded
  const [expandedGameId, setExpandedGameId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedGameId(expandedGameId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center p-4 py-8">
      <div className="w-full max-w-md mx-auto"> {/* Max-width for mobile responsiveness */}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-2 drop-shadow-sm">
            Portal de Juegos Neomórfico
          </h1>
          <p className="text-gray-600 text-base max-w-xs mx-auto">
            Toca una tarjeta para descubrir más y empezar a jugar.
          </p>
        </div>

        {/* Games List */}
        <div className="space-y-6"> {/* Adds vertical spacing between cards */}
          {GAMES.map((game) => (
            <div
              key={game.id}
              className={`
                bg-gray-100 rounded-3xl p-6
                shadow-[15px_15px_30px_rgba(0,0,0,0.1),-15px_-15px_30px_rgba(255,255,255,0.8)]
                hover:shadow-[10px_10px_20px_rgba(0,0,0,0.1),-10px_-10px_20px_rgba(255,255,255,0.8)]
                active:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]
                transition-all duration-300 cursor-pointer
                ${expandedGameId === game.id ? 'shadow-[inset_10px_10px_20px_rgba(0,0,0,0.1),inset_-10px_-10px_20px_rgba(255,255,255,0.8)]' : ''}
              `}
              onClick={() => toggleExpand(game.id)}
            >
              <div className="flex items-center space-x-4 mb-4">
                {/* Game Icon */}
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-100 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] flex items-center justify-center">
                  <span className="text-3xl">{game.icon}</span>
                </div>
                {/* Game Name and Description (always visible) */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-700 mb-1">{game.name}</h3>
                  <p className="text-gray-600 text-sm">{game.description}</p>
                </div>
              </div>

              {/* Collapsible Details */}
              {expandedGameId === game.id && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <p className="text-gray-600 text-sm mb-4">{game.longDescription}</p>
                  <div className="bg-gray-100 rounded-xl shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] p-2 mb-6">
                    <p className="text-xs text-gray-500">{game.stats}</p>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className={`px-6 py-2 rounded-2xl font-semibold text-white bg-gradient-to-r ${game.color}
                        shadow-[3px_3px_6px_rgba(0,0,0,0.2),-3px_-3px_6px_rgba(255,255,255,0.8)]
                        hover:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)]
                        active:scale-95 transition-all duration-200 text-sm`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card collapse when clicking button
                        navigate(`/${game.id}`);
                      }}
                    >
                      Jugar Ahora
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
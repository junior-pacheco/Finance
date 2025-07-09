"use client"

import { useState } from "react"
import { X, TrendingUp, TrendingDown } from "lucide-react"
import { Input } from "@nextui-org/react"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (transaction: {
    type: "income" | "expense"
    amount: number
    category: string
    description: string
    date: string
  }) => void
  expenseCategories: string[]
  incomeCategories: string[]
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  expenseCategories,
  incomeCategories,
}: AddTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = () => {
    if (!amount || !category || !description) return

    onAdd({
      type,
      amount: Number.parseFloat(amount),
      category,
      description,
      date,
    })

    // Reset form
    setAmount("")
    setCategory("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
    onClose()
  }

  const categories = type === "expense" ? expenseCategories : incomeCategories

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-md p-6 rounded-xl shadow-lg relative text-white">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Nueva Transacción</h2>

        <div className="space-y-4">
          {/* Tipo */}
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md border ${
                type === "expense" ? "bg-red-500 text-white border-red-500" : "border-gray-600 text-gray-300"
              }`}
              onClick={() => setType("expense")}
            >
              <TrendingDown className="h-4 w-4" /> Gasto
            </button>
            <button
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md border ${
                type === "income" ? "bg-green-500 text-white border-green-500" : "border-gray-600 text-gray-300"
              }`}
              onClick={() => setType("income")}
            >
              <TrendingUp className="h-4 w-4" /> Ingreso
            </button>
          </div>

          {/* Monto */}
          <Input
            type="number"
            label="Monto"
            // placeholder="0.00"
            value={amount}
            onValueChange={setAmount}
            variant="bordered"
            size="lg"
          />

          {/* Categoría */}
          <div>
            <label className="text-sm text-white mb-1 block">Categoría</label>
            <select
              className="w-full bg-zinc-800 border border-gray-600 rounded-md px-4 py-2 text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <Input
            // label="Descripción"
            placeholder="¿En qué gastaste?"
            value={description}
            onValueChange={setDescription}
            variant="bordered"
            size="lg"
          />

          {/* Fecha */}
          <Input
            type="date"
            // label="Fecha"
            value={date}
            onValueChange={setDate}
            variant="bordered"
            size="lg"
          />

          {/* Acciones */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-500 rounded-md px-4 py-2 text-white hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 rounded-md px-4 py-2 text-white ${
                type === "expense" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

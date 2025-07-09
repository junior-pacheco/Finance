"use client"

import { useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react"
import { TrendingUp, TrendingDown } from "lucide-react"

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" className="mx-4">
      <ModalContent className="bg-zinc-900">
        <ModalHeader className="text-white text-center">Nueva Transacción</ModalHeader>
        <ModalBody className="space-y-4">
          {/* Tipo de transacción */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              color={type === "expense" ? "danger" : "default"}
              variant={type === "expense" ? "solid" : "bordered"}
              onPress={() => setType("expense")}
              className="h-12"
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Gasto
            </Button>
            <Button
              color={type === "income" ? "success" : "default"}
              variant={type === "income" ? "solid" : "bordered"}
              onPress={() => setType("income")}
              className="h-12"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Ingreso
            </Button>
          </div>

          {/* Monto */}
          <Input
            type="number"
            label="Monto"
            placeholder="0.00"
            value={amount}
            onValueChange={setAmount}
            variant="bordered"
            size="lg"
            classNames={{
              input: "text-lg",
            }}
          />

          {/* Categoría */}
          <Select
            label="Categoría"
            placeholder="Selecciona una categoría"
            selectedKeys={category ? [category] : []}
            onSelectionChange={(keys) => setCategory(Array.from(keys)[0] as string)}
            variant="bordered"
            size="lg"
          >
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </Select>

          {/* Descripción */}
          <Input
            label="Descripción"
            placeholder="¿En qué gastaste?"
            value={description}
            onValueChange={setDescription}
            variant="bordered"
            size="lg"
          />

          {/* Fecha */}
          <Input type="date" label="Fecha" value={date} onValueChange={setDate} variant="bordered" size="lg" />
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onPress={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button color={type === "expense" ? "danger" : "success"} onPress={handleSubmit} className="flex-1">
            Agregar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

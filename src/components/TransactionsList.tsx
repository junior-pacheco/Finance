import { Card, CardBody, Button, Chip } from "@nextui-org/react"
import { Trash2, TrendingUp, TrendingDown } from "lucide-react"
import type { Transaction } from "../App"

interface TransactionsListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionsList({ transactions, onDelete }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="space-y-4 flex justify-center items-center mt-10">
        {/* <h2 className="text-xl font-bold text-white">Historial</h2> */}
        <Card className="">
          <CardBody className="p-8 text-center">
            <p className="text-gray-400">No hay transacciones</p>
            <p className="text-sm text-gray-500 mt-1">Agrega tu primera transacción</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  // Agrupar transacciones por fecha
  const groupedTransactions = transactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    },
    {} as Record<string, Transaction[]>,
  )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Historial</h2>

      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400 capitalize px-1">{date}</h3>
          {dayTransactions.map((transaction) => (
            <Card key={transaction.id} className="bg-zinc-900/50">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "income" ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{transaction.description}</p>
                      <Chip size="sm" variant="flat" className="mt-1">
                        {transaction.category}
                      </Chip>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-semibold text-sm ${
                        transaction.type === "income" ? "text-success" : "text-danger"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => onDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
}

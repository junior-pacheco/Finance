import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import type { Transaction } from "../App"

interface MonthlyBalanceProps {
  transactions: Transaction[]
}

export function MonthlyBalance({ transactions }: MonthlyBalanceProps) {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
  })

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyBalance = monthlyIncome - monthlyExpenses
  const isPositive = monthlyBalance >= 0

  const monthName = new Date().toLocaleDateString("es-ES", {
    month: "long",
  })

  return (
    <Card className="bg-zinc-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-white" />
          <h3 className="text-lg font-semibold text-white">{monthName}</h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center justify-center gap-1 text-success mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Ingresos</span>
            </div>
            <p className="text-lg font-bold text-success">${monthlyIncome.toLocaleString()}</p>
          </div>

          <div className="text-center p-3 bg-danger/10 rounded-lg border border-danger/20">
            <div className="flex items-center justify-center gap-1 text-danger mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-medium">Gastos</span>
            </div>
            <p className="text-lg font-bold text-danger">${monthlyExpenses.toLocaleString()}</p>
          </div>
        </div>

        <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Balance del mes</p>
          <div className="flex items-center justify-center gap-2">
            <p className={`text-xl font-bold ${isPositive ? "text-success" : "text-danger"}`}>
              {isPositive ? "+" : ""}${monthlyBalance.toLocaleString()}
            </p>
            <Chip color={isPositive ? "success" : "danger"} variant="flat">
              {isPositive ? "Superávit" : "Déficit"}
            </Chip>
          </div>
        </div>

        {currentMonthTransactions.length > 0 && (
          <div className="text-center text-xs text-gray-500">
            {currentMonthTransactions.length} transacciones este mes
          </div>
        )}
      </CardBody>
    </Card>
  )
}

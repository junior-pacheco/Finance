import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import type { Transaction } from "../App"

interface IncomeExpenseChartProps {
  transactions: Transaction[]
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  // Agrupar transacciones por mes
  const monthlyData = transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("es-ES", { month: "short" })

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          income: 0,
          expenses: 0,
        }
      }

      if (transaction.type === "income") {
        acc[monthKey].income += transaction.amount
      } else {
        acc[monthKey].expenses += transaction.amount
      }

      return acc
    },
    {} as Record<string, { month: string; income: number; expenses: number }>,
  )

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Solo últimos 6 meses

  if (chartData.length === 0) {
    return (
      <Card className="bg-zinc-900/50">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Últimos Meses</h3>
        </CardHeader>
        <CardBody>
          <div className="h-48 flex items-center justify-center text-gray-400">No hay datos suficientes</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900/50">
      <CardHeader>
        <h3 className="text-lg font-semibold text-white">Últimos Meses</h3>
      </CardHeader>
      <CardBody>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "#9ca3af" }} />
              <YAxis hide />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
              <Bar dataKey="income" fill="#22c55e" name="Ingresos" radius={[2, 2, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Gastos" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}

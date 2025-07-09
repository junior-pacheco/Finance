"use client"

import { useState } from "react"
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { Transaction } from "../App"

interface CategoryChartProps {
  transactions: Transaction[]
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"]

export function CategoryChart({ transactions }: CategoryChartProps) {
  const [viewType, setViewType] = useState<"expenses" | "income">("expenses")

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const incomesByCategory = transactions
    .filter((t) => t.type === "income")
    .reduce(
      (acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const expenseData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({ name: category, value: amount }))
    .sort((a, b) => b.value - a.value)

  const incomeData = Object.entries(incomesByCategory)
    .map(([category, amount]) => ({ name: category, value: amount }))
    .sort((a, b) => b.value - a.value)

  const currentData = viewType === "expenses" ? expenseData : incomeData
  const total = currentData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Categorías</h2>
      </div> */}

      {/* Toggle Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          color={viewType === "expenses" ? "danger" : "default"}
          variant={viewType === "expenses" ? "solid" : "bordered"}
          onPress={() => setViewType("expenses")}
          className="h-12"
        >
          Gastos
        </Button>
        <Button
          color={viewType === "income" ? "success" : "default"}
          variant={viewType === "income" ? "solid" : "bordered"}
          onPress={() => setViewType("income")}
          className="h-12"
        >
          Ingresos
        </Button>
      </div>

      <Card className="bg-zinc-900/50 rounded-xl">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">
            {viewType === "expenses" ? "Gastos" : "Ingresos"} por Categoría
          </h3>
        </CardHeader>
        <CardBody>
          {currentData.length === 0 ? (
            <div className="h-64 flex items-center rounded-xl justify-center text-gray-400">
              No hay datos de {viewType === "expenses" ? "gastos" : "ingresos"}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={false}
                    >
                      {currentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Monto"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {currentData.map((item, index) => {
                  const percentage = ((item.value / total) * 100).toFixed(1)
                  return (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-white">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-300">${item.value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

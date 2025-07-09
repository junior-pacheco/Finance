"use client"

import { useState, useEffect } from "react"
import { Plus, TrendingUp, TrendingDown, Target, PieChart, List, Home, Wallet } from "lucide-react"
import { Card, CardBody, Button, Tabs, Tab } from "@nextui-org/react"
import { AddTransactionModal } from "./components/AddTransactionModal"
import { TransactionsList } from "./components/TransactionsList"
import { IncomeExpenseChart } from "./components/IncomeExpenseChart"
import { CategoryChart } from "./components/CategoryChart"
import { SavingsGoals } from "./components/SavingsGoals"
import { MonthlyBalance } from "./components/MonthlyBalance"

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

export interface SavingsGoal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

const EXPENSE_CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Servicios",
  "Compras",
  "Otros",
]

const INCOME_CATEGORIES = ["Salario", "Freelance", "Inversiones", "Otros"]

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("home")

  // Cargar datos del localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem("finance-transactions")
    const savedGoals = localStorage.getItem("finance-goals")

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }

    if (savedGoals) {
      setSavingsGoals(JSON.parse(savedGoals))
    } else {
      // Objetivos de ejemplo
      const defaultGoals: SavingsGoal[] = [
        {
          id: "1",
          name: "Fondo de Emergencia",
          target: 50000,
          current: 15000,
          deadline: "2024-12-31",
        },
        {
          id: "2",
          name: "Vacaciones",
          target: 20000,
          current: 8500,
          deadline: "2024-08-15",
        },
      ]
      setSavingsGoals(defaultGoals)
      localStorage.setItem("finance-goals", JSON.stringify(defaultGoals))
    }
  }, [])

  // Guardar transacciones en localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("finance-transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  // Calcular totales
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-4 text-white">
            <MonthlyBalance transactions={transactions} />
            <IncomeExpenseChart transactions={transactions} />
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-white px-1">Transacciones Recientes</h3>
              <div className="space-y-2">
                {transactions.slice(0, 5).map((transaction) => (
                  <Card key={transaction.id} className="bg-zinc-800/50">
                    <CardBody className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "income" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {transaction.type === "income" ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-white">{transaction.description}</p>
                            <p className="text-xs text-gray-400">{transaction.category}</p>
                          </div>
                        </div>
                        <span
                          className={`font-semibold text-sm ${
                            transaction.type === "income" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
              {transactions.length > 5 && (
                <Button variant="bordered" onPress={() => setActiveTab("transactions")} className="w-full">
                  Ver todas las transacciones
                </Button>
              )}
            </div>
          </div>
        )
      case "categories":
        return <CategoryChart transactions={transactions} />
      case "goals":
        return <SavingsGoals goals={savingsGoals} setGoals={setSavingsGoals} balance={balance} />
      case "transactions":
        return <TransactionsList transactions={transactions} onDelete={deleteTransaction} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header Móvil */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2">
                <Wallet className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-purple-500">Finance</h1>
                <p className="text-xs text-gray-400">Tu dinero bajo control</p>
              </div>
            </div>
            <Button
              isIconOnly
              color="success"
              variant="solid"
              onPress={() => setIsAddModalOpen(true)}
              className="rounded-full h-10 w-10"
            >
              <Plus className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Balance Cards - Solo en Home */}
      {activeTab === "home" && (
        <div className="px-4 py-4 space-y-3">
          <Card className="bg-zinc-900/50 rounded-xl">
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Balance Total</p>
                <p className="text-3xl font-bold text-white mb-3">${balance.toLocaleString()}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-center gap-1 text-success mb-1">
                      <TrendingUp className="h-4 w-4 text-white" />
                      <span className="text-xs font-medium text-white">Ingresos</span>
                    </div>
                    <p className="font-semibold text-green-500">${totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-danger/10 rounded-lg border border-red-500/20">
                    <div className="flex items-center justify-center gap-1 text-danger mb-1">
                      <TrendingDown className="h-4 text-white w-4" />
                      <span className="text-xs text-white font-medium">Gastos</span>
                    </div>
                    <p className="font-semibold text-red-500">${totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="px-4 pb-4">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0  bg-zinc-900">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          variant="light"
          classNames={{
            base: "w-full",
            tabList: "grid grid-cols-4 w-full bg-transparent",
            tab: "h-16 flex-col",
            tabContent: "group-data-[selected=true]:text-white text-purple-500",
          }}
        >
          <Tab
            key="home"
            title={
              <div className="flex flex-col items-center space-y-1">
                <Home className="h-5 w-5" />
                <span className="text-xs">Inicio</span>
              </div>
            }
          />
          <Tab
            key="categories"
            title={
              <div className="flex flex-col items-center space-y-1">
                <PieChart className="h-5 w-5" />
                <span className="text-xs">Categorías</span>
              </div>
            }
          />
          <Tab
            key="goals"
            title={
              <div className="flex flex-col items-center space-y-1">
                <Target className="h-5 w-5" />
                <span className="text-xs">Objetivos</span>
              </div>
            }
          />
          <Tab
            key="transactions"
            title={
              <div className="flex flex-col items-center space-y-1">
                <List className="h-5 w-5" />
                <span className="text-xs">Historial</span>
              </div>
            }
          />
        </Tabs>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTransaction}
        expenseCategories={EXPENSE_CATEGORIES}
        incomeCategories={INCOME_CATEGORIES}
      />
    </div>
  )
}

export default App

// "use client"

// import { useState } from "react"
// import {
//   Card,
//   CardBody,
//   Button,
//   Progress,
//   Chip,
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Input,
// } from "@nextui-org/react"
// import { Target, Calendar, Sparkles } from "lucide-react"
// import type { SavingsGoal } from "../App"

// interface SavingsGoalsProps {
//   goals: SavingsGoal[]
//   setGoals: (goals: SavingsGoal[]) => void
//   balance: number
// }

// export function SavingsGoals({ goals, setGoals }: SavingsGoalsProps) {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false)
//   const [newGoal, setNewGoal] = useState({
//     name: "",
//     target: "",
//     deadline: "",
//   })

//   const handleAddGoal = () => {
//     if (!newGoal.name || !newGoal.target || !newGoal.deadline) return

//     const goal: SavingsGoal = {
//       id: Date.now().toString(),
//       name: newGoal.name,
//       target: Number.parseFloat(newGoal.target),
//       current: 0,
//       deadline: newGoal.deadline,
//     }

//     const updatedGoals = [...goals, goal]
//     setGoals(updatedGoals)
//     localStorage.setItem("finance-goals", JSON.stringify(updatedGoals))

//     setNewGoal({ name: "", target: "", deadline: "" })
//     setIsAddModalOpen(false)
//   }

//   const updateGoalProgress = (goalId: string, amount: number) => {
//     const updatedGoals = goals.map((goal) =>
//       goal.id === goalId ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal,
//     )
//     setGoals(updatedGoals)
//     localStorage.setItem("finance-goals", JSON.stringify(updatedGoals))
//   }

//   const getTimeRemaining = (deadline: string) => {
//     const today = new Date()
//     const deadlineDate = new Date(deadline)
//     const diffTime = deadlineDate.getTime() - today.getTime()
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

//     if (diffDays < 0) return "Vencido"
//     if (diffDays === 0) return "Hoy"
//     if (diffDays === 1) return "1 día"
//     if (diffDays < 30) return `${diffDays} días`

//     const months = Math.floor(diffDays / 30)
//     return `${months} ${months === 1 ? "mes" : "meses"}`
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex mt-4 items-end justify-end">
//         {/* <h2 className="text-xl font-bold text-white">Objetivos</h2> */}
//         <Button
//           color="secondary"
//           variant="solid"
//           onPress={() => setIsAddModalOpen(true)}
//           startContent={<Sparkles className="h-4 w-4" />}
//           className="bg-purple-600 rounded-md flex text-white"
//         >
//           Nueva Meta
//         </Button>
//       </div>

//       {goals.length === 0 ? (
//         <Card className="bg-zinc-900/50">
//           <CardBody className="p-8 text-center">
//             <div className="flex justify-center mb-4">
//               <div className="p-3 bg-purple-600/20 rounded-full">
//                 <Target className="h-8 w-8 text-purple-400" />
//               </div>
//             </div>
//             <p className="text-gray-400">No tienes metas de ahorro</p>
//             <p className="text-sm text-gray-500 mt-1">Crea tu primera meta para empezar a ahorrar</p>
//           </CardBody>
//         </Card>
//       ) : (
//         <div className="space-y-3">
//           {goals.map((goal) => {
//             const progress = (goal.current / goal.target) * 100
//             const isCompleted = goal.current >= goal.target
//             const timeRemaining = getTimeRemaining(goal.deadline)

//             return (
//               <Card key={goal.id} className="bg-zinc-900/50">
//                 <CardBody className="p-4">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <div className="p-1.5 bg-purple-600/20 rounded-full">
//                           <Target className="h-4 w-4 text-purple-400" />
//                         </div>
//                         <h4 className="font-medium text-white">{goal.name}</h4>
//                       </div>
//                       {isCompleted && (
//                         <Chip color="success" variant="flat" startContent={<Sparkles className="h-3 w-3" />}>
//                           ¡Listo!
//                         </Chip>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-300">${goal.current.toLocaleString()}</span>
//                         <span className="text-gray-300">${goal.target.toLocaleString()}</span>
//                       </div>
//                       <Progress value={progress} color="primary" className="max-w-full" />
//                       <div className="flex justify-between text-xs text-gray-500">
//                         <span>{progress.toFixed(1)}% completado</span>
//                         <div className="flex items-center space-x-1">
//                           <Calendar className="h-3 w-3" />
//                           <span>{timeRemaining}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {!isCompleted && (
//                       <div className="grid grid-cols-3 gap-2">
//                         <Button size="sm" variant="bordered" onPress={() => updateGoalProgress(goal.id, 1000)}>
//                           +$1K
//                         </Button>
//                         <Button size="sm" variant="bordered" onPress={() => updateGoalProgress(goal.id, 5000)}>
//                           +$5K
//                         </Button>
//                         <Button size="sm" variant="bordered" onPress={() => updateGoalProgress(goal.id, 10000)}>
//                           +$10K
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 </CardBody>
//               </Card>
//             )
//           })}
//         </div>
//       )}

//       <Modal  portalContainer={document.body}  isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} placement="center" className="mx-4">
//         <ModalContent className="bg-zinc-900">
//           <ModalHeader className="text-white text-center flex items-center justify-center gap-2">
//             <Sparkles className="h-5 w-5 text-purple-400" />
//             Nueva Meta de Ahorro
//           </ModalHeader>
//           <ModalBody className="space-y-4">
//             <Input
//               label="Nombre de la meta"
//               placeholder="Ej: Vacaciones, Auto nuevo..."
//               value={newGoal.name}
//               onValueChange={(value) => setNewGoal((prev) => ({ ...prev, name: value }))}
//               variant="bordered"
//               size="lg"
//             />
//             <Input
//               type="number"
//               label="Monto objetivo"
//               placeholder="0.00"
//               value={newGoal.target}
//               onValueChange={(value) => setNewGoal((prev) => ({ ...prev, target: value }))}
//               variant="bordered"
//               size="lg"
//             />
//             <Input
//               type="date"
//               label="Fecha límite"
//               value={newGoal.deadline}
//               onValueChange={(value) => setNewGoal((prev) => ({ ...prev, deadline: value }))}
//               variant="bordered"
//               size="lg"
//             />
//           </ModalBody>
//           <ModalFooter>
//             <Button variant="bordered" onPress={() => setIsAddModalOpen(false)} className="flex-1">
//               Cancelar
//             </Button>
//             <Button
//               className="flex-1 bg-purple-600 text-white"
//               onPress={handleAddGoal}
//               startContent={<Sparkles className="h-4 w-4" />}
//             >
//               Crear Meta
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import {
  Card,
  CardBody,
  Button,
  Progress,
  Chip,
  Input,
} from "@nextui-org/react"
import { Target, Calendar, Sparkles, X } from "lucide-react"
import type { SavingsGoal } from "../App"

interface SavingsGoalsProps {
  goals: SavingsGoal[]
  setGoals: (goals: SavingsGoal[]) => void
  balance: number
}

export function SavingsGoals({ goals, setGoals }: SavingsGoalsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    deadline: "",
  })

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) return

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      target: Number.parseFloat(newGoal.target),
      current: 0,
      deadline: newGoal.deadline,
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    localStorage.setItem("finance-goals", JSON.stringify(updatedGoals))

    setNewGoal({ name: "", target: "", deadline: "" })
    setIsAddModalOpen(false)
  }

  const updateGoalProgress = (goalId: string, amount: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal,
    )
    setGoals(updatedGoals)
    localStorage.setItem("finance-goals", JSON.stringify(updatedGoals))
  }

  const getTimeRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Vencido"
    if (diffDays === 0) return "Hoy"
    if (diffDays === 1) return "1 día"
    if (diffDays < 30) return `${diffDays} días`

    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "mes" : "meses"}`
  }

  return (
    <div className="space-y-4">
      <div className="flex mt-4 items-end justify-end">
        <Button
          color="secondary"
          variant="solid"
          onClick={() => setIsAddModalOpen(true)}
          startContent={<Sparkles className="h-4 w-4" />}
          className="bg-purple-600 rounded-md flex text-white"
        >
          Nueva Meta
        </Button>
      </div>

      {/* MODAL PERSONALIZADO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-md p-6 rounded-xl shadow-lg relative text-white">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setIsAddModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-semibold">Nueva Meta de Ahorro</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Nombre de la meta"
                placeholder="Ej: Vacaciones, Auto nuevo..."
                value={newGoal.name}
                onValueChange={(value) => setNewGoal((prev) => ({ ...prev, name: value }))}
                variant="bordered"
                size="lg"
              />
              <Input
                type="number"
                label="Monto objetivo"
                placeholder="0.00"
                value={newGoal.target}
                onValueChange={(value) => setNewGoal((prev) => ({ ...prev, target: value }))}
                variant="bordered"
                size="lg"
              />
              <Input
                type="date"
                label="Fecha límite"
                value={newGoal.deadline}
                onValueChange={(value) => setNewGoal((prev) => ({ ...prev, deadline: value }))}
                variant="bordered"
                size="lg"
              />
              <div className="flex gap-2 mt-4">
                <Button fullWidth variant="bordered" onClick={() => setIsAddModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  fullWidth
                  className="bg-purple-600 text-white"
                  onClick={handleAddGoal}
                  startContent={<Sparkles className="h-4 w-4" />}
                >
                  Crear Meta
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <Card className="bg-zinc-900/50">
          <CardBody className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-600/20 rounded-full">
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <p className="text-gray-400">No tienes metas de ahorro</p>
            <p className="text-sm text-gray-500 mt-1">Crea tu primera meta para empezar a ahorrar</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            const isCompleted = goal.current >= goal.target
            const timeRemaining = getTimeRemaining(goal.deadline)

            return (
              <Card key={goal.id} className="bg-zinc-900/50">
                <CardBody className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-600/20 rounded-full">
                          <Target className="h-4 w-4 text-purple-400" />
                        </div>
                        <h4 className="font-medium text-white">{goal.name}</h4>
                      </div>
                      {isCompleted && (
                        <Chip color="success" variant="flat" startContent={<Sparkles className="h-3 w-3" />}>
                          ¡Listo!
                        </Chip>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">${goal.current.toLocaleString()}</span>
                        <span className="text-gray-300">${goal.target.toLocaleString()}</span>
                      </div>
                      <Progress value={progress} color="primary" className="max-w-full" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{progress.toFixed(1)}% completado</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{timeRemaining}</span>
                        </div>
                      </div>
                    </div>

                    {!isCompleted && (
                      <div className="grid grid-cols-3 gap-2">
                        <Button size="sm" variant="bordered" onClick={() => updateGoalProgress(goal.id, 1000)}>
                          +$1K
                        </Button>
                        <Button size="sm" variant="bordered" onClick={() => updateGoalProgress(goal.id, 5000)}>
                          +$5K
                        </Button>
                        <Button size="sm" variant="bordered" onClick={() => updateGoalProgress(goal.id, 10000)}>
                          +$10K
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

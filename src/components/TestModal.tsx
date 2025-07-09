import { useState } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react"

export default function TestModal() {
  const [isOpen, setIsOpen] = useState(false)

  console.log("Estado actual del modal:", isOpen)

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <Button
        onPress={() => {
          console.log("Clic en botón: abrir modal")
          setIsOpen(true)
        }}
      >
        Abrir modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          console.log("Modal cerrado")
          setIsOpen(false)
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-white">Modal funcionando 🎉</ModalHeader>
              <ModalBody>
                <p className="text-white">Ahora sí abre correctamente.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

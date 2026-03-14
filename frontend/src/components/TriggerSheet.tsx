import { useState } from "react"
import type { NodeKind, NodeMetadata } from "./CreateWorkflow"

import { Button } from "@/components/ui/button"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SUPPORTED_TRIGGERS = [
  { id: "timer-trigger", title: "Timer" },
  { id: "price-trigger", title: "Price Trigger" },
]

export const TriggerSheet = ({
  onSelect,
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetadata) => void
}) => {

  const [metadata, setMetadata] = useState({})
  const [open, setOpen] = useState(true)

  const [selectedTrigger, setSelectedTrigger] = useState<NodeKind>(
    "timer-trigger"
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
  <SheetContent className="flex flex-col">

    <SheetHeader>
      <SheetTitle>Select trigger</SheetTitle>
      <SheetDescription>
        Select the type of trigger that you need
      </SheetDescription>
    </SheetHeader>

    <div className="mt-6">
      <Select
        value={selectedTrigger}
        onValueChange={(value) =>
          setSelectedTrigger(value as NodeKind)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select trigger" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {SUPPORTED_TRIGGERS.map(({ id, title }) => (
              <SelectItem key={id} value={id}>
                {title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <SheetFooter className="mt-auto">
      <Button
        className="w-full"
        onClick={() => {
          onSelect(selectedTrigger, metadata)
          setOpen(false)
        }}
      >
        Create Trigger
      </Button>
    </SheetFooter>

  </SheetContent>
</Sheet>
  )
}
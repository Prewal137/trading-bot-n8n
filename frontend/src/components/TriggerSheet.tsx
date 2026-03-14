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
  {
    id: "timer",
    title: "Timer",
    description: "Run this trigger every x seconds/minutes",
  },
  {
    id: "price-trigger",
    title: "Price Trigger",
    description:
      "Runs whenever the price goes above or below a certain number for an asset",
  },
]

export const TriggerSheet = ({
  onSelect,
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetadata) => void
}) => {

  const [metadata, setMetadata] = useState({})
  const [selectedTrigger, setSelectedTrigger] = useState<NodeKind>(
    SUPPORTED_TRIGGERS[0].id as NodeKind
  )

  return (
    <Sheet open={true}>
      <SheetContent>

        <SheetHeader>
          <SheetTitle>Select trigger</SheetTitle>

          <SheetDescription>
            Select the type of trigger that you need

            <Select value={selectedTrigger}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>

                  {SUPPORTED_TRIGGERS.map(({ id, title }) => (
                    <SelectItem
                      key={id}
                      onSelect={() => setSelectedTrigger(id as NodeKind)}
                      value={id}
                    >
                      {title}
                    </SelectItem>
                  ))}

                </SelectGroup>
              </SelectContent>

            </Select>

          </SheetDescription>

        </SheetHeader>

        <SheetFooter>

          <Button
            onClick={() => {
              onSelect(selectedTrigger, metadata)
            }}
            type="submit"
          >
            Create Trigger
          </Button>

        </SheetFooter>

      </SheetContent>
    </Sheet>
  )
}
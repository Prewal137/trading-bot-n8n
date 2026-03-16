import { useState } from "react"
import type { NodeKind, NodeMetadata } from "./CreateWorkflow"

import { Button } from "@/components/ui/button"

import {
  Sheet,
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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { type TimerNodeMetadata, type PriceTriggerMetadata, SUPPORTED_ASSETS } from "@repo/common";

const SUPPORTED_TRIGGERS = [
  { id: "timer-trigger", title: "Timer" },
  { id: "price-trigger", title: "Price Trigger" },
]



export const TriggerSheet = ({
  onSelect,
  onClose
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetadata) => void;
  onClose?: () => void;
}) => {

  const [open, setOpen] = useState(true)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose?.()
    }
  }

  const [selectedTrigger, setSelectedTrigger] = useState<NodeKind>("timer-trigger")

  const [metadata, setMetadata] = useState<
    TimerNodeMetadata | PriceTriggerMetadata
  >({
    time: 3600,
  } as TimerNodeMetadata)

  const handleTriggerChange = (value: NodeKind) => {
    setSelectedTrigger(value)

    if (value === "timer-trigger") {
      setMetadata({ time: 3600 } as TimerNodeMetadata)
    }

    if (value === "price-trigger") {
      setMetadata({
        price: 0,
        asset: "SOL",
      } as PriceTriggerMetadata)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col">

        <SheetHeader>
          <SheetTitle>Select trigger</SheetTitle>
          <SheetDescription>
            Select the type of trigger that you need
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4 px-4">

          <Select
            value={selectedTrigger}
            onValueChange={(value) => handleTriggerChange(value as NodeKind)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a trigger" />
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

          {selectedTrigger === "timer-trigger" && (
            <div className="flex flex-col gap-2">
              <Label>Number of seconds after which to run the timer</Label>
              <Input
                type="number"
                value={(metadata as TimerNodeMetadata).time}
                onChange={(e) =>
                  setMetadata({
                    ...(metadata as TimerNodeMetadata),
                    time: Number(e.target.value),
                  })
                }
              />
            </div>
          )}

          {selectedTrigger === "price-trigger" && (
            <div className="flex flex-col gap-4">

              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={(metadata as PriceTriggerMetadata).price ?? ""}
                  onChange={(e) =>
                    setMetadata({
                      ...(metadata as PriceTriggerMetadata),
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Asset</Label>

                <Select
                  value={(metadata as PriceTriggerMetadata).asset ?? "SOL"}
                  onValueChange={(value) =>
                    setMetadata({
                      ...(metadata as PriceTriggerMetadata),
                      asset: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {SUPPORTED_ASSETS.map((id) => (
                        <SelectItem key={id} value={id}>
                          {id}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>

                </Select>
              </div>

            </div>
          )}

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
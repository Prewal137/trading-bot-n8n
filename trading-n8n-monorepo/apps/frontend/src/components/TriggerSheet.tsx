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
  { id: "timer", title: "Timer" },

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

  const [selectedTrigger, setSelectedTrigger] = useState<NodeKind>("timer")

  const [metadata, setMetadata] = useState<
    TimerNodeMetadata | PriceTriggerMetadata
  >({
    time: 3600,
  } as TimerNodeMetadata)

  const handleTriggerChange = (value: NodeKind) => {
    setSelectedTrigger(value)

    if (value === "timer") {
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
          <SheetTitle className="text-2xl font-bold">Select trigger</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Select the type of trigger you need and configure its parameters.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-8 py-8 px-2">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-muted-foreground/80">Trigger type</Label>
            <Select
              value={selectedTrigger}
              onValueChange={(value) => handleTriggerChange(value as NodeKind)}
            >
              <SelectTrigger className="w-full h-14 rounded-2xl border-secondary bg-secondary/10 px-4 text-base">
                <SelectValue placeholder="Select a trigger" />
              </SelectTrigger>

              <SelectContent className="rounded-2xl">
                <SelectGroup>
                  {SUPPORTED_TRIGGERS.map(({ id, title }) => (
                    <SelectItem key={id} value={id} className="rounded-xl py-3">
                      {title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {selectedTrigger === "timer" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-semibold text-muted-foreground/80 lowercase">time</Label>
              <Input
                type="number"
                placeholder="Enter time in seconds"
                className="h-14 rounded-2xl border-secondary bg-secondary/10 px-4 text-base"
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
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground/80 lowercase">price</Label>
                <Input
                  type="number"
                  placeholder="Target price"
                  className="h-14 rounded-2xl border-secondary bg-secondary/10 px-4 text-base"
                  value={(metadata as PriceTriggerMetadata).price ?? ""}
                  onChange={(e) =>
                    setMetadata({
                      ...(metadata as PriceTriggerMetadata),
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground/80 uppercase">Asset</Label>
                <Select
                  value={(metadata as PriceTriggerMetadata).asset ?? "SOL"}
                  onValueChange={(value) =>
                    setMetadata({
                      ...(metadata as PriceTriggerMetadata),
                      asset: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full h-14 rounded-2xl border-secondary bg-secondary/10 px-4 text-base">
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>

                  <SelectContent className="rounded-2xl">
                    <SelectGroup>
                      {SUPPORTED_ASSETS.map((id) => (
                        <SelectItem key={id} value={id} className="rounded-xl py-3">
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

        <SheetFooter className="mt-auto pt-10 px-2 pb-8">
          <Button
            className="w-full h-14 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl transition-all text-base font-bold"
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
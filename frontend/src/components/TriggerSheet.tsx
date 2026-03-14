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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TimerNodeMetadata } from "@/nodes/triggers/Timer"
import type { PriceTriggerMetadata } from "@/nodes/triggers/PriceTrigger"

const SUPPORTED_TRIGGERS = [
  { id: "timer-trigger", title: "Timer" },
  { id: "price-trigger", title: "Price Trigger" },
]
const SUPPORTED_ASSETS=["SOL","BTC","ETH"];
export const TriggerSheet = ({
  onSelect,
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetadata) => void
}) => {

  const [metadata, setMetadata] = useState<TimerNodeMetadata | PriceTriggerMetadata | any>({
    time : 3600
  })
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

    <div className="flex flex-col gap-4 py-4 px-4">
      <Select
        value={selectedTrigger}
        onValueChange={(value) =>
          setSelectedTrigger(value as NodeKind)
        }
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

      {selectedTrigger === "timer-trigger" && <div>
        <div className="pt-4">
          Number of seconds after which to run the timer
        </div>
        <Input value={metadata.time} onChange={(e) => setMetadata((metadata: any) => ({
          ...metadata,
          time: Number(e.target.value)
        }))}></Input>
      </div>}

      {selectedTrigger === "price-trigger" && <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label>Price</Label>
          <Input type="text" onChange={(e) => setMetadata((m: any) => ({
            ...m,
            price: Number(e.target.value)
          }))} />
        </div>
        <div className="grid gap-2">
          <Label>Asset</Label>
          <Select value={metadata.asset} onValueChange={(value) => setMetadata((metadata: any) => ({
            ...metadata,
            asset: value
          }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SUPPORTED_ASSETS.map((id) => <>
                  <SelectItem key={id} value={id}>{id}</SelectItem>
                </>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>}
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
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
import { type TimerNodeMetadata, type TradingMetadata, type PriceTriggerMetadata } from "@repo/common"

const SUPPORTED_ACTIONS = [{
  id: "hyperliquid",
  title: "Hyperliquid",
  description: "Place a trade on hyperliquid",
}, {
  id: "lighter",
  title: "Lighter",
  description: "Place a trade on lighter"
}, {
  id: "backpack",
  title: "Backpack",
  description: "Place a trade on Backpack"
}]

const SUPPORTED_ASSETS = ["SOL", "BTC", "ETH"];

export const ActionSheet = ({
  onSelect
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetadata) => void
}) => {

  const [metadata, setMetadata] = useState<TradingMetadata | any>({});
  const [open, setOpen] = useState(true)

  const [selectedAction, setSelectedAction] = useState(
    SUPPORTED_ACTIONS[0].id
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
  <SheetContent className="flex flex-col">

    <SheetHeader>
      <SheetTitle>Select action</SheetTitle>
      <SheetDescription>
        Select the type of action that you need
      </SheetDescription>
    </SheetHeader>

    <div className="flex flex-col gap-4 py-4 px-4">
      <Select
        value={selectedAction}
        onValueChange={(value) =>
          setSelectedAction(value)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a trigger" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {SUPPORTED_ACTIONS.map(({ id, title }) => (
              <>
                <SelectItem key={id} value={id}>{title}</SelectItem>
                {/* <SelectLabel>{description}</SelectLabel> */}
              </>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {(selectedAction === "hyperliquid" || selectedAction === "lighter" || selectedAction === "backpack") && <div className="flex flex-col">
        <div className="pt-4">
          Type
        </div>
        <Select value={metadata?.type} onValueChange={(value) => setMetadata((metadata: any) => ({
          ...metadata,
          type: value
        }))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"long"}>LONG</SelectItem>
              <SelectItem value={"short"}>SHORT</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="pt-4">
          Symbol
        </div>
        <Select value={metadata?.symbol} onValueChange={(value) => setMetadata((metadata: any) => ({
          ...metadata,
          symbol: value
        }))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an asset" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SUPPORTED_ASSETS.map((asset) => (
                <SelectItem key={asset} value={asset}>{asset}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="pt-4">
          Qty
        </div>
        <Input value={metadata?.qty} onChange={(e) => setMetadata((metadata: any) => ({
          ...metadata,
          qty: Number(e.target.value)
        }))}></Input>
      </div>}
    </div>

    <SheetFooter className="mt-auto">
      <Button
        className="w-full"
        onClick={() => {
          onSelect(selectedAction as NodeKind, metadata)
          setOpen(false)
        }}
      >
        Create Action
      </Button>
    </SheetFooter>

  </SheetContent>
</Sheet>
  )
}
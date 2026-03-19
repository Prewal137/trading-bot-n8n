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
import { type TradingMetadata } from "@repo/common"

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
  onSelect,
  onClose
}: {
  onSelect: (kind: NodeKind, metadata: NodeMetadata, credentials?: any) => void;
  onClose?: () => void;
}) => {

  const [metadata, setMetadata] = useState<TradingMetadata | any>({});
  const [credentials, setCredentials] = useState<{ API_KEY?: string }>({});
  const [open, setOpen] = useState(true)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose?.()
    }
  }

  const [selectedAction, setSelectedAction] = useState(
    SUPPORTED_ACTIONS[1].id // Default to Lighter for the screenshot match
  )

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
  <SheetContent className="flex flex-col">

    <SheetHeader>
      <SheetTitle className="text-2xl font-bold">Select action</SheetTitle>
      <SheetDescription className="text-sm text-muted-foreground">
        Choose an exchange and configure your trade parameters.
      </SheetDescription>
    </SheetHeader>

    <div className="flex flex-col gap-6 py-6 px-1">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">Action type</Label>
        <Select
          value={selectedAction}
          onValueChange={(value) => setSelectedAction(value)}
        >
          <SelectTrigger className="w-full h-12 rounded-xl border-secondary bg-secondary/20">
            <SelectValue placeholder="Select an action" />
          </SelectTrigger>

          <SelectContent className="rounded-xl">
            <SelectGroup>
              {SUPPORTED_ACTIONS.map(({ id, title }) => (
                <SelectItem key={id} value={id}>{title} Exchange</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {(selectedAction === "hyperliquid" || selectedAction === "lighter" || selectedAction === "backpack") && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground lowercase">type</Label>
              <Select 
                value={metadata?.type} 
                onValueChange={(value) => setMetadata((prev: any) => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-full h-12 rounded-xl border-secondary bg-secondary/20">
                  <SelectValue placeholder="Weather it is a long or a shor" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectGroup>
                    <SelectItem value={"long"}>LONG</SelectItem>
                    <SelectItem value={"short"}>SHORT</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Asset</Label>
              <Select 
                value={metadata?.symbol} 
                onValueChange={(value) => setMetadata((prev: any) => ({ ...prev, symbol: value }))}
              >
                <SelectTrigger className="w-full h-12 rounded-xl border-secondary bg-secondary/20">
                  <SelectValue placeholder="Which asset to long or short" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectGroup>
                    {SUPPORTED_ASSETS.map((asset) => (
                      <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Quantity</Label>
            <Input 
              placeholder="How much to long or short"
              className="h-12 rounded-xl border-secondary bg-secondary/20"
              value={metadata?.qty ?? ""} 
              onChange={(e) => setMetadata((prev: any) => ({ ...prev, qty: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground uppercase">API_KEY *</Label>
            <Input 
              type="password"
              placeholder="Enter API_KEY"
              className="h-12 rounded-xl border-secondary bg-secondary/20"
              value={credentials?.API_KEY ?? ""} 
              onChange={(e) => setCredentials({ API_KEY: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>

    <SheetFooter className="mt-auto pt-6">
      <Button
        className="w-full h-12 rounded-xl shadow-lg hover:shadow-xl transition-all"
        onClick={() => {
          onSelect(selectedAction as NodeKind, metadata, credentials)
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
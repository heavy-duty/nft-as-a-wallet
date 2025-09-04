import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'

export function AppModal({
  children,
  title,
  submit,
  submitDisabled,
  submitLabel,
  open,
  onOpenChange,
  disabled = false,
}: {
  children: React.ReactNode
  title: string
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        <DialogFooter>
          {submit ? (
            <Button type="submit" onClick={submit} disabled={submitDisabled}>
              {submitLabel || 'Save'}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

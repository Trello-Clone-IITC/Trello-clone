import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ListDto } from "@ronmordo/contracts";
import { emitUpdateList } from "../../socket";

type Props = {
  boardId: string;
  list: ListDto;
  trigger: React.ReactNode;
};

export function EditListDialogButton({ boardId, list, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(list.name);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      emitUpdateList(boardId, list.id, { name: name.trim() });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="top-1/2 sm:max-w-[420px] w-full">
        <DialogHeader>
          <DialogTitle>Edit list</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="List name" />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading || !name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

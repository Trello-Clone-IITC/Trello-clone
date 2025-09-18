import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emitCreateList } from "../../socket";

type Props = {
  boardId: string;
};

export function AddListDialogButton({ boardId }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      emitCreateList(boardId, name.trim());
      setOpen(false);
      setName("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full text-left text-[#b6c2cf]">
          + Add another list
        </Button>
      </DialogTrigger>
      <DialogContent className="top-1/2 sm:max-w-[420px] w-full">
        <DialogHeader>
          <DialogTitle>Create list</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="List name" />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading || !name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

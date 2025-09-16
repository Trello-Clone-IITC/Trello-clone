import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emitCreateCard } from "../../socket";

type Props = {
  boardId: string;
  listId: string;
  trigger?: React.ReactNode;
};

export function AddCardDialogButton({ boardId, listId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    try {
      setLoading(true);
      emitCreateCard(boardId, listId, title.trim());
      setOpen(false);
      setTitle("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" className="w-full text-left text-[#b6c2cf]">
            + Add a card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="top-1/2 sm:max-w-[420px] w-full">
        <DialogHeader>
          <DialogTitle>Create card</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Card title" />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading || !title.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

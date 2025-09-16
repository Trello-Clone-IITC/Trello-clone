import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CardDto } from "@ronmordo/contracts";
import { emitUpdateCard } from "../../socket";

type Props = {
  boardId: string;
  card: CardDto;
  trigger: React.ReactNode;
};

export function EditCardDialogButton({ boardId, card, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    try {
      setLoading(true);
      emitUpdateCard(boardId, card.id, { title: title.trim() });
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
          <DialogTitle>Edit card</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Card title" />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading || !title.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

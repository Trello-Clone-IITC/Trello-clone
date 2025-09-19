import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CardDto } from "@ronmordo/contracts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useAimanCard,
  useAimanCardAttachments,
  useAimanCardChecklists,
  useAimanCardComments,
  useAimanCardLabels,
  useAimanBoardLabels,
} from "../../hooks/useAimansBoard";
import { emitDeleteCard, emitUpdateCard } from "../../socket";
import {
  addLabelToCard,
  createAttachment,
  createCardComment,
  createChecklist,
  deleteAttachment,
  deleteCardComment,
  deleteChecklist,
  removeLabelFromCard,
} from "../../api";
import ChecklistSection from "./ChecklistSection";
// Socket-only flow as requested

type Props = {
  boardId: string;
  card: CardDto;
  trigger: React.ReactNode;
};

export function CardDetailsDialog({ boardId, card, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(card.startDate ? new Date(card.startDate) : null);
  const [dueDate, setDueDate] = useState<Date | null>(card.dueDate ? new Date(card.dueDate) : null);

  const [newComment, setNewComment] = useState("");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [selectedLabelId, setSelectedLabelId] = useState<string | undefined>();
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentFilename, setAttachmentFilename] = useState("");

  const queryClient = useQueryClient();

  // Fetch fresh card when opened; nested only when open for performance
  const { data: freshCard } = useAimanCard(boardId, card.listId, card.id, open);
  const { data: comments } = useAimanCardComments(boardId, card.listId, card.id, open);
  const { data: checklists } = useAimanCardChecklists(boardId, card.listId, card.id, open);
  const { data: labels } = useAimanCardLabels(boardId, card.listId, card.id, open);
  const { data: attachments } = useAimanCardAttachments(boardId, card.listId, card.id, open);
  const { data: boardLabels } = useAimanBoardLabels(boardId);

  // Keep fields in sync if socket updates land while open
  useEffect(() => {
    if (freshCard) {
      setTitle(freshCard.title);
      setDescription(freshCard.description ?? "");
      setStartDate(freshCard.startDate ? new Date(freshCard.startDate) : null);
      setDueDate(freshCard.dueDate ? new Date(freshCard.dueDate) : null);
    }
  }, [freshCard]);

  const stats = useMemo(() => ({
    comments: comments?.length ?? 0,
    checklists: checklists?.length ?? 0,
    labels: labels?.length ?? 0,
    attachments: attachments?.length ?? 0,
  }), [comments, checklists, labels, attachments]);

  const save = async () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    if (!trimmedTitle) return;
    try {
      setSaving(true);
      // Emit update via Socket.IO; caches will refresh from realtime event
      emitUpdateCard(boardId, card.id, {
        title: trimmedTitle,
        description: trimmedDesc || undefined,
        startDate: startDate ? startDate.toISOString() : null,
        dueDate: dueDate ? dueDate.toISOString() : null,
      });
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    emitDeleteCard(boardId, card.id, card.listId);
    setOpen(false);
  };

  // Mutations: comments
  const addCommentMut = useMutation({
    mutationFn: (text: string) => createCardComment(card.id, text),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["aiman", "card", "comments", boardId, card.listId, card.id] });
    },
  });

  const deleteCommentMut = useMutation({
    mutationFn: (commentId: string) => deleteCardComment(card.id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiman", "card", "comments", boardId, card.listId, card.id] });
    },
  });

  // Mutations: checklists
  const addChecklistMut = useMutation({
    mutationFn: (title: string) => createChecklist(card.id, title, (checklists?.length ?? 0) + 1),
    onSuccess: () => {
      setNewChecklistTitle("");
      queryClient.invalidateQueries({ queryKey: ["aiman", "card", "checklists", boardId, card.listId, card.id] });
    },
  });

  const deleteChecklistMut = useMutation({
    mutationFn: (checklistId: string) => deleteChecklist(card.id, checklistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiman", "card", "checklists", boardId, card.listId, card.id] });
    },
  });

  // Mutations: labels on card
  const addLabelMut = useMutation({
    mutationFn: (labelId: string) => addLabelToCard(card.id, labelId),
    onSuccess: () => {
      setSelectedLabelId(undefined);
      queryClient.invalidateQueries({ queryKey: ["aiman", "card", "labels", boardId, card.listId, card.id] });
    },
  });

  const removeLabelMut = useMutation({
    mutationFn: (labelId: string) => removeLabelFromCard(card.id, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiman", "card", "labels", boardId, card.listId, card.id] });
    },
  });

  // Mutations: attachments
  const addAttachmentMut = useMutation({
    mutationFn: (payload: { url: string; filename: string }) =>
      createAttachment(card.id, { url: payload.url, filename: payload.filename }),
    onSuccess: () => {
      setAttachmentUrl("");
      setAttachmentFilename("");
      queryClient.invalidateQueries({ queryKey: ["aiman", "card", "attachments", boardId, card.listId, card.id] });
    },
  });

  const deleteAttachmentMut = useMutation({
    mutationFn: (attachmentId: string) => deleteAttachment(card.id, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiman", "card", "attachments", boardId, card.listId, card.id] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="top-1/2 sm:max-w-[640px] w-full">
        <DialogHeader>
          <DialogTitle>Edit card</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Card title" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-[#b6c2cf]">
            <div>Comments: {stats.comments}</div>
            <div>Checklists: {stats.checklists}</div>
            <div>Labels: {stats.labels}</div>
            <div>Attachments: {stats.attachments}</div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Start date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    {startDate ? startDate.toDateString() : "Set start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar mode="single" selected={startDate ?? undefined} onSelect={(d) => setStartDate(d ?? null)} />
                </PopoverContent>
              </Popover>
              {startDate && (
                <Button variant="ghost" size="sm" onClick={() => setStartDate(null)} className="w-fit">
                  Clear start date
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Due date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    {dueDate ? dueDate.toDateString() : "Set due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar mode="single" selected={dueDate ?? undefined} onSelect={(d) => setDueDate(d ?? null)} />
                </PopoverContent>
              </Popover>
              {dueDate && (
                <Button variant="ghost" size="sm" onClick={() => setDueDate(null)} className="w-fit">
                  Clear due date
                </Button>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Comments</label>
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment"
                  className="w-64"
                />
                <Button
                  onClick={() => newComment.trim() && addCommentMut.mutate(newComment.trim())}
                  disabled={addCommentMut.isPending || !newComment.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {comments?.map((c) => (
                <div key={c.id} className="flex items-center justify-between border border-[#2d363c] rounded p-2">
                  <div className="text-sm text-[#b6c2cf]">{c.text}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400"
                    onClick={() => deleteCommentMut.mutate(c.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Checklists</label>
              <div className="flex gap-2">
                <Input
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  placeholder="Checklist title"
                  className="w-64"
                />
                <Button
                  onClick={() => newChecklistTitle.trim() && addChecklistMut.mutate(newChecklistTitle.trim())}
                  disabled={addChecklistMut.isPending || !newChecklistTitle.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {checklists?.map((cl) => (
                <ChecklistSection
                  key={cl.id}
                  boardId={boardId}
                  listId={card.listId}
                  cardId={card.id}
                  checklist={cl}
                  enabled={open}
                  onDeleteChecklist={(id) => deleteChecklistMut.mutate(id)}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Labels</label>
              <div className="flex items-center gap-2">
                <Select value={selectedLabelId} onValueChange={setSelectedLabelId}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Pick a label" />
                  </SelectTrigger>
                  <SelectContent>
                    {boardLabels
                      ?.filter((bl) => !labels?.some((l) => l.id === bl.id))
                      .map((bl) => (
                        <SelectItem key={bl.id} value={bl.id}>
                          {bl.name ?? bl.color}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => selectedLabelId && addLabelMut.mutate(selectedLabelId)}
                  disabled={!selectedLabelId || addLabelMut.isPending}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {labels?.map((l) => (
                <div key={l.id} className="flex items-center gap-2 border border-[#2d363c] rounded px-2 py-1">
                  <span className="text-xs text-[#b6c2cf]">{l.name ?? l.color}</span>
                  <Button size="sm" variant="ghost" className="text-red-400" onClick={() => removeLabelMut.mutate(l.id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Attachments</label>
              <div className="flex items-center gap-2">
                <Input
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="Attachment URL"
                  className="w-60"
                />
                <Input
                  value={attachmentFilename}
                  onChange={(e) => setAttachmentFilename(e.target.value)}
                  placeholder="Filename"
                  className="w-48"
                />
                <Button
                  onClick={() =>
                    attachmentUrl.trim() && attachmentFilename.trim() &&
                    addAttachmentMut.mutate({ url: attachmentUrl.trim(), filename: attachmentFilename.trim() })
                  }
                  disabled={addAttachmentMut.isPending || !attachmentUrl.trim() || !attachmentFilename.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {attachments?.map((a) => (
                <div key={a.id} className="flex items-center justify-between border border-[#2d363c] rounded p-2">
                  <a href={a.url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 underline">
                    {a.filename}
                  </a>
                  <Button size="sm" variant="ghost" className="text-red-400" onClick={() => deleteAttachmentMut.mutate(a.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <Button variant="destructive" onClick={remove} disabled={saving}>
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
                Close
              </Button>
              <Button onClick={save} disabled={saving || !title.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

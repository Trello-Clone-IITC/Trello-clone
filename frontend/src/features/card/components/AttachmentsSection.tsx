import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { AttachmentPopover } from "./AttachmentPopover";

type Attachment = {
  id: string;
  url: string;
  filename?: string | null;
  displayText?: string | null;
};

type AttachmentsSectionProps = {
  attachments?: Attachment[] | null;
  onEdit: (
    att: Attachment,
    payload: { url: string; displayText?: string }
  ) => void;
  onCommentPrefill: (text: string) => void;
  onRemove: (id: string) => void;
};

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  attachments,
  onEdit,
  onCommentPrefill,
  onRemove,
}) => {
  return (
    <section className="space-y-2 mt-3">
      {attachments && attachments.length > 0 && (
        <div className="text-sm font-medium text-gray-400">Attachments</div>
      )}
      <div className="space-y-2">
        {(attachments ?? []).map((att) => (
          <div
            key={att.id}
            className="flex items-center justify-between bg-[#1e2022] rounded px-3 py-2"
          >
            <a
              href={att.url}
              target="_blank"
              rel="noreferrer"
              className="text-[#85b8ff] text-sm truncate max-w-[75%]"
              title={att.url}
            >
              {att.displayText || att.filename || att.url}
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-7 h-7 rounded bg-[#2b2c2f] hover:bg-[#32373c] flex items-center justify-center"
                  aria-label="Attachment actions"
                >
                  <Ellipsis className="w-4 h-4 text-[#bfc1c4]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 bg-[#2b2c2f] border-[#3c3d40] text-white"
              >
                <div className="p-1">
                  <AttachmentPopover
                    initialUrl={att.url}
                    initialDisplayText={
                      att.displayText || att.filename || undefined
                    }
                    onInsert={({ url, displayText }) =>
                      onEdit(att, { url, displayText })
                    }
                    onClose={() => {}}
                  >
                    <button className="w-full text-left px-2 py-1 text-sm hover:bg-[#3a3f45] rounded">
                      Edit
                    </button>
                  </AttachmentPopover>
                  <button
                    className="w-full text-left px-2 py-1 text-sm hover:bg-[#3a3f45] rounded"
                    onClick={() =>
                      onCommentPrefill(
                        att.displayText || att.filename || att.url
                      )
                    }
                  >
                    Comment
                  </button>
                  <button
                    className="w-full text-left px-2 py-1 text-sm text-red-400 hover:bg-[#3a3f45] rounded"
                    onClick={() => onRemove(att.id)}
                  >
                    Remove
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AttachmentsSection;

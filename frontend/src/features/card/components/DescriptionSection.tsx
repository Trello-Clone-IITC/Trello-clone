import React from "react";

type DescriptionSectionProps = {
  description?: string | null;
  isEditing: boolean;
  draft: string;
  onStartEdit: () => void;
  onChangeDraft: (v: string) => void;
  onSave: () => Promise<void> | void;
  onCancel: () => void;
};

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
  isEditing,
  draft,
  onStartEdit,
  onChangeDraft,
  onSave,
  onCancel,
}) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#bfc1c4]">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11H20C20.5523 11 21 10.5523 21 10C21 9.44772 20.5523 9 20 9H4ZM3 14C3 13.4477 3.44772 13 4 13H12C12.5523 13 13 13.4477 13 14C13 14.5523 12.5523 15 12 15H4C3.44772 15 3 14.5523 3 14Z"
            clipRule="evenodd"
          />
        </svg>
        Description
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={draft}
            onChange={(e) => onChangeDraft(e.target.value)}
            className="w-full rounded-md bg-transparent p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            rows={6}
            autoFocus
          />
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={onSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-[#b1bcca] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              className="ml-auto text-xs text-gray-400 bg-[#2c3339] px-2 py-1 rounded"
            >
              Formatting help
            </button>
          </div>
        </div>
      ) : (
        <div
          className="rounded-md bg-transparent p-3 text-sm text-[#bfc1c4] cursor-text"
          onClick={onStartEdit}
        >
          {description || "Add a more detailed description..."}
        </div>
      )}
    </section>
  );
};

export default DescriptionSection;

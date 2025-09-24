import React from "react";
import { X } from "lucide-react";

type AddChecklistFormProps = {
  title: string;
  onTitleChange: (value: string) => void;
  onAdd: () => void;
  onClose?: () => void;
};

export const AddChecklistForm: React.FC<AddChecklistFormProps> = ({
  title,
  onTitleChange,
  onAdd,
  onClose,
}) => {
  return (
    <div className="w-80 p-0 bg-[#2b2c2f] rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-center p-4 relative">
        <h3 className="text-[#a9abaf] font-medium text-sm">Add checklist</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 w-6 h-6 flex items-center justify-center hover:bg-gray-600 transition-colors rounded"
          >
            <X className="w-4 h-4 text-[#a9abaf]" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="pt-0 px-3 pb-3">
        {/* Title Input */}
        <div className="font-bold mt-3 mb-1 text-xs leading-4 flex flex-col">
          <label className="block text-sm font-medium text-[#a9abaf] mb-2">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full h-[41px] py-1 px-3 rounded-[3px] border-1 border-[#3c3d40] bg-[#242528] placeholder:text-[#96999e] text-[#bfc1c4] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#85b8ff] focus-visible:border-1"
            placeholder="Checklist"
            autoFocus
          />
        </div>

        {/* Copy Items Dropdown */}
        <div>
          <label className="block text-sm font-bold text-[#bfc1c4] mb-0.5 mt-3">
            Copy items from...
          </label>
          <select className="w-full h-[48px] py-1 px-[6px] rounded-[3px] border-1 border-[#3c3d40] bg-[#242528] placeholder:text-[#bfc1c4] text-[#bfc1c4] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#85b8ff] focus-visible:border-1">
            <option value="">(none)</option>
          </select>
        </div>

        {/* Add Button */}
        <div className="flex justify-start">
          <button
            onClick={onAdd}
            className="bg-[#669df1] hover:bg-[#8fb8f6] text-[#a9abaf] rounded text-sm font-medium  mt-3.5 px-6 py-1.5"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChecklistForm;

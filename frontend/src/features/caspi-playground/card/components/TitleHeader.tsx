import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const TitleHeader = ({ title }: { title: string }) => (
  <DialogHeader className="px-6 pt-6 pb-4">
    <div className="flex items-center gap-3">
      <div className="size-4 rounded-full border-2 border-gray-400" />
      <div className="min-w-0 flex-1">
        <DialogTitle className="text-xl font-semibold text-white leading-tight">
          {title}
        </DialogTitle>
      </div>
    </div>
  </DialogHeader>
);


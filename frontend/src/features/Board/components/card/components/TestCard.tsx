import { useState } from "react";
import CardModal from "./CardModal";

export default function TestCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-[#22272b] border border-gray-600 rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <h3 className="font-medium text-white mb-2">
          Full Authentication (Login + Register)
        </h3>
        <div className="flex gap-2 mb-2">
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
            Easy
          </span>
          <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded">
            Must Have
          </span>
        </div>
        <p className="text-sm text-gray-400">Click to open modal</p>
      </div>

      <CardModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Full Authentication (Login + Register)"
      />
    </>
  );
}

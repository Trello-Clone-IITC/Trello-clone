import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { CreateBoardPopover } from "@/features/final-final/board/components/CreateBoardPopover";

interface CreateNewBoardProps {
  className?: string;
  onClick?: () => void;
}

export const CreateNewBoard = ({ className }: CreateNewBoardProps) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <CreateBoardPopover>
      <div
        className={cn(
          "group relative overflow-hidden p-2 gap-0 cursor-pointer transition-all duration-200 w-full max-w-[215px] rounded-lg min-h-[108px] flex items-center justify-center shadow-[0px_1px_1px_#091e4240,0px_0px_1px_#091e424f]",
          isLight
            ? "bg-[#f0f1f2] hover:bg-[#dddedd]"
            : "bg-[#2c2c2e] hover:bg-[#37373a]",
          className
        )}
      >
        <span
          className={cn(
            "text-[14px] font-normal  text-center ",
            isLight
              ? "text-[#75777b] group-hover:text-[#6d6d70]"
              : "text-[#919397] group-hover:text-[#a5a7a9]"
          )}
        >
          Create new board
        </span>
      </div>
    </CreateBoardPopover>
  );
};

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { CreateBoardPopover } from "@/features/board/components/CreateBoardPopover";

interface CreateNewBoardProps {
  className?: string;
  onClick?: () => void;
}

export const CreateNewBoard = ({ className, onClick }: CreateNewBoardProps) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <CreateBoardPopover>
      <Button
        onClick={onClick}
        className={cn(
          "min-h-[108px] p-2 rounded-lg border-0 cursor-pointer text-[14px] font-normal",
          isLight
            ? "bg-[#f0f1f2] hover:bg-[#dddedd] text-[#75777b] hover:text-[#6d6d70]"
            : "bg-[#2c2c2e] hover:bg-[#37373a] text-[#919397] hover:text-[#a5a7a9]",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span>Create new board</span>
        </div>
      </Button>
    </CreateBoardPopover>
  );
};

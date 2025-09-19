import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";
import starredIcon from "../../../assets/starred-icon.svg";

interface BoardCardProps {
  id: string;
  title: string;
  backgroundImage?: string;
  className?: string;
  isStarred?: boolean;
}

export const BoardCard = ({
  id,
  title,
  backgroundImage,
  className,
  isStarred = false,
}: BoardCardProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isLight = theme === "light";

  const handleBoardClick = () => {
    navigate(`/b/${id}`);
  };

  // Generate a random image if none provided
  const imageUrl =
    backgroundImage ||
    `https://picsum.photos/480/320?random=${Math.floor(Math.random() * 1000)}`;
  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-0 gap-0 cursor-pointer transition-all duration-200 w-full max-w-[215px] shadow-[0px_1px_1px_#091e4240,0px_0px_1px_#091e424f]",
        className
      )}
      onClick={handleBoardClick}
    >
      {/* Background Image Container */}
      <div
        className={`relative h-20 w-full bg-cover bg-center bg-no-repeat`}
        style={{ backgroundImage: `url("${imageUrl}")` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200" />

        {/* Starred Button - Only show if isStarred is true */}
        {isStarred && (
          <Button
            type="button"
            size="sm"
            className={`absolute top-2 right-2 w-6 h-6 rounded-[3px] p-0 transition-all duration-200 hover:scale-105 ${
              isLight
                ? "bg-[#f0f1f2] hover:bg-[#dddedd]"
                : "bg-[#2c2c2e] hover:bg-[#37373a]"
            }`}
            title="Click to unstar board. It will be removed from your starred list."
          >
            <img
              src={starredIcon}
              alt="Starred Icon"
              className="w-4 h-4 brightness-0 invert"
            />
          </Button>
        )}
      </div>

      {/* Title Bar */}
      <div className="px-2 py-1.5 bg-[#1f1f21]">
        <span className="font-normal text-[#b3b5b8] text-[14px]">{title}</span>
      </div>
    </Card>
  );
};

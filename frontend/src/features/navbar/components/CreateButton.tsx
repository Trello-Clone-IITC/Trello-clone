import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";

export default function CreateButton() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`flex rounded items-center gap-2 px-3 py-2 h-8 text-sm font-medium border-0 cursor-pointer ${
            isLight
              ? "bg-[#0c66e4] text-white hover:bg-[#0055cc] "
              : "bg-[#579dff] text-[#1d2125] hover:bg-[#85b8ff]"
          }`}
        >
          <span>Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={`w-72 border-none ${
          isLight ? "bg-white text-[#292a2e]" : "bg-[#2b2c2f] text-[#cecfd2]"
        }`}
      >
        <ul className="p-3">
          <li className="min-w-full -mx-4 rounded-none">
            <DropdownMenuItem
              className={`flex flex-col w-full items-start  p-2 rounded-none cursor-pointer ${
                isLight
                  ? "hover:bg-[#f0f1f2] focus-visible:bg-[#f0f1f2]"
                  : "hover:bg-[#37383b] focus-visible:bg-[#37383b]"
              }`}
            >
              <span className={"flex items-center justify-start  w-full "}>
                <span className="px-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM5 6C5 5.44772 5.44772 5 6 5H10C10.5523 5 11 5.44772 11 6V16C11 16.5523 10.5523 17 10 17H6C5.44772 17 5 16.5523 5 16V6ZM14 5C13.4477 5 13 5.44772 13 6V12C13 12.5523 13.4477 13 14 13H18C18.5523 13 19 12.5523 19 12V6C19 5.44772 18.5523 5 18 5H14Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Create board
              </span>
              <div className="flex-1">
                <div className="text-xs  mt-1 opacity-70">
                  A board is made up of cards ordered on lists. Use it to manage
                  projects, track information, or organize anything.
                </div>
              </div>
            </DropdownMenuItem>
          </li>
          <li className="min-w-full -mx-4 ">
            <DropdownMenuItem
              className={`flex flex-col items-start  p-2 rounded-none cursor-pointer ${
                isLight
                  ? "hover:bg-[#f0f1f2] focus-visible:bg-[#f0f1f2]"
                  : "hover:bg-[#37383b] focus-visible:bg-[#37383b]"
              }`}
            >
              <span className="flex items-start justify-start w-full">
                <span className="px-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="">
                    <path
                      d="M7 3C7 2.44772 7.44772 2 8 2H9C9.55228 2 10 2.44772 10 3C10 3.55228 9.55228 4 9 4H8C7.44772 4 7 3.55228 7 3Z"
                      fill="currentColor"
                    />
                    <path
                      d="M3 7C2.44772 7 2 7.44772 2 8V9C2 9.55228 2.44772 10 3 10C3.55228 10 4 9.55228 4 9V8C4 7.44772 3.55228 7 3 7Z"
                      fill="currentColor"
                    />
                    <path
                      d="M2 12C2 11.4477 2.44772 11 3 11C3.55228 11 4 11.4477 4 12V13C4 13.5523 3.55228 14 3 14C2.44772 14 2 13.5523 2 13V12Z"
                      fill="currentColor"
                    />
                    <path
                      d="M2 16C2 15.4477 2.44772 15 3 15C3.55228 15 4 15.4477 4 16V19C2.89543 19 2 18.1046 2 17V16Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 2C11.4477 2 11 2.44772 11 3C11 3.55228 11.4477 4 12 4H13C13.5523 4 14 3.55228 14 3C14 2.44772 13.5523 2 13 2H12Z"
                      fill="currentColor"
                    />
                    <path
                      d="M15 3C15 2.44772 15.4477 2 16 2H17C18.1046 2 19 2.89543 19 4H16C15.4477 4 15 3.55228 15 3Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4 2C2.89543 2 2 2.89543 2 4V5C2 5.55228 2.44772 6 3 6C3.55228 6 4 5.55228 4 5V4H5C5.55228 4 6 3.55228 6 3C6 2.44772 5.55228 2 5 2H4Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7 5C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H7ZM8 7C7.44772 7 7 7.44771 7 8V17C7 17.5523 7.44772 18 8 18H11C11.5523 18 12 17.5523 12 17V8C12 7.44772 11.5523 7 11 7H8ZM14 8C14 7.44772 14.4477 7 15 7H18C18.5523 7 19 7.44772 19 8V13C19 13.5523 18.5523 14 18 14H15C14.4477 14 14 13.5523 14 13V8Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Start with a template
              </span>
              <div className="flex-1 text-left justify-start">
                <div className="text-xs  mt-1 opacity-70">
                  Get started faster with a board template.
                </div>
              </div>
            </DropdownMenuItem>
          </li>
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

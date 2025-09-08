import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Users, SquareArrowOutUpRight } from "lucide-react";

// Trello Theme Icons
const LightThemeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="https://trello.com/assets/a3a279edd7e5baaef4f7.svg"
    alt="Light theme"
    width="64"
    height="48"
    className={className}
  />
);

const DarkThemeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="https://trello.com/assets/cb4097b01b57e5d91727.svg"
    alt="Dark theme"
    width="64"
    height="48"
    className={className}
  />
);

const SystemThemeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="https://trello.com/assets/37c3bf748ee7dbf33e66.svg"
    alt="System theme"
    width="64"
    height="48"
    className={className}
  />
);

import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { useMe } from "@/features/auth/hooks/useMe";
import { useContext, useState } from "react";
import { ThemeProviderContext } from "@/context/ThemeContext";

export default function UserMenu() {
  const signOut = useSignOut();
  const { data: user } = useMe();
  const { theme, setTheme } = useContext(ThemeProviderContext);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  if (!user) {
    return (
      <div>
        <span>Please refresh the page</span>
      </div>
    );
  }

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const fullName = user.email.split("@")[0];
  const email = user.email;
  const initials = getInitials(fullName);

  return (
    <>
      <style>
        {`
          input[type="radio"] {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            width: 14px;
            height: 14px;
            min-width: 14px;
            min-height: 14px;
            border: 2px solid #9fadbc;
            border-radius: 50%;
            background-color: transparent;
            cursor: pointer;
            position: relative;
            flex-shrink: 0;
          }
          
          input[type="radio"]:checked {
            background-color: #579dff;
            border-color: #579dff;
          }
          
          
          input[type="radio"]:focus-visible {
            outline: 2px solid #85b8ff;
            outline-offset: 2px;
          }
          
          input[type="radio"]:active {
            background-color: #85b8ff;
            border-color: #85b8ff;
          }
          
          /* Disable hover opening for submenu */
          [data-radix-submenu-trigger] {
            pointer-events: auto !important;
          }
          
          [data-radix-submenu-trigger]:hover {
            pointer-events: auto !important;
          }
          
          /* Position submenu to the left with 6px gap */
          [data-radix-submenu-content] {
            transform: translateX(-6px) !important;
          }
          
          /* Prevent submenu from opening on hover */
          [data-radix-submenu-trigger][data-state="closed"]:hover {
            pointer-events: auto !important;
          }
          
          /* Blue border using ::after pseudo-element to prevent layout shift */
          .theme-option-light::after,
          .theme-option-dark::after,
          .theme-option-system::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 2px;
            background-color: #579dff;
            opacity: 0;
            transition: opacity 0.2s ease;
          }
          
          .theme-option-light.active::after,
          .theme-option-dark.active::after,
          .theme-option-system.active::after {
            opacity: 1;
          }
        `}
      </style>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-8 w-8 rounded-full hover:bg-[#333c43]"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={`${fullName}'s avatar`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[304px] p-0"
          style={{
            backgroundColor: "#282e33",
            border: "1px solid #39424a",
          }}
        >
          <div className="p-3 w-full">
            {/* ACCOUNT Section */}
            <div className="w-full px-0 py-2">
              <h2
                className="text-xs font-semibold uppercase tracking-wide mb-2 px-3 w-full"
                style={{ color: "#b6c2cf" }}
              >
                ACCOUNT
              </h2>
              <div className="flex items-center gap-3 mb-3 px-3 w-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={`${fullName}'s avatar`}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div
                    className="text-sm font-normal"
                    style={{ color: "#b6c2cf" }}
                  >
                    {fullName}
                  </div>
                  <div
                    className="text-xs font-light"
                    style={{ color: "#b6c2cf" }}
                  >
                    {email}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div
                  className="flex items-center justify-between px-5 py-1.5 cursor-pointer hover:bg-[#323940] -mx-3"
                  style={{ color: "#b6c2cf" }}
                >
                  <span className="text-sm font-normal w-full">
                    Switch accounts
                  </span>
                </div>
                <div
                  className="flex items-center justify-between px-5 py-1.5 cursor-pointer hover:bg-[#323940] -mx-3"
                  style={{ color: "#b6c2cf" }}
                >
                  <span className="text-sm font-normal">Manage account</span>
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            <Separator style={{ backgroundColor: "#3d474f" }} />

            {/* TRELLO Section */}
            <div className="w-full px-3 py-2 rounded-none">
              <h2
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: "#b6c2cf" }}
              >
                TRELLO
              </h2>
            </div>

            {/* TRELLO Links List */}
            <ul className="-mx-3">
              {/* Profile and visibility */}
              <li
                className="w-full px-5 py-1.5 cursor-pointer hover:bg-[#323940] list-none"
                style={{ color: "#b6c2cf" }}
              >
                <span className="text-sm font-normal">
                  Profile and visibility
                </span>
              </li>

              {/* Activity */}
              <li
                className="w-full px-5 py-1.5 cursor-pointer hover:bg-[#323940] list-none"
                style={{ color: "#b6c2cf" }}
              >
                <span className="text-sm font-normal">Activity</span>
              </li>

              {/* Cards */}
              <li
                className="w-full px-5 py-1.5 cursor-pointer hover:bg-[#323940] list-none"
                style={{ color: "#b6c2cf" }}
              >
                <span className="text-sm font-normal">Cards</span>
              </li>

              {/* Settings */}
              <li
                className="w-full px-5 py-1.5 cursor-pointer hover:bg-[#323940] list-none"
                style={{ color: "#b6c2cf" }}
              >
                <span className="text-sm font-normal">Settings</span>
              </li>

              {/* Theme */}
              <li className="w-full list-none">
                <DropdownMenuSub
                  open={isThemeOpen}
                  onOpenChange={setIsThemeOpen}
                >
                  <DropdownMenuSubTrigger
                    className="w-full flex items-center justify-between px-5 py-1.5 cursor-pointer text-sm font-normal rounded-none"
                    style={{
                      color: isThemeOpen ? "#579dff" : "#b6c2cf",
                      backgroundColor: isThemeOpen ? "#1c2b41" : "transparent",
                      borderLeft: isThemeOpen ? "3px solid #579dff" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isThemeOpen) {
                        e.currentTarget.style.backgroundColor = "#323940";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isThemeOpen) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                    onPointerEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onPointerMove={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent
                    className="px-0 py-3 flex flex-col items-stretch mr-[18px]"
                    style={{
                      backgroundColor: "#282e33",
                      border: "1px solid #39424a",
                    }}
                  >
                    <div
                      className={`flex items-center px-3 py-2 cursor-pointer relative theme-option-light ${
                        theme === "light" ? "active" : ""
                      }`}
                      style={{
                        color: theme === "light" ? "#579dff" : "#b6c2cf",
                        backgroundColor:
                          theme === "light" ? "#1c2b41" : "transparent",
                      }}
                      onClick={() => setTheme("light")}
                      onMouseEnter={(e) => {
                        if (theme !== "light") {
                          e.currentTarget.style.backgroundColor = "#455059";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (theme !== "light") {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={theme === "light"}
                        onChange={() => setTheme("light")}
                        className="mr-2"
                      />
                      <LightThemeIcon className="mr-[13px]" />
                      <span className="text-sm font-medium whitespace-nowrap">
                        Light
                      </span>
                    </div>
                    <div
                      className={`flex items-center px-3 py-2 cursor-pointer relative theme-option-dark ${
                        theme === "dark" ? "active" : ""
                      }`}
                      style={{
                        color: theme === "dark" ? "#579dff" : "#b6c2cf",
                        backgroundColor:
                          theme === "dark" ? "#1c2b41" : "transparent",
                      }}
                      onClick={() => setTheme("dark")}
                      onMouseEnter={(e) => {
                        if (theme !== "dark") {
                          e.currentTarget.style.backgroundColor = "#455059";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (theme !== "dark") {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={theme === "dark"}
                        onChange={() => setTheme("dark")}
                        className="mr-2"
                      />
                      <DarkThemeIcon className="mr-[13px]" />
                      <span className="text-sm font-medium whitespace-nowrap">
                        Dark
                      </span>
                    </div>
                    <div
                      className={`flex items-center px-3 py-2 cursor-pointer relative theme-option-system ${
                        theme === "system" ? "active" : ""
                      }`}
                      style={{
                        color: theme === "system" ? "#579dff" : "#b6c2cf",
                        backgroundColor:
                          theme === "system" ? "#1c2b41" : "transparent",
                      }}
                      onClick={() => setTheme("system")}
                      onMouseEnter={(e) => {
                        if (theme !== "system") {
                          e.currentTarget.style.backgroundColor = "#455059";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (theme !== "system") {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value="system"
                        checked={theme === "system"}
                        onChange={() => setTheme("system")}
                        className="mr-2"
                      />
                      <SystemThemeIcon className="mr-[13px]" />
                      <span className="text-sm font-medium whitespace-nowrap">
                        Match System
                      </span>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </li>
            </ul>

            <Separator
              style={{ backgroundColor: "#3d474f", margin: "8px 12px" }}
            />

            {/* Create Workspace */}
            <div
              className="w-full px-5 py-1.5 cursor-pointer hover:bg-[#323940] flex items-center gap-2 -mx-3"
              style={{
                color: "#b6c2cf",
                marginLeft: "-12px",
                marginRight: "-12px",
                width: "calc(100% + 24px)",
              }}
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-normal">Create Workspace</span>
            </div>

            <Separator
              style={{ backgroundColor: "#3d474f", margin: "8px 12px" }}
            />

            {/* Help and Shortcuts */}
            <div className="space-y-1 -mx-3">
              <div
                className="w-full px-5 py-1.5 cursor-pointer hover:bg-[#323940]"
                style={{ color: "#b6c2cf" }}
              >
                <span className="text-sm font-normal">Help</span>
              </div>
              <div
                className="w-full px-5 py-1.5 cursor-pointer hover:bg-[#323940]"
                style={{ color: "#b6c2cf" }}
              >
                <span className="text-sm font-normal">Shortcuts</span>
              </div>
            </div>

            <Separator
              style={{ backgroundColor: "#3d474f", margin: "8px 12px" }}
            />

            {/* Log Out */}
            <div
              onClick={signOut}
              className="w-full px-5 py-1.5 cursor-pointer hover:bg-[#323940] -mx-3"
              style={{
                color: "#b6c2cf",
                marginLeft: "-12px",
                marginRight: "-12px",
                width: "calc(100% + 24px)",
              }}
            >
              <span className="text-sm font-normal">Log Out</span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

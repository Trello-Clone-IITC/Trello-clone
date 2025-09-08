import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Users, SquareArrowOutUpRight, ChevronRight } from "lucide-react";

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

export default function UserMenuPopover() {
  const signOut = useSignOut();
  const { data: user } = useMe();
  const { theme, setTheme } = useContext(ThemeProviderContext);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const isLight = theme === "light";

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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-8 w-8 rounded-full hover:bg-[#333c43]"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={`${fullName}'s avatar`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-[304px] p-0"
          style={{
            backgroundColor: isLight ? "#ffffff" : "#282e33",
            border: isLight ? "1px solid #dcdfe4" : "1px solid #39424a",
          }}
        >
          <div className="p-3 w-full">
            {/* ACCOUNT Section */}
            <div className="w-full p-0">
              <h2
                className="text-[11px] font-bold uppercase tracking-wide px-2 w-full leading-tight mt-4 mx-0 mb-2"
                style={{ color: isLight ? "#626f86" : "#8390a0" }}
              >
                ACCOUNT
              </h2>
              <div className="flex items-center gap-3 p-2 w-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={`${fullName}'s avatar`}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div
                    className="text-sm font-normal mt-[2px]"
                    style={{ color: isLight ? "#172b4d" : "#b6c2cf" }}
                  >
                    {fullName}
                  </div>
                  <div
                    className="text-xs font-light"
                    style={{ color: isLight ? "#172b4d" : "#b6c2cf" }}
                  >
                    {email}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div
                  className="flex items-center justify-between px-5 py-1.5 cursor-pointer -mx-3"
                  style={{
                    color: isLight ? "#172b4d" : "#b6c2cf",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isLight
                      ? "#dcdfe4"
                      : "#323940";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span className="text-sm font-normal w-full">
                    Switch accounts
                  </span>
                </div>
                <div
                  className="flex items-center justify-between px-5 py-1.5 cursor-pointer -mx-3"
                  style={{
                    color: isLight ? "#172b4d" : "#b6c2cf",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isLight
                      ? "#dcdfe4"
                      : "#323940";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span className="text-sm font-normal">Manage account</span>
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            <Separator
              style={{
                backgroundColor: isLight ? "#dcdfe4" : "#3d474f",
                margin: "8px 0",
              }}
            />

            {/* TRELLO Section */}
            <div className="w-full p-0 rounded-none">
              <h2
                className="text-[11px] font-bold uppercase tracking-wide mt-4 mx-0 mb-2 px-2 leading-tight"
                style={{ color: isLight ? "#626f86" : "#8390a0" }}
              >
                TRELLO
              </h2>
            </div>

            {/* TRELLO Links List */}
            <ul className="-mx-3">
              {/* Profile and visibility */}
              <li
                className="w-full px-5 py-1.5 cursor-pointer list-none"
                style={{
                  color: isLight ? "#172b4d" : "#b6c2cf",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isLight
                    ? "#dcdfe4"
                    : "#323940";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="text-sm font-normal">
                  Profile and visibility
                </span>
              </li>

              {/* Activity */}
              <li
                className="w-full px-5 py-1.5 cursor-pointer list-none"
                style={{
                  color: isLight ? "#172b4d" : "#b6c2cf",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isLight
                    ? "#dcdfe4"
                    : "#323940";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="text-sm font-normal">Activity</span>
              </li>

              {/* Cards */}
              <li
                className="w-full px-5 py-1.5 cursor-pointer list-none"
                style={{
                  color: isLight ? "#172b4d" : "#b6c2cf",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isLight
                    ? "#dcdfe4"
                    : "#323940";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="text-sm font-normal">Cards</span>
              </li>

              {/* Settings */}
              <li
                className="w-full px-5 py-1.5 cursor-pointer list-none"
                style={{
                  color: isLight ? "#172b4d" : "#b6c2cf",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isLight
                    ? "#dcdfe4"
                    : "#323940";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="text-sm font-normal">Settings</span>
              </li>

              {/* Theme */}
              <li className="w-full list-none">
                <Popover open={isThemeOpen} onOpenChange={setIsThemeOpen}>
                  <PopoverTrigger asChild>
                    <div
                      className="w-full flex items-center justify-between px-5 py-1.5 cursor-pointer text-sm font-normal rounded-none"
                      style={{
                        color: isThemeOpen
                          ? isLight
                            ? "#186de5"
                            : "#579dff"
                          : isLight
                          ? "#172b4d"
                          : "#b6c2cf",
                        backgroundColor: isThemeOpen
                          ? isLight
                            ? "#e9f2ff"
                            : "#1c2b41"
                          : "transparent",
                        borderLeft: isThemeOpen
                          ? isLight
                            ? "3px solid #186de5"
                            : "3px solid #579dff"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isThemeOpen) {
                          e.currentTarget.style.backgroundColor = isLight
                            ? "#dcdfe4"
                            : "#323940";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isThemeOpen) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <span>Theme</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    side="left"
                    className="px-0 py-3 flex flex-col items-stretch"
                    style={{
                      backgroundColor: isLight ? "#ffffff" : "#282e33",
                      border: isLight
                        ? "1px solid #dcdfe4"
                        : "1px solid #39424a",
                    }}
                  >
                    <div
                      className={`flex items-center px-3 py-2 cursor-pointer relative theme-option-light ${
                        theme === "light" ? "active" : ""
                      }`}
                      style={{
                        color:
                          theme === "light"
                            ? isLight
                              ? "#186de5"
                              : "#579dff"
                            : isLight
                            ? "#172b4d"
                            : "#b6c2cf",
                        backgroundColor:
                          theme === "light"
                            ? isLight
                              ? "#e9f2ff"
                              : "#1c2b41"
                            : "transparent",
                      }}
                      onClick={() => setTheme("light")}
                      onMouseEnter={(e) => {
                        if (theme !== "light") {
                          e.currentTarget.style.backgroundColor = isLight
                            ? "#dcdfe4"
                            : "#455059";
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
                        color:
                          theme === "dark"
                            ? isLight
                              ? "#186de5"
                              : "#579dff"
                            : isLight
                            ? "#172b4d"
                            : "#b6c2cf",
                        backgroundColor:
                          theme === "dark"
                            ? isLight
                              ? "#e9f2ff"
                              : "#1c2b41"
                            : "transparent",
                      }}
                      onClick={() => setTheme("dark")}
                      onMouseEnter={(e) => {
                        if (theme !== "dark") {
                          e.currentTarget.style.backgroundColor = isLight
                            ? "#dcdfe4"
                            : "#455059";
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
                        color:
                          theme === "system"
                            ? isLight
                              ? "#186de5"
                              : "#579dff"
                            : isLight
                            ? "#172b4d"
                            : "#b6c2cf",
                        backgroundColor:
                          theme === "system"
                            ? isLight
                              ? "#e9f2ff"
                              : "#1c2b41"
                            : "transparent",
                      }}
                      onClick={() => setTheme("system")}
                      onMouseEnter={(e) => {
                        if (theme !== "system") {
                          e.currentTarget.style.backgroundColor = isLight
                            ? "#dcdfe4"
                            : "#455059";
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
                  </PopoverContent>
                </Popover>
              </li>
            </ul>

            <Separator
              style={{
                backgroundColor: isLight ? "#dcdfe4" : "#3d474f",
                margin: "8px 0",
              }}
            />

            {/* Create Workspace */}
            <div
              className="w-full px-5 py-1.5 cursor-pointer flex items-center gap-2 -mx-3"
              style={{
                color: isLight ? "#172b4d" : "#b6c2cf",
                marginLeft: "-12px",
                marginRight: "-12px",
                width: "calc(100% + 24px)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isLight
                  ? "#dcdfe4"
                  : "#323940";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-normal">Create Workspace</span>
            </div>

            <Separator
              style={{
                backgroundColor: isLight ? "#dcdfe4" : "#3d474f",
                margin: "8px 0",
              }}
            />

            {/* Help and Shortcuts */}
            <div className="space-y-1 -mx-3">
              <div
                className="w-full px-5 py-1.5 cursor-pointer"
                style={{
                  color: isLight ? "#172b4d" : "#b6c2cf",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isLight
                    ? "#dcdfe4"
                    : "#323940";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="text-sm font-normal">Help</span>
              </div>
              <div
                className="w-full px-5 py-1.5 cursor-pointer"
                style={{
                  color: isLight ? "#172b4d" : "#b6c2cf",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isLight
                    ? "#dcdfe4"
                    : "#323940";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="text-sm font-normal">Shortcuts</span>
              </div>
            </div>

            <Separator
              style={{
                backgroundColor: isLight ? "#dcdfe4" : "#3d474f",
                margin: "8px 0",
              }}
            />

            {/* Log Out */}
            <div
              onClick={signOut}
              className="w-full px-5 py-1.5 cursor-pointer -mx-3"
              style={{
                color: isLight ? "#172b4d" : "#b6c2cf",
                marginLeft: "-12px",
                marginRight: "-12px",
                width: "calc(100% + 24px)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isLight
                  ? "#dcdfe4"
                  : "#323940";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span className="text-sm font-normal">Log Out</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

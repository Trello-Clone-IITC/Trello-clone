import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SquareArrowOutUpRight, ChevronRight } from "lucide-react";
import peopleIcon from "../../../assets/people-icon.svg";
import peopleIconLight from "../../../assets/people-icon-light.svg";
import lightThemeIcon from "../../../assets/light-theme-icon.svg";
import darkThemeIcon from "../../../assets/dark-theme-icon.svg";
import systemThemeIcon from "../../../assets/system-theme-icon.svg";

// Trello Theme Icons
const LightThemeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src={lightThemeIcon}
    alt="Light theme"
    width="64"
    height="48"
    className={`rounded-lg ${className}`}
  />
);

const DarkThemeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src={darkThemeIcon}
    alt="Dark theme"
    width="64"
    height="48"
    className={`rounded-lg ${className}`}
  />
);

const SystemThemeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src={systemThemeIcon}
    alt="System theme"
    width="64"
    height="48"
    className={`rounded-lg ${className}`}
  />
);

import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { useMe } from "@/features/auth/hooks/useMe";
import { useUpdateUserTheme } from "@/features/auth/hooks/useUpdateUserTheme";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import CreateWorkspaceModal from "@/features/dashboard/components/CreateWorkspaceModal";
import type { Theme } from "@ronmordo/types";
export default function UserMenuPopover() {
  const signOut = useSignOut();
  const { data: user } = useMe();
  const { theme, setTheme } = useTheme();
  const { mutateAsync: updateUserTheme } = useUpdateUserTheme();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] =
    useState(false);

  const handleThemeChange = async (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      await updateUserTheme(newTheme);
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

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
            className={`h-10 w-10 bg-transparent relative cursor-pointer ${
              isLight
                ? "text-[#505258] hover:bg-[#dddedd]"
                : "text-[#a9abaf] hover:bg-[#37373a]"
            }`}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatarUrl} alt={`${fullName}'s avatar`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className={`w-[304px] p-0 ${
            isLight
              ? "bg-[#fff] border-1-[#dcdfe4]"
              : "bg-[#2b2c2f] border-1-[#39424a]"
          }`}
        >
          <div className="p-3 w-full">
            {/* ACCOUNT Section */}
            <div className="w-full p-0">
              <h2
                className={`text-[11px] font-bold uppercase tracking-wide px-2 w-full leading-tight mt-4 mx-0 mb-2 ${
                  isLight ? "text-[#626f86]" : "text-[#abadb0]"
                }`}
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
                    className={`text-sm font-normal mt-[2px] ${
                      isLight ? "text-[#172b4d]" : "text-[#abadb0]"
                    }`}
                  >
                    {fullName}
                  </div>
                  <div
                    className={`text-xs font-light mt-[2px] ${
                      isLight ? "text-[#172b4d]" : "text-[#abadb0]"
                    }`}
                  >
                    {email}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div
                  className={`flex items-center justify-between px-5 py-1.5 cursor-pointer -mx-3 bg-transparent ${
                    isLight
                      ? "text-[#172b4d] hover:bg-[#dcdfe4]"
                      : "text-[#abadb0] hover:bg-[#323940]"
                  }`}
                >
                  <span className="text-sm font-normal w-full">
                    Switch accounts
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between px-5 py-1.5 cursor-pointer -mx-3 bg-transparent ${
                    isLight
                      ? "text-[#172b4d] hover:bg-[#dcdfe4]"
                      : "text-[#abadb0] hover:bg-[#323940]"
                  }`}
                >
                  <span className="text-sm font-normal">Manage account</span>
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            <Separator
              className={`my-2 mx-0 ${
                isLight ? "bg-[#dcdfe4]" : "bg-[#424346]"
              }`}
            />

            {/* TRELLO Section */}
            <div className="w-full p-0 rounded-none">
              <h2
                className="text-[11px] font-bold uppercase tracking-wide mt-4 mx-0 mb-2 px-2 leading-tight"
                style={{ color: isLight ? "#626f86" : "#abadb0" }}
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
                  color: isLight ? "#172b4d" : "#abadb0",
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
                  color: isLight ? "#172b4d" : "#abadb0",
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
                  color: isLight ? "#172b4d" : "#abadb0",
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
                  color: isLight ? "#172b4d" : "#abadb0",
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
                          : "#abadb0",
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
                            : "#abadb0",
                        backgroundColor:
                          theme === "light"
                            ? isLight
                              ? "#e9f2ff"
                              : "#1c2b41"
                            : "transparent",
                      }}
                      onClick={() => handleThemeChange("light")}
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
                        onChange={() => handleThemeChange("light")}
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
                            : "#abadb0",
                        backgroundColor:
                          theme === "dark"
                            ? isLight
                              ? "#e9f2ff"
                              : "#1c2b41"
                            : "transparent",
                      }}
                      onClick={() => handleThemeChange("dark")}
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
                        onChange={() => handleThemeChange("dark")}
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
                            : "#abadb0",
                        backgroundColor:
                          theme === "system"
                            ? isLight
                              ? "#e9f2ff"
                              : "#1c2b41"
                            : "transparent",
                      }}
                      onClick={() => handleThemeChange("system")}
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
                        onChange={() => handleThemeChange("system")}
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
                backgroundColor: isLight ? "#dcdfe4" : "#424346",
                margin: "8px 0",
              }}
            />

            {/* Create Workspace */}
            <div
              className={`w-[calc(100% + 24px)] px-5 py-1.5 cursor-pointer flex items-center gap-2 -mx-3 ${
                isLight
                  ? "text-[#172b4d] hover:bg-[#dcdfe4]"
                  : "text-[#abadb0] hover:bg-[#323940]"
              }  `}
              onClick={() => setIsCreateWorkspaceModalOpen(true)}
            >
              <img
                src={isLight ? peopleIconLight : peopleIcon}
                alt="People"
                className="h-4 w-4"
              />
              <span className="text-sm font-normal">Create Workspace</span>
            </div>

            <Separator
              style={{
                backgroundColor: isLight ? "#dcdfe4" : "#424346",
                margin: "8px 0",
              }}
            />

            {/* Help and Shortcuts */}
            <div className="-mx-3">
              <div
                className={`w-[calc(100% + 24px)] px-5 py-1.5 ${
                  isLight
                    ? "text-[#172b4d] hover:bg-[#dcdfe4]"
                    : "text-[#abadb0] hover:bg-[#323940]"
                } cursor-pointer`}
              >
                <span className="text-sm font-normal">Help</span>
              </div>
              <div
                className={`w-[calc(100% + 24px)] px-5 py-1.5 ${
                  isLight
                    ? "text-[#172b4d] hover:bg-[#dcdfe4]"
                    : "text-[#abadb0] hover:bg-[#323940]"
                } cursor-pointer`}
              >
                <span className="text-sm font-normal">Shortcuts</span>
              </div>
            </div>

            <Separator
              className={`${isLight ? "bg-[#dcdfe4]" : "bg-[#424346]"}`}
              style={{
                backgroundColor: isLight ? "#dcdfe4" : "#424346",
                margin: "8px 0",
              }}
            />

            {/* Log Out */}
            <div
              onClick={signOut}
              className={`w-[calc(100% + 24px)] -mx-3 px-5 py-1.5 ${
                isLight
                  ? "text-[#172b4d] hover:bg-[#dcdfe4]"
                  : "text-[#abadb0] hover:bg-[#323940]"
              } cursor-pointer`}
            >
              <span className="text-sm font-normal">Log Out</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceModalOpen}
        onClose={() => setIsCreateWorkspaceModalOpen(false)}
      />
    </>
  );
}

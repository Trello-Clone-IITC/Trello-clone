import starIconLight from "../../../assets/star-icon-light.svg";
import starIconDark from "../../../assets/star-icon-dark.svg";
import clockIconLight from "../../../assets/clock-icon-light.svg";
import clockIconDark from "../../../assets/clock-icon-dark.svg";
import { BoardCard } from "../components/BoardCard";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import boardsIconLight from "../../../assets/boards-icon-light.svg";
import boardsIconDark from "../../../assets/boards-icon-dark.svg";
import membersIconLight from "../../../assets/members-icon-light.svg";
import membersIconDark from "../../../assets/members-icon-dark.svg";
import gearwheelIconLight from "../../../assets/gearwheel-icon-light.svg";
import gearwheelIconDark from "../../../assets/gearwheel-icon-dark.svg";
import upgradeIconLight from "../../../assets/upgrade-icon-light.svg";
import upgradeIconDark from "../../../assets/upgrade-icon-dark.svg";

export default function DashboardPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const starIcon = isLight ? starIconLight : starIconDark;
  const clockIcon = isLight ? clockIconLight : clockIconDark;
  const boardsIcon = isLight ? boardsIconLight : boardsIconDark;
  const membersIcon = isLight ? membersIconLight : membersIconDark;
  const gearwheelIcon = isLight ? gearwheelIconLight : gearwheelIconDark;
  const upgradeIcon = isLight ? upgradeIconLight : upgradeIconDark;

  const buttonTextColor = isLight ? "text-[#292a2e]" : "text-[#bfc1c4]";

  return (
    <div className="space-y-6">
      <section className="max-w-[1266px] pb-10">
        <div
          className={`flex items-center gap-2 font-bold text-[16px] ${buttonTextColor} mb-4`}
        >
          <img src={starIcon} alt="Star" className="w-6 h-6" />
          <span>Starred boards</span>
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(23%, 1fr))",
            columnGap: "2%",
            rowGap: "20px",
          }}
        >
          <BoardCard title="Tasks" isStarred={true} />
          <BoardCard title="Project Alpha" isStarred={true} />
          <BoardCard title="Team Planning" isStarred={true} />
        </div>
      </section>
      <section className="max-w-[1266px] pb-10">
        <div
          className={`flex items-center gap-2 font-bold text-[16px] ${buttonTextColor} mb-4`}
        >
          <img src={clockIcon} alt="Clock" className="w-6 h-6" />
          <span>Recently viewed</span>
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(23%, 1fr))",
            columnGap: "2%",
            rowGap: "20px",
          }}
        >
          <BoardCard title="Recent Board 1" />
          <BoardCard title="Recent Board 2" />
        </div>
      </section>

      {/* Your Workspaces Section */}
      <section>
        <h3
          className={`text-[16px] uppercase font-bold mt-3 mb-5 ${
            isLight ? "text-[#505258]" : "text-[#a9abaf]"
          }`}
        >
          YOUR WORKSPACES
        </h3>
        <div className="mb-4 flex items-center">
          {/* Workspace Icon with gradient */}
          <div
            className={`w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm mr-2 ${
              isLight ? "text-white" : "text-[#1f1f21]"
            }`}
          >
            W
          </div>
          {/* Workspace Name */}
          <h3
            className={`text-[16px] font-bold  self-start flex-1 mt-1 mr-2 mb-1 ml-1 pt-0.5 ${
              isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
            }`}
          >
            Workspace Name
          </h3>
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className={`${buttonTextColor} rounded-[3px] cursor-pointer ${
                isLight
                  ? "bg-[#f0f1f2] hover:bg-[#dddedd]"
                  : "bg-[#2c2c2e] hover:bg-[#37373a]"
              }`}
            >
              <img src={boardsIcon} alt="Boards" className="w-4 h-4 mr-1" />
              Boards
            </Button>
            <Button
              size="sm"
              className={`${buttonTextColor} rounded-[3px] cursor-pointer ${
                isLight
                  ? "bg-[#f0f1f2] hover:bg-[#dddedd]"
                  : "bg-[#2c2c2e] hover:bg-[#37373a]"
              }`}
            >
              <img src={membersIcon} alt="Members" className="w-4 h-4 mr-1" />
              Members
            </Button>
            <Button
              size="sm"
              className={`${buttonTextColor} rounded-[3px] cursor-pointer ${
                isLight
                  ? "bg-[#f0f1f2] hover:bg-[#dddedd]"
                  : "bg-[#2c2c2e] hover:bg-[#37373a]"
              }`}
            >
              <img
                src={gearwheelIcon}
                alt="Settings"
                className="w-4 h-4 mr-1"
              />
              Settings
            </Button>
            <Button
              size="sm"
              className={`${buttonTextColor} rounded-[3px] cursor-pointer ${
                isLight
                  ? "bg-[#f8eefe] hover:bg-[#eed7fc]"
                  : "bg-[#35243f] hover:bg-[#48245d]"
              }`}
            >
              <div className="w-5 h-5 mr-1 rounded-[3px] bg-[#964ac0] flex items-center justify-center">
                <img
                  src={upgradeIcon}
                  alt="Upgrade"
                  className={`w-4 h-4 ${
                    isLight ? "brightness-0 invert" : "brightness-0"
                  }`}
                  style={
                    !isLight
                      ? {
                          filter:
                            "brightness(0) saturate(100%) invert(8%) sepia(8%) saturate(1038%) hue-rotate(180deg) brightness(95%) contrast(89%)",
                        }
                      : {}
                  }
                />
              </div>
              Upgrade
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

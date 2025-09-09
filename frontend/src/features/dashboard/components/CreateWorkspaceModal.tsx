import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
}: CreateWorkspaceModalProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceType, setWorkspaceType] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement workspace creation logic
    console.log("Creating workspace:", {
      name: workspaceName,
      type: workspaceType,
      description: workspaceDescription,
    });
    onClose();
  };

  const isFormValid = workspaceName.trim().length > 0 && workspaceType;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="flex items-center justify-center my-[48px] p-0 w-fit top-[14px] translate-y-0"
        showCloseButton={false}
      >
        <div
          className={`min-h-[500px] lg:max-h-[637px] lg:mx-0 md:mx-auto xl:min-w-[1200px] lg:min-w-[calc(100vw-48px)] lg:flex-row md:flex-col-reverse md:max-w-[475px] flex items-stretch rounded-[3px] mb-0 p-0 overflow-hidden gap-0 ${
            isLight ? "bg-white text-[#292a2e]" : "bg-[#242528] text-[#bfc1c4]"
          }`}
        >
          {/* Left side - Form */}
          <div className="flex-1 px-6 mt-16 mb-6 flex flex-col z-3 items-center">
            <form
              onSubmit={handleSubmit}
              className="w-[388px] items-stretch gap-0"
            >
              <h2 className="text-2xl font-semibold mb-3">
                Let's build a Workspace
              </h2>
              <p className="text-lg text-wrap font-normal text-[#9ea0a4]">
                Boost your productivity by making it easier for everyone to
                access boards in one location.
              </p>

              {/* Workspace Name */}
              <div className="space-y-2 text-[#a9abaf]">
                <Label
                  htmlFor="workspace-name"
                  className="text-xs font-medium mt-6 "
                >
                  Workspace name
                </Label>
                <Input
                  id="workspace-name"
                  type="text"
                  placeholder="Taco's Co."
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  maxLength={100}
                  className="lg:w-[388px] h-12 md:w-full py-2 px-3 rounded-[3px] border-1 border-[#7e8188] mb-1.5"
                />
                <p className="text-xs font-lighter">
                  This is the name of your company, team or organization.
                </p>
              </div>

              {/* Workspace Type */}
              <div className="space-y-2">
                <Label
                  htmlFor="workspace-type"
                  className="text-sm font-medium mt-6 mb-1"
                >
                  Workspace type
                </Label>
                <Select value={workspaceType} onValueChange={setWorkspaceType}>
                  <SelectTrigger className="bg-[#242528] flex items-center justify-between min-h-[40px] rounded-[3px] border-1 border-[#7e8188] w-full py-[2px] px-[6px]">
                    <SelectValue className="mx-[2px]" placeholder="Choose…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Workspace Description */}
              <div className="">
                <Label
                  htmlFor="workspace-description"
                  className="text-sm font-bold text-[#bfc1c4] mt-6 mb-1"
                >
                  Workspace description
                  <span className=" text-xs font-light">Optional</span>
                </Label>
                <Textarea
                  id="workspace-description"
                  placeholder="Our team organizes everything here."
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  rows={6}
                  className="w-full resize-none"
                />
                <p className="text-xs ">
                  Get your members on board with a few words about your
                  Workspace.
                </p>
              </div>

              {/* Submit Button */}
              <footer className="w-full mt-4">
                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className={`px-3 py-1.5 h-12 rounded-[3px] w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLight
                      ? "bg-[#1868db] hover:bg-[#1558bc] text-white"
                      : "bg-[#669df1] hover:bg-[#8fb8f6] text-[#1f1f21]"
                  }`}
                >
                  Continue
                </Button>
              </footer>
            </form>
          </div>

          {/* Right side - Illustration */}
          <div className="flex-1 lg:items-start  md:z-2  bg-[url(https://trello.com/assets/df0d81969c6394b61c0d.svg)] bg-no-repeat bg-cover flex md:items-center  lg:scale-x-[1] lg:scale-y-[1] md:scale-y-[2] justify-center overflow-hidden lg:pt-[112px] md:p-0 lg:rotate-0 md:rotate-[-90deg] md:bg-position-[60px] lg:bg-position-[0px] relative">
            <div className="h-full md:scale-x-[0.5] lg:translate-x-[0px] md:translate-x-[-50px] lg:rotate-0 md:rotate-[90deg] lg:scale-x-[1] lg:pt-0 md:pt-10">
              <img
                className="z-3"
                src="https://trello.com/assets/d1f066971350650d3346.svg"
                alt="Trello"
              />
            </div>
          </div>

          {/* Close Button */}
          <Button
            size="icon"
            className="absolute top-7 z-4 right-3 h-8 w-8 text-[#e2e3e4] hover:bg-transparent cursor-pointer bg-transparent shadow-none"
            onClick={onClose}
          >
            <X className="size-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

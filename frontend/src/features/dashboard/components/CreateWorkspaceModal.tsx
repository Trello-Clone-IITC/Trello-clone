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
import { useCreateWorkspace } from "../hooks/useCreateWorkspace";
import { WorkspaceTypeSchema, type WorkspaceType } from "@ronmordo/contracts";
interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
}: CreateWorkspaceModalProps) {
  const [workspaceName, setWorkspaceName] = useState("");

  // type WorkspaceWithPlaceholder = WorkspaceType | "";
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>();

  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const { theme } = useTheme();
  const isLight = theme === "light";

  const createWorkspaceMutation = useCreateWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      await createWorkspaceMutation.mutateAsync({
        name: workspaceName,
        type: workspaceType,
        description: workspaceDescription || undefined,
      });
    } catch (error) {
      console.error("Failed to create workspace:", error);
    }
    onClose();
  };

  const isFormValid = workspaceName.trim().length > 0 && workspaceType;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setWorkspaceName("");
          setWorkspaceType(undefined);
          setWorkspaceDescription("");
          onClose();
        }
      }}
    >
      <DialogContent
        className="lg:flex lg:justify-center lg:items-center xl:min-w-[1200px] lg:max-w-[calc(100vw - 48px)] lg:overflow-x-hidden   my-[48px] p-0  md:max-w-[475px]  md:max-h-[90vh]  top-[14px] translate-y-0 md:overflow-y-auto"
        showCloseButton={false}
      >
        <div
          className={`min-h-[500px] lg:max-h-[637px] lg:mx-0 md:mx-auto xl:min-w-[1200px] lg:flex-row md:flex-col-reverse  flex items-stretch rounded-[3px] mb-0 p-0 overflow-hidden gap-0 ${
            isLight ? "bg-white text-[#292a2e]" : "bg-[#242528] text-[#bfc1c4]"
          }`}
        >
          {/* Left side - Form */}
          <div className="flex-1 px-6 mt-16 mb-6 flex flex-col z-3 items-center">
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
              className="w-[388px] -mt-0.5"
            >
              <h2 className="text-2xl font-semibold mb-3">
                Let's build a Workspace
              </h2>
              <p className="text-lg/5.5 text-wrap font-normal text-[#9ea0a4] -mt-[3px] mb-7 line-h">
                Boost your productivity by making it easier for everyone to
                access boards in one location.
              </p>

              {/* Workspace Name */}
              <div className="text-[#a9abaf]">
                <Label
                  htmlFor="workspace-name"
                  className={`text-xs font-bold mt-6 mb-1  ${
                    isLight ? " text-[#292a2e]" : "text-[#bfc1c4]"
                  }`}
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
                  className={`lg:w-[388px] h-12 md:w-full py-2 px-3 rounded-[3px] border-1 mb-1.5 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none   placeholder:font-normal ${
                    isLight
                      ? "border-[#8c8f97] text-[#bfc1c4] focus-visible:border-[#4688ec] focus-visible:border-1 "
                      : "border-[#7e8188] placeholder:text-[#96999e] focus-visible:border-[#85b8ff] focus-visible:border-1 "
                  }`}
                />
                <p
                  className={`text-xs font-lighter ${
                    isLight ? " text-[#292a2e]" : "text-[#bfc1c4]"
                  }`}
                >
                  This is the name of your company, team or organization.
                </p>
              </div>

              {/* Workspace Type */}
              <div className="">
                <Label
                  htmlFor="workspace-type"
                  className={`text-xs font-bold mt-6 mb-1  ${
                    isLight ? " text-[#292a2e]" : "text-[#bfc1c4]"
                  }`}
                >
                  Workspace type
                </Label>
                <Select
                  value={workspaceType}
                  onValueChange={(value: WorkspaceType) =>
                    setWorkspaceType(value)
                  }
                >
                  <SelectTrigger
                    className={`bg-[#242528] flex items-center justify-between min-h-[40px]  rounded-[3px] border-1  w-full py-[2px] px-[6px] cursor-pointer  ${
                      isLight
                        ? "bg-[#fff] placeholder:text-[#292a2e] border-[#8c8f97]"
                        : "bg-[#242528] placeholder:text-[#bfc1c4] border-[#7e8188]"
                    }`}
                  >
                    <SelectValue
                      className={` ${
                        isLight
                          ? "placeholder:text-[#292a2e]"
                          : "placeholder:text-[#bfc1c4]"
                      }`}
                      placeholder="Choose…"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={WorkspaceTypeSchema.enum.engineering_it}>
                      Engineering-IT
                    </SelectItem>
                    <SelectItem value={WorkspaceTypeSchema.enum.marketing}>
                      Marketing
                    </SelectItem>
                    <SelectItem
                      value={WorkspaceTypeSchema.enum.human_resources}
                    >
                      Human Resources
                    </SelectItem>
                    <SelectItem value={WorkspaceTypeSchema.enum.sales_crm}>
                      Sales CRM
                    </SelectItem>
                    <SelectItem value={WorkspaceTypeSchema.enum.small_business}>
                      Small Business
                    </SelectItem>
                    <SelectItem value={WorkspaceTypeSchema.enum.operations}>
                      Operations
                    </SelectItem>
                    <SelectItem value={WorkspaceTypeSchema.enum.education}>
                      Education
                    </SelectItem>
                    <SelectItem value={WorkspaceTypeSchema.enum.other}>
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Workspace Description */}
              <Label
                htmlFor="workspace-description"
                className={`text-xs font-bold  mt-6 mb-1 ${
                  isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                }`}
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
                className={`w-full resize-none rounded-[3px] border-1 border-transparent  mb-1.5 text-sm   ${
                  isLight
                    ? "border-[#8c8f97] text-[#6b6e76] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#4688ec] focus-visible:border-1"
                    : "border-[#7e8188] text-[#8c8f93] placeholder:text-[#818488] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#85b8ff] focus-visible:border-1"
                }`}
              />
              <p
                className={`text-xs mt-3 ${
                  isLight ? "text-[#505258]" : "text-[#a9abaf]"
                }`}
              >
                Get your members on board with a few words about your Workspace.
              </p>

              {/* Submit Button */}
              <footer className="w-full mt-3.5">
                <Button
                  type="submit"
                  className={`px-3 py-1.5 h-12 rounded-[3px] cursor-pointer w-full text-sm disabled:opacity-50 ${
                    !isFormValid
                      ? isLight
                        ? "bg-[#f8f8f8] hover:bg-[#f8f8f8] cursor-not-allowed text-[#b2b4ba]"
                        : "bg-[#2a2b2d] hover:bg-[#2a2b2d] cursor-not-allowed  text-[#585a60] "
                      : isLight
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
              {isFormValid && (
                <img
                  src="https://trello.com/assets/1a4590e4c12ebbbd161a.svg"
                  alt="green face"
                  className="w-21 h-21 z-3 animate-[slideInFromBottomLeft_0.3s_ease-out_forwards]"
                />
              )}
            </div>
          </div>

          {/* Close Button */}
          <Button
            size="icon"
            className={`absolute top-7 z-4 right-3 h-8 w-8  hover:bg-transparent cursor-pointer bg-transparent shadow-none ${
              isLight ? "text-[#1e1f21]" : "text-[#e2e3e4]"
            }`}
            onClick={onClose}
          >
            <X className="size-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

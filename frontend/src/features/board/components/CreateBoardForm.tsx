import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { X, Check, MoreHorizontal, ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateBoard } from "../hooks/useBoard";
import { useUserWorkspaces } from "@/features/dashboard/hooks/useUserWorkspaces";
import {
  upgradeIconDark,
  upgradeIconLight,
  lockIcon,
  lockIconDark,
  globeIcon,
  globeIconDark,
  peopleIcon,
  peopleLightIcon,
} from "@/assets";
import type { CreateBoardInput } from "@ronmordo/contracts";
interface CreateBoardFormProps {
  onBack?: () => void;
  onClose?: () => void;
  showBackButton?: boolean;
}

// Background options
const backgroundOptions = [
  {
    id: "photo-1",
    type: "photo",
    url: "https://images.unsplash.com/photo-1742156345582-b857d994c84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDF8MzE3MDk5fHx8fHwyfHwxNzU3OTE0ODczfA&ixlib=rb-4.1.0&q=80&w=2560",
    previewUrl:
      "https://images.unsplash.com/photo-1742156345582-b857d994c84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDF8MzE3MDk5fHx8fHwyfHwxNzU3OTE0ODczfA&ixlib=rb-4.1.0&q=80&w=400",
    title: "Glacier sits atop an arid, rocky landscape.",
  },
  {
    id: "photo-2",
    type: "photo",
    url: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1543/972d5bb6b30978a434abeed68e6f730b/photo-1741812191037-96bb5f12010a.webp",
    previewUrl:
      "https://images.unsplash.com/photo-1741812191037-96bb5f12010a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDJ8MzE3MDk5fHx8fHwyfHwxNzU3OTE0ODczfA&ixlib=rb-4.1.0&q=80&w=400",
    title: "Majestic mountain silhouetted against an orange sky.",
  },
  {
    id: "photo-3",
    type: "photo",
    url: "https://images.unsplash.com/photo-1742937163916-78fd07cc3b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDN8MzE3MDk9fHx8fHwyfHwxNzU3OTE0ODczfA&ixlib=rb-4.1.0&q=80&w=2560",
    previewUrl:
      "https://images.unsplash.com/photo-1742937163916-78fd07cc3b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDN8MzE3MDk9fHx8fHwyfHwxNzU3OTE0ODczfA&ixlib=rb-4.1.0&q=80&w=400",
    title: "Palm tree fronds against a neutral, muted background.",
  },
  {
    id: "photo-4",
    type: "photo",
    url: "https://images.unsplash.com/photo-1742845918430-c6093f93f740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDR8MzE3MDk5fHx8fHwyfHwxNzU3OTE0ODczfA&ixlib=rb-4.1.0&q=80&w=2560",
    previewUrl:
      "https://images.unsplash.com/photo-1742845918430-c6093f93f740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDR8MzE3MDk5fHx8fHwyfHwxNzU3OTE0ODczfA&ixlib=rb-4.1.0&q=80&w=400",
    title: "Sunrise illuminates a beautiful lake and snowy mountains.",
  },
  {
    id: "gradient-1",
    type: "gradient",
    color: "rgb(220, 234, 254)",
    pattern: "/assets/13425f9db06517de0f7f.svg",
    title: "Light blue gradient",
  },
  {
    id: "gradient-2",
    type: "gradient",
    color: "rgb(34, 140, 213)",
    pattern: "/assets/707f35bc691220846678.svg",
    title: "Blue gradient",
  },
  {
    id: "gradient-3",
    type: "gradient",
    color: "rgb(11, 80, 175)",
    pattern: "/assets/d106776cb297f000b1f4.svg",
    title: "Dark blue gradient",
  },
  {
    id: "gradient-4",
    type: "gradient",
    color: "rgb(103, 66, 132)",
    pattern: "/assets/8ab3b35f3a786bb6cdac.svg",
    title: "Dark purple gradient",
  },
  {
    id: "gradient-5",
    type: "gradient",
    color: "rgb(168, 105, 193)",
    pattern: "/assets/a7c521b94eb153008f2d.svg",
    title: "Purple gradient",
  },
];

export const CreateBoardForm = ({
  onBack,
  onClose,
  showBackButton = false,
}: CreateBoardFormProps) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [selectedBackground, setSelectedBackground] = useState(
    backgroundOptions[0].id
  );

  const createBoard = useCreateBoard();
  const { data: workspaces, isLoading: workspacesLoading } =
    useUserWorkspaces();

  const form = useForm<CreateBoardInput>({
    defaultValues: {
      name: "",
      workspaceId: "",
      visibility: "workspace_members",
      background: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  const selectedBg = backgroundOptions.find(
    (bg) => bg.id === selectedBackground
  );

  const onSubmit = async (data: CreateBoardInput) => {
    try {
      // Determine the background value based on type
      let backgroundValue = "#0079bf"; // default fallback

      if (selectedBg?.type === "photo") {
        backgroundValue = selectedBg.url || "#0079bf";
      } else if (selectedBg?.type === "gradient") {
        // For gradients, use the pattern if available, otherwise use the color
        backgroundValue = selectedBg.pattern || selectedBg.color || "#0079bf";
      }

      await createBoard.mutateAsync({
        name: data.name,
        description: "",
        visibility: data.visibility,
        workspaceId: data.workspaceId,
        background: backgroundValue,
        allowCovers: true,
        showComplete: true,
      });

      // Reset form and close on success
      form.reset();
      onClose?.();
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  return (
    <div className="flex flex-col items-stretch">
      {/* Header */}
      <header
        className={cn(
          "grid grid-cols-[32px_1fr_32px] items-center text-center py-[0.25rem] px-[0.5rem]"
        )}
      >
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 col-start-1 col-end-auto row-start-1 row-end-auto flex items-center justify-center rounded-[8px]"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <h2
          className={cn(
            "font-semibold col-start-2 row-start-1 row-end-auto h-10 px-8 flex items-center justify-center text-center text-sm leading-10",
            isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
          )}
        >
          Create board
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 col-start-3 col-end-auto row-start-1 row-end-auto flex items-center justify-center rounded-[8px]"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center max-h-[600px] px-3 overflow-x-hidden overflow-y-auto">
        {/* Background Preview */}
        <div className="flex items-center pb-2">
          <div
            className="flex items-center justify-center w-[200px] h-[120px] rounded-[3px] relative bg-center bg-cover"
            style={{
              backgroundColor: selectedBg?.color,
              backgroundImage:
                selectedBg?.type === "photo"
                  ? `url(${selectedBg.previewUrl || selectedBg.url})`
                  : selectedBg?.pattern
                  ? `url(${selectedBg.pattern})`
                  : undefined,
            }}
          >
            <img
              className=""
              src="https://trello.com/assets/14cda5dc635d1f13bc48.svg"
              alt="lists"
            />
          </div>
        </div>

        {/* Background Selection */}
        <div className="flex flex-col w-full">
          <h3
            className={cn(
              "text-xs font-bold mb-2",
              isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
            )}
          >
            Background
          </h3>
          <div className="flex flex-col w-full pb-1">
            {/* Photo backgrounds */}
            <ul className="flex gap-1.5 w-full m-0 pb-2 list-none">
              {backgroundOptions.slice(0, 4).map((bg) => (
                <li key={bg.id} className="w-16 h-10 m-0 p-0">
                  <button
                    type="button"
                    className="relative w-full h-full rounded-[3px] outline-0 bg-cover bg-center cursor-pointer flex items-center justify-center overflow-hidden hover:after:absolute hover:after:inset-0 hover:after:bg-white/20 hover:after:rounded-[3px]"
                    style={{
                      backgroundImage: `url(${bg.previewUrl || bg.url})`,
                    }}
                    onClick={() => setSelectedBackground(bg.id)}
                    title={bg.title}
                  >
                    {selectedBackground === bg.id && (
                      <>
                        <div className="absolute inset-0 bg-white/10 rounded-[3px]" />
                        <Check className="h-3 w-3 text-[#1f1f21] drop-shadow-lg relative z-10" />
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Gradient backgrounds */}
            <ul className="flex gap-1.5 w-full m-0 p-0 list-none">
              {backgroundOptions.slice(4, 9).map((bg) => (
                <li key={bg.id} className="flex-1">
                  <button
                    type="button"
                    className={cn(
                      "relative w-full h-8 rounded border-2 flex items-center justify-center",
                      selectedBackground === bg.id
                        ? "border-[#579dff]"
                        : "border-transparent hover:border-[#9fadbc]"
                    )}
                    style={{
                      backgroundColor: bg.color,
                      backgroundImage: bg.pattern
                        ? `url(${bg.pattern})`
                        : undefined,
                    }}
                    onClick={() => setSelectedBackground(bg.id)}
                    title={bg.title}
                  >
                    {selectedBackground === bg.id && (
                      <Check className="h-4 w-4 text-white drop-shadow-lg" />
                    )}
                  </button>
                </li>
              ))}
              <li className="flex-1">
                <button
                  type="button"
                  className={cn(
                    "w-full h-8 rounded border-2 border-transparent hover:border-[#9fadbc] flex items-center justify-center",
                    isLight ? "bg-[#f0f1f2]" : "bg-[#2c2c2e]"
                  )}
                  title="More backgrounds"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            {/* Board Title */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Board title is required" }}
              render={({ field, fieldState }) => {
                const hasError = fieldState.error || !field.value?.trim();
                return (
                  <FormItem className="gap-0.5 mt-3 mb-1">
                    <FormLabel
                      className={cn(
                        "text-xs font-medium flex gap-0.5",
                        isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                      )}
                    >
                      Board title<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter board title"
                        className={cn(
                          "h-10 px-3 py-2 w-full rounded-[3px] focus-visible:ring-0",
                          hasError
                            ? "border-[#f15b50] focus-visible:border-[#f15b50]"
                            : isLight
                            ? "focus-visible:border-[#4688ec]"
                            : "focus-visible:border-[#596e8f]"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {hasError && (
                        <div className="flex mt-0.5">
                          <span className="mr-2">👋</span>
                          <p className="text-sm text-[#bfc1c4] flex items-center mb-2">
                            Board title is required
                          </p>
                        </div>
                      )}
                    </FormMessage>
                  </FormItem>
                );
              }}
            />

            {/* Workspace Selection */}
            <FormField
              control={form.control}
              name="workspaceId"
              rules={{ required: "Please select a workspace" }}
              render={({ field, fieldState }) => {
                const hasError = fieldState.error || !field.value;
                return (
                  <FormItem className="gap-0">
                    <FormLabel
                      className={cn(
                        "text-xs font-bold mt-3 mb-1",
                        isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                      )}
                    >
                      Workspace<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={workspacesLoading}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "flex items-center justify-between min-h-[40px] rounded-[3px] border-1 w-full py-[2px] px-[6px] cursor-pointer focus-visible:ring-0",
                            hasError
                              ? "border-[#f15b50] focus-visible:border-[#f15b50]"
                              : isLight
                              ? "bg-[#fff] placeholder:text-[#292a2e] border-[#8c8f97] focus-visible:border-[#4688ec]"
                              : "bg-[#242528] placeholder:text-[#bfc1c4] border-[#7e8188] focus-visible:border-[#596e8f]"
                          )}
                        >
                          <SelectValue
                            placeholder={
                              workspacesLoading
                                ? "Loading workspaces..."
                                : "Select a workspace"
                            }
                            className={cn(
                              isLight
                                ? "placeholder:text-[#292a2e]"
                                : "placeholder:text-[#bfc1c4]"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workspaces?.map((workspace) => (
                          <SelectItem key={workspace.id} value={workspace.id}>
                            {workspace.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {hasError && (
                        <div className="flex mt-0.5">
                          <span className="mr-2">👋</span>
                          <p className="text-sm text-[#bfc1c4] flex items-center mb-2">
                            {fieldState.error?.message ||
                              "Please select a workspace"}
                          </p>
                        </div>
                      )}
                    </FormMessage>
                  </FormItem>
                );
              }}
            />

            {/* Visibility Selection */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="gap-0">
                  <FormLabel
                    className={cn(
                      "text-xs font-bold mt-3 mb-1",
                      isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                    )}
                  >
                    Visibility
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "flex items-center justify-between min-h-[40px] rounded-[3px] border-2 w-full py-[2px] px-[6px] cursor-pointer focus-visible:ring-0",
                          isLight
                            ? "bg-[#fff] placeholder:text-[#292a2e] border-[#8c8f97] focus-visible:border-[#4688ec]"
                            : "bg-[#242528] placeholder:text-[#bfc1c4] border-[#7e8188] focus-visible:border-[#596e8f]"
                        )}
                      >
                        <SelectValue
                          className={cn(
                            isLight
                              ? "placeholder:text-[#292a2e]"
                              : "placeholder:text-[#bfc1c4]"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <img
                            src={isLight ? lockIcon : lockIconDark}
                            alt="lock"
                            className={cn(
                              "h-4 w-4",
                              isLight
                                ? "[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(8%)_saturate(1033%)_hue-rotate(202deg)_brightness(95%)_contrast(89%)]"
                                : "[filter:brightness(0)_saturate(100%)_invert(75%)_sepia(6%)_saturate(464%)_hue-rotate(202deg)_brightness(96%)_contrast(88%)]"
                            )}
                          />
                          <span>Private</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="workspace_members">
                        <div className="flex items-center gap-2">
                          <img
                            src={isLight ? peopleIcon : peopleLightIcon}
                            alt="people"
                            className={cn(
                              "h-4 w-4 data-[state=closed]:hidden data-[state=open]:visible",
                              isLight
                                ? "[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(8%)_saturate(1033%)_hue-rotate(202deg)_brightness(95%)_contrast(89%)]"
                                : "[filter:brightness(0)_saturate(100%)_invert(75%)_sepia(6%)_saturate(464%)_hue-rotate(202deg)_brightness(96%)_contrast(88%)]"
                            )}
                          />
                          <span>Workspace</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <img
                            src={isLight ? globeIcon : globeIconDark}
                            alt="globe"
                            className={cn(
                              "h-4 w-4",
                              isLight
                                ? "[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(8%)_saturate(1033%)_hue-rotate(202deg)_brightness(95%)_contrast(89%)]"
                                : "[filter:brightness(0)_saturate(100%)_invert(75%)_sepia(6%)_saturate(464%)_hue-rotate(202deg)_brightness(96%)_contrast(88%)]"
                            )}
                          />
                          <span>Public</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Upgrade Notice */}
            <div
              className={cn(
                "mb-2 mt-4 rounded font-normal text-sm",
                isLight
                  ? "bg-[#f8f9fa] text-[#505258]"
                  : "bg-[#2c2c2e] text-[#a9abaf]"
              )}
            >
              This Workspace has 5 boards remaining. Free Workspaces can only
              have 10 open boards. For unlimited boards, upgrade your Workspace.
            </div>

            {/* Upgrade Button */}
            <Button
              type="button"
              className={cn(
                "w-full h-10 rounded-[3px] cursor-pointer",
                isLight
                  ? "border-[#dcdfe4] bg-[#f8eefe] hover:bg-[#eed7fc]"
                  : "border-[#434345] bg-[#35243f] hover:bg-[#48245d]"
              )}
            >
              <div className="flex items-center gap-2 font-normal text-[#a2a2aa] text-sm">
                <div className="h-5 w-5 rounded-[3px] bg-[#c97cf4]   flex items-center justify-center">
                  <img
                    className="h-4 w-4"
                    src={`${isLight ? upgradeIconDark : upgradeIconLight}`}
                    alt="upgrade"
                  />
                </div>
                Start free trial
              </div>
            </Button>

            {/* Create Button */}
            <Button
              type="submit"
              disabled={
                !form.watch("name")?.trim() ||
                !form.watch("workspaceId") ||
                createBoard.isPending
              }
              className={cn(
                "w-full h-10 mt-4 mb-0 cursor-pointer rounded-[3px]",
                !form.watch("name")?.trim() ||
                  !form.watch("workspaceId") ||
                  createBoard.isPending
                  ? isLight
                    ? "bg-[#f8f8f8] text-[#b2b4ba] cursor-not-allowed disabled:opacity-100"
                    : "bg-[#303134] text-[#585a60] cursor-not-allowed disabled:opacity-100"
                  : isLight
                  ? "bg-[#1868db] hover:bg-[#1558bc] text-white"
                  : "bg-[#669df1] hover:bg-[#8fb8f6] text-[#1f1f21]"
              )}
            >
              {createBoard.isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>

        {/* Template Button */}
        <Button
          type="button"
          className={cn(
            "w-full h-10 mt-2 rounded-[3px] text-sm cursor-pointer",
            isLight
              ? "border-[#dcdfe4] hover:bg-[#f0f1f2]"
              : "border-[#434345] bg-[#36373a] text-[#bfc1c4] hover:bg-[#414246]"
          )}
        >
          Start with a template
        </Button>

        {/* Footer */}
        <div
          className={cn(
            "text-xs text-center mt-2 pb-4",
            isLight ? "text-[#505258]" : "text-[#a9abaf]"
          )}
        >
          By using images from Unsplash, you agree to their{" "}
          <a
            href="https://unsplash.com/license"
            target="_blank"
            className="underline"
          >
            license
          </a>{" "}
          and{" "}
          <a
            href="https://unsplash.com/terms"
            target="_blank"
            className="underline"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useUserWorkspaces } from "@/features/dashboard/hooks/useUserWorkspaces";
import { getBoardByWorkspace } from "@/features/dashboard/api";
import { useSearch } from "@/features/navbar/hooks/useSearch";
import type {
  BoardDto,
  WorkspaceDto,
  WorkspaceWithBoardsDto,
} from "@ronmordo/contracts";
import { getBackgroundPreviewUrl } from "@/features/dashboard/utils/backgroundUtils";

type SwitchBoardsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SwitchBoardsModal({ open, onClose }: SwitchBoardsModalProps) {
  const navigate = useNavigate();
  const { data: workspaces } = useUserWorkspaces();
  type BoardListItem = {
    id: string;
    name: string;
    background: BoardDto["background"];
    workspaceId: string;
  };

  const [userBoards, setUserBoards] = useState<BoardListItem[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(searchValue.trim()), 400);
    return () => clearTimeout(id);
  }, [searchValue]);

  const { data: searchResults, isLoading: searching } = useSearch(debounced);

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | "all">(
    "all"
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Load boards for each workspace (the /workspaces endpoint returns workspaces without boards)
  useEffect(() => {
    const loadBoards = async () => {
      if (!workspaces || workspaces.length === 0) {
        setUserBoards([]);
        return;
      }
      setBoardsLoading(true);
      try {
        const results = await Promise.all(
          (workspaces as WorkspaceDto[]).map(async (ws) => {
            const boards = await getBoardByWorkspace(ws.id);
            return (
              boards as unknown as Array<{
                id: string;
                name: string;
                background: BoardDto["background"];
                workspaceId?: string;
              }>
            ).map(
              (b) =>
                ({
                  id: b.id,
                  name: b.name,
                  background: b.background,
                  workspaceId: b.workspaceId ?? ws.id,
                } satisfies BoardListItem)
            );
          })
        );
        const merged: BoardListItem[] = results.flat();
        // Deduplicate by id
        const unique = Array.from(
          new Map(merged.map((b) => [b.id, b])).values()
        );
        setUserBoards(unique);
      } catch {
        setUserBoards([]);
      } finally {
        setBoardsLoading(false);
      }
    };
    loadBoards();
  }, [workspaces]);

  const boardsByWorkspace = useMemo(() => {
    const map = new Map<string, BoardListItem[]>();
    (workspaces as WorkspaceDto[] | undefined)?.forEach((ws) => {
      map.set(
        ws.id,
        userBoards.filter((b) => b.workspaceId === (ws as WorkspaceDto).id)
      );
    });
    return map;
  }, [userBoards, workspaces]);

  const boardsToRender: BoardListItem[] = useMemo(() => {
    if (debounced && searchResults?.boards)
      return (
        searchResults.boards as unknown as Array<
          Partial<BoardDto> & {
            workspaceId?: string;
            workspace?: { id: string };
          }
        >
      ).map((b) => ({
        id: (b.id as string) ?? "",
        name: (b.name as string) ?? "Untitled",
        background: b.background as BoardDto["background"],
        workspaceId:
          (b.workspaceId as string | undefined) ?? b.workspace?.id ?? "",
      }));
    // Default: render all user boards
    if (activeWorkspaceId === "all") return userBoards;
    return boardsByWorkspace.get(activeWorkspaceId) || [];
  }, [
    debounced,
    searchResults,
    userBoards,
    activeWorkspaceId,
    boardsByWorkspace,
  ]);

  const handleOpenBoard = (boardId: string) => {
    onClose();
    navigate(`/b/${boardId}`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent
        className="flex max-w-[780px] w-full flex-col gap-0 p-0 border-0 bg-transparent top-[450px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="w-full rounded-[8px] bg-[#2b2c2f] shadow-[0px_8px_12px_#0104045C,0px_0px_1px_#01040480] border border-[#3c3d40]">
          {/* Search Row */}
          <div className="p-4">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search your boards"
              className="h-9 bg-[#242528] border-2 border-[#7e8188] focus-visible:border-[#596e8f] text-[#bfc1c4] placeholder:text-[#bfc1c4]"
            />
            {/* Workspace filter chips */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveWorkspaceId("all")}
                className={`px-2 py-1 rounded text-xs ${
                  activeWorkspaceId === "all"
                    ? "bg-[#1c2b42] text-[#669df1]"
                    : "bg-[#3d3f43] text-[#bfc1c4] hover:bg-[#484a4f]"
                }`}
              >
                All
              </button>
              {(
                workspaces as unknown as WorkspaceWithBoardsDto[] | undefined
              )?.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => setActiveWorkspaceId(ws.id)}
                  className={`px-2 py-1 rounded text-xs ${
                    activeWorkspaceId === ws.id
                      ? "bg-[#1c2b42] text-[#669df1]"
                      : "bg-[#3d3f43] text-[#bfc1c4] hover:bg-[#484a4f]"
                  }`}
                >
                  {ws.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4 max-h-[520px] overflow-y-auto">
            {!debounced && (
              <h3 className="text-sm text-[#bfc1c4] flex items-center gap-2 mb-3">
                <span className="inline-block w-4 h-4 rounded-full border border-[#7e8188]" />
                Your boards
              </h3>
            )}

            {/* Boards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {searching || boardsLoading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#85b8ff]"></div>
                </div>
              ) : boardsToRender.length > 0 ? (
                boardsToRender.map((board) => {
                  const bgUrl = getBackgroundPreviewUrl(board.background);
                  return (
                    <button
                      key={board.id}
                      onClick={() => handleOpenBoard(board.id)}
                      className="text-left rounded-[8px] overflow-hidden bg-[#1f2023] hover:bg-[#27282c] transition-colors border border-[#2f3236]"
                    >
                      <div className="w-full h-[90px] bg-gray-600">
                        {bgUrl ? (
                          <img
                            src={bgUrl}
                            alt={board.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {board.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="px-3 py-2">
                        <div className="text-sm text-[#bfc1c4] truncate">
                          {board.name}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full text-center text-[#96999e] py-8 text-sm">
                  No boards found
                </div>
              )}
            </div>

            {/* Workspaces sections with chevrons */}
            {!debounced && (
              <div className="mt-6 space-y-4">
                {(
                  workspaces as unknown as WorkspaceWithBoardsDto[] | undefined
                )?.map((ws) => (
                  <div key={ws.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [ws.id]: !prev[ws.id],
                        }))
                      }
                      className="w-full flex items-center justify-between text-[#bfc1c4] text-sm py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block transition-transform ${
                            expanded[ws.id] ? "rotate-90" : "-rotate-90"
                          }`}
                        >
                          ›
                        </span>
                        <span className="font-semibold">{ws.name}</span>
                      </div>
                      <span className="text-xs text-[#96999e]">
                        {(boardsByWorkspace.get(ws.id) || []).length} boards
                      </span>
                    </button>

                    {expanded[ws.id] && (
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {(boardsByWorkspace.get(ws.id) || []).map((board) => {
                          const bgUrl = getBackgroundPreviewUrl(
                            board.background
                          );
                          return (
                            <button
                              key={board.id}
                              onClick={() => handleOpenBoard(board.id)}
                              className="text-left rounded-[8px] overflow-hidden bg-[#1f2023] hover:bg-[#27282c] transition-colors border border-[#2f3236]"
                            >
                              <div className="w-full h-[90px] bg-gray-600">
                                {bgUrl ? (
                                  <img
                                    src={bgUrl}
                                    alt={board.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                      {board.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="px-3 py-2">
                                <div className="text-sm text-[#bfc1c4] truncate">
                                  {board.name}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

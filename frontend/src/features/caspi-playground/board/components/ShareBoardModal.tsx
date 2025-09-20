import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Link2, ChevronDown, User, Crown, Shield } from "lucide-react";

interface Member {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar: string;
  avatarColor: string;
  isOnline?: boolean;
}

interface ShareBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "niv caspi",
    username: "niveh115",
    role: "Admin",
    avatar: "NC",
    avatarColor: "bg-teal-500",
    isOnline: true,
  },
  {
    id: "2",
    name: "ron mordukhovich",
    username: "ronmordukhovich",
    role: "Member",
    avatar: "RM",
    avatarColor: "bg-orange-500",
    isOnline: true,
  },
];

const roleOptions = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "observer", label: "Observer" },
];

export default function ShareBoardModal({
  isOpen,
  onClose,
}: ShareBoardModalProps) {
  const [emailInput, setEmailInput] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [activeTab, setActiveTab] = useState("members");

  console.log("ShareBoardModal rendered, isOpen:", isOpen);

  const handleShare = () => {
    // Handle sharing logic here
    console.log("Sharing with:", emailInput, "Role:", selectedRole);
    setEmailInput("");
  };

  const handleCreateLink = () => {
    // Handle link creation logic here
    console.log("Creating share link");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Crown className="h-3 w-3" />;
      case "Member":
        return <User className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md bg-[#2b2c2f] border-[#3c434a] text-white p-0 rounded-lg top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        showCloseButton={false}
      >
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-white">
              Share board
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-[#3c434a] rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Email/Name Input Section */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Email address or name"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 bg-[#37383b] border-[#4c4d51] text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-0"
              />
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-24 bg-[#37383b] border-[#4c4d51] text-white focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2b2c2f] border-[#3c434a]">
                  {roleOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-white hover:bg-[#3c434a] focus:bg-[#3c434a]"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleShare}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                Share
              </Button>
            </div>

            {/* Link Sharing Section */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Link2 className="h-4 w-4" />
              <span>Share this board with a link</span>
            </div>
            <Button
              variant="link"
              onClick={handleCreateLink}
              className="p-0 h-auto text-blue-400 hover:text-blue-300 text-sm ml-6"
            >
              Create link
            </Button>
          </div>

          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-[#37383b] border border-[#4c4d51] h-10">
              <TabsTrigger
                value="members"
                className="text-white data-[state=active]:bg-[#4c4d51] data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Board members
                <span className="ml-2 bg-[#4c4d51] text-white text-xs px-1.5 py-0.5 rounded">
                  {mockMembers.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="text-white data-[state=active]:bg-[#4c4d51] data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Join requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="mt-4">
              <div className="space-y-3 max-h-64 overflow-y-auto header-popover-scrollbar">
                {mockMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 hover:bg-[#37383b] rounded transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 ${member.avatarColor} rounded-full flex items-center justify-center text-xs font-semibold text-white`}
                      >
                        {member.avatar}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-white">
                            {member.name}
                            {member.id === "1" && " (you)"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span>@{member.username}</span>
                          <span>•</span>
                          <span>Workspace admin</span>
                        </div>
                      </div>
                    </div>
                    <Select defaultValue={member.role}>
                      <SelectTrigger className="w-20 h-8 bg-[#37383b] border-[#4c4d51] text-white text-xs focus:ring-0">
                        <div className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          <span className="text-xs">{member.role}</span>
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-[#2b2c2f] border-[#3c434a]">
                        {roleOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-white hover:bg-[#3c434a] focus:bg-[#3c434a] text-xs"
                          >
                            <div className="flex items-center gap-2">
                              {getRoleIcon(option.label)}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="mt-4">
              <div className="text-center text-gray-400 py-8">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No join requests</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, CreditCard, HelpCircle } from "lucide-react";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 h-8 w-8 rounded-full hover:bg-[#333c43]"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://trello-members.s3.amazonaws.com/686ff7a407dbdf7cc7289f2f/e06e0141fd06836dd83c83f407c4e19b/30.png"
              alt="User avatar"
            />
            <AvatarFallback>NC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* User Info */}
        <div className="px-3 py-2 border-b">
          <div className="text-sm font-medium">niv caspi</div>
          <div className="text-xs text-gray-500">niveh115</div>
        </div>

        <DropdownMenuItem className="flex items-center gap-3 p-3">
          <User className="h-4 w-4" />
          <span>Profile and visibility</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 p-3">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 p-3">
          <CreditCard className="h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-3 p-3">
          <HelpCircle className="h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-3 p-3 text-red-600">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

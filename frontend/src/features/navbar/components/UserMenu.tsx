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
import { useMe } from "@/features/auth/hooks/useMe";
import { useUser } from "@clerk/clerk-react";

export default function UserMenu() {
  const { data: user } = useMe();
  const { user: clerkUser } = useUser();

  const getInitials = (email: string) => {
    return email.split("@")[0].slice(0, 2).toUpperCase();
  };

  const fullName = clerkUser?.fullName || user?.email?.split("@")[0] || "User";
  const email = user?.email || clerkUser?.emailAddresses[0].emailAddress || "";
  const initials = getInitials(email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 h-8 w-8 rounded-full hover:bg-[#333c43]"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={clerkUser?.imageUrl}
              alt={`${fullName}'s avatar`}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* User Info */}
        <div className="px-3 py-2 border-b">
          <div className="text-sm font-medium">{fullName}</div>
          <div className="text-xs text-gray-500">{email}</div>
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

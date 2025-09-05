import type { User, Theme } from "@prisma/client";
import { UserDtoSchema, type UserDto } from "@ronmordo/types";

export function mapUserToDto(user: User): UserDto {
  const dto: UserDto = {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    username: user.username ?? null,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    theme: mapTheme(user.theme),
    emailNotification: user.emailNotification,
    pushNotification: user.pushNotification,
    createdAt: user.createdAt.toISOString(),
    bio: user.bio ?? null,
  };
  return UserDtoSchema.parse(dto);
}

function mapTheme(t: Theme): "light" | "dark" | "system" {
  switch (t) {
    case "Light":
      return "light";
    case "Dark":
      return "dark";
    case "System":
      return "system";
  }
}

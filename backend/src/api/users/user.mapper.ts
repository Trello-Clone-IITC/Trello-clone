import type { Prisma, User, Theme, $Enums } from "@prisma/client";
import { UserDtoSchema, type UserDto } from "@ronmordo/contracts";

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

export function mapUserDtoToCreateInput(dto: UserDto): Prisma.UserCreateInput {
  return {
    id: dto.id,
    clerkId: dto.clerkId,
    email: dto.email,
    username: dto.username ?? undefined,
    fullName: dto.fullName,
    avatarUrl: dto.avatarUrl,
    theme: mapThemeDto(dto.theme),
    emailNotification: dto.emailNotification,
    pushNotification: dto.pushNotification,
    createdAt: new Date(dto.createdAt),
    bio: dto.bio ?? undefined,
  };
}

function mapThemeDto(t: UserDto["theme"]): $Enums.Theme {
  switch (t) {
    case "light":
      return "Light";
    case "dark":
      return "Dark";
    case "system":
      return "System";
  }
}

import { UserDtoSchema } from "@ronmordo/contracts";
export function mapUserToDto(user) {
    const dto = {
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
function mapTheme(t) {
    switch (t) {
        case "Light":
            return "light";
        case "Dark":
            return "dark";
        case "System":
            return "system";
    }
}
export function mapUserDtoToCreateInput(dto) {
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
function mapThemeDto(t) {
    switch (t) {
        case "light":
            return "Light";
        case "dark":
            return "Dark";
        case "system":
            return "System";
    }
}

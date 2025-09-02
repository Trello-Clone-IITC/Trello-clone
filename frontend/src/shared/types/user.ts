export interface User {
  id: string;
  email: string;
}

export type CreateUserInput = Pick<User, "email">;

export type PatchUserInput = Partial<CreateUserInput>;

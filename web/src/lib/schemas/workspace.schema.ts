import { z } from "zod";

export const WorkspaceCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(80, "Name must be 80 characters or fewer"),
});

export const WorkspaceUpdateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  plan: z.enum(["free", "pro", "team"]).optional(),
});

export const WorkspaceMemberRoleSchema = z.enum(["owner", "admin", "member"]);

export type WorkspaceCreateInput = z.infer<typeof WorkspaceCreateSchema>;
export type WorkspaceUpdateInput = z.infer<typeof WorkspaceUpdateSchema>;

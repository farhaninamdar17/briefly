import { describe, it, expect } from "vitest";
import { hasRequiredRole, AuthenticatedUser } from "../lib/security/auth";

describe("Security: Role-Based Authorization Engine", () => {
  const adminUser: AuthenticatedUser = {
    id: "usr_admin",
    email: "admin@briefly.news",
    name: "Admin Lead",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  };

  const editorUser: AuthenticatedUser = {
    id: "usr_editor",
    email: "editor@briefly.news",
    name: "Senior Editor",
    role: "EDITOR",
    createdAt: new Date().toISOString(),
  };

  const normalUser: AuthenticatedUser = {
    id: "usr_reader",
    email: "reader@briefly.news",
    name: "Reader User",
    role: "USER",
    createdAt: new Date().toISOString(),
  };

  it("should grant ADMIN access to all operations", () => {
    expect(hasRequiredRole(adminUser, "ADMIN")).toBe(true);
    expect(hasRequiredRole(adminUser, "EDITOR")).toBe(true);
    expect(hasRequiredRole(adminUser, "USER")).toBe(true);
  });

  it("should permit EDITOR to manage stories but block ADMIN-only actions", () => {
    expect(hasRequiredRole(editorUser, "EDITOR")).toBe(true);
    expect(hasRequiredRole(editorUser, "USER")).toBe(true);
    expect(hasRequiredRole(editorUser, "ADMIN")).toBe(false);
  });

  it("should strictly deny USER from accessing EDITOR and ADMIN actions", () => {
    expect(hasRequiredRole(normalUser, "USER")).toBe(true);
    expect(hasRequiredRole(normalUser, "EDITOR")).toBe(false);
    expect(hasRequiredRole(normalUser, "ADMIN")).toBe(false);
  });

  it("should deny null or unauthenticated users", () => {
    expect(hasRequiredRole(null, "USER")).toBe(false);
    expect(hasRequiredRole(null, "ADMIN")).toBe(false);
  });
});

import { RoleGate } from "@/features/auth/role-gate";

export default function TraderLayout({ children }) {
  return <RoleGate allowedRoles={["trader", "admin"]} loginHref="/login">{children}</RoleGate>;
}

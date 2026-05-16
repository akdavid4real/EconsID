import { RoleGate } from "@/features/auth/role-gate";

export default function LenderLayout({ children }) {
  return <RoleGate allowedRoles={["lender", "admin"]} loginHref="/lender/login">{children}</RoleGate>;
}

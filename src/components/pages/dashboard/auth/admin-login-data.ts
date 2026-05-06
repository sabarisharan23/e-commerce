import { ADMIN_DEMO_CREDENTIALS } from "@/components/shared";

export const adminLoginContent = {
  eyebrow: "Admin Dashboard",
  heading: "Welcome back",
  description:
    "Sign in to manage products, orders, users, reports, and store operations from one place.",
  heroTitle: "Run the store with confidence",
  heroDescription:
    "Use the demo admin access below to explore the full Theni Store back-office experience.",
  credentials: [
    {
      label: "Demo Email",
      value: ADMIN_DEMO_CREDENTIALS.email,
    },
    {
      label: "Demo Password",
      value: ADMIN_DEMO_CREDENTIALS.password,
    },
  ],
  highlights: [
    "Catalog and inventory controls",
    "Orders, users, and review moderation",
    "Reports, offers, brands, and settings",
  ],
} as const;

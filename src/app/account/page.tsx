import { AccountPage } from "@/components/pages/account/account-page";
import { type AccountSection } from "@/components/pages/account/account-data";

const validSections = new Set<AccountSection>([
  "profile",
  "orders",
  "addresses",
  "payments",
  "settings",
]);

type AccountRouteProps = {
  searchParams: Promise<{
    section?: string | string[] | undefined;
  }>;
};

export default async function AccountRoute({ searchParams }: AccountRouteProps) {
  const { section } = await searchParams;
  const sectionValue = Array.isArray(section) ? section[0] : section;
  const initialSection = validSections.has(sectionValue as AccountSection)
    ? (sectionValue as AccountSection)
    : "profile";

  return <AccountPage key={initialSection} initialSection={initialSection} />;
}

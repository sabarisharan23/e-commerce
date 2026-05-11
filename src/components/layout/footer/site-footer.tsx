import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "About Us", href: "/info/about-us" },
  { label: "Shop All Products", href: "/products" },
  { label: "Our Team", href: "/info/our-team" },
  { label: "Contact Support", href: "/info/contact-support" },
  { label: "Terms of Service", href: "/info/terms-of-service" },
];

const productColumns = [
  [
    { label: "Bamboost", href: "/products?q=Bamboost" },
    { label: "Good morning mix", href: "/products?q=Good%20morning%20mix" },
    { label: "Bamboo rice puttu", href: "/products?q=Bamboo%20rice%20puttu" },
    { label: "Mappilai samba idiya...", href: "/products?q=Mappilai%20samba" },
    { label: "Nutsup", href: "/products?q=Nutsup" },
    { label: "Millet Flour", href: "/products?q=Millet%20Flour" },
    { label: "Drink Mix", href: "/products?category=drink-mix" },
  ],
  [
    { label: "Dosa Mix", href: "/products?q=Dosa%20Mix" },
    { label: "Diabetic Mix", href: "/products?category=diabetic-mix" },
    { label: "Protein Mix", href: "/products?category=protein-mix" },
    { label: "Health Mix", href: "/products?category=health-mix" },
    { label: "Weight Loss Mix", href: "/products?q=Weight%20Loss%20Mix" },
    { label: "Weight Gain Mix", href: "/products?q=Weight%20Gain%20Mix" },
    { label: "Healthy Ingredients", href: "/products?q=Healthy%20Ingredients" },
  ],
];

const customerServiceLinks = [
  { label: "Order Tracking", href: "/info/order-tracking" },
  { label: "Return Policy", href: "/info/return-policy" },
  { label: "Shipping Info", href: "/info/shipping-info" },
  { label: "FAQs", href: "/info/faqs" },
  { label: "Gift Cards", href: "/info/gift-cards" },
  { label: "Become a Seller", href: "/info/become-a-seller" },
  { label: "Advertise", href: "/info/advertise" },
];

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="mt-1 h-6 w-6 shrink-0 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h3l1.6-2h6.8L17 7h3v11H4z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.6a2 2 0 0 1-.6 1.8L7 10a16 16 0 0 0 7 7l1.9-1.9a2 2 0 0 1 1.8-.6l2.6.4A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

function FooterLogo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Theni Store home">
      <Image
        src="/images/logos.png"
        alt="Theni Store"
        width={2458}
        height={1745}
        sizes="(max-width: 640px) 9rem, 12rem"
        className="h-24 w-auto object-contain sm:h-28"
      />
    </Link>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className="text-[1.2rem] font-semibold text-[#17213d] sm:text-[1.35rem]">
        {title}
      </h2>
      <ul className="mt-5 space-y-3 text-[0.98rem] font-medium text-[#5e7697] sm:mt-6 sm:space-y-4 sm:text-[1.02rem]">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="transition-colors hover:text-[#294b72]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterActionButton({
  label,
  children,
  href,
}: {
  label: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#fcf6eb] text-[#111]">
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[15rem] bg-[url('/footer/footer-landscape-v2.png')] bg-cover bg-center bg-no-repeat sm:h-[20rem] lg:h-[28rem]"
        />

        <div className="relative w-full px-4 pt-10 pb-[16rem] sm:px-6 sm:pt-12 sm:pb-[21rem] lg:px-8 lg:pb-[28rem]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.85fr_1.45fr_0.9fr] lg:gap-12">
            <div className="max-w-md">
              <FooterLogo />
              <p className="mt-6 text-[0.98rem] font-medium leading-[1.65] text-[#5e7697] sm:text-[1.02rem]">
                Connecting you to pure millet products directly from Theni Store.
                No chemicals, no added sugar just natural wellness solutions for
                modern life.
              </p>
              <div className="mt-6 flex items-start gap-3 text-[0.98rem] font-semibold leading-[1.55] text-[#415b36] sm:text-[1.02rem]">
                <LocationIcon />
                <p>
                  Gokulam Colony, SPK Road,
                  <br />
                  Chinnamanur, Theni District,
                  <br />
                  Tamil Nadu
                </p>
              </div>
            </div>

            <FooterLinkColumn title="Quick Links" links={quickLinks} />

            <div>
              <h2 className="text-[1.2rem] font-semibold text-[#17213d] sm:text-[1.35rem]">
                Products
              </h2>
              <div className="mt-5 grid gap-5 sm:mt-6 sm:grid-cols-2">
                {productColumns.map((column, index) => (
                  <ul
                    key={`product-column-${index}`}
                    className="space-y-3 text-[0.98rem] font-medium text-[#5e7697] sm:space-y-4 sm:text-[1.02rem]"
                  >
                    {column.map((link) => (
                      <li key={`${link.label}-${link.href}`}>
                        <Link href={link.href} className="transition-colors hover:text-[#294b72]">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <FooterLinkColumn
              title="Customer Service"
              links={customerServiceLinks}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#4d7842]">
        <div className="flex w-full flex-col gap-4 px-4 py-4 text-white sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="text-sm font-medium sm:text-base">
            © 2026 Theni Stores. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <FooterActionButton label="Gallery" href="/products">
              <CameraIcon />
            </FooterActionButton>
            <FooterActionButton label="Payments" href="/account?section=payments">
              <CardIcon />
            </FooterActionButton>
            <FooterActionButton label="Contact" href="/info/contact-support">
              <PhoneIcon />
            </FooterActionButton>
          </div>
        </div>
      </div>
    </footer>
  );
}

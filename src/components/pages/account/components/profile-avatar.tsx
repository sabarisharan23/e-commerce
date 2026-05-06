"use client";

type ProfileAvatarProps = {
  initials: string;
  name: string;
  variant?: "round" | "square";
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-14 w-14 text-lg",
  md: "h-20 w-20 text-2xl",
  lg: "h-36 w-36 text-4xl",
};

export function ProfileAvatar({
  initials,
  name,
  variant = "round",
  size = "md",
}: ProfileAvatarProps) {
  return (
    <div
      aria-label={name}
      className={[
        "inline-flex items-center justify-center border border-white/70 bg-[linear-gradient(145deg,#f8dccd,#e8b79d)] font-bold tracking-[0.08em] text-[#23304b] shadow-[0_16px_40px_rgba(28,36,58,0.12)]",
        sizeClasses[size],
        variant === "round" ? "rounded-full" : "rounded-[1.6rem]",
      ].join(" ")}
    >
      {initials}
    </div>
  );
}

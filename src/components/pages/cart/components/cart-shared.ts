export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getPackLabel(name: string) {
  const parts = name.split(" - ");
  const variant = parts.length > 1 ? parts[parts.length - 1] : "";

  if (/\d/.test(variant)) {
    return `${variant} Pack`;
  }

  return "Standard Pack";
}

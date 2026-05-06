export type ProfileInformation = {
  fullName: string;
  email: string;
  phone: string;
  updatedLabel: string;
};

export type LoginActivity = {
  id: string;
  device: string;
  location: string;
  status: string;
};

export type PaymentMethodToggle = {
  id: string;
  label: string;
  enabled: boolean;
};

export type DeliveryPinCode = {
  id: string;
  pinCode: string;
  areaName: string;
  deliveryTime: string;
};

export type NotificationPreference = {
  id: string;
  alertType: string;
  email: boolean;
  sms: boolean;
  push: boolean;
};

export type RolePermission = {
  id: string;
  module: string;
  admin: boolean;
  manager: boolean;
  staff: boolean;
};

export type IntegrationCard = {
  id: string;
  name: string;
  description: string;
  status: "Connected" | "Not Active";
  actionLabel: string;
  icon: "stripe" | "shipping" | "analytics";
};

export const settingsPageData = {
  heading: "Settings",
  description: "Configure your store preferences and account security",
  profileInformation: {
    fullName: "Administrator",
    email: "admin@thenistores.com",
    phone: "+91 98765 43210",
    updatedLabel: "Last updated: 2 hours ago",
  } satisfies ProfileInformation,
  security: {
    passwordStrengthLabel: "Password strength: Weak. Use symbols and numbers.",
    twoFactorEnabled: true,
    twoFactorLabel: "2FA Enabled",
    loginActivity: [
      {
        id: "macbook",
        device: 'MacBook Pro 16" - Chrome',
        location: "Theni, India • Active now",
        status: "current",
      },
      {
        id: "iphone",
        device: "iPhone 15 Pro - Safari",
        location: "Chennai, India • 4 hours ago",
        status: "recent",
      },
    ] satisfies LoginActivity[],
  },
  storeSettings: {
    storeName: "Theni Stores",
    gstNumber: "33AABCU1234F1Z1",
    address: "No 12, Main Bazaar Road, Theni, Tamil Nadu - 625531",
    supportEmail: "support@thenistores.com",
    supportPhone: "1800-STORE-THENI",
  },
  paymentMethods: {
    connectedLabel: "Gateway Connected",
    toggles: [
      { id: "upi", label: "UPI", enabled: true },
      { id: "cards", label: "Cards", enabled: true },
      { id: "netbanking", label: "Net Banking", enabled: false },
      { id: "cod", label: "COD", enabled: true },
    ] satisfies PaymentMethodToggle[],
    gatewayName: "Razorpay API Configuration",
    gatewayKeyLabel: "API Key",
    gatewayKey: "rzp_live_v98sh872635hhs",
  },
  deliveryConfiguration: {
    standardCharge: "50",
    freeDeliveryThreshold: "999",
    pinCodes: [
      { id: "625531", pinCode: "625531", areaName: "Theni Main", deliveryTime: "24 Hours" },
      { id: "625513", pinCode: "625513", areaName: "Andipatti", deliveryTime: "48 Hours" },
    ] satisfies DeliveryPinCode[],
  },
  notificationPreferences: [
    { id: "orders", alertType: "New Orders", email: true, sms: true, push: true },
    { id: "failures", alertType: "Payment Failures", email: true, sms: false, push: true },
    { id: "stock", alertType: "Stock Alerts", email: true, sms: false, push: false },
  ] satisfies NotificationPreference[],
  userRolePermissions: [
    { id: "products", module: "Products", admin: true, manager: true, staff: false },
    { id: "orders", module: "Orders", admin: true, manager: true, staff: true },
    { id: "reports", module: "Reports", admin: true, manager: false, staff: false },
  ] satisfies RolePermission[],
  integrations: [
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept international credit cards and Apple Pay.",
      status: "Connected",
      actionLabel: "Disconnect",
      icon: "stripe",
    },
    {
      id: "shiprocket",
      name: "Shiprocket",
      description: "Multi-courier shipping and order tracking.",
      status: "Connected",
      actionLabel: "Disconnect",
      icon: "shipping",
    },
    {
      id: "ga4",
      name: "Google Analytics 4",
      description: "Track user behavior and conversion rates.",
      status: "Not Active",
      actionLabel: "Connect Account",
      icon: "analytics",
    },
  ] satisfies IntegrationCard[],
};


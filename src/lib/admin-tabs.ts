export const ADMIN_TABS = [
  { id: "carousel", label: "Carousel" },
  { id: "products", label: "Products" },
  { id: "codes", label: "Codes" },
  { id: "blog", label: "Blog" },
  { id: "testimonials", label: "Testimonials" },
] as const;

export type AdminTabId = (typeof ADMIN_TABS)[number]["id"];

function isAdminTabId(value: string): value is AdminTabId {
  return ADMIN_TABS.some((tab) => tab.id === value);
}

export function resolveAdminTab(tab?: string): AdminTabId {
  if (tab && isAdminTabId(tab)) return tab;
  return "carousel";
}

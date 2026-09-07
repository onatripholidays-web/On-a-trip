declare interface Window {
  TeamOAT?: {
    openModule: (key: string, params?: Record<string, string>) => void;
  };
  crmAuthUser?: unknown;
  crmProfile?: { role?: string; salesperson?: string; [key: string]: unknown };
  supabase?: unknown;
  XLSX?: unknown;
}

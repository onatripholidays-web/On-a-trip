V32 Admin Login

- admin.html is now the admin login screen.
- admin-dashboard.html is the protected content manager.
- Starter credentials in this static build:
  Admin ID: admin
  Password: OnATrip@2026
- Change these credentials in admin.html before production deployment.
- Current package/batch/blog data tools still use browser localStorage. A secure shared backend (Supabase/Firebase/custom API) is required for multi-device/team editing and for changes to persist publicly across all visitors.

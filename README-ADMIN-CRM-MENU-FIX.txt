ON A TRIP HOLIDAYS — ADMIN CRM MENU FIX

GitHub direct write was blocked by the connected GitHub integration (403), so these two ready-to-upload files are provided:

1. admin-v4-crm-final.html
   - Keeps the existing admin-v4-crm.html dashboard unchanged inside an iframe.
   - Removes Blog / SEO from the visible sidebar.
   - Replaces Enquiries with 🔐 CRM Login.
   - CRM Login opens crm.html (the secure Supabase CRM).
   - Removes old Blog/SEO quick actions.
   - Changes Quick Lead / old CRM shortcuts to CRM Login.

2. admin.html
   - After successful admin login, opens admin-v4-crm-final.html instead of admin-v4-crm.html.

Upload/replace both files in the repository root on the main branch.
No changes are required to crm.html or Supabase.

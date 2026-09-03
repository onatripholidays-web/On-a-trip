# V35 — Payment Invoicer Changes Only

- Added `admin-dashboard.html` with AI Quotation Maker + Payment Invoicer modules.
- Removed the Update Photos module from this new admin dashboard.
- Added `payment-invoicer.html`, styled as a travel confirmation voucher/payment invoice based on the supplied reference PDF.
- Added booking ID/date, trip dates, places, booking type, guest contact/email/Aadhaar/address, tariff, pax, inclusions, total, advance, balance, payment status/mode/date, notes, terms and company payment details.
- Payment invoice is printable / Save as PDF from the browser.
- Paid quotation now opens the Payment Invoicer with the quote data prefilled through localStorage.
- Full payment displays `PAID IN FULL` and `₹ 0` balance.
- Replaced admin branding references with the main website `assets/logo.png`.
- Existing AI quotation, negotiation and editable itinerary workflow retained.

## Important
The admin login in the existing V34 flow is still client-side demo authentication. It does not provide real server-side password verification or password reset. A production-secure auth backend is required for real credentials.

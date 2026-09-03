# V29 — Branded Editable Quote + PDF

Update-only patch for On A Trip Holidays.

## Added

1. On A Trip Holidays logo in the admin builder and printable quotation.
2. Editable itinerary after AI generation:
   - Day title
   - Day summary
   - Day hotel
   - Day meals
   - Accommodation
   - Transport
   - Meals
   - Inclusions
   - Exclusions
   - Quote
   - Important notes
3. Branded A4 print/save-to-PDF layout.
4. Payment details from the supplied Char Dham PDF.
5. Payment QR from the supplied PDF.
6. Guest/destination/duration/traveller/date details on the PDF.
7. WhatsApp share and draft saving retained.

## Payment information taken from the supplied PDF

- Account Name: ON A TRIP HOLIDAYS.
- Account Number: 2602261212328370
- Account Type: Current Account
- IFSC: AUBL0002612
- Branch Address: House No 25 A, GF, Nandanavanam Complex, SR Nagar Main Rd, Vengal Rao Nagar, Sunder Nagar, Hyderabad, Telangana 500038
- UPI No.: 8125248909
- UPI ID: onatripholidays0976@aubank
- Booking instruction: Rs. 5000/- per person advance; remaining amount 7 days prior to trip; reconfirm on +91-8125248909.

## Upload

Replace/add only:
- admin-ai-itinerary.html
- assets/on-a-trip-logo.png
- assets/payment-qr.png

Do not replace the rest of the website.

After Vercel deploys, open:
https://www.onatripholidays.com/admin-ai-itinerary.html

Generate an itinerary, tap Edit Itinerary, make any changes, then tap Create Branded PDF.
The browser print dialog is used to save the quotation as PDF.

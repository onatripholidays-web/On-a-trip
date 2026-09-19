# On A Trip CRM — Travel OS Enhancement Scope

This implementation extends the existing CRM into a full travel-agency operating system.

## Sales
- Lead scoring and Hot/Warm/Cold temperature
- Lead → Follow-up → Quotation → Negotiation → Booking pipeline
- Sales targets and incentive rules
- Campaign/source attribution
- Customer 360 foundation

## Quotations & Commercials
- Quotation header and line items
- Cost price vs selling price
- Discount and tax
- Acceptance/rejection lifecycle
- Trip profitability foundation

## Trip Operations
- Unique Trip ID
- Traveller records
- Hotel/transport/activity/service records
- Supplier confirmation tracking
- Voucher records
- Operations ownership
- Tour dates and trip status

## Finance
- Customer ledger
- Supplier ledger
- Collections/outstanding foundation
- Trip-level cost, revenue and gross margin
- Incentive payouts

## Customer Experience
- Customer document records
- Secure expiring/revocable trip portal tokens
- Feedback/review records

## Marketing & Automation
- Campaigns
- Spend/leads/bookings/revenue attribution
- Automation rules with conditions/actions

## UI work to connect to these primitives
1. Sales dashboard and salesperson scorecards
2. Quotation cost calculator and PDF/share workflow
3. Trip Operations workspace
4. Supplier ledger and confirmations
5. Customer ledger and payment timeline
6. Customer portal
7. Campaign dashboard
8. Automation builder
9. Incentive dashboard
10. Post-trip feedback workflow

All new tables use RLS and are intended to be accessed through the CRM's server-side authorization layer.

Final Project Specification: SmartDine POS & Reservation System

1. Core Vision
   A comprehensive restaurant management system that bridges Pre-booking with Real-time Point of Sale (POS). calculates profits, manages staff shifts (Wardia), and supports multi-platform responsiveness (Mobile/Tablet/Desktop).

2. Technical Stack
   Framework: Next.js 14+ (App Router).

Database: MongoDB Atlas with Mongoose ORM.

UI: Shadcn UI + Tailwind CSS (Mobile-First approach).

State & Logic: React Server Actions (for all DB writes).

Theming: Dark/Light mode (Next-Themes).

Internationalization: Arabic (RTL) & English (LTR) support.

3. User Roles & Authentication
   Admin: Full access to analytics, profit reports, menu editing, and shift history.

Cashier/Staff: Access to POS, table management, and personal shift reports.

System Feature: Each User is linked to a Staff record containing their name and employee details.

4. Database Models (Mongoose)
   A. Staff & Shifts
   Staff: Name, Email, Role (Admin/Cashier), isActive.

Shift (الوردية): staffId, startTime, endTime, openingBalance, totalCashSales, totalVisaSales, status (Open/Closed).

B. Menu
MenuItem: Name (AR/EN), Category, costPrice, salePrice, quantity (Stock), isAvailable.

Logic: Alert if quantity < 5. Total profit per item = (salePrice - costPrice) \* quantity.

C. Reservations & Tables
Table: Table Number, Capacity, Status (Available/Occupied/Reserved).

Reservation: Customer Name, Phone, tableId, startTime, endTime, partySize, status.

D. Orders & Billing
Order: shiftId, staffId, tableId, items (Array of objects), totalAmount, paymentMethod (Cash/Visa), isPaid.

5. Key Features & Pages
   📱 POS Interface (Mobile & Tablet Optimized)
   Table Grid: Visual representation of tables and their status.

Order Management: Add/Remove items from the menu to a specific table.

Billing: Quick checkout with "Cash" or "Visa" options.

💰 Treasury & "Wardia" Logic
Shift Opening: Staff must enter "Opening Cash" to start the day.

Shift Closing: Systematic summary of all transactions during the shift, segmented by payment method.

Closing Report: Compares "Expected Cash" vs. "Actual Cash" entered by the staff.

📈 Reports & Analytics (Admin Only)
Stock Valuation: Total value of current stock based on cost price.

Shift History: Ability to review any past shift and who was responsible.

6. Development Workflow for the Agent
   Initial Setup: Install lucide-react, shadcn/ui, mongoose, next-themes, and next-intl.

Layouts: Create a responsive Sidebar for Desktop and a Bottom-Nav for Mobile.

Database: Initialize MongoDB connection and define the 6 core schemas mentioned above.

Server Actions: Create actions for: openShift, closeShift, createOrder, updateStock.

Dashboard: Build the POS table grid and the Menu management CRUD.

💡 Final Note for the Agent:
Ensure all currency displays and dates are formatted according to the selected language (Arabic/English). Use MongoDB Transactions for the closeShift and createOrder actions to ensure data integrity.

# Chowly - Project Documentation
**Live Demo URL:** [https://chowly-omega.vercel.app](https://chowly-omega.vercel.app)


## 1. How I Built It

### The Tech Stack
For this project, I used tools that made it easy to build a full-stack application (meaning it has both a front-end user interface and a back-end database):
*   **Next.js (React):** This is the main framework I used to build the website. It lets me write UI components and handle backend logic (Server Actions) all in one place.
*   **Tailwind CSS:** I used this to style the application. Instead of writing separate CSS files, Tailwind lets me add styles directly inside my code (like `text-center` or `bg-blue-500`), which made making the app responsive for mobile phones much easier.
*   **Supabase (PostgreSQL):** This is where the actual live database lives. It stores all the restaurants, menus, staff, and orders.
*   **Prisma:** This is an ORM (Object-Relational Mapper). It basically acts as a translator between my Next.js code and the Supabase database. Instead of writing complex SQL queries, I just write simple JavaScript commands like `prisma.order.create()`.
*   **Vercel:** I used Vercel to deploy the application so anyone on the internet can access it.

### The Data Model
My database consists of a few connected tables:
*   **Restaurant:** Stores the name, location, and images for the different vendors in the marketplace.
*   **Menu:** Holds the food and drinks. Each item has a `name`, `price`, `preparationTime`, and an `itemType` (Food or Drink).
*   **Staff:** Stores the names and roles (Chef, Bartender, Waiter) for each restaurant.
*   **Order:** The core of the app. It tracks the `status` (pending, served, failed, paid), the `waitingTime`, and which staff members prepared it.
*   **OrderItem:** Connects the Order to the specific Menu items the customer chose, tracking the `quantity`.
*   **Payment:** Records the final amount, the payment method (Card or Cash), and any tip the customer added.
*   **Review:** If an order is delayed, this stores the 1-5 star rating and the customer's written complaint.

## 2. How I Used AI

To build this project, I worked with an AI coding assistant. It was incredibly helpful, but I still had to guide it strictly to meet all the assignment requirements.

*   **What I asked it to do:** I asked the AI to help me set up the initial Next.js boilerplate, connect Prisma to my Supabase database, and build the basic layout for the Customer and Waiter screens using modern UI components. I also asked it to help me seed the database with realistic restaurants and menus.
*   **What I accepted:** I gladly accepted the AI's help with writing the Tailwind CSS styling, building the database connection logic, and writing the Server Actions (the backend functions that read and write data).
*   **What I had to correct myself:** The AI didn't always get the logic right on the first try. For example:
    *   The AI initially made the Waiter's assignment dropdowns too basic. I had to explicitly instruct it to make the dropdowns "smart" (e.g., if an order only contains Food, the Bartender dropdown should be disabled).
    *   The AI initially made the payment button just a single click. I rejected that and instructed it to build a much more convincing "dummy payment flow" where the user can choose Card or Cash and add an optional tip.
    *   I had to correct the AI to fix responsive design issues so the app would look good on small mobile screens, not just large laptops.
    *   I also had to guide the AI to fix a deployment bug where Vercel wasn't generating the Prisma client properly.

## 3. How the Application Behaves (The Story)

Here is exactly what happens under the hood as a user moves through the app:

1.  **Menu Browsing:** The app fetches the menu list from the database. The customer views the items and clicks "+" to add them to their cart. 
2.  **Order Placement:** When the customer clicks "Place Order", the app calculates the total estimated waiting time by finding the longest `preparationTime` in their cart (since kitchens cook items in parallel). It saves the order to the database with a status of `pending`.
3.  **Kitchen Processing:** The order immediately appears on the Waiter's screen. Because it's `pending`, the Waiter knows it needs to be made.
4.  **Order Assignment:** The Waiter selects a Chef (and/or Bartender) from a dropdown list to take responsibility for the order. Once the food is ready, the Waiter clicks "Mark as Served". The database updates the order status to `served`.
5.  **Complaint and Rating:** Back on the Customer screen, the app is checking the time. If the time since the order was placed is *greater* than the estimated waiting time, a "Running late?" warning appears. Once the order is served, if it was delayed, a 1-5 star rating and text box appear so the customer can complain.
6.  **Payment:** Finally, the customer is presented with a checkout screen. They select a tip, choose Card or Cash, and click Pay. The system creates a `Payment` record in the database, and the order is complete!

## 4. Stranger's Walkthrough Guide

Want to test it out yourself? Follow these simple steps:

**Step 1: Visit the Live App**
Go to the deployed link: https://chowly-omega.vercel.app

**Step 2: Act as the Customer**
*   You will land on the Marketplace homepage. Click on any restaurant (like "Burger Lounge" or "Ocean Basket").
*   You are now looking at the Customer Menu. Add a few items to your cart by clicking the "+" buttons.
*   *Optional:* Type a special instruction in the note box (e.g., "No onions").
*   Click **Place Order**. You will see your digital receipt and an estimated waiting time.

**Step 3: Switch to the Waiter**
*   Look at the top-right corner of the screen. You will see a toggle switch. Click **Waiter**.
*   You will now see the Kitchen Dashboard. Find your recent order under "Pending Orders".
*   Use the dropdown menus to assign a Chef and a Bartender. *(Notice how if you didn't order a drink, the Bartender dropdown is disabled!)*
*   Click **Mark as Served**. 

**Step 4: Switch back to Customer**
*   Click the toggle in the top-right back to **Customer**.
*   Your receipt will now say "SERVED". 
*   *Note: If you wait longer than the estimated waiting time before the Waiter serves it, you will be prompted to leave a star rating and complaint.*
*   Scroll down to the Payment section. Choose a tip amount, select "Pay with Card" (you can type fake numbers), and click **Pay**.
*   You're done! You can click "Start New Order" to do it all again.

# 🎮 Casino Game Platform

A full-featured casino gaming application built using **Node.js/Express** for the backend, **React.js/Redux** for the frontend, and **HTML Canvas** for rendering game graphics.

### 🎲 Available Games

- Roulette
- Blackjack
- Slot Machines
- Craps
- Poker (5 Card Draw & Texas Hold’em)
- Keno
- Race Betting

---

## 📋 Project Requirements

### 1. Write your opinion here

    - Strengths and weaknesses of UI/UX
        Strengths:
        - Use of CSS variables for theming is a good practice.
        - The project has a component-based architecture, which helps in code organization.
        - It includes some media queries, showing an intention for responsiveness.

        Weaknesses:
        - The application relies on a single, massive CSS file (over 4,500 lines), which is detrimental to performance and maintainability.
        - Widespread use of fixed units (`px`) for fonts, spacing, and layout dimensions makes the UI rigid and not scalable. It's better to use relative units like `rem` and `em`.
        - Overuse of `position: absolute` and fixed heights can lead to layout issues on different screen sizes.
        - Presence of `!important` overrides in the CSS, which is a sign of specificity issues and makes the code harder to debug.
        - Lack of a clear CSS methodology like BEM or CSS Modules makes the styling hard to scale.
        - Media queries are not consolidated, leading to repetitive code.

    - Crypto Payment Logic Assessment & Suggest improvements
        Assessment:
        - The backend uses a third-party service (NowPayments), which is a good approach to offload the complexity of handling crypto transactions.

        Suggested Improvements:
        - **Remove Hardcoded API Keys**: The API key is currently hardcoded in `server/payments/cryptoPayment.js`. This is a major security flaw. It should be stored securely in an environment variable (`.env` file) and accessed via `process.env`.
        - **Implement Secure Webhooks (IPN)**: The current payment confirmation flow relies on a client-side redirect (`success_url`), which is insecure and can be spoofed. The system should use server-to-server Instant Payment Notifications (IPNs)/webhooks provided by NowPayments to securely verify transaction status if NowPayments have one. The webhook endpoint should also validate the incoming request signature to ensure it's from NowPayments.
        - **Add Server-Side Validation**: There is no server-side validation for the data received from the client when creating an invoice or confirming a payment. The server should validate all inputs (e.g., amount, currency) to prevent invalid data from being processed.
        - **Improve Error Handling**: The current error handling may expose sensitive information. It's better to log detailed errors on the server and return generic, user-friendly messages to the client.
        - **Integrate with a Database**: The payment logic does not seem to interact with a database to persist transaction records or link them to users. A successful payment should trigger an update in the database (e.g., updating a user's balance or order status). In fact, I had to create mock database responses for the sign in and sign up to really see what happens when a user successfully logs in.

### 2. Wallet Integration

- Integrate wallet connection as a **precondition** for sign-in.
  - I built the wallet connection as the first page the user sees before going into the app. I ensured I used themes around the app and application main font for the buttons, although it is not as readable as I want it.
- Maintain the existing sign-in flow, but ensure users can only authenticate **after a successful wallet connection**
  I maintained the existing sign-in flow, but the socket wasn't returning any response when someone tries signing in or signing up, so after some debugging, I understood that there was really no working database connection. To avoid doing so much on what I wasn't asked to do, I just created a simple mock database to use for the sign in and sign up and so if you clone the app, and install the packages and do the normal "npm run dev", the two servers will spin up and also a build for the client will be generated, and when you launch the app on port 1111, you'll notice that not only can a user connect their metamask, they can as well sign in and see the dashboard.

To spin up this application, for test purposes, remember to fill at least the required 4 environment variables:
NODE_ENV=development
PORT=1111
BASE_URL=http://localhost:1111
STRIPE_TEST_KEY=[Please put the value that was previously hardcoded in the code]

Please keep these environment variables inside a .env.development in the server folder. /server/.env.development
Please note that the test key was previously hardcoded, so In had to put it in an environment variable.

Also, one more suggestion for improvement will be to abstract css styling to libraries like Tailwindcss, it is easier to use and more maintainable.

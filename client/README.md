# Valentine Proposal Web App 💖

Your viral Valentine app is ready!

## 🚀 How to Run

1.  **Start the App** (If not already running):
    ```bash
    npm run dev
    npx convex dev
    ```
    Access the app at: `http://localhost:5173`

## 📧 Email Setup (Optional)

To enable the "Send via Email" feature securely or to use the backend mechanism:

1.  Get an API Key from [Resend](https://resend.com).
2.  Add it to your Convex Dashboard:
    - Go to your Convex Dashboard (link in terminal output of `npx convex dev`).
    - Navigate to **Settings** > **Environment Variables**.
    - Add `RESEND_API_KEY` with your key.

## 🛠 Features

- **Sender Flow (`/`)**: Create a personal link.
- **Receiver Flow (`/v/:id`)**: The interactive proposal.
  - **Desktop**: The "No" button runs away on hover!
  - **Mobile**: Tapping "No" makes "Yes" grow until it's the only option!
- **Celebration**: Confetti and a happy message on acceptance.

## 🎨 Customization

- **Styles**: Edit `src/index.css` to change colors/fonts.
- **Image**: Replace `public/valentine-bear.png` with your own image.

Enjoy spreading the love! 💘

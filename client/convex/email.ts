"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { Resend } from "resend";

declare const process: any;

export const send = action({
  args: {
    toEmail: v.string(),
    link: v.string(),
    senderName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY is not set in Convex environment variables.",
      );
    }

    const resend = new Resend(apiKey);
    const sender = args.senderName || "An Admirer";

    try {
      await resend.emails.send({
        from: "Valentine <onboarding@resend.dev>", // Default Resend test email
        to: args.toEmail,
        subject: `${sender} sent you a Valentine! 💖`,
        html: `
          <div style="font-family: sans-serif; text-align: center; color: #590d22; background-color: #fff0f3; padding: 40px; border-radius: 10px;">
            <h1 style="color: #ff4d6d;">Start of layout?</h1>
            <p style="font-size: 18px;">${sender} has asked you a very special question.</p>
            <div style="margin: 30px 0;">
              <a href="${args.link}" style="background: linear-gradient(135deg, #ff4d6d, #c9184a); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px;">Open My Valentine</a>
            </div>
            <p style="color: #800f2f; font-size: 14px;">(Click the button to reveal the message!)</p>
          </div>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send email");
    }
  },
});

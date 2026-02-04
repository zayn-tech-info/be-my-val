import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    senderName: v.optional(v.string()),
    senderEmail: v.optional(v.string()), // Added argument
    receiverEmail: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("valentines", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
    return id;
  },
});

export const get = query({
  args: { id: v.id("valentines") },
  handler: async (ctx, args) => {
    const valentine = await ctx.db.get(args.id);
    return valentine;
  },
});

export const accept = mutation({
  args: { id: v.id("valentines") },
  handler: async (ctx, args) => {
    const valentine = await ctx.db.get(args.id);
    if (!valentine) throw new Error("Valentine not found");

    await ctx.db.patch(args.id, { status: "accepted" });

    // Future: trigger email to senderEmail here via internal action
  },
});

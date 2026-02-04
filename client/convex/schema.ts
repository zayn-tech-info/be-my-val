import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  valentines: defineTable({
    senderName: v.optional(v.string()),
    senderEmail: v.optional(v.string()), // Added for notifying the creator
    receiverEmail: v.string(),
    message: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
  }),
});

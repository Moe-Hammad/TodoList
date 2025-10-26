import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTodos = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").order("desc").collect();
    return todos;
  },
});

export const addTodo = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const todoID = await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
    });
    return todoID;
  },
});

export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todobyId = await ctx.db.get(args.id);
    if (!todobyId) {
      throw new ConvexError("Todo does not exist.");
    }
    await ctx.db.patch(args.id, {
      isCompleted: !todobyId.isCompleted,
    });
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateTodo = mutation({
  args: { id: v.id("todos"), text: v.string() },
  handler: async (ctx, args) => {
    const todobyId = await ctx.db.get(args.id);
    if (!todobyId) {
      throw new ConvexError("Todo does not exist.");
    }
    await ctx.db.patch(args.id, {
      text: args.text,
    });
  },
});

export const clearAllTodos = mutation({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();

    for (const td of todos) {
      await ctx.db.delete(td._id);
    }
    return { deletedCount: todos.length };
  },
});

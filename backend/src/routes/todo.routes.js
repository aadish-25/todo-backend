import { Router } from "express";
import { Todo } from "../models/todo.models.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// ============================
// GET all todos
// ============================
router.route("/").get(async function (req, res) {
  try {
    const allTodos = await Todo.find({ owner: req.user._id });

    // Map todos and send as JSON with status 200
    res.status(200).json(
      allTodos.map((todo) => ({
        id: todo._id,
        name: todo.name,
        title: todo.title,
        content: todo.content,
        isCompleted: todo.isCompleted,
      }))
    );
  } catch (error) {
    // Send error response if DB query fails
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ============================
// POST create a todo
// ============================
router.route("/").post(async function (req, res) {
  try {
    const { name, title, content } = req.body;

    // Create a new Todo in the database with owner
    const newTodo = await Todo.create({
      name,
      title,
      content,
      owner: req.user._id
    });

    // Send response with created todo
    res.status(201).json({
      message: "Todo created",
      data: {
        id: newTodo._id,
        name: newTodo.name,
        title: newTodo.title,
        content: newTodo.content,
        isCompleted: newTodo.isCompleted,
      }
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(400).json({ error: "Failed to create todo" });
  }
});

// ============================
// PATCH update a todo
// ============================
router.route("/:id").patch(async function (req, res) {
  try {
    const idToUpdate = req.params.id;
    const { name, title, content, isCompleted } = req.body;

    // Find todo by ID and owner
    const findTodo = await Todo.findOne({ _id: idToUpdate, owner: req.user._id });
    if (!findTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Update fields if provided
    if (name !== undefined) findTodo.name = name;
    if (title !== undefined) findTodo.title = title;
    if (content !== undefined) findTodo.content = content;
    if (isCompleted !== undefined) findTodo.isCompleted = isCompleted;

    const updatedTodo = await findTodo.save();

    res.status(200).json({
      updated: true,
      data: {
        id: updatedTodo._id,
        name: updatedTodo.name,
        title: updatedTodo.title,
        content: updatedTodo.content,
        isCompleted: updatedTodo.isCompleted,
      }
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(400).json({ updated: false });
  }
});

// ============================
// DELETE a todo
// ============================
router.route("/:id").delete(async function (req, res) {
  try {
    const idToDelete = req.params.id;

    // Find and delete todo by ID and owner
    const deletedTodo = await Todo.findOneAndDelete({
      _id: idToDelete,
      owner: req.user._id
    });

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ deleted: true });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(400).json({ deleted: false });
  }
});

export default router;

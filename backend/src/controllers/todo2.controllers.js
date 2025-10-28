import { Todo } from "../models/todo.models";


// GET request - show all todos

export const getTodos = async function (req, res) {
  try {
    const allTodos = await Todo.find();

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
};

// POST request - create a todo

export const postTodos = async function (req, res) {
  try {
    const { name, title, content } = req.body;

    // Create a new Todo in the database
    const newTodo = await Todo.create({ name, title, content });

    // Send response with created todo
    res.status(201).json({ message: "Todo created", data: newTodo });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(400).json({ error: "Failed to create todo" });
  }
};

// PATCH request - update a todo

export const patchTodos = async function (req, res) {
  try {
    const idToUpdate = req.params.id;
    const updatedTitle = req.body.newTitle;

    // Find todo by ID
    const findTodo = await Todo.findById(idToUpdate);
    if (!findTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Update title and save
    findTodo.title = updatedTitle;
    await findTodo.save();

    res.status(200).json({ updated: true });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(400).json({ updated: false });
  }
};

// DELETE request - delete a todo

export const deleteTodos = async function (req, res) {
  try {
    const idToDelete = req.params.id;

    // Find todo by ID
    const findTodo = await Todo.findById(idToDelete);
    if (!findTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Delete todo
    await Todo.findByIdAndDelete(idToDelete);

    res.status(200).json({ deleted: true });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(400).json({ deleted: false });
  }
};

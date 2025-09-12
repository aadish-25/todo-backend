import { Router } from "express";
import { Todo } from "../models/todo.models.js";

const router = Router();

// display all todos
router.route("/").get(async function (req, res) {
  try {
    const allTodos = await Todo.find();
    res.json(
      allTodos.map((todo) => ({
        id: todo._id,
        name: todo.name,
        title: todo.title,
        content: todo.content,
        isCompleted: todo.isCompleted,
      }))
    );
    
    res.status(200)
  } catch (error) {}
});

// create a todo
router.route("/").post(async function (req, res) {
  const { name, title, content } = req.body;
  await Todo.create({
    name,
    title,
    content,
  });
  res.status(201).json({ message: "received", data: req.body });
});

// update a todo
router.route("/:id").patch(async function (req, res) {
  try {
    const idToUpdate = req.params.id;
    const updatedTitle = req.body.newTitle;

    const findTodo = await Todo.findById(idToUpdate);
    if (!findTodo) return res.status(404).json({ message: "Todo not found" });

    findTodo.title = updatedTitle;
    await findTodo.save();

    res.status(201).json({"updated": true})
  } catch (error) {
    console.log("Error in updating todo");
    res.status(400).json({"updated": false})
  }
});

// delete a todo
router.route("/:id").delete(async function (req, res) {
    try {
    const idToDelete = req.params.id;

    const findTodo = await Todo.findById(idToDelete);
    if (!findTodo) return res.status(404).json({ message: "Todo not found" });

    await Todo.findByIdAndDelete(idToDelete)

    res.status(201).json({"deleted": true})
  } catch (error) {
    console.log("Error in updating todo : ", error);
    res.status(400).json({"deleted": false})
  }
});

export default router;

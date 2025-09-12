import { Router } from "express";
import { deleteTodos, getTodos, patchTodos, postTodos } from "../controllers/todo2.controllers.js";

const router = Router();

router.route('/').get(getTodos)
router.route('/').post(postTodos)
router.route('/:id').patch(patchTodos)
router.route('/:id').delete(deleteTodos)


// router.route("/")
//   .get(getTodos)
//   .post(postTodos);

// router.route("/:id")
//   .patch(patchTodos)
//   .delete(deleteTodos);
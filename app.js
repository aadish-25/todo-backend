import express from "express"
import dotenv from "dotenv"
import {Todo} from "./src/models/todo.models.js"
const app = express()

dotenv.config({ path: './.env' })

app.use(express.json())
app.use(express.urlencoded())

// import routes
import todoRoutes from "./src/routes/todo.routes.js"

// declare routes
app.use("/todo", todoRoutes)

export default app;

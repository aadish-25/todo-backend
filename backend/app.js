import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { Todo } from "./src/models/todo.models.js"
const app = express()

dotenv.config({ path: './.env' })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

// import routes
import todoRoutes from "./src/routes/todo.routes.js"
import authRoutes from "./src/routes/auth.routes.js"
// declare routes
app.use("/todo", todoRoutes)
app.use("/auth", authRoutes)

export default app;

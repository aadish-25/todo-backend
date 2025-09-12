import { Router } from "express";
import { User } from "../models/user.models.js";

import bcypt from "bcryptjs"
import jwt from "jsonwebtoken";


const router = Router();

// register an user
router.route("/register").post(async function (req, res) {
    
})

// log in an user
router.route("/login").post(async function (req, res) {
    
})

export default router
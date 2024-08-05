import express from "express";

import {
  ADD_TICKET,
  GET_USER_TICKETS,
} from "../controller/ticket.js";


import authUser from "../middleware/auth.js";
const router = express.Router();


router.post("/tickets", authUser, ADD_TICKET);

router.get("/tickets/user/:id", GET_USER_TICKETS);


export default router;

import express from "express";

import {
  SIGN_UP,
  LOGIN,
  GENERATE_REFRESH_TOKEN,
  GET_USER_BY_ID,
  GET_ALL_USERS,
  GET_USER_BY_ID_WITH_TICKETS,
} from "../controller/user.js";

const router = express.Router();
import authUser from "../middleware/auth.js";

router.post("/signup", SIGN_UP);
router.post("/refreshToken", GENERATE_REFRESH_TOKEN);

router.get("/login", LOGIN);
router.get("/users", authUser, GET_ALL_USERS);
router.get("/users/:id", authUser, GET_USER_BY_ID);
router.get("/users/:id/ticket", authUser, GET_USER_BY_ID_WITH_TICKETS);

export default router;

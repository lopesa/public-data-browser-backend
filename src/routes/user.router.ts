import { User } from "@prisma/client";
import express from "express";
var router = express.Router();
import passport from "passport";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false, failWithError: true }),
  async (req, res, next) => {
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

router.post("/login", async (req, res, next) => {
  if (!process.env.JWT_TOKEN_SECRET) {
    return next(new Error("JWT_TOKEN_SECRET not set"));
  }
  const test = process.env;
  debugger;
  passport.authenticate(
    "login",
    async (err: Error, user: User, info?: { message: string }) => {
      try {
        if (err || !user) {
          return next(err || new Error("An error occurred."));
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { _id: user.id, email: user.email };
          const token = jwt.sign({ user: body }, process.env.JWT_TOKEN_SECRET!);

          return res.json({ token });
        });
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
});

export default router;

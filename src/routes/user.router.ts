import { User } from "@prisma/client";
import express from "express";
var router = express.Router();
import passport from "passport";
import { generateJWT } from "../services/auth.service";

router.post("/signup", async (req, res, next) => {
  passport.authenticate(
    "signup",
    { session: false, failWithError: true },

    async (err: Error, user: User, info?: { message: string }) => {
      if (err || !user) {
        return next(err || new Error("Problem Authenticating"));
      }
      const body = { _id: user.id, email: user.email };
      const token = generateJWT(body);
      return token
        ? res.json({ token, email: user.email })
        : next(new Error("Account created, but Problem creating token"));
    }
  )(req, res, next);
});

router.post("/login", async (req, res, next) => {
  passport.authenticate(
    "login",
    async (err: Error, user: User, info?: { message: string }) => {
      if (err || !user) {
        return next(err || new Error("Problem Authenticating"));
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user.id, email: user.email };
        const token = generateJWT(body);

        return token
          ? res.json({ token, email: user.email })
          : next(new Error("Problem creating token"));
      });
    }
  )(req, res, next);
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      message: "You made it to the secure route",
      user: req.user,
      token: req.query.secret_token,
    });
  }
);

export default router;
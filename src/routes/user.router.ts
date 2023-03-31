import { User } from "@prisma/client";
import express from "express";
var router = express.Router();
import passport from "passport";
import { createNewUserWithEmailAndPassword } from "../controllers/user.controller";
import { generateJWT } from "../services/auth.service";
import { JwtTokenUser } from "../types/types-general";

router.post("/signup", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return next(new Error("Email and password required"));
  }
  const newUserToken = await createNewUserWithEmailAndPassword(
    email,
    password
  ).catch((e) => {
    return next(e);
  });
  if (!newUserToken) {
    return next(new Error("Problem creating user"));
  }
  return res.status(200).send({ token: newUserToken, email });
});

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res, next) => {
    const body = {
      _id: (req.user as User)?.id,
      email: (req.user as User)?.email,
    };
    const token = generateJWT(body);

    return token
      ? res.json({ token, email: (req.user as JwtTokenUser).email })
      : next(new Error("Problem creating token"));
  }
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    req.logOut(() => {});
    res.json({
      message: "You made it to the secure route",
      user: req.user,
      token: req.query.secret_token,
    });
  }
);

export default router;

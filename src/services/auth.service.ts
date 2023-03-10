// import bcrypt from "bcrypt";
// import {
//   PrismaClient,
//   // Prisma,
// } from "@prisma/client";
import passport from "passport";
import Strategy from "passport-local";
import UserService from "./user.service";

// const prisma = new PrismaClient();
const localStrategy = Strategy.Strategy;

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await UserService.create({ email, password }).catch((e) => {
        done(e);
      });
      user
        ? done(null, user)
        : done(null, false, { message: "Something went wrong" });
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      debugger;
      const user = await UserService.getUser(email).catch((e) => {
        return done(e || "Something went wrong");
      });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      const validate = await UserService.isValidPassword(user, password);
      if (!validate) {
        debugger;
        // return done(null, false, { message: "Wrong Password" });
        return done(new Error("Wrong Password"), false);
      }
      return done(null, user, { message: "Logged in Successfully" });
    }
  )
);

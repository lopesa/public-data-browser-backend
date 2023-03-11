/**
 * followed: https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport
 *
 * this is also a good darticle: https://medium.com/@prashantramnyc/difference-between-session-cookies-vs-jwt-json-web-tokens-for-session-management-4be67d2f066e
 */

import passport from "passport";
import Strategy from "passport-local";
import UserService from "./user.service";
import PassportJWT from "passport-jwt";
import jwt from "jsonwebtoken";

const localStrategy = Strategy.Strategy;
const JWT_VALID_TIME = "1d";

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
      const user = await UserService.getUser(email).catch((e) => {
        return done(e || new Error("Problem finding user"));
      });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      const validate = await UserService.isValidPassword(user, password);
      if (!validate) {
        return done(new Error("Wrong Password"), false);
      }
      return done(null, user, { message: "Logged in Successfully" });
    }
  )
);

passport.use(
  "jwt",
  new PassportJWT.Strategy(
    {
      secretOrKey: process.env.JWT_TOKEN_SECRET,
      jwtFromRequest:
        PassportJWT.ExtractJwt.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export const generateJWT = (user: { _id: string; email: string }) => {
  if (!process.env.JWT_TOKEN_SECRET) {
    return;
  }
  return jwt.sign({ user: user }, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: JWT_VALID_TIME,
  });
};

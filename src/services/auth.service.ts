/**
 * followed: https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport
 *
 * this is also a good article: https://medium.com/@prashantramnyc/difference-between-session-cookies-vs-jwt-json-web-tokens-for-session-management-4be67d2f066e
 *
 * https://stackoverflow.com/questions/32722952/is-it-safe-to-put-a-jwt-into-the-url-as-a-query-parameter-of-a-get-request#:~:text=on%20this%20post.-,Is%20it%20safe%20to%20put%20a%20jwt%20(json%20web%20token,is%20URL%2Dencoding%2Dsafe.
 */

import passport from "passport";
import Strategy from "passport-local";
import { getUserByEmail, createUser, isValidPassword } from "./user.service";
import PassportJWT from "passport-jwt";
import jwt from "jsonwebtoken";
import { JwtTokenUser } from "../types/types-general";

const localStrategy = Strategy.Strategy;
const JWT_VALID_TIME = "1d";

// passport.use(
//   "signup",
//   new localStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async (email, password, done) => {
//       const userExists = await getUserByEmail(email).catch((e) => {
//         done(new Error("problem checking user exists"), false);
//       });
//       if (userExists) {
//         return done(new Error("User already exists"), false);
//       }
//       const user = await createUser(email, password).catch((e) => {
//         done(e);
//       });
//       return user
//         ? done(null, user)
//         : done(new Error("Problem Creating User"), false);
//     }
//   )
// );

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await getUserByEmail(email).catch((e) => {
        return done(e || new Error("Problem finding user"));
      });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      const validate = await isValidPassword(user, password);
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
        // PassportJWT.ExtractJwt.fromUrlQueryParameter("secret_token"),
        PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user as JwtTokenUser);
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

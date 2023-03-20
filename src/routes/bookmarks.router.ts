import express from "express";
import passport from "passport";
var router = express.Router();
import { PrismaClient, Prisma, User } from "@prisma/client";
import { addBookmarksForUser } from "../controllers/bookmarks.controller";
import { BookmarkKey, JwtTokenUser } from "../types/types-general";
import { getInitialDataForBookmarks } from "../services/bookmarks.service";

router.get("/", async (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (err: Error, user: User, info?: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error("Problem getting user from token"));
      }
      res.status(200).send(user.email);
    }
  )(req, res, next);
});

router.post("/addBookmarks", async (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (err: Error, user: JwtTokenUser, info?: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error("Problem passing JWT Token User to route"));
      }
      const bookmarks: BookmarkKey[] = req.body.bookmarks;
      if (!bookmarks) {
        return next(new Error("No bookmarks provided"));
      }
      const updatedUser = await addBookmarksForUser(user, bookmarks).catch(
        (e) => {
          next(e);
        }
      );

      // factor this out of the router
      if (
        !updatedUser?.bookmarks ||
        !(typeof updatedUser.bookmarks === "object") ||
        !Array.isArray(updatedUser.bookmarks) ||
        !updatedUser.bookmarks.length
      ) {
        return next(new Error("Problem updating user"));
      }

      // this is suspect, is it definitely an array of strings?
      const filteredBookmarks = Array.from(updatedUser.bookmarks).filter(
        (bookmark) => {
          return bookmark !== null;
        }
      ) as string[];

      const initialBookmarkData = await getInitialDataForBookmarks(
        filteredBookmarks
      ).catch((e) => {
        return next(new Error("Bookmark added but failed to get return data"));
      });

      debugger;

      res.status(200).json(initialBookmarkData);
    }
  )(req, res, next);
});

export default router;

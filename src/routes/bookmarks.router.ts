import express from "express";
import passport from "passport";
var router = express.Router();
import { PrismaClient, Prisma, User } from "@prisma/client";
import { addBookmarksForUser } from "../controllers/bookmarks.controller";
import BookmarksService from "../services/bookmarks.service";
import { dbCatchMethod } from "../services/db.service";
import { BookmarkKey } from "../types/types-general";

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
      // const bookmarks = await BookmarksService.getBookmarks(user);
      res.status(200).send(user.email);
    }
  )(req, res, next);
});

router.post("/addBookmarks", async (req, res, next) => {
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
      debugger;
      const bookmarks: BookmarkKey[] = req.body.bookmarks;
      if (!bookmarks) {
        return next(new Error("No bookmarks provided"));
      }
      const result = await addBookmarksForUser(user, bookmarks);

      debugger;
      res.status(200).send();
    }
  )(req, res, next);
});

export default router;

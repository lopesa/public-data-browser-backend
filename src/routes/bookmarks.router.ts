import express from "express";
import passport from "passport";
var router = express.Router();
import { PrismaClient, Prisma, User } from "@prisma/client";
import {
  addBookmarksForUser,
  getInitialUserBookmarkData,
  removeBookmarkForUser,
} from "../controllers/bookmarks.controller";
import { BookmarkKey, JwtTokenUser } from "../types/types-general";

router.get("/", async (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (err: Error, user: JwtTokenUser, info?: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error("Problem getting user from token"));
      }
      const intialBookmarks = await getInitialUserBookmarkData(user).catch(
        (e) => {
          next(e);
        }
      );
      if (!intialBookmarks) {
        return next(new Error("Problem getting initial bookmarks"));
      }
      res.status(200).json(intialBookmarks);
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
      const userBookmarks = await addBookmarksForUser(user, bookmarks).catch(
        (e) => {
          next(e);
        }
      );
      if (!userBookmarks) {
        return next(new Error("Problem adding bookmarks"));
      }
      res.status(200).json(userBookmarks);
    }
  )(req, res, next);
});

router.post("/removeBookmark", async (req, res, next) => {
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
      const id: string = req.body.originalId;
      debugger;
      if (!id) {
        return next(new Error("No bookmark provided"));
      }

      debugger;

      const bookmarkRemoved = await removeBookmarkForUser(user, id).catch(
        (e) => {
          next(e);
        }
      );

      if (!bookmarkRemoved) {
        return next(new Error("Problem removing bookmark"));
      }

      const intialBookmarks = await getInitialUserBookmarkData(user).catch(
        (e) => {
          next(e);
        }
      );
      if (!intialBookmarks) {
        return next(new Error("Problem getting initial bookmarks"));
      }
      res.status(200).json(intialBookmarks);
    }
  )(req, res, next);
});

export default router;

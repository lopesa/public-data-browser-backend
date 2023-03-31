import express from "express";
import passport from "passport";
var router = express.Router();
import {
  addBookmarksForUser,
  getInitialUserBookmarkData,
  removeBookmarkForUser,
} from "../controllers/bookmarks.controller";
import { BookmarkKey, JwtTokenUser } from "../types/types-general";

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (!req.user) {
      return next(new Error("Problem getting user from token"));
    }
    const intialBookmarks = await getInitialUserBookmarkData(
      req.user as JwtTokenUser
    ).catch((e) => {
      next(e);
    });
    if (!intialBookmarks) {
      return next(new Error("Problem getting initial bookmarks"));
    }
    res.status(200).json(intialBookmarks);
  }
);

router.post(
  "/addBookmarks",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (!req.user) {
      return next(new Error("Problem passing JWT Token User to route"));
    }
    const bookmarks: BookmarkKey[] = req.body.bookmarks;
    if (!bookmarks) {
      return next(new Error("No bookmarks provided"));
    }
    const userBookmarks = await addBookmarksForUser(
      req.user as JwtTokenUser,
      bookmarks
    ).catch((e) => {
      next(e);
    });
    if (!userBookmarks) {
      return next(new Error("Problem adding bookmarks"));
    }
    res.status(200).json(userBookmarks);
  }
);

router.post(
  "/removeBookmark",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (!req.user) {
      return next(new Error("Problem passing JWT Token User to route"));
    }
    const id: string = req.body.originalId;
    if (!id) {
      return next(new Error("No bookmark provided"));
    }

    const bookmarkRemoved = await removeBookmarkForUser(
      req.user as JwtTokenUser,
      id
    ).catch((e) => {
      next(e);
    });

    if (!bookmarkRemoved) {
      return next(new Error("Problem removing bookmark"));
    }

    const intialBookmarks = await getInitialUserBookmarkData(
      req.user as JwtTokenUser
    ).catch((e) => {
      next(e);
    });
    if (!intialBookmarks) {
      return next(new Error("Problem getting initial bookmarks"));
    }
    res.status(200).json(intialBookmarks);
  }
);

export default router;

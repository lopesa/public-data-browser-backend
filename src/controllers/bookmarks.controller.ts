import { BookmarkKey, JwtTokenUser } from "../types/types-general";
import {
  addBookmarksToDbWithUser,
  getFullDataForBookmarks,
  getInitialUserBookmarkDataByUserId,
  removeBookmarkFromDbForUser,
} from "../services/bookmarks.service";

export const getInitialUserBookmarkData = async (user: JwtTokenUser) => {
  const userBookmarksInitialData = await getInitialUserBookmarkDataByUserId(
    user._id
  ).catch((e) => {
    throw e;
  });
  if (!userBookmarksInitialData) {
    throw new Error("Could not get user bookmarks initial data");
  }
  return userBookmarksInitialData;
};

export const addBookmarksForUser = async (
  user: JwtTokenUser,
  bookmarks: BookmarkKey[]
) => {
  const fullData = await getFullDataForBookmarks(bookmarks).catch((e) => {
    throw e;
  });
  if (!fullData.length) {
    throw new Error("Could not get full data for bookmarks");
  }

  const addedBookmarks = await addBookmarksToDbWithUser(fullData, user).catch(
    (e) => {
      throw e;
    }
  );

  if (!addedBookmarks) {
    throw new Error("Could not add bookmarks to db");
  }

  const userBookmarksInitialData = await getInitialUserBookmarkDataByUserId(
    user._id
  ).catch((e) => {
    throw e;
  });

  if (!userBookmarksInitialData) {
    throw new Error("Could not get user bookmarks initial data");
  }
  return userBookmarksInitialData;
};

export const removeBookmarkForUser = async (
  user: JwtTokenUser,
  bookmarkOriginalId: string
) => {
  debugger;
  const bookmarkRemoved = await removeBookmarkFromDbForUser(
    user,
    bookmarkOriginalId
  ).catch((e) => {
    throw e;
  });
  debugger;
  if (!bookmarkRemoved) {
    throw new Error("Could not remove bookmark from db");
  }

  return true;
};

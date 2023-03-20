import { PrismaClient, Prisma, User } from "@prisma/client";
import { BookmarkKey, JwtTokenUser } from "../types/types-general";
import {
  addBookmarksToDb,
  concatBookmarksToUser,
  getExistingBookmarks,
  getFullDataForBookmarks,
} from "../services/bookmarks.service";

export const addBookmarksForUser = async (
  user: JwtTokenUser,
  bookmarks: BookmarkKey[]
) => {
  const existingBookmarks = await getExistingBookmarks(bookmarks).catch((e) => {
    return [];
  });
  const existingBookmarksOriginalIds = existingBookmarks.map((bookmark) => {
    return bookmark.originalId;
  });
  const bookmarksToAddToDb = bookmarks.filter((bookmark) => {
    return !existingBookmarksOriginalIds.includes(bookmark.dataItemUuid);
  });

  let bookmarkIdsAddedToDb: string[] = [];
  if (bookmarksToAddToDb.length > 0) {
    const fullData = await getFullDataForBookmarks(bookmarksToAddToDb).catch(
      (e) => {
        throw e;
      }
    );
    if (!fullData.length) {
      throw new Error("Could not get full data for bookmarks");
    }

    // check if bookmarks exist.
    bookmarkIdsAddedToDb = await addBookmarksToDb(fullData).catch((e) => {
      throw e;
    });
  }

  const bookmarkIdsToAddToUser = bookmarkIdsAddedToDb.concat(
    existingBookmarks.map((bookmark) => {
      return bookmark.id;
    })
  );

  const updatedUser = await concatBookmarksToUser(
    bookmarkIdsToAddToUser,
    user
  ).catch((e) => {
    throw e;
  });
  if (!updatedUser) {
    throw new Error("Could not update user");
  }
  return updatedUser;
};

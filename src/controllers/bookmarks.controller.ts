import { BookmarkKey, JwtTokenUser } from "../types/types-general";
import {
  addBookmarksToDbWithUser,
  getFullDataForBookmarks,
  getInitialUserBookmarkDataByUserId,
} from "../services/bookmarks.service";

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

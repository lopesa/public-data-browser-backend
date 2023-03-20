import { PrismaClient, Prisma, User, BookmarkItem } from "@prisma/client";
import { dbCatchMethod } from "../services/db.service";
import {
  AllDataTypesUnion,
  BookmarkKey,
  DatasetGetFullDataMethod,
  DatasetKeys,
  JwtTokenUser,
} from "../types/types-general";
import { getFullDataForItem as departmentOfAgricultureGetFullDataForItem } from "../services/department-of-agriculture.service";
import { getFullDataForItem as departmentOfEnergyGetFullDataForItem } from "../services/department-of-energy.service";
import { getUserById, updateUser, updateUserById } from "./user.service";

const prisma = new PrismaClient();

export const DatasetKeyToDatasetGetMethod: Record<
  DatasetKeys,
  DatasetGetFullDataMethod
> = {
  departmentOfAgriculture: departmentOfAgricultureGetFullDataForItem,
  departmentOfEnergy: departmentOfEnergyGetFullDataForItem,
};

const db = {
  createMany: async (bookmarks: Prisma.BookmarkItemCreateManyInput[]) => {
    const created = await prisma.bookmarkItem
      .createMany({
        data: bookmarks,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return created;
  },
  create: async (data: Prisma.BookmarkItemCreateInput) => {
    const created = await prisma.bookmarkItem
      .create({
        data,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return created;
  },
  getBookmark: async (
    where: Prisma.BookmarkItemWhereUniqueInput,
    select?: Prisma.BookmarkItemSelect
  ) => {
    const args: {
      where: Prisma.BookmarkItemWhereUniqueInput;
      select?: Prisma.BookmarkItemSelect;
    } = {
      where: where,
    };
    select && (args.select = select);
    const item = await prisma.bookmarkItem.findUnique(args).catch(async (e) => {
      await dbCatchMethod(e);
      throw e;
    });
    await prisma.$disconnect();
    return item;
  },
};

export const getExistingBookmarks = async (bookmarks: BookmarkKey[]) => {
  const returnVal: BookmarkItem[] = [];
  for await (const bookmark of bookmarks) {
    const result = await db
      .getBookmark({ originalId: bookmark.dataItemUuid })
      .catch((e) => {
        throw e;
      });
    if (result) {
      returnVal.push(result);
    }
  }
  return returnVal;
};

export const getInitialDataForBookmark = async (id: string) => {
  const bookmark = await db
    .getBookmark(
      { id },
      {
        id: true,
        title: true,
        description: true,
        distribution: true,
        spatial: true,
      }
    )
    .catch((e) => {
      throw e;
    });
  return bookmark;
};

export const getInitialDataForBookmarks = async (bookmarkIds: string[]) => {
  return await Promise.all(
    bookmarkIds.map(async (bookmarkId) => {
      const result = await getInitialDataForBookmark(bookmarkId).catch(
        (err) => {
          throw err;
        }
      );
      return result;
    })
  );
};

export const getFullDataForBookmarks = async (bookmarks: BookmarkKey[]) => {
  // alternate way of writing this:
  // for await (const bookmark of bookmarks) {
  //   const getMethod = DatasetKeyToDatasetGetMethod[bookmark.datasetId];
  //   const result = await getMethod(bookmark.dataItemUuid).catch((err) => {
  //     throw err;
  //   });
  //   return result;

  return await Promise.all(
    bookmarks.map(async (bookmark) => {
      const getMethod = DatasetKeyToDatasetGetMethod[bookmark.datasetId];
      const result = await getMethod(bookmark.dataItemUuid).catch((err) => {
        throw err;
      });
      const preppedResult = prepBookmarkDataForDb(bookmark, result);
      // debugger;
      return preppedResult;
    })
  );
};

const prepBookmarkDataForDb = (
  bookmark: BookmarkKey,
  bookmarkData: AllDataTypesUnion
) => {
  // why won't this typing work?
  // let returnResult: Prisma.BookmarkItemCreateInput = {
  let returnResult: any = {
    // ...bookmarkData,
    originalSource: bookmark.datasetId,
    originalId: bookmark.dataItemUuid,
  };
  for (const key in bookmarkData) {
    if (key === "createdAt" || key === "updatedAt" || key === "id") {
      continue;
    }
    if (bookmarkData[key as keyof typeof bookmarkData] === null) {
      continue;
    }
    let val: Prisma.JsonValue | Date =
      bookmarkData[key as keyof typeof bookmarkData];

    if (typeof val === null) {
      continue;
    }
    if (typeof val === "object") {
      returnResult[key as keyof Prisma.BookmarkItemCreateInput] =
        JSON.stringify(bookmarkData[key as keyof typeof bookmarkData]);
      continue;
    }
    returnResult[key as keyof Prisma.BookmarkItemCreateInput] = val;
  }
  return returnResult as Prisma.BookmarkItemCreateInput;
};

export const addBookmarksToDb = async (
  bookmarks: Prisma.BookmarkItemCreateManyInput[]
) => {
  const result = await Promise.all(
    bookmarks.map(async (bookmark) => {
      const created = await db.create(bookmark).catch((err) => {
        throw err;
      });
      return created;
    })
  );
  // debugger;
  const bookmarkIds = result.map((resultItem) => resultItem.id);
  // debugger;
  return bookmarkIds;

  // return db.createMany(bookmarks);
};

export const concatBookmarksToUser = async (
  bookmarksIds: string[],
  user: JwtTokenUser
) => {
  debugger;
  const fullUserData = await getUserById(user._id).catch((e) => {
    throw e;
  });
  if (!fullUserData) {
    throw new Error("Failed to get user data");
  }
  let currentBookmarks = fullUserData?.bookmarks;
  if (
    !currentBookmarks ||
    !Array.isArray(currentBookmarks) ||
    !currentBookmarks.length
  ) {
    currentBookmarks = [];
  }
  // const newBookmarks = [...currentBookmarks, ...bookmarksIds];
  const newBookmarks = [...currentBookmarks, ...bookmarksIds];
  const updatedUser = await updateUser(fullUserData, {
    bookmarks: newBookmarks,
  }).catch((e) => {
    throw e;
  });
  debugger;
  if (!updatedUser) {
    throw new Error("Failed to update user bookmarks");
  }
  return updatedUser;
};

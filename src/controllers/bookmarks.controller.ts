import { PrismaClient, Prisma, User } from "@prisma/client";
import {
  AllDataTypesIntersection,
  AllDataTypesUnion,
  BookmarkKey,
  BookmarkInputCandidate,
} from "../types/types-general";
import { getFullDataForItem as departmentOfAgricultureGetFullDataForItem } from "../services/department-of-agriculture.service";
import { getFullDataForItem as departmentOfEnergyGetFullDataForItem } from "../services/department-of-energy.service";
import { DatasetKeys, DatasetGetFullDataMethod } from "../types/types-general";
import { BookmarkItem } from "@prisma/client";

export const DatasetKeyToDatasetGetMethod: Record<
  DatasetKeys,
  DatasetGetFullDataMethod
> = {
  departmentOfAgriculture: departmentOfAgricultureGetFullDataForItem,
  departmentOfEnergy: departmentOfEnergyGetFullDataForItem,
};

const prisma = new PrismaClient();

const getFullDataForBookmarks = async (bookmarks: BookmarkKey[]) => {
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
      debugger;
      return result;
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
  // const noCopyList = [null, 'createdAt', 'updatedAt', 'id']
  for (const key in bookmarkData) {
    if (key === "createdAt" || key === "updatedAt" || key === "id") {
      continue;
    }
    // const key = prop as keyof AllDataTypesIntersection;
    if (bookmarkData[key as keyof typeof bookmarkData] === null) {
      continue;
    }
    let val: Prisma.JsonValue | Date =
      bookmarkData[key as keyof AllDataTypesUnion];

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

const copyDataItemsToBookmarksTable = async (
  bookmarks: Omit<BookmarkItem, "id">[]
) => {};

export const addBookmarksForUser = async (
  user: User,
  bookmarks: BookmarkKey[]
) => {
  const fullData = await getFullDataForBookmarks(bookmarks).catch((e) => {
    throw e;
  });
  if (!fullData) {
    throw new Error("Could not get full data for bookmarks");
  }
  // const preppedData = await prepBookmarkDataForDb(fullData).catch((e) => {
  //   throw e;
  // });

  // const result = await copyDataItemsToBookmarksTable(fullData).catch((e) => {
  //   throw e;
  // });
  // return result;
};

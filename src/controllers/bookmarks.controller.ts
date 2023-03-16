import { PrismaClient, Prisma, User } from "@prisma/client";
import { AllDataTypes, BookmarkKey } from "../types/types-general";
import { getFullDataForItem as departmentOfAgricultureGetFullDataForItem } from "../services/department-of-agriculture.service";
import { getFullDataForItem as departmentOfEnergyGetFullDataForItem } from "../services/department-of-energy.service";
import { DatasetKeys, DatasetGetFullDataMethod } from "../types/types-general";

export const DatasetKeyToDatasetGetMethod: Record<
  DatasetKeys,
  DatasetGetFullDataMethod
> = {
  departmentOfAgriculture: departmentOfAgricultureGetFullDataForItem,
  departmentOfEnergy: departmentOfEnergyGetFullDataForItem,
};

const getFullDataForBookmarks = async (bookmarks: BookmarkKey[]) => {
  const allFullData: AllDataTypes[] = [];
  for await (const bookmark of bookmarks) {
    const getMethod = DatasetKeyToDatasetGetMethod[bookmark.datasetId];
    const result = await getMethod(bookmark.dataItemUuid).catch((err) => {
      console.error(err);
    });
    if (!result) {
      return;
    }
    allFullData.push(result);
  }
  return allFullData;
};

const copyDataItemsToBookmarksTable = async (bookmarks: BookmarkKey[]) => {
  const fullData = await getFullDataForBookmarks(bookmarks).catch((e) => {
    throw e;
  });

  // const result = await addBookMarks

  return fullData;
};

export const addBookmarksForUser = async (
  user: User,
  bookmarks: BookmarkKey[]
) => {
  const result = await copyDataItemsToBookmarksTable(bookmarks).catch((e) => {
    throw e;
  });
  return result;
};

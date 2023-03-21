import { PrismaClient, Prisma, BookmarkItem } from "@prisma/client";
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

type BookmarkItemWithUsers = Prisma.BookmarkItemGetPayload<{
  include: { users: true };
}>;

const prisma = new PrismaClient();

export const DatasetKeyToDatasetGetMethod: Record<
  DatasetKeys,
  DatasetGetFullDataMethod
> = {
  departmentOfAgriculture: departmentOfAgricultureGetFullDataForItem,
  departmentOfEnergy: departmentOfEnergyGetFullDataForItem,
};

const db = {
  createMany: async (data: Prisma.BookmarkItemCreateManyInput[]) => {
    const created = await prisma.bookmarkItem
      .createMany({
        data,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return created;
  },
  create: async (
    data: Prisma.BookmarkItemCreateInput,
    select?: Prisma.BookmarkItemSelect
  ) => {
    const args: {
      data: Prisma.BookmarkItemCreateInput;
      select?: Prisma.BookmarkItemSelect;
    } = {
      data: data,
    };
    select && (args.select = select);
    const created = await prisma.bookmarkItem.create(args).catch(async (e) => {
      await dbCatchMethod(e);
      throw e;
    });
    await prisma.$disconnect();
    return created;
  },
  getBookmark: async (
    where: Prisma.BookmarkItemWhereUniqueInput,
    select?: Prisma.BookmarkItemSelect
    // include?: Prisma.BookmarkItemInclude
    // ): Promise<BookmarkItem | BookmarkItemWithUsers | null> => {
  ) => {
    const args: {
      where: Prisma.BookmarkItemWhereUniqueInput;
      select?: Prisma.BookmarkItemSelect;
      // include?: Prisma.BookmarkItemInclude;
    } = {
      where: where,
    };
    select && (args.select = select);
    // include && (args.include = include);
    const item = await prisma.bookmarkItem.findUnique(args).catch(async (e) => {
      await dbCatchMethod(e);
      throw e;
    });
    await prisma.$disconnect();
    return item;
  },
  getBookmarks: async (
    where: Prisma.BookmarkItemWhereInput,
    select?: Prisma.BookmarkItemSelect,
    include?: Prisma.BookmarkItemInclude
  ) => {
    const args: {
      where: Prisma.BookmarkItemWhereInput;
      select?: Prisma.BookmarkItemSelect;
      include?: Prisma.BookmarkItemInclude;
    } = {
      where: where,
    };
    select && (args.select = select);
    include && (args.include = include);
    const items = await prisma.bookmarkItem.findMany(args).catch(async (e) => {
      await dbCatchMethod(e);
      throw e;
    });
    await prisma.$disconnect();
    return items;
  },
  updateBookmark: async (
    where: Prisma.BookmarkItemWhereUniqueInput,
    data: Prisma.BookmarkItemUpdateInput
  ) => {
    const updated = await prisma.bookmarkItem
      .update({
        where: where,
        data: data,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return updated;
  },
  deleteBookmark: async (where: Prisma.BookmarkItemWhereUniqueInput) => {
    const deleted = await prisma.bookmarkItem
      .delete({
        where: where,
      })
      .catch(async (e) => {
        await dbCatchMethod(e);
        throw e;
      });
    await prisma.$disconnect();
    return deleted;
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

export const getInitialUserBookmarkDataByUserId = async (id: string) => {
  return await db
    .getBookmarks(
      {
        users: {
          some: {
            id,
          },
        },
      },
      {
        id: true,
        originalId: true,
        title: true,
        description: true,
        distribution: true,
        spatial: true,
      }
    )
    .catch((e) => {
      throw e;
    });
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
  return await Promise.all(
    bookmarks.map(async (bookmark) => {
      const created = await db.create(bookmark).catch((err) => {
        throw err;
      });
      return created;
    })
  );
};

export const addBookmarksToDbWithUser = async (
  fullData: Prisma.BookmarkItemCreateInput[],
  user: JwtTokenUser
) => {
  fullData = fullData.map((data) => {
    return {
      ...data,
      users: {
        connect: [{ id: user._id }],
      },
    };
  });

  // I have to execute this as a batch of create vs createMany because
  // createMany can't handle the connect
  // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-multiple-records-and-multiple-related-records
  // const addedBookmarks = await db.createMany(fullData).catch((e) => {
  //   throw e;
  // });

  const addedBookmarks = await Promise.all(
    fullData.map(async (data) => {
      return await db.create(data).catch((e) => {
        throw e;
      });
    })
  );

  return addedBookmarks;
};

const bookmarkWithUserCount = Prisma.validator<Prisma.BookmarkItemArgs>()({
  select: {
    _count: {
      select: {
        users: true,
      },
    },
  },
});

type BookmarkWithUserCount = Prisma.BookmarkItemGetPayload<
  typeof bookmarkWithUserCount
> | null;

export const removeBookmarkFromDbForUser = async (
  user: JwtTokenUser,
  bookmarkOriginalId: string
) => {
  const updatedBookmark = await db
    .updateBookmark(
      { originalId: bookmarkOriginalId },
      {
        users: {
          disconnect: [{ id: user._id }],
        },
      }
    )
    .catch((e) => {
      throw e;
    });

  if (!updatedBookmark) {
    throw new Error("Problem removing bookmark from user");
  }

  const userCountCall = (await db
    .getBookmark(
      { originalId: bookmarkOriginalId },
      {
        _count: {
          select: { users: true },
        },
      }
    )
    .catch((e) => {
      throw e;
    })) as BookmarkWithUserCount;

  const userCount = userCountCall?._count?.users;

  if (userCount === 0) {
    const deletedBookmark = await db
      .deleteBookmark({
        originalId: bookmarkOriginalId,
      })
      .catch((e) => {
        throw e;
      });
    if (!deletedBookmark) {
      throw new Error("Problem deleting bookmark");
    }
  }
  return true;
};

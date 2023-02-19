import { PrismaClient, Prisma } from "@prisma/client";
type TableNames = Uncapitalize<Prisma.ModelName>; // this is a bad path. struggling against what Prisma is doing for me. But interesting TS
// good post on intrinsic type manipulations:
// https://fjolt.com/article/typescript-intrinsic-type-manipulations

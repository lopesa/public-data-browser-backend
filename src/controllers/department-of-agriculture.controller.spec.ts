import request from "supertest";
import {
  getDepartmentOfAgricultureDataItem,
  getInitialDepartmentOfAgricultureData,
} from "../controllers/department-of-agriculture.controller";
import * as DepartmentOfAgricultureService from "../services/department-of-agriculture.service";
import { expect, jest, test } from "@jest/globals";
import {
  mockDepartmentOfAgricultureDataItem,
  mockUSGovernmentInitialDataItem,
} from "../mocks";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

describe("Department of Agriculture Controller", () => {
  describe("getInitialDepartmentOfAgricultureData", () => {
    it("should call into DOAService.getInitialData", async () => {
      const getFullDataForItemSpy = jest
        .spyOn(DepartmentOfAgricultureService, "getInitialData")
        .mockImplementation(() =>
          Promise.resolve(mockUSGovernmentInitialDataItem)
        );
      await getInitialDepartmentOfAgricultureData().catch((e) => {});
      expect(getFullDataForItemSpy).toHaveBeenCalled();
    });
    it("should throw an error if getInitialData throws an error", async () => {
      const getFullDataForItemSpy = jest
        .spyOn(DepartmentOfAgricultureService, "getInitialData")
        .mockImplementation(() =>
          Promise.reject(
            new Error("Error fetching data from db: getInitialData")
          )
        );
      await getInitialDepartmentOfAgricultureData().catch((e) => {
        expect(e.message).toBe("Error fetching data from db: getInitialData");
      });
    });
    it("should return the data from getInitialData", async () => {
      jest
        .spyOn(DepartmentOfAgricultureService, "getInitialData")
        .mockImplementation(() =>
          Promise.resolve(mockUSGovernmentInitialDataItem)
        );
      const data = await getInitialDepartmentOfAgricultureData().catch(
        (e) => {}
      );
      expect(data).toEqual(mockUSGovernmentInitialDataItem);
    });
  });

  describe("getDepartmentOfAgricultureDataItem", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should throw error 'Invalid ID' if the id param isn't a valid uuid", async () => {
      let mReq: any = { params: { id: "" } };
      const mRes: any = {};
      const mNext = jest.fn();
      await getDepartmentOfAgricultureDataItem(mReq, mRes).catch((e) => {
        expect(e.message).toBe("Invalid ID");
      });

      mReq = { params: { id: "not a uuid so invalid" } };
      await getDepartmentOfAgricultureDataItem(mReq, mRes).catch((e) => {
        expect(e.message).toBe("Invalid ID");
      });
    });

    it("should call into DOAService.getFullDataForItem with the id param", async () => {
      const validUuid = uuidv4();
      const mReq: any = { params: { id: validUuid } };
      const mRes: any = {};
      const mNext = jest.fn();
      const getFullDataForItemSpy = jest
        .spyOn(DepartmentOfAgricultureService, "getFullDataForItem")
        .mockImplementation(() =>
          Promise.resolve(mockDepartmentOfAgricultureDataItem)
        );
      await getDepartmentOfAgricultureDataItem(mReq, mRes).catch((e) => {});
      expect(getFullDataForItemSpy).toHaveBeenCalledWith(validUuid);
    });

    it("should throw an error if getFullDataForItem throws an error", async () => {
      const validUuid = uuidv4();
      const mReq: any = { params: { id: validUuid } };
      const mRes: any = {};
      const getFullDataForItemSpy = jest
        .spyOn(DepartmentOfAgricultureService, "getFullDataForItem")
        .mockImplementation(() =>
          Promise.reject(new Error("Error fetching data from db"))
        );
      await getDepartmentOfAgricultureDataItem(mReq, mRes).catch((e) => {
        expect(e.message).toBe("Error fetching data from db");
      });
    });

    it("should return the data from getFullDataForItem", async () => {
      const validUuid = uuidv4();
      const mReq: any = { params: { id: validUuid } };
      const mRes: any = {};
      const getFullDataForItemSpy = jest
        .spyOn(DepartmentOfAgricultureService, "getFullDataForItem")
        .mockImplementation(() =>
          Promise.resolve(mockDepartmentOfAgricultureDataItem)
        );
      const data = await getDepartmentOfAgricultureDataItem(mReq, mRes).catch(
        (e) => {}
      );
      expect(data).toEqual(mockDepartmentOfAgricultureDataItem);
    });
  });
});

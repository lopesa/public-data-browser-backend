import request from "supertest";
import {
  getDepartmentOfEnergyDataItem,
  getInitialDepartmentOfEnergyData,
} from "./department-of-energy.controller";
import * as DepartmentOfEnergyService from "../services/department-of-energy.service";
import { expect, jest, test } from "@jest/globals";
import {
  mockUSGovernmentInitialDataItem,
  mockUSGovernmentInitialData,
} from "../mocks";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { DepartmentOfEnergyDataItem } from "@prisma/client";

describe("Department of Energy Controller", () => {
  describe("getInitialDepartmentOfEnergyData", () => {
    it("should call into DOAService.getInitialData", async () => {
      const getFullDataForItemSpy = jest
        .spyOn(DepartmentOfEnergyService, "getInitialData")
        .mockImplementation(() => Promise.resolve(mockUSGovernmentInitialData));
      await getInitialDepartmentOfEnergyData().catch((e) => {});
      expect(getFullDataForItemSpy).toHaveBeenCalled();
    });
    it("should throw an error if getInitialData throws an error", async () => {
      jest
        .spyOn(DepartmentOfEnergyService, "getInitialData")
        .mockImplementation(() =>
          Promise.reject(
            new Error("Error fetching data from db: getInitialData")
          )
        );
      await getInitialDepartmentOfEnergyData().catch((e) => {
        expect(e.message).toBe("Error fetching data from db: getInitialData");
      });
    });
    it("should return the data from getInitialData", async () => {
      jest
        .spyOn(DepartmentOfEnergyService, "getInitialData")
        .mockImplementation(() => Promise.resolve(mockUSGovernmentInitialData));
      const data = await getInitialDepartmentOfEnergyData().catch((e) => {});
      expect(data).toEqual(mockUSGovernmentInitialData);
    });
  });

  describe("getDepartmentOfEnergyDataItem", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should throw error 'Invalid ID' if the id param isn't a valid uuid", async () => {
      let mReq: any = { params: { id: "" } };
      const mRes: any = {};
      const mNext = jest.fn();
      await getDepartmentOfEnergyDataItem(mReq, mRes).catch((e) => {
        expect(e.message).toBe("Invalid ID");
      });

      mReq = { params: { id: "not a uuid so invalid" } };
      await getDepartmentOfEnergyDataItem(mReq, mRes).catch((e) => {
        expect(e.message).toBe("Invalid ID");
      });
    });

    it("should call into DOEservice.getFullDataForItem with the id param", async () => {
      const validUuid = uuidv4();
      const mReq: any = { params: { id: validUuid } };
      const mRes: any = {};
      const mNext = jest.fn();
      const getFullDataForItemSpy = jest
        .spyOn(DepartmentOfEnergyService, "getFullDataForItem")
        .mockImplementation(() =>
          Promise.resolve(
            mockUSGovernmentInitialDataItem as DepartmentOfEnergyDataItem
          )
        );
      await getDepartmentOfEnergyDataItem(mReq, mRes).catch((e) => {});
      expect(getFullDataForItemSpy).toHaveBeenCalledWith(validUuid);
    });

    it("should throw an error if getFullDataForItem throws an error", async () => {
      const validUuid = uuidv4();
      const mReq: any = { params: { id: validUuid } };
      const mRes: any = {};
      const getFullDataForItemSpy = jest
        .spyOn(DepartmentOfEnergyService, "getFullDataForItem")
        .mockImplementation(() =>
          Promise.reject(new Error("Error fetching data from db"))
        );
      await getDepartmentOfEnergyDataItem(mReq, mRes).catch((e) => {
        expect(e.message).toBe("Error fetching data from db");
      });
    });

    it("should return the data from getFullDataForItem", async () => {
      const validUuid = uuidv4();
      const mReq: any = { params: { id: validUuid } };
      const mRes: any = {};
      const getFullDataForItemSpy = jest
        .spyOn(DepartmentOfEnergyService, "getFullDataForItem")
        .mockImplementation(() =>
          Promise.resolve(
            mockUSGovernmentInitialDataItem as DepartmentOfEnergyDataItem
          )
        );
      const data = await getDepartmentOfEnergyDataItem(mReq, mRes).catch(
        (e) => {}
      );
      expect(data).toEqual(mockUSGovernmentInitialDataItem);
    });
  });
});

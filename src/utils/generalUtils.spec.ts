import { getFileExtension } from "./generalUtils";

describe("General Utils", () => {
  it("(getFileExtension) should return the file extension of a url", async () => {
    const url =
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
    const extension = getFileExtension(url);
    expect(extension).toBe("png");
  });
});

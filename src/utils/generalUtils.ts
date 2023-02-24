export const diff_hours = (dt2: number, dt1: number) => {
  var diff = (dt2 - dt1) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};

export const getFileExtension = (filename: string) => {
  // return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  if (!filename.includes(".")) {
    return -1;
  }
  const lastDotIndex = filename.lastIndexOf(".");
  const length = filename.length;
  // debugger;
  if (length - lastDotIndex > 5) {
    return -1;
  }
  return (
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) || -1
  );
};

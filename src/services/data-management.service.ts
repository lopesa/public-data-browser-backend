/**
 *
 * @param data an array of one of the highest level datatypes
 * @returns fields on the current db table for the datatype that are null for all items in the array
 *
 * used to hlep input data from different sources. I can use a model based on
 * a previous model that is overly inclusive in order to get a new data set
 * into the db and then use this helper to go back and figure which items
 * never get used for the new model and remove these in the Prisma schema
 */
export const checkForNulls = <T>(data: T) => {
  if (typeof data !== "object" || !Array.isArray(data)) {
    throw new Error("Data in checkForNulls must be an array of objects");
  }
  let nulls: any = {};

  data.forEach((item) => {
    for (const key in item) {
      if (item[key as keyof T] === null) {
        if (!(nulls[key] === 2)) {
          nulls[key] = 1;
        }
      } else {
        nulls[key] = 2;
      }
    }
  });
  const finalNullFields = Object.keys(nulls).filter((key) => nulls[key] === 1);
  return finalNullFields;
};

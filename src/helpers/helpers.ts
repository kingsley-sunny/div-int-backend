import { IAnyObjectType } from "../types/types";
/**
 * This parse the field parameter to a mongodb projector which can be use when selecting fields in a mongodb document
 * @param fields - The fields to be extracted e.g ["name","age"]
 * @returns
 */
export function extractFieldsQuery(fields: string | undefined) {
  let projection: IAnyObjectType = {};

  if (fields && fields.length > 0) {
    // check for wildcard field (*)
    const fieldsArray = JSON.parse(fields) as string[];
    const wildcardField = fieldsArray.find(field => field === "*");

    // if there is no wild card field, then we just append the remaining field to the projection object
    if (!wildcardField) {
      fieldsArray.forEach((field: string) => {
        projection[field] = 1;
      });
    }
  }
  return projection;
}

/**
 * formats value to date if it is a string and the new Date(value) is a valid date else returns the value
 * @param value - either a string | number
 * @returns
 */
const formatToDateIfValid = (value: string | number) => {
  return typeof value === "string" && !isNaN(new Date(value) as any) ? new Date(value) : value;
};

/**
 * Formats the filter to mongodb filter object in a find operation
 * @param filters - The filters to be extracted e.g {name: ["==","Sunny"],"createdAt":[">=":"1-1-2024"]}
 * @returns
 */
export function extractFiltersQuery(filters: string) {
  let whereCondition: IAnyObjectType = {};
  if (filters) {
    let formattedFilters = JSON.parse(filters);

    for (const key in formattedFilters) {
      const element = formattedFilters[key];

      if (!Array.isArray(element) && element.length !== 2) {
        throw new Error(`${key} value must be an array`);
      }

      const operator = element[0];
      let value = element[1];

      switch (operator) {
        case "==":
          whereCondition[key] = { $eq: value };
          break;

        case ">=":
          value = formatToDateIfValid(value);
          whereCondition[key] = { $gte: value };
          break;

        case "<=":
          value = formatToDateIfValid(value);
          whereCondition[key] = { $lte: value };
          break;

        case ">":
          value = formatToDateIfValid(value);
          whereCondition[key] = { $gt: value };
          break;

        case "<":
          value = formatToDateIfValid(value);
          whereCondition[key] = { $lt: value };
          break;

        default:
          break;
      }
    }
  }
  return whereCondition;
}

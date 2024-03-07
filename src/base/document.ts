import dotenv from "dotenv";
import fs from "fs";
import { Collection, Db, MongoClient } from "mongodb";
import path from "path";
import { extractFieldsQuery, extractFiltersQuery } from "../helpers/helpers";
import { IAnyObjectType } from "../types/types";

// load the local environmental variables
dotenv.config();

interface ModelSchema {
  fields: { [key: string]: { type: string; required: boolean; defaultAdded: boolean } };
  requiredFields: string[];
}

export class Document {
  private static modelSchemas: { [key: string]: ModelSchema } = {};
  private static client: MongoClient;
  private static db: Db;

  /**
   * This loads the json file, it is useful for validation
   * @param modelName - the name of the model
   */
  static async loadSchema(modelName: string) {
    const modelJsonPath = path.join("src", "models", modelName, `${modelName}.json`);
    const schema: ModelSchema = JSON.parse(fs.readFileSync(modelJsonPath, "utf8"));
    Document.modelSchemas[modelName] = schema;
  }

  static async connect() {
    Document.client = await MongoClient.connect(
      process.env.DATABASE_URI ?? "mongodb://localhost:27017"
    );
    Document.db = Document.client.db(process.env.DB_NAME ?? "test");
  }

  static getTableName(modelName: string) {
    return `tab${modelName}`;
  }

  static getCollection(modelName: string): Collection {
    const tableName = this.getTableName(modelName);
    return Document.db.collection(tableName);
  }

  /**
   * Loads the model json file and validate the data against it (checks for type and required fields)
   * @param modelName - The name of the model
   * @param data - The data that will be validated against the JSON schema
   */
  static async validateModel(modelName: string, data: any) {
    // load the schema
    await Document.loadSchema(modelName);

    const schema = Document.modelSchemas[modelName];
    if (!schema) {
      throw new Error(`Model schema not found for ${modelName}`);
    }

    const errors = [];

    for (const [field, fieldSchema] of Object.entries(schema.fields)) {
      if (!fieldSchema.defaultAdded) {
        // check if the types are not the same and if the field is not a default field
        if (typeof data[field] !== fieldSchema.type && data[field]) {
          errors.push(
            `${field} type should be ${fieldSchema.type} but got ${typeof data[field]} instead`
          );
        }

        if (fieldSchema.required && !data[field]) {
          errors.push(`${field} is required`);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }

  /**
   *
   * @param modelName - the name of the model
   * @param data - The data to create, createdAt and updatedAt will be created by default
   * @returns
   */
  static async create<T>(modelName: string, data: T) {
    const date = new Date();

    await this.validateModel(modelName, data);

    const collection = this.getCollection(modelName);
    const result = await collection.insertOne({
      ...data,
      createdAt: date,
      updatedAt: date,
    });

    return result.insertedId;
  }

  /**
   * This performs a find query in the model
   * @param modelName - the name of the model
   * @param filters - a object query filters, used in the where condition e.g: {name: ["==","Sunny"],"createdAt":[">=":"1-1-2024"]},
   *
   * @param fields - an array of selected fields in the table to choose, if "*" is present, it will select all the fields
   * @returns an array of mongodb document
   */
  static async find(modelName: string, filters: string, fields?: string) {
    const collection = this.getCollection(modelName);

    let projection: IAnyObjectType = extractFieldsQuery(fields);

    let whereCondition: IAnyObjectType = extractFiltersQuery(filters);

    const data = await collection.find(whereCondition, { projection }).toArray();

    return data;
  }
}

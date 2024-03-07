#!/usr/bin/env node
import { program } from "commander";
import fs from "fs";
import path from "path";

program
  .command("create-model <modelName>")
  .description("Create a new model")
  .action(async modelName => {
    const modelFolder = path.join("src", "models", modelName);
    const modelFilePath = path.join(modelFolder, `${modelName}.ts`);
    const modelJsonPath = path.join(modelFolder, `${modelName}.json`);

    try {
      // Create model folder
      fs.mkdirSync(modelFolder, { recursive: true });

      // Create model file
      const modelFileContent = `import { Document } from '../../base/document';

export class ${modelName} extends Document {
  // Add model properties and methods here
}
`;
      fs.writeFileSync(modelFilePath, modelFileContent);

      // Create model JSON file
      const modelJsonContent = `{
  "fields": {
    "_id": { "type": "string", "required": true, "defaultAdded": true },
    "createdAt": { "type": "string", "required": true, "defaultAdded": true },
    "updatedAt": { "type": "string", "required": true, "defaultAdded": true }
    }
}
`;
      fs.writeFileSync(modelJsonPath, modelJsonContent);

      console.log(`Model ${modelName} created successfully!`);
    } catch (err) {
      console.error(`Error creating model ${modelName}: ${err}`);
    }
  });

program.parse(process.argv);

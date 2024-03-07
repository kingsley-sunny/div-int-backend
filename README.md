## To install all the dependencies

After cloning the source code, to install all the dependencies or binary files run

```shell
npm install
```

after installing the dependencies, make a file called .env in the root directory and then add your secret credentials. example shown below

```shell
DATABASE_URI=mongodb://localhost:27017
DB_NAME=test
PORT=3000
```

make sure to have mongodb server installed or you create a mongodb account and then get the connection_uri

## To start the project

```shell
npm run dev
```

or

```shell
npm run start
```

then open another terminal section and run, if you want to edit it (optional).

```shell
npx tsc --watch
```

## 1. Hooks System

Once the project is being started all the hooks, afterStart, afterMigrate and beforeMigrate will be called. this is an example below

```shell
beforeMigrate hook: before migrating 30%
beforeMigrate hook: before migrating 60%
beforeMigrate hook: before migrating 100%
Server is running on port 3000
afterStart hook: Application starting 30%
afterStart hook: Application starting 60%
afterStart hook: Application started successfully 100%
afterMigrate hook: after migrating 30%
afterMigrate hook: after migrating 60%
afterMigrate hook: after migrating 100%
```

## 2. CLI for Model Creation

To create a model for example if we are creating a User model, run this command

```shell
npx divic create-model User
```

This will create the /models/User/User.ts and also /models/User/User.json file respectively with the JSON file containing the model properties

## 3. Model Structure and Validation

The model created will create a `tab<ModelName>` int the database for example our case will be `tabUser` because we are creating a user model
The json file created along with the model contains the required fields and some model properties
The Document base model have field validations in which all other models inherited after.

## 4. Api Endpoint

The API endpoint to retrieve a model and is

```json
"url": "/api/data",
"requestType": "Get",
"parameters": "modelName, filters, fields"
```

for example if you want to get all the models you send a GET request to

```
http://localhost:3000/api/data?modelName=User
```

if you want to select some fields from the user model you send a GET request to
`http://localhost:3000/api/data?modelName=User&fields=["firstName"]`
This will get only the first name,

If you want to add special filters like adding a where condition, or getting data from a particular date upwards, send a GET request to

```
http://localhost:3000/api/data?modelName=User&filters={ "firstName": ["==", "Sunny"] ,"createdAt":[">=", "1-1-2023"]}
```

###### Aside that I also created an endpoint where you can create a model

send a POST request to

```
http://localhost:3000/api/create?modelName=<ModelName>
```

Note! you can change the `<ModelName>` above to be any Model name. but make sure you create the model with the CLI command first.

you can add any request body, but the structure of your data must follow the `Model.json` structure else it will throw an error.

Thanks
Ezeobi Kingsley Sunny

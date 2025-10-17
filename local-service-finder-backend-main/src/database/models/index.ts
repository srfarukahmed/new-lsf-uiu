/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@src/config/db';
import fs from 'fs';
import path from 'path';
import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = (config as any)[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: dbConfig.logging,
  },
);

// Step 1: Dynamically import models
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.endsWith('.ts') || file.endsWith('.js')),
  );

const models: Record<string, ModelStatic<Model>> = {};

for (const file of modelFiles) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const model = require(path.join(__dirname, file)).default(
    sequelize,
    DataTypes,
  );
  models[model.name] = model;
}

// Step 2: Setup associations
Object.values(models).forEach((model: any) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

// Step 3: Export typed db
export type DbInterface = {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
} & typeof models;

const db = {
  ...models,
  sequelize,
  Sequelize,
} as DbInterface;

export default db;

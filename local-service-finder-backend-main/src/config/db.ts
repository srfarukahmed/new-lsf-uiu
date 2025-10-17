import dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

type IDatabaseConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
  logging: boolean;
};

const config: Record<string, IDatabaseConfig> = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'tabletec_finder',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
  },
  test: {
    username: 'root',
    password: '',
    database: 'mydb_test',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
  },
};

// Log the configuration to verify values are loaded correctly
console.log('Database Configuration:', config);

export default config;

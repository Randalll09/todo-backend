import { registerAs, type ConfigFactory } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'local'}`,
});

const config = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
export default (
  registerAs as (
    token: string,
    factory: ConfigFactory,
  ) => ReturnType<typeof registerAs>
)('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

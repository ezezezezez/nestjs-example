import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "config";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const dbConfig = config.get<PostgresConnectionOptions>("db");

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: Number(process.env.RDS_PORT) || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: ["../**/*.entity.js"],
  synchronize: Boolean(process.env.TYPEORM_SYNC) || dbConfig.synchronize
};

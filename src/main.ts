import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import * as config from "config";

async function bootstrap() {
  const serverConfig: { port: number; origin: string } = config.get("server");

  const logger = new Logger("bootstrap");

  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === "development") {
    app.enableCors();
  } else if (process.env.NODE_ENV === "production") {
    app.enableCors({
      origin: serverConfig.origin
    });

    logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  }

  const PORT = process.env.PORT || serverConfig.port;

  await app.listen(PORT);

  logger.log(`Application listening on port ${PORT}`);
}
bootstrap();

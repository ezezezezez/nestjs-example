import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as config from "config";

async function bootstrap() {
  const serverConfig: { port: number; origin: string } = config.get("server");

  const logger = new Logger("bootstrap");

  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("NestJS Example")
    .setDescription("Task Management API With JWT Strategy As Authentication")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

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

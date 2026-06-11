import { ValidationPipe } from "@nestjs/common";
import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "llms.txt", method: RequestMethod.GET },
      { path: "llms-full.txt", method: RequestMethod.GET },
      { path: "ai-sitemap.xml", method: RequestMethod.GET }
    ]
  });
  // 允许管理后台、官网本地开发及未来正式域名跨域访问
  const corsOrigins = (process.env.CORS_ORIGINS ??
    `${process.env.ADMIN_WEB_ORIGIN ?? "http://localhost:3000"},${process.env.PUBLIC_SITE_URL ?? "https://www.yfyk.com"}`)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const isLocalDevOrigin = (origin: string) =>
    /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(
      origin
    );

  app.enableCors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      if (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
}

bootstrap();

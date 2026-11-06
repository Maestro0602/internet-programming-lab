import { INestApplication, ValidationPipe } from '@nestjs/common';

// Shared by main.ts and the e2e tests, so tests run the app exactly as it runs for real
export function configureApp(app: INestApplication) {
  // Validate every request body and query against its DTO class
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that are not in the DTO...
      forbidNonWhitelisted: true, // ...or rather, refuse the request with 400
      transform: true, // turn the plain JSON into an instance of the DTO
    }),
  );
  // Allow the Vue dev server to call this API from the browser (lecture: CORS)
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173' });
}

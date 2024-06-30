import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swagger(app: INestApplication) {
  const document = createDocument(app);
  SwaggerModule.setup('swagger', app, document);
}

function createDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(`Magic transporters`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  return SwaggerModule.createDocument(app, config);
}

import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerDocumentOptions = new DocumentBuilder()
  .setTitle(`${process.env.COMPANY_NAME} API`)
  .setDescription('Rest API with NestJS, Typeorm and Postgres')
  .setVersion('1.0')
  .addTag('user', 'Operations related to users')
  .addTag('clients', 'Operations related to clients')
  .addBearerAuth()
  .build();

export interface SwaggerDocumentOptions {
  include?: Array<new (...args: any[]) => any>;
  extraModels?: Array<new (...args: any[]) => any>;
  ignoreGlobalPrefix?: boolean;
  deepScanRoutes?: boolean;
  operationIdFactory?: (
    controllerKey: string,
    methodKey: string,
    version?: string,
  ) => string;
  linkNameFactory?: (
    controllerKey: string,
    methodKey: string,
    fieldKey: string,
  ) => string;
  autoTagControllers?: boolean;
}

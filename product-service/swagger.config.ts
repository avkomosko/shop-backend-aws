export const swaggerConfig = {
  title: 'Products service API',
  apiType: 'httpApi',
  generateSwaggerOnDeploy: true,
  typefiles: ['./src/functions/models/product-list.model.ts', './src/functions/models/product.model.ts'],
  useStage: true,
  basePath: '/dev',
  host: 'b8nbu70yzh.execute-api.eu-west-1.amazonaws.com',
}

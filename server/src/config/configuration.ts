export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT ?? '3000', 10),
  version: process.env.VERSION ?? '1.0.0',
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.POSTGRES_USER ?? 'db',
    password: process.env.POSTGRES_PASSWORD ?? 'db',
    database: process.env.POSTGRES_DB ?? 'db',
  },
  ec: {
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRETE_KEY,
    region: process.env.REGION,
    amiId: process.env.AMI_ID,
    securityGroupId: process.env.SECURITY_GROUP_ID,
    subnetId: process.env.SUBNET_ID,
    vpcId: process.env.VPC_ID,
  },
  cors: {
    origins: process.env.CORS_ORIGINS,
  },
});

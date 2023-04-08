import * as Joi from '@hapi/joi';

export default () => ({
  envFilePath: ['.env'],
  validationSchema: Joi.object({
    DATABASE_HOST: Joi.required(),
    DATABASE_PORT: Joi.number().default(5432),
    JWT_SECRET: Joi.required(),
  }),
  secret: process.env.JWT_SECRET,
});

import { Logger } from '@nestjs/common';

export const LoggerHelper = (message: string, ctx: string, error?: boolean) => {
  const logger = new Logger(ctx);

  if (error) {
    return logger.error(message);
  }

  return logger.log(message);
};

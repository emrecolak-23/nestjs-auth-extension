import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/iam/constants/iam.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
    return field ? user && user[field] : user;
  },
);

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { CONSTANTS } from 'utils/constant';

@Injectable()
export class jwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    for (let x = 0; x < CONSTANTS.BY_PASS_URL.length; x++) {
      if (request.url == CONSTANTS.BY_PASS_URL[x]) {
        return true;
      }
    }

    return super.canActivate(context);
  }
}

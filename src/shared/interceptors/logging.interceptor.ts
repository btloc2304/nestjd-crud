import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const sanitizedBody = { ...context.switchToHttp().getRequest().body };
        const sanitizedHeaders = { ...context.switchToHttp().getRequest().headers };

        // Remove or mask sensitive fields
        if (sanitizedBody.password) sanitizedBody.password = '***';
        if (sanitizedHeaders.authorization) sanitizedHeaders.authorization = '***';

        return next.handle();
    }
}

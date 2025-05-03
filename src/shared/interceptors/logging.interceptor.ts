import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');
        console.log('Request:', context.switchToHttp().getRequest().url);
        console.log('Method:', context.switchToHttp().getRequest().method);
        const sanitizedBody = { ...context.switchToHttp().getRequest().body };
        const sanitizedHeaders = { ...context.switchToHttp().getRequest().headers };

        // Remove or mask sensitive fields
        if (sanitizedBody.password) sanitizedBody.password = '***';
        if (sanitizedHeaders.authorization) sanitizedHeaders.authorization = '***';

        console.log('Sanitized Body:', sanitizedBody);
        console.log('Sanitized Headers:', sanitizedHeaders);

        const now = Date.now();
        return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
    }
}

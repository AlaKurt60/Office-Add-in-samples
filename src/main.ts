import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  HTTP_INTERCEPTORS,
  HttpHandler,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptorservice } from './Auth/auth-interceptor.service';

function loggingInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
  console.log('Outgoing request');
  console.log(request);
  // const req = request.clone({
  //   headers: request.headers.set('Dette-er-en-hest', 'Test'),
  // });
  // console.log(req);
  // return next(req);
  return next(request);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorservice,
      multi: true,
    },
    provideHttpClient(withInterceptors([loggingInterceptor])),
    DatePipe,
    provideAnimationsAsync(),
  ],
}).catch((err) => console.error(err));

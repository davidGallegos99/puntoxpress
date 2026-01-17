import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";

import { AppComponent } from "./app/app-shell/app.component";
import { appRoutes } from "./app/app.routes";
import { provideZonelessChangeDetection } from "@angular/core";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes),
    provideZonelessChangeDetection(),
  ],
}).catch((error) => console.error(error));

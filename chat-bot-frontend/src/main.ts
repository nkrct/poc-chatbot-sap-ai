import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { App } from './app/app';
import 'zone.js';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [provideAnimations(), provideHttpClient()]
});

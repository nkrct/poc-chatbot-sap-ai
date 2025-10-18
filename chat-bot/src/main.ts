import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { App } from './app/app';
import 'zone.js';

bootstrapApplication(App, {
  providers: [provideAnimations()]
});

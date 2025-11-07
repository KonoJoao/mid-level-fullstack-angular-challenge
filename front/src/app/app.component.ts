import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ClientPageComponent } from './components/client-page/client-page.component';
import { TabsComponent } from './components/tabs/tabs.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, TabsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'front';
}

import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { ClientPageComponent } from '../client-page/client-page.component';
import { OrderPageComponent } from '../order-page/order-page.component';

@Component({
  selector: 'app-tabs',
  imports: [TabsModule, ButtonModule, ClientPageComponent, OrderPageComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
  currentTab = 0;

  setCurrentTab(tab: number) {
    this.currentTab = tab;
  }
}

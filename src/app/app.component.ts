import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { homeOutline, chatboxOutline, flashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [IonicModule, RouterLink, RouterLinkActive],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/dashboard', icon: 'home-outline' },
    { title: 'Consumption', url: '/consumption', icon: 'flash-outline' },
    { title: 'Chat', url: '/chat', icon: 'chatbox-outline' },
  ];

  constructor() {
    addIcons({ homeOutline, chatboxOutline, flashOutline });
  }
}

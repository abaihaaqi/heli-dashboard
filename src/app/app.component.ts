import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { homeOutline, chatboxOutline, flashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from './services/auth.service';
import {
  IonApp,
  IonSplitPane,
  IonContent,
  IonList,
  IonListHeader,
  IonImg,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonMenu,
  IonMenuToggle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  standalone: true,
  imports: [
    IonMenuToggle,
    IonMenu,
    IonRouterOutlet,
    IonLabel,
    IonIcon,
    IonImg,
    IonListHeader,
    IonList,
    IonContent,
    IonSplitPane,
    IonApp,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/dashboard', icon: 'home-outline' },
    { title: 'Consumption', url: '/consumption', icon: 'flash-outline' },
    { title: 'Chat', url: '/chat', icon: 'chatbox-outline' },
  ];
  currentUser: any = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((data) => {
      this.currentUser = data;
    });

    addIcons({ homeOutline, chatboxOutline, flashOutline });
  }
}

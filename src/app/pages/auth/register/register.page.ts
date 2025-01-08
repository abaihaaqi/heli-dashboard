import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import {
  IonHeader,
  IonButton,
  IonToolbar,
  IonContent,
  IonTitle,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonList,
    IonTitle,
    IonContent,
    IonToolbar,
    IonButton,
    IonHeader,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
})
export class RegisterPage {
  name: string = '';
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService
      .register({
        name: this.name,
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Register failed:', error);
        },
      });
  }
}

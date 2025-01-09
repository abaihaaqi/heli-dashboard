import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserApplianceService } from 'src/app/services/user-appliance.service';
import { ConsumptionService } from 'src/app/services/consumption.service';
import {
  IonHeader,
  IonButton,
  IonTitle,
  IonList,
  IonItem,
  IonToolbar,
  IonContent,
  IonInput,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    IonInput,
    IonContent,
    IonToolbar,
    IonItem,
    IonList,
    IonTitle,
    IonButton,
    IonHeader,
  ],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private userApplianceService: UserApplianceService,
    private consumptionService: ConsumptionService,
    private router: Router
  ) {}

  ngOnInit() {}

  login() {
    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.userApplianceService.getAllData().subscribe();
          this.consumptionService.getAllData().subscribe();
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
  }
}

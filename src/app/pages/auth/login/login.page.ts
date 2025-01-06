import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login() {
    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
  }
}

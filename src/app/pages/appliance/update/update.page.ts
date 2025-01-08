import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonButtons,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { UserApplianceService } from 'src/app/services/user-appliance.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
  standalone: true,
  imports: [
    IonSelectOption,
    IonItem,
    IonList,
    IonContent,
    IonIcon,
    IonButton,
    IonTitle,
    IonBackButton,
    IonToolbar,
    IonButtons,
    IonHeader,
    CommonModule,
    FormsModule,
  ],
})
export class UpdatePage implements OnInit {
  @Input() id = '';

  applianceName: any;
  rooms: any = [];
  prevRoom: any;

  inputRoom: any;

  constructor(
    private userApplianceService: UserApplianceService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.userApplianceService.rooms$.subscribe((data) => (this.rooms = data));
    this.userApplianceService.getDataByID(this.id).subscribe({
      next: (response) => {
        this.prevRoom = response.room;
        this.inputRoom = this.prevRoom;
        this.applianceName = response.appliance.toLowerCase();
      },
      error: (error) => {
        console.error('Error loading data:', error);
      },
    });
  }

  handleUpdate() {
    this.userApplianceService
      .updateUserAppliance(Number(this.id), this.inputRoom, this.prevRoom)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Update user appliance failed:', error);
        },
      });
    this.inputRoom = this.prevRoom;
  }

  logout() {
    this.authService.logout().subscribe();
    this.router.navigate(['/login']);
  }
}

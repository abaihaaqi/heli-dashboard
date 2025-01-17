import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { ApplianceService } from 'src/app/services/appliance.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserApplianceService } from 'src/app/services/user-appliance.service';
import {
  IonToolbar,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonSelectOption,
    IonSelect,
    IonItem,
    IonList,
    IonContent,
    IonIcon,
    IonButton,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    FormsModule,
  ],
})
export class AddPage implements OnInit {
  appliances: any;
  rooms: any = [];

  inputAppliance: any;
  inputRoom: any;

  constructor(
    private applianceService: ApplianceService,
    private userApplianceService: UserApplianceService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.loadData();
    this.userApplianceService.rooms$.subscribe((data) => (this.rooms = data));
  }

  loadData() {
    this.applianceService.getAllData().subscribe({
      next: (response) => {
        this.appliances = response;
      },
      error: (error) => {
        console.error('Error loading data:', error);
      },
    });
  }

  addUserAppliance() {
    this.userApplianceService
      .addUserAppliance({
        appliance_id: this.inputAppliance,
        room: this.inputRoom,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Add user appliance failed:', error);
        },
      });
    this.inputAppliance = undefined;
    this.inputRoom = undefined;
  }

  logout() {
    this.authService.logout().subscribe();
    this.router.navigate(['/login']);
  }
}

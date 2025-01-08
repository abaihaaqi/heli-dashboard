import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { createOutline, logOutOutline, trashBinOutline } from 'ionicons/icons';
import { UserApplianceService } from 'src/app/services/user-appliance.service';
import { ConsumptionService } from 'src/app/services/consumption.service';
import { ReqAddConsumption } from 'src/app/model/consumption';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class DashboardPage implements OnInit {
  userAppliancesByRoom: any = {};
  rooms: any = [];

  constructor(
    private userApplianceService: UserApplianceService,
    private consumptionService: ConsumptionService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ logOutOutline, trashBinOutline, createOutline });
  }

  ngOnInit() {
    this.userApplianceService.getAllData().subscribe();
    this.userApplianceService.rooms$.subscribe((data) => {
      this.rooms = data;
    });
    this.userApplianceService.userAppliancesByRoom$.subscribe((data) => {
      this.userAppliancesByRoom = data;
    });
  }

  handleDelete(id: any, room: any) {
    this.userApplianceService.deleteUserAppliance(id, room).subscribe({
      next: () => {
        console.log('User appliance deleted successfully');
      },
      error: (err) => console.error('Error deleting user appliance:', err),
    });
  }

  toggleAppliance(userAppliance: any): void {
    const dateISOString = new Date(Date.now()).toISOString();
    const currentStatus = userAppliance.current_status;
    const targetStatus = currentStatus == 'on' ? 'off' : 'on';
    const energy = userAppliance.energy;
    const data: ReqAddConsumption = {
      user_appliance_id: userAppliance.id,
      amount: targetStatus == 'off' ? 0 : energy,
      consumed_at: dateISOString,
      status: targetStatus,
    };

    this.consumptionService.addConsumption(data).subscribe({
      next: () => {
        this.userApplianceService.updateCurrentStatus({
          id: userAppliance.id,
          status: currentStatus,
          room: userAppliance.room,
        });
        console.log('Consumption added successfully');
      },
      error: (error) => {
        console.error('Error loading data:', error);
      },
    });
  }

  logout() {
    this.authService.logout().subscribe();
    this.router.navigate(['/login']);
  }
}

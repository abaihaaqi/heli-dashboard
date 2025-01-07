import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ConsumptionService } from 'src/app/services/consumption.service';
import { FormsModule } from '@angular/forms';
import { ConsumptionsChartComponent } from '../../components/consumptions-chart/consumptions-chart.component';

@Component({
  selector: 'app-consumption',
  templateUrl: 'consumption.page.html',
  styleUrls: ['consumption.page.scss'],
  imports: [FormsModule, IonicModule, ConsumptionsChartComponent],
})
export class ConsumptionPage implements OnInit {
  consumptions: any = [];

  constructor(
    private authService: AuthService,
    private consumptionService: ConsumptionService,
    private router: Router
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.consumptionService.getAllData().subscribe();
    this.consumptionService.consumptions$.subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        const consumption = data[i];
        const consumptionDate = new Date(consumption.consumed_at);
        const dateStr = consumptionDate.toLocaleDateString(['ID-id'], {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        });
        data[i].date = dateStr;

        const timeStr = consumptionDate.toLocaleTimeString([], {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        });
        data[i].time = timeStr;
      }
      this.consumptions = data;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  reset() {}
}

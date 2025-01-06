import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ConsumptionService } from 'src/app/services/consumption.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consumption',
  templateUrl: 'consumption.page.html',
  styleUrls: ['consumption.page.scss'],
  imports: [FormsModule, IonicModule],
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
      this.consumptions = data;
      console.log(this.consumptions);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  reset() {}
}

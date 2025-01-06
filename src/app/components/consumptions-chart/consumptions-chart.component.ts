import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { ConsumptionService } from 'src/app/services/consumption.service';

@Component({
  selector: 'app-consumptions-chart',
  templateUrl: './consumptions-chart.component.html',
  styleUrls: ['./consumptions-chart.component.scss'],
  imports: [IonicModule],
})
export class ConsumptionsChartComponent implements OnInit {
  consumptions: any = [];

  constructor(private consumptionService: ConsumptionService) {}

  ngOnInit() {
    this.consumptionService.getAllData().subscribe();
    this.consumptionService.consumptions$.subscribe((data) => {
      this.consumptions = data;
      console.log(this.consumptions);
    });
    // this.consumptionSub = this.consumptionService.consumptions.subscribe(
    //   (consumptions) => {
    //     this.consumptions = consumptions;
    //     const allHours: string[] = [];
    //     const energyConsumptions: number[] = [];
    //     let startDate: number = 0;
    //     let endDate: number = 0;
    //     let monthYearStr: string = '';
    //     for (let i = 0; i < consumptions.length; i++) {
    //       const consumptionData = consumptions[i];
    //       const consumptionDate = new Date(consumptionData.consumption_date);
    //       const monthNames = [
    //         'January',
    //         'February',
    //         'March',
    //         'April',
    //         'May',
    //         'June',
    //         'July',
    //         'August',
    //         'September',
    //         'October',
    //         'November',
    //         'December',
    //       ];
    //       const month = monthNames[consumptionDate.getMonth()];
    //       const year = consumptionDate.getFullYear();
    //       monthYearStr = `${month} ${year}`;
    //       const currentDate = consumptionDate.getDate();
    //       if (startDate == 0 || currentDate < startDate) {
    //         startDate = currentDate;
    //       }
    //       if (currentDate > endDate) {
    //         endDate = currentDate;
    //       }
    //       const time = consumptionDate.toLocaleTimeString([], {
    //         hour12: false,
    //         hour: '2-digit',
    //         minute: '2-digit',
    //       });
    //       const hourId = allHours.findIndex((hour) => hour == time);
    //       if (hourId == -1) {
    //         allHours.push(time);
    //         energyConsumptions.push(consumptionData.energy_consumption);
    //       } else {
    //         energyConsumptions[hourId] += consumptionData.energy_consumption;
    //       }
    //     }
    //     if (allHours.length != 0 && energyConsumptions.length != 0) {
    //       this.chart = new Chart('MyChart', {
    //         type: 'line', //this denotes tha type of chart
    //         data: {
    //           // values on X-Axis
    //           labels: allHours,
    //           datasets: [
    //             {
    //               label: `${startDate} - ${endDate} ${monthYearStr}`,
    //               data: energyConsumptions,
    //             },
    //           ],
    //         },
    //         options: {
    //           aspectRatio: 1.5,
    //         },
    //       });
    //     }
    //   }
    // );
  }
}

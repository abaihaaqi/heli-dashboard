import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import { AnalyzeTableComponent } from '../analyze-table/analyze-table.component';

@Component({
  selector: 'app-consumptions-chart',
  templateUrl: './consumptions-chart.component.html',
  styleUrls: ['./consumptions-chart.component.scss'],
  imports: [IonicModule, FormsModule, AnalyzeTableComponent],
})
export class ConsumptionsChartComponent implements OnInit, AfterViewInit {
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;
  @Input() data: any[] = [];
  calculatedData: any = {};
  filteredData: any = {};

  selectAvailableOption: any[] = [];

  inputGroupBy: any = 'day';
  inputSelectedOption: any;

  chart: Chart | undefined;

  ngOnInit(): void {
    this.populateSelectAvailableOption();
    if (this.data && this.data.length > 0) {
      this.calculateConsumptions(this.data);
      this.filterByDate();
    }
  }

  ngAfterViewInit() {
    this.initializeChart();
  }

  private populateSelectAvailableOption(): void {
    if (this.data.length === 0) {
      return;
    }

    const dates = this.data.map((item) => new Date(item.consumed_at).getTime());
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));
    endDate.setHours(23, 59, 59, 999);

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const date = new Date(currentDate);
      const label = date.toLocaleDateString(['ID-id'], {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
      this.selectAvailableOption.push({
        label: label,
        value: date.toISOString(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.inputSelectedOption = this.selectAvailableOption[0].value;
  }

  private calculateConsumptions(data: any[]) {
    // Filter and sort data
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.consumed_at).getTime() - new Date(b.consumed_at).getTime()
    );

    const groupedByAppliance: { [appliance: string]: any[] } = {};

    // Group data by appliance
    sortedData.forEach((item) => {
      if (!groupedByAppliance[item.appliance]) {
        groupedByAppliance[item.appliance] = [];
      }
      groupedByAppliance[item.appliance].push(item);
    });

    // Process each appliance
    const appliancesConsumption: {
      [appliance: string]: any;
    } = {};

    for (const appliance in groupedByAppliance) {
      const hourlyConsumption: { [hour: string]: number } = {};
      const events = groupedByAppliance[appliance];

      let startTime: Date | null = null;
      let amount: any = 0;

      for (const event of events) {
        if (!appliancesConsumption[event.appliance]) {
          appliancesConsumption[event.appliance] = {
            room: event.room,
            kwh: event.amount,
          };
        }

        const eventTime = new Date(event.consumed_at);

        if (event.status === 'on') {
          startTime = eventTime;
          startTime.setMinutes(0, 0, 0);
          amount = event.amount;
        } else if (event.status === 'off' && startTime) {
          const endTime = eventTime;

          // Calculate energy consumption across hours
          let current = new Date(startTime);

          while (current <= endTime) {
            current.setHours(current.getHours() + 1);
            const dateLabel = current.toISOString();

            if (!hourlyConsumption[dateLabel]) {
              hourlyConsumption[dateLabel] = 0;
            }

            // Allocate energy proportionally to the time span
            hourlyConsumption[dateLabel] += amount;
          }

          startTime = null; // Reset start time
        }
      }

      if (events.length % 2 !== 0) {
        const startTime = new Date(events[events.length - 1].consumed_at);
        startTime.setMinutes(0, 0, 0);

        const endTime = new Date(Date.now());
        endTime.setMinutes(0, 0, 0);

        // Calculate energy consumption across hours
        let current = new Date(startTime);

        while (current <= endTime) {
          current.setHours(current.getHours() + 1);
          const dateLabel = current.toISOString();

          if (!hourlyConsumption[dateLabel]) {
            hourlyConsumption[dateLabel] = 0;
          }

          // Allocate energy proportionally to the time span
          hourlyConsumption[dateLabel] += amount;
        }
      }
      appliancesConsumption[appliance] = {
        consumptions: hourlyConsumption,
        ...appliancesConsumption[appliance],
      };
    }
    this.calculatedData = appliancesConsumption;
  }

  private initializeChart() {
    const { labels, datasets } = this.transformDataForChart();

    // Initialize Chart.js
    this.chart = new Chart(this.myChart.nativeElement, {
      type: 'line', // Chart type (can be 'bar', 'line', 'pie', etc.)
      data: {
        labels: labels, // Hours as labels
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  private filterByDate() {
    const start = new Date(this.inputSelectedOption);
    start.setHours(0, 0, 0, 0);
    const end = new Date(this.inputSelectedOption);
    end.setHours(23, 59, 59, 999);

    const filteredData: { [key: string]: any } = {};

    for (const [appliance, records] of Object.entries(this.calculatedData)) {
      const filteredRecords = Object.entries(
        (records as { consumptions: { [key: string]: any } }).consumptions
      ).reduce((result: { [key: string]: any }, [date, value]) => {
        const recordDate = new Date(date);
        const timeStr = `${String(recordDate.getHours()).padStart(2, '0')}:00`;

        if (recordDate >= start && recordDate <= end) {
          result[timeStr] = value;
        }
        return result;
      }, {});

      if (Object.keys(filteredRecords).length > 0) {
        filteredData[appliance] = {
          consumptions: filteredRecords,
          room: (records as { room: string }).room,
          kwh: (records as { kwh: string }).kwh,
        };
      }
    }

    this.filteredData = filteredData;
  }

  private transformDataForChart() {
    console.log(this.filteredData);

    // Generate hourly labels (00:00 to 23:00)
    const labels = Array.from(
      { length: 24 },
      (_, i) => `${String(i).padStart(2, '0')}:00`
    );

    // Transform the data into Chart.js format
    const datasets = Object.entries(this.filteredData).map(
      ([appliance, readings]) => {
        const readingsTyped = readings as {
          consumptions: { [key: string]: number };
        };

        const hourlyData = labels.map((hour) => {
          return readingsTyped.consumptions[hour] || 0;
        });

        return {
          label: appliance,
          data: hourlyData,
          borderColor: this.getRandomColor(),
          fill: false,
        };
      }
    );

    return { labels, datasets };
  }

  private getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 1)`;
  }

  onSelectChange() {
    this.filterByDate();

    const { datasets } = this.transformDataForChart();
    if (this.chart) {
      this.chart.data.datasets = datasets;
      this.chart.update();
    }
  }
}

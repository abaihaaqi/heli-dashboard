import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-analyze-table',
  templateUrl: './analyze-table.component.html',
  styleUrls: ['./analyze-table.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AnalyzeTableComponent implements OnChanges {
  @Input() data: any[] = [];
  table: {
    Appliance: string[];
    Consumption: string[];
    Room: string[];
    KWh: string[];
  } = { Appliance: [], Consumption: [], Room: [], KWh: [] };
  query = '';

  chats: { AIResponse: string[]; UserQuestion: string[] } = {
    AIResponse: [],
    UserQuestion: [],
  };
  chatObj = Object.entries(this.chats);

  constructor(private chatService: ChatService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.table = {
      Appliance: [],
      Consumption: [],
      Room: [],
      KWh: [],
    };
    if (changes['data'].currentValue) {
      for (const [key, value] of Object.entries(changes['data'].currentValue)) {
        this.table.Appliance.push(key);
        const typedValue = value as {
          room: string;
          kwh: string;
          consumptions: { [key: string]: string };
        };
        this.table.Room.push(typedValue.room);
        this.table.KWh.push(String(typedValue.kwh));

        let current = '0.00';
        for (const amount of Object.values(typedValue.consumptions)) {
          current = (parseFloat(current) + parseFloat(amount)).toFixed(1);
        }
        this.table.Consumption.push(current);
      }
    }
  }

  analyzeTable() {
    this.chatService.analyzeTable(this.table, this.query).subscribe({
      next: (response) => {
        this.chats.UserQuestion.push(this.query);
        this.chats.AIResponse.push(response);
        this.query = '';
      },
      error: (error) => {
        console.error('Analyze failed:', error);
      },
    });
  }
}

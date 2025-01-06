import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AiService } from 'src/app/services/ai.service';

@Component({
  selector: 'app-analyze-table',
  templateUrl: './analyze-table.component.html',
  styleUrls: ['./analyze-table.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AnalyzeTableComponent {
  query = '';
  chats: any = {
    AIResponse: [],
    UserQuestion: [],
  };
  chatObj = Object.entries(this.chats);

  constructor(private aiService: AiService) {}

  analyzeTable() {
    this.aiService.analyzeTable(this.query).subscribe({
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

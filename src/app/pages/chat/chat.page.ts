import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { MarkdownService } from '../../services/markdown.service';
import { ChatService } from 'src/app/services/chat.service';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonInput,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonMenuButton,
    IonIcon,
    IonButton,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonContent,
    IonHeader,
    CommonModule,
    FormsModule,
  ],
})
export class ChatPage implements OnInit {
  query = '';
  chats: any = {
    AIResponse: [],
    UserQuestion: [],
  };
  chatObj = Object.entries(this.chats);

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private markdownService: MarkdownService,
    private router: Router
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {}

  chat() {
    this.chatService.chat(this.query).subscribe({
      next: (response) => {
        this.chats.UserQuestion.push(this.query);
        const markdown = this.markdownService.convertMarkdownToHtml(response);
        this.chats.AIResponse.push(markdown);
        this.query = '';
      },
      error: (error) => {
        console.error('Chat failed :', error);
      },
    });
  }

  logout() {
    this.authService.logout().subscribe();
    this.router.navigate(['/login']);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private converter: any;

  constructor() {
    this.loadShowdown();
  }

  async loadShowdown() {
    const showdown = await import('showdown');
    this.converter = new showdown.Converter();
  }

  async convertMarkdownToHtml(markdown: string): Promise<string> {
    if (!this.converter) {
      await this.loadShowdown();
    }
    return this.converter.makeHtml(markdown);
  }
}

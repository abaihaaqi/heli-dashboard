import { Injectable } from '@angular/core';
import * as showdown from 'showdown';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private converter: showdown.Converter;

  constructor() {
    this.converter = new showdown.Converter();
  }

  convertMarkdownToHtml(markdown: string): string {
    return this.converter.makeHtml(markdown);
  }
}

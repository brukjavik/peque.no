import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapHeartFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, [NgIcon]],
  providers: [provideIcons({ bootstrapHeartFill })],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  urlInput: string = '';
  shortenedUrl: string | null = null;
  isCreatingShortLink: boolean = true;
  errorMessage: string | null = null;
  copied: boolean = false;

  retry(): void {
    this.urlInput = '';
    this.shortenedUrl = null;
    this.isCreatingShortLink = true;
    this.errorMessage = null;
  }

  copyToClipboard(): void {
    if (this.shortenedUrl) {
      navigator.clipboard.writeText(this.shortenedUrl).then(
        () => {
          this.errorMessage = null;
          this.copied = true;
          setTimeout(() => {
            this.copied = false;
          }, 2000);
        },
        (err) => {
          this.errorMessage = 'Failed to copy URL.';
          console.error('Could not copy text: ', err);
        }
      );
    } else {
      this.errorMessage = 'No URL to copy.';
    }
  }

  shortenUrl(): void {
    try {
      const url = new URL(this.urlInput);
      const isHttp = url.protocol === 'http:' || url.protocol === 'https:';
      const hasHostname = !!url.hostname;

      if (!isHttp || !hasHostname) {
        throw new Error();
      }
    } catch {
      this.errorMessage = 'Por favor, insira uma URL válida.';
      this.shortenedUrl = null;
      return;
    }

    try {
      const encoded = btoa(this.urlInput).slice(0, 6);
      this.shortenedUrl = `https://short.ly/${encoded}`;
      this.errorMessage = null;
      this.isCreatingShortLink = false;
    } catch (error) {
      this.errorMessage = 'Failed to shorten the URL.';
      this.shortenedUrl = null;
    }
  }
}

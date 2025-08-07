import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapHeartFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, [NgIcon], HttpClientModule],
  providers: [provideIcons({ bootstrapHeartFill })],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private http: HttpClient) {}
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

    this.isCreatingShortLink = true;
    this.http
      .post<{ shortenedUrl: string }>('http://localhost:3000/create', {
        url: this.urlInput,
      })
      .subscribe({
        next: (response) => {
          this.shortenedUrl = response.shortenedUrl;
          this.errorMessage = null;
          this.isCreatingShortLink = false;
        },
        error: (err) => {
          this.errorMessage = 'Erro ao encurtar a URL.';
          this.shortenedUrl = null;
          this.isCreatingShortLink = false;
        },
      });
  }
}

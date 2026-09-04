import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { PortfolioCard } from '../portfolio.service';

@Component({
  selector: 'app-case-study-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-study-modal.component.html',
  styleUrl: './case-study-modal.component.css',
})
export class CaseStudyModalComponent {
  @Input() card: PortfolioCard | null = null;
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.card) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }
}

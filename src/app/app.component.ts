import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PortfolioService, PortfolioCard } from './portfolio.service';
import { PortfolioCardComponent } from './portfolio-card/portfolio-card.component';
import { CaseStudyModalComponent } from './case-study-modal/case-study-modal.component';
import { AboutMeComponent } from './about-me/about-me.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, PortfolioCardComponent, CaseStudyModalComponent, AboutMeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly profile = this.portfolioService.profile;
  readonly cards = this.portfolioService.cards;
  readonly currentYear = new Date().getFullYear();

  selectedCard: PortfolioCard | null = null;

  openCaseStudy(card: PortfolioCard): void {
    this.selectedCard = card;
    document.body.style.overflow = 'hidden';
  }

  closeCaseStudy(): void {
    this.selectedCard = null;
    document.body.style.overflow = '';
  }
}

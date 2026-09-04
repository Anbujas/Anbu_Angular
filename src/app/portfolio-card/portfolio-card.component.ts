import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CanvasAnimationService } from '../canvas-animation.service';
import { PortfolioCard } from '../portfolio.service';

@Component({
  selector: 'app-portfolio-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-card.component.html',
  styleUrl: './portfolio-card.component.css',
})
export class PortfolioCardComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) card!: PortfolioCard;
  @Output() learnMore = new EventEmitter<PortfolioCard>();

  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private stopAnimation?: () => void;

  constructor(private readonly canvasAnimationService: CanvasAnimationService) {}

  ngAfterViewInit(): void {
    this.stopAnimation = this.canvasAnimationService.start(this.canvasRef.nativeElement, this.card.animation);
  }

  ngOnDestroy(): void {
    this.stopAnimation?.();
  }

  onLearnMore(): void {
    this.learnMore.emit(this.card);
  }
}

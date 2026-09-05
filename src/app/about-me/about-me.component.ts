import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Skill {
  name: string;
  percent: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

interface Metric {
  value: string;
  label: string;
}

interface Achievement {
  icon: string;
  title: string;
  detail: string;
}

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css',
})
export class AboutMeComponent {
  readonly skillCategories: SkillCategory[] = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React', percent: 90 },
        { name: 'Angular', percent: 80 },
        { name: 'JavaScript', percent: 85 },
        { name: 'TypeScript', percent: 85 },
      ],
    },
    {
      title: 'Backend & Data',
      skills: [
        { name: 'Python', percent: 90 },
        { name: 'FastAPI', percent: 85 },
        { name: 'SQL / Starburst', percent: 88 },
        { name: 'Pandas / Databricks', percent: 80 },
      ],
    },
    {
      title: 'AI & ML',
      skills: [
        { name: 'NLP / Transformers', percent: 85 },
        { name: 'XGBoost / ARIMA', percent: 80 },
        { name: 'LLM Integration', percent: 82 },
        { name: 'Scikit-learn', percent: 78 },
      ],
    },
    {
      title: 'Platforms & DevOps',
      skills: [
        { name: 'Tableau', percent: 85 },
        { name: 'Helm / Docker', percent: 80 },
        { name: 'Git / CI-CD', percent: 90 },
        { name: 'AWS / Cloud', percent: 80 },
      ],
    },
  ];

  readonly metrics: Metric[] = [
    { value: '500+', label: 'Hours/Week Saved' },
    { value: '100+', label: 'Analysts Served' },
    { value: '77%', label: 'Performance Win' },
    { value: '95%', label: 'ML Accuracy' },
  ];

  readonly achievements: Achievement[] = [
    {
      icon: '📈',
      title: 'Promoted to Data Engineer 2 (July 2026)',
      detail:
        'Advanced from Developer role in recognition of technical excellence, project delivery, and measurable team impact within first year.',
    },
    {
      icon: '🏆',
      title: 'Best Team Player Award (2024–25)',
      detail:
        'Recognized for driving innovation while uplifting teammates and leading all AI/automation initiatives across global liquidity reporting.',
    },
    {
      icon: '📦',
      title: '8 Production Systems Shipped',
      detail:
        'Analytics Hub, Dynamic Dashboard, Forecasting Engine, Commentary Automation, SQL Converter, Jira Integration, Migration Analyzer, LMS. All at scale, all in production.',
    },
    {
      icon: '💡',
      title: '$20K Pro Bono Nonprofit Impact',
      detail:
        'Volunteered website development for nonprofits via Catchafire. Delivered real value to organizations with limited tech budgets.',
    },
  ];
}

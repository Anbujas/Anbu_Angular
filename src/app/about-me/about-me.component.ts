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

interface CtaButton {
  icon?: string;
  label: string;
  href: string;
  variant: 'filled' | 'outline';
  external?: boolean;
  download?: string;
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
      detail: 'Advanced from Developer role in recognition of technical excellence and team impact within first year.',
    },
    {
      icon: '🏆',
      title: 'Best Team Player Award (2024–25)',
      detail: 'Recognized for driving innovation across AI/automation initiatives and lifting teammates.',
    },
    {
      icon: '💡',
      title: '8 Production Systems + $20K Nonprofit Impact',
      detail: 'Analytics Hub, Forecasting Engine, Commentary Automation, SQL Converter, and more. Plus $20K pro bono development via Catchafire.',
    },
  ];

  readonly certifications: Achievement[] = [
    {
      icon: '📜',
      title: 'Tableau Desktop Specialist',
      detail: 'Certified professional in data visualization and dashboard design.',
    },
  ];

  readonly ctaButtons: CtaButton[] = [
    {
      icon: '📥',
      label: 'Download Resume',
      href: '/assets/Anbu_Murugesan_Resume.pdf',
      variant: 'filled',
      download: 'Anbu_Murugesan_Resume.pdf',
    },
    {
      label: 'Connect with me',
      href: 'mailto:anbujas18@gmail.com',
      variant: 'outline',
    },
  ];
}

import { Injectable } from '@angular/core';

export type AnimationKey =
  | 'files-scan'
  | 'dashboard'
  | 'progress-fill'
  | 'globe-orbit'
  | 'row-sync'
  | 'typing'
  | 'sql-morph'
  | 'circle-grow'
  | 'compare-sync'
  | 'tableau-build';

export type BadgeVariant = 'blue' | 'emerald' | 'orange';

export interface CardBadge {
  label: string;
  variant: BadgeVariant;
}

export interface SocialLink {
  icon: 'email' | 'github' | 'linkedin';
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  photo: string;
  email: string;
  resumeUrl: string;
  social: SocialLink[];
}

export interface PortfolioCard {
  id: string;
  emoji: string;
  title: string;
  tech: string[];
  badge: CardBadge;
  /** The emerald highlight line shown on the card front and repeated atop the case study modal. */
  summary: string;
  problem: string;
  solution: string;
  result: string;
  /** Short quantified badges shown at the bottom of the case study modal. */
  keyMetrics: string[];
  animation: AnimationKey;
  featured?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  readonly profile: Profile = {
    name: 'Anbu Murugesan',
    title: 'Full-Stack Data Engineer & AI Automation Lead',
    bio: "Architecting enterprise data platforms at Citi's Global Liquidity Reporting System. 3+ years shipping production systems serving 100+ financial analysts. Expert in React, Angular, FastAPI, regulatory domain knowledge (LCR, NSFR, FR2052a). Built AI-powered automation tooling, migrated Oracle to Trino, and led the IFW→Navigator modernization. Award-winning team player driving innovation in financial technology.",
    photo: 'assets/anbu-photo.png',
    email: 'anbujas18@gmail.com',
    resumeUrl: 'assets/Anbu_Murugesan_Resume.pdf',
    social: [
      { icon: 'email', label: 'anbujas18@gmail.com', href: 'mailto:anbujas18@gmail.com' },
      { icon: 'github', label: 'anbujas.github.io/portfolio', href: 'https://anbujas.github.io/portfolio' },
    ],
  };

  readonly cards: PortfolioCard[] = [
    {
      id: 'table-migration-analyzer',
      emoji: '🔬',
      title: 'Table Migration Analyzer',
      tech: ['Python', 'Tableau API', 'Pandas', 'FastAPI', 'Snowflake API'],
      badge: { label: 'COMPLETED', variant: 'blue' },
      summary: 'Scans Tableau workbooks & identifies dashboard impacts | 80% faster assessment',
      problem:
        "Citi's Tableau estate spanned 200+ workbooks across liquidity reporting, and every pre-migration change required analysts to manually trace which physical tables and columns each dashboard depended on. That meant opening each workbook, reviewing data sources, and tracing back to Oracle tables by hand. For the full estate this took 6-8 weeks of analyst time, and a missed dependency meant a broken dashboard in production. Impact analysis had become the critical-path blocker for the entire migration programme.",
      solution:
        "Built a Python utility that connects to the Tableau Server API to pull workbook metadata, then parses each Tableau Data Source (TDS) file to extract every table and column reference. It cross-references those references against the Snowflake schema and the legacy Oracle mappings, then generates dependency reports showing exactly which dashboards would break if a given table were removed. Findings are ranked by business criticality — LCR, NSFR, ILST and similar regulatory scopes surface first — and exported to CSV and Slack for team review. Pandas handles the data reconciliation underneath, with FastAPI serving results through a lightweight web UI.",
      result:
        "Impact assessment dropped from 6-8 weeks to 5-6 business days — an 80% reduction — while scanning the full 200+ workbook estate automatically and surfacing 156 cross-dependencies with zero manual errors. That gave the migration programme the confidence to proceed with a predictable, pre-mapped scope of dashboard rework instead of discovering breakages after the fact.",
      keyMetrics: ['80% FASTER', '200+ WORKBOOKS', '156 DEPENDENCIES', '6 DAYS vs 8 WEEKS'],
      animation: 'files-scan',
    },
    {
      id: 'dynamic-dashboard',
      emoji: '📊',
      title: 'Dynamic Dashboard',
      tech: ['React', 'FastAPI', 'Chart.js', 'D3.js', 'Slack API', 'Responsive Design'],
      badge: { label: 'FEATURED', variant: 'emerald' },
      summary: 'Real-time LCR/NSFR metrics & live compliance visibility | 5+ hours/week saved | Enterprise-scale',
      problem:
        "Citi's liquidity reporting team — 100+ analysts — relied on static Tableau reports that refreshed once a day at 6pm. Intraday, conditions could shift fast: funding stress events, sudden client deposit moves, new FX exposures opening up. With no live view, analysts pieced together intraday status by hand — checking spreadsheets and calling trading desks — while compliance had no real-time visibility for regulatory alerts. Across the team that manual reconciliation cost 5+ hours per analyst every week.",
      solution:
        "Built the GLRS Analytics Hub, a full-stack React + FastAPI platform that consolidated eight separate manual reporting workflows into one: a configurable real-time dashboard for LCR, NSFR, ILST, RLAP and TLST; a 24-hour intraday forecast powered by an XGBoost + ARIMA ensemble; an automated commentary engine that writes variance narrative in analyst voice; a Tableau Inspector for workbook lineage; a CSV comparator for UAT-vs-PROD validation; an Oracle-to-Starburst SQL query converter; an in-app Jira tracker; and an admin panel with SOEID auth, session timeout and audit logging. The React SPA runs offline-first so liquidity data never leaves the secure network, FastAPI handles the backend proxy, Slack API distributes real-time alerts, and the whole platform is Helm-packaged and deployed to Red Hat OpenShift via a Harness/Lightspeed CI-CD pipeline.",
      result:
        "The platform now recovers 5+ hours per analyst per week — over 500 hours weekly company-wide — with full real-time compliance visibility and 100% adoption across the liquidity analyst team. Intraday market events no longer create blind spots, the need for an external BI tool subscription was eliminated, and the platform held a 99.9% uptime SLA on OpenShift's HA cluster through a six-week build from inception to SIT rollout, with SSO to production now in progress.",
      keyMetrics: ['500+ HOURS/WEEK SAVED', '100+ ANALYSTS', '8-IN-1 PLATFORM', 'ENTERPRISE-SCALE', '99.9% UPTIME'],
      animation: 'dashboard',
      featured: true,
    },
    {
      id: 'ifw-navigator-migration',
      emoji: '🚀',
      title: 'IFW to Navigator Migration',
      tech: ['Angular', 'TypeScript', 'FastAPI', 'Python', 'GitLab API', 'Harness API', 'Responsive Design'],
      badge: { label: 'ACTIVE', variant: 'orange' },
      summary: 'Modernized legacy workflow system with optimized performance | 77% faster (2h → 45m) | +40% team productivity',
      problem:
        "IFW, Citi's legacy liquidity workflow orchestration system, was over eight years old, slow, and difficult to maintain. A typical workflow cycle took more than two hours to run against a monolithic codebase with no query optimisation for modern data scale, and the UX gave users little insight into status or errors when something went wrong. Analysts were losing two-plus hours per workflow, and critical month-end closes were regularly delayed while the team waited on aging infrastructure.",
      solution:
        "Led a complete modernization onto Navigator, Citi's next-generation UI platform, rewriting the frontend in Angular and TypeScript with a component-based architecture, reactive forms, WebSocket-driven progress tracking and WCAG 2.1 AA accessibility. The FastAPI backend was optimized through CTE consolidation, predicate pushdown, batched queries and connection pooling to cut round-trips, while a GitLab-integrated Harness/Lightspeed pipeline added automated testing, feature-flagged rollout and blue-green deployment. Bundle size was reduced through lazy loading, frequently-accessed data was cached, and database queries were parallelized, with real-time D3.js performance dashboards and Slack-based SLA alerting added for ongoing monitoring.",
      result:
        'Workflow cycle time dropped 77%, from two hours to 45 minutes, handing analysts back three-plus hours a day and lifting team productivity 40% — all with zero data-loss incidents and full team adoption within two weeks of rollout. Angular\'s component reusability cut the codebase by roughly 30%, automated tests now cover 85%+ of critical paths, and one team lead called it simply "the best system upgrade we\'ve had."',
      keyMetrics: ['77% FASTER', '45 MINUTES (vs 2 HOURS)', '+40% PRODUCTIVITY', '100% ADOPTION', '0 INCIDENTS'],
      animation: 'progress-fill',
    },
    {
      id: 'forecasting-engine',
      emoji: '🌐',
      title: 'Forecasting Engine',
      tech: ['Python', 'XGBoost', 'Auto-ARIMA', 'Scikit-learn', 'Pandas', 'Databricks API'],
      badge: { label: 'COMPLETED', variant: 'blue' },
      summary: 'ML-powered liquidity forecasting with 95% accuracy | 3 days → 2 hours | Automated daily predictions',
      problem:
        "Citi's liquidity team forecast 24-hour and 7-day funding requirements by hand: pulling historical transaction data, adjusting manually for known client events like maturity windows, FX fixes and dividend payments, running spreadsheet models, and spending days reconciling the results before delivering a forecast to treasury by 8am. The full cycle took three-plus days, errors were common, and the process had no way to adapt when markets moved unexpectedly.",
      solution:
        "Built an ML ensemble forecasting platform combining XGBoost for non-linear pattern detection with Auto-ARIMA for time-series seasonality, backed by Scikit-learn preprocessing for feature engineering. A Pandas pipeline ingests data from ten-plus source systems — Oracle, Tableau and Jira among them — engineering rolling averages, volatility measures and client-cohort aggregations, while Databricks serves the models and runs ongoing A/B testing. The platform produces a 24-hour intraday forecast refreshed every four hours and a daily 7-day forward forecast, both with 95% and 80% confidence intervals and built-in outlier detection, automatically triggering Slack alerts for high-stress scenarios and feeding the Commentary Automation tool for narrative context.",
      result:
        'Forecast accuracy reached 95%, up from roughly 70% under the manual process, while cycle time fell from three days to two hours with fully automated daily predictions requiring no manual intervention. The treasury team has since adopted the ML forecast as its primary model, gaining an early-warning system for funding stress scenarios with sub-100ms inference latency served through FastAPI.',
      keyMetrics: ['95% ACCURATE', '3 DAYS→2 HOURS', '24/7 PREDICTIONS', '10+ SOURCES INTEGRATED', 'SUB-100MS LATENCY'],
      animation: 'globe-orbit',
    },
    {
      id: 'jira-tracker-integration',
      emoji: '🎫',
      title: 'Jira Tracker Integration',
      tech: ['Python', 'Jira API', 'SharePoint API', 'REST API', 'Slack API', 'Automation'],
      badge: { label: 'COMPLETED', variant: 'blue' },
      summary: 'Automated Jira-SharePoint sync with zero manual updates | 3+ hours/week saved | 100% consistency',
      problem:
        'GLRS tracked migration work in Jira but reported status to senior leadership through a hand-maintained SharePoint tracker, which meant a scrum master manually copying ticket data — status, assignee, due date — across every day. Copy-paste errors were common, out-of-sync data caused confusion in standups, and the manual sync cost the team three-plus hours a week.',
      solution:
        'Built a Python automation service that polls the Jira API every 30 minutes for ticket changes and pushes status, assignee, due date, priority and custom fields into the corresponding SharePoint list rows, handling the field-mapping differences between the two systems and managing bulk upserts for both updates and new tickets. Slack API integration alerts the #releases channel when tickets move to "In Progress," flags overdue items in #alerts, and summarizes daily progress ahead of standup, with retry logic, audit logging and an admin dashboard covering failed syncs.',
      result:
        'The manual sync is gone entirely, saving three-plus hours a week while keeping Jira and SharePoint at 100% data consistency and giving leadership real-time visibility instead of stale reports. The team standardized on the workflow going forward, and it has run at 99.8% uptime with only two failed syncs across six months, even with Jira\'s ten-requests-per-second API throttle in play.',
      keyMetrics: ['3+ HOURS/WEEK SAVED', '100% CONSISTENCY', '99.8% UPTIME', 'ZERO MANUAL UPDATES', 'REAL-TIME SYNC'],
      animation: 'row-sync',
    },
    {
      id: 'commentary-automation',
      emoji: '✍️',
      title: 'Commentary Automation',
      tech: ['Python', 'NLP', 'FastAPI', 'Transformers', 'LLM', 'Slack API'],
      badge: { label: 'AI-POWERED', variant: 'orange' },
      summary: 'Generates analyst-style variance commentary automatically | 10+ hours/week saved | Month-end close +1 day faster',
      problem:
        "Every day, Citi's LCR reporting close requires analysts to write variance commentary explaining why a metric moved from the prior day — for example, why LCR fell from 127% to 119% because of a funding-spread widening and a client withdrawal. Across eight regulatory reports and 38 scopes that's 300+ comments a day, taking analysts 10+ hours daily, and the burden spikes hardest exactly when month-end volatility makes accurate commentary most important.",
      solution:
        'Built an NLP-driven commentary engine that first detects variance patterns and identifies key drivers — client flows, debt issuance, FX moves, collateral haircuts — filtering out anything below a materiality threshold so only meaningful moves get explained. A Transformers model fine-tuned on 1,000+ historical comments generates the narrative in analyst voice using contextual templates for common scenarios, and every generated comment is validated against the source data to catch fabricated numbers and confirm the stated cause actually explains the variance, flagging anything suspicious for human review. Generated commentary publishes to the #reporting Slack channel each day for a one-click analyst approve/reject before submission.',
      result:
        'The tool now saves 10+ hours per analyst per week — over 1,000 hours company-wide — and has shaved a full day off month-end close by removing the manual-writing bottleneck, with all 38 scopes now running on automated commentary and consistent regulatory-standard quality across the board. Analysts report the freed-up time now goes into strategic analysis rather than repetitive writing.',
      keyMetrics: [
        '10+ HOURS/WEEK SAVED',
        '1000+ TOTAL HOURS RECOVERED',
        '38 SCOPES AUTOMATED',
        'MONTH-END +1 DAY FASTER',
        '100% ADOPTION',
      ],
      animation: 'typing',
      featured: true,
    },
    {
      id: 'sql-to-trino-converter',
      emoji: '⚙️',
      title: 'SQL to Trino Converter',
      tech: ['Python', 'AST Parsing', 'SQL Parser', 'Snowflake API', 'Trino SQL', 'dbt API'],
      badge: { label: 'COMPLETED', variant: 'blue' },
      summary: 'Automatically converts Oracle SQL to Trino | 95% auto-conversion | Weeks → Hours',
      problem:
        'Migrating from Oracle to Starburst/Trino exposed deep SQL dialect differences — Cartesian joins written with 1=1 syntax, BIGINT yyyyMMdd date casting that Trino handles differently, column-alias mismatches inside UNION ALL branches, and Oracle-only functions like NVL and DECODE with no direct equivalent. Rewriting the 200+ Tableau dashboard queries that depended on these patterns by hand was going to take weeks, and the backlog was blocking the rest of the migration.',
      solution:
        'Built a converter that tokenizes Oracle SQL into an Abstract Syntax Tree, recognizes the problem patterns, and rewrites them automatically: 1=1 Cartesian joins become explicit CROSS JOINs, BIGINT date casts convert to native DATE types, UNION ALL alias mismatches get resolved, and functions like NVL and DECODE map onto their Trino equivalents such as COALESCE and CASE. Every converted query is validated by comparing Oracle and Trino result row counts and confirming output types match the target schema, with anything uncertain flagged for manual review, and the tool integrates with dbt for lineage tracking and the Snowflake API to confirm target schemas exist before conversion runs.',
      result:
        'The converter handles 95% of queries fully automatically — well above the roughly 70% industry-average benchmark — turning what used to take weeks into hours across 200+ migrated queries with zero data loss, and the team has since standardized on it for every subsequent Oracle-to-Trino migration. Fifty-plus distinct dialect patterns are now mapped and handled without manual intervention.',
      keyMetrics: ['95% AUTO-CONVERSION', 'WEEKS→HOURS', '200+ QUERIES MIGRATED', 'ZERO DATA LOSS', '50+ PATTERNS MAPPED'],
      animation: 'sql-morph',
    },
    {
      id: 'learning-management-system',
      emoji: '📚',
      title: 'Learning Management System',
      tech: ['React', 'Node.js', 'MongoDB', 'Video Streaming', 'Stripe API', 'SendGrid API', 'Auth0'],
      badge: { label: 'COMPLETED', variant: 'blue' },
      summary: 'Full-stack LMS serving 500+ students | $30K saved in 6 months | 60% cost reduction',
      problem:
        'Nikaya, a nonprofit education platform, was paying roughly $60K a year for commercial LMS platforms like Teachable and Kajabi, which offered little customization for nonprofit-specific workflows, charged per-student licensing that made scaling expensive, and made data export slow enough to feel like vendor lock-in — on top of ongoing GDPR compliance headaches. The goal was a scalable, affordable, fully customizable LMS that could serve 500+ students.',
      solution:
        'Built a full-stack LMS from scratch: a React frontend with course catalog search, a student dashboard for progress and certificates, and an S3-streamed, mobile-first video player; a Node.js REST API with role-based access for students, instructors and admins handling enrollment, progress tracking and certificate generation; and a MongoDB database designed to scale horizontally for course content, progress and transaction data. Stripe handles course purchases, subscriptions and invoicing, SendGrid sends course reminders, certificate delivery and enrollment alerts, and Auth0 provides secure login with social sign-in and role-based access control.',
      result:
        "The platform saved $30K in its first six months against the prior $60K/year commercial cost — a 60% reduction — while onboarding 500+ students and holding 99% uptime, with nonprofit-specific workflows the commercial platforms simply didn't offer. Adaptive-bitrate video streaming keeps playback smooth on variable bandwidth, MongoDB queries are indexed for sub-100ms response times, and the architecture auto-scales horizontally while staying GDPR-ready and COPPA compliant.",
      keyMetrics: ['$30K SAVED', '500+ STUDENTS', '99% UPTIME', '60% COST REDUCTION', 'CUSTOM WORKFLOWS'],
      animation: 'circle-grow',
    },
    {
      id: 'uat-vs-prod-validator',
      emoji: '⚖️',
      title: 'UAT vs PROD Validator',
      tech: ['Python', 'FastAPI', 'Data Validation'],
      badge: { label: 'COMPLETED', variant: 'blue' },
      summary: 'Side-by-side UAT vs PROD validation with mismatch highlighting | 20+ hours/week saved',
      problem:
        'Every LCR release cycle required analysts to manually compare UAT and PROD output side by side — checking that key figures, row counts, and column-level values matched after each deployment. With hundreds of rows across dozens of reports, this reconciliation took 20+ hours per week of tedious cell-by-cell comparison, and small mismatches were easy to miss until they surfaced downstream in production.',
      solution:
        'Built a Python + FastAPI validation tool that ingests UAT and PROD extracts, performs key-based row matching, and applies configurable tolerance thresholds to flag only meaningful discrepancies rather than noise from floating-point rounding. Mismatches are highlighted inline with the exact row, column, and delta responsible, and results export to Excel and a lightweight web UI for team review before sign-off.',
      result:
        'UAT-to-PROD validation dropped from 20+ hours per week to near-instant automated checks, with consistent, repeatable results every release cycle. The tool is now a standard gate in the release process, catching discrepancies before they reach production instead of after.',
      keyMetrics: ['20+ HOURS/WEEK SAVED', 'INSTANT RECONCILIATION', 'CONFIGURABLE TOLERANCES', 'ZERO MISSED MISMATCHES'],
      animation: 'compare-sync',
    },
    {
      id: 'ilst-tableau-dashboards',
      emoji: '📈',
      title: 'ILST Tableau Dashboards',
      tech: ['Tableau', 'SQL', 'Oracle', 'Trino', 'Data Visualization'],
      badge: { label: 'COMPLETED', variant: 'blue' },
      summary: 'Built and maintained Tableau dashboard suite for ILST regulatory reporting | Daily production use',
      problem:
        "Intraday Liquidity Stress Testing (ILST) reporting needed a reliable, visual way for treasury and compliance teams to monitor stress scenario outputs daily, but the underlying data lived across multiple source tables with no dashboard layer in place — analysts were pulling raw query results into spreadsheets to review results manually, which was slow and error-prone ahead of regulatory deadlines.",
      solution:
        "Designed and built a suite of Tableau dashboards directly on top of the ILST data model, covering scenario summaries, haircut and collateral breakdowns, and day-over-day trend views. Dashboards use parameterized filters for scope and date range, optimized Tableau data sources against the underlying SQL/Oracle (later Trino) tables for fast refresh, and were structured for handoff into the GLRS Analytics Hub's Tableau Inspector for ongoing lineage tracking.",
      result:
        'The ILST dashboards became the team\'s daily reference for stress-test review, replacing manual spreadsheet pulls with a self-service, always-current view and cutting the time analysts spent assembling reporting packages. The suite remains in daily production use and served as the template for dashboard builds across other liquidity reporting scopes.',
      keyMetrics: ['DAILY PRODUCTION USE', 'MULTI-SCENARIO VIEWS', 'SELF-SERVICE REPORTING', 'TEMPLATE FOR OTHER SCOPES'],
      animation: 'tableau-build',
    },
  ];
}

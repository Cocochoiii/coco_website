/**
 * Centralized data for every page.
 * Keeps component files focused on rendering logic only.
 */

import { EYE, PAL } from './theme'

/* ─── Navigation ─── */

export const NAV_PAGES = [
  { key: 'home',       label: 'Home',       subtitle: 'Piano Hero',      accent: '#e37b88' },
  { key: 'experience', label: 'Experience',  subtitle: "Where I've Been", accent: '#e37b88' },
  { key: 'projects',   label: 'Projects',    subtitle: 'Selected Work',   accent: '#e37b88' },
  { key: 'about',      label: 'About',       subtitle: 'Get to Know Me',  accent: '#e37b88' },
]

/* ─── HomePage ─── */

export const TYPEWRITER_TITLES = [
  'Creative Software Engineering',
  'Full Stack Development',
  'Innovative iOS Development',
  'Data Engineering & IoT',
  'Product & Project Innovation',
  'Design Driven Development',
]

export const HOME_ZONES = (musicOn) => [
  { id: 'exp',    top: '62.5%', left: '45%',   w: 100, h: 100, r: '50%',  label: 'Experience', msg: "Let me show you\nwhere I've worked",         nav: 'experience', freq: 261.6 },
  { id: 'proj',   top: '60%',   left: '48%',   w: 75,  h: 90,  r: '8px',  label: 'Projects',   msg: "Check out what\nI've built",                 nav: 'projects',   freq: 329.6 },
  { id: 'resume', top: '61%',   left: '55.5%', w: 55,  h: 55,  r: '50%',  label: 'Resume',     msg: "Here's my resume",                            nav: null,         freq: 392.0 },
  { id: 'keys',   top: '69%',   left: '52%',   w: 500, h: 40,  r: '8px',  label: '♫ Music',    msg: musicOn ? 'Click to pause 🎵' : 'Click to play music 🎶', nav: '_music', freq: 523.3 },
  { id: 'about',  top: '75%',   left: '51%',   w: 200, h: 200, r: '50%',  label: 'About Me',   msg: "That's me!\nNice to meet you",                nav: 'about',      freq: 659.3 },
]

export const SOCIALS = [
  { href: 'https://github.com/Cocochoiii',                      label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/coco-choi-5a16511a2/',   label: 'LinkedIn' },
  { href: 'mailto:choi.coco@northeastern.edu',                   label: 'Email' },
]

/* ─── ExperiencePage ─── */

export const EXPERIENCES = [
  {
    title: 'UbiWell Lab', role: 'Software Engineer Intern', period: 'May 2025 – Oct 2025',
    color: EYE.rose, hBg: EYE.cream, hText: EYE.shadow,
    highlights: [
      'Django/FastAPI microservices · 2.5M+ data points/day',
      '100+ React/TS dashboards · 1,000+ daily users',
      'iOS module with on-device ML · 99.7% reliability',
      'Kafka event-driven · 50K events/s',
    ],
  },
  {
    title: 'Audi Innovation', role: 'Data Engineer Intern', period: 'Jan 2023 – Aug 2024',
    color: EYE.skin, hBg: EYE.shadow, hText: EYE.skin,
    highlights: [
      '500+ GB/day from 20K+ IoT sensors · 99.9% uptime',
      'Airflow + Spark ETL · batch time ↓42%',
      'Snowflake + dbt · SQL perf ↑60%',
      '15+ PySpark models · $2M/yr retention',
    ],
  },
  {
    title: 'Mars Inc. HK', role: 'Full Stack Developer', period: 'Feb 2022 – Dec 2022',
    color: EYE.warm, hBg: EYE.cream, hText: EYE.shadow,
    highlights: [
      'React Native + GraphQL · 5,000+ DAU',
      'Socket.IO + Redis · 10K concurrent',
      'MongoDB geospatial · latency ↓65%',
      'Architecture supporting $300K Q1 rev',
    ],
  },
  {
    title: 'Pet Paradise', role: 'Founder & Developer', period: '2024 – Now',
    color: EYE.iris, hBg: EYE.shadow, hText: EYE.iris,
    highlights: [
      'Next.js 14 + TypeScript + Stripe',
      'iOS companion app · Swift/SwiftUI',
      'Real-time chat · booking · admin',
      'Caring for 20+ cats & dogs',
    ],
  },
  {
    title: 'Northeastern', role: 'MS Computer Science', period: '2024 – 2027',
    color: EYE.rose, hBg: EYE.rose, hText: '#fff',
    highlights: [
      'GPA 3.8/4.0 · Boston, MA',
      'OOD · Algorithms · Cloud · Distributed Systems',
    ],
  },
  {
    title: 'Franklin & Marshall', role: 'BA Business & Film', period: '2018 – 2021',
    color: EYE.skin, hBg: EYE.skin, hText: EYE.shadow,
    highlights: [
      'GPA 3.72/4.0 · Lancaster, PA',
      'Double major: Business & Film Studies',
    ],
  },
]

/* ─── ProjectsPage ─── */

export const PROJECTS = [
  { title: 'Pet Paradise',      meta: 'Next.js · TypeScript · MongoDB · Stripe',            year: "'24", bg: PAL.pink,   text: '#fff',       hBg: PAL.dark,   hText: PAL.pink,   link: 'https://github.com/Cocochoiii/coco_pets' },
  { title: 'Media Recommender', meta: 'Python · PyTorch · BERT · AWS SageMaker',            year: "'24", bg: PAL.blue,   text: PAL.dark,     hBg: PAL.dark,   hText: PAL.blue,   link: 'https://github.com/Cocochoiii/media-recs_platform' },
  { title: 'MedSync Pro',       meta: 'React · FastAPI · PostgreSQL · Redis · Docker',      year: "'25", bg: PAL.yellow, text: PAL.dark,     hBg: PAL.dark,   hText: PAL.yellow, link: 'https://github.com/Cocochoiii/healthcare-analytics-platform' },
  { title: 'Audi E-Charging',   meta: 'React · TypeScript · Express · Socket.IO',           year: "'23", bg: PAL.dark,   text: PAL.yellow,   hBg: PAL.yellow, hText: PAL.dark,   link: 'https://github.com/Cocochoiii/audi-e-charging-app' },
  { title: 'Audi IoT Platform', meta: 'FastAPI · Kafka · TimescaleDB · React · ML',         year: "'23", bg: PAL.orange, text: PAL.dark,     hBg: PAL.dark,   hText: PAL.orange, link: 'https://github.com/Cocochoiii/audi-iot-platform' },
  { title: 'MalHae 말해',       meta: 'Swift · SwiftUI · MapKit · MVVM',                    year: "'25", bg: PAL.pink,   text: PAL.dark,     hBg: PAL.grey,   hText: '#fff',     link: 'https://github.com/Cocochoiii/korean_learning_APP' },
  { title: 'Mars E-Commerce',   meta: 'React · GraphQL · Node.js · RabbitMQ',               year: "'22", bg: PAL.yellow, text: PAL.dark,     hBg: PAL.orange, hText: '#fff',     link: 'https://github.com/Cocochoiii/mars-ecommerce' },
  { title: 'AdServe Pro',       meta: 'TypeScript · TensorFlow.js · Kafka · K8s',           year: "'25", bg: PAL.grey,   text: '#fff',       hBg: PAL.blue,   hText: PAL.dark,   link: 'https://github.com/Cocochoiii/google_ads' },
]

/* ─── AboutPage ─── */

export const SKILLS = [
  { label: 'React',      color: EYE.rose },
  { label: 'TypeScript', color: EYE.skin },
  { label: 'Next.js',    color: EYE.iris },
  { label: 'Node.js',    color: EYE.warm },
  { label: 'Python',     color: EYE.rose },
  { label: 'Swift',      color: EYE.skin },
  { label: 'Django',     color: EYE.iris },
  { label: 'FastAPI',    color: EYE.warm },
  { label: 'GraphQL',    color: EYE.rose },
  { label: 'Kafka',      color: EYE.skin },
  { label: 'Docker',     color: EYE.iris },
  { label: 'MongoDB',    color: EYE.warm },
  { label: 'PostgreSQL', color: EYE.rose },
  { label: 'AWS',        color: EYE.skin },
  { label: 'Redis',      color: EYE.iris },
  { label: 'Spark',      color: EYE.warm },
  { label: 'SwiftUI',    color: EYE.rose },
  { label: 'GSAP',       color: EYE.skin },
  { label: 'Rive',       color: EYE.iris },
  { label: 'Git',        color: EYE.warm },
]

export const ABOUT_STATS = [
  { n: '3.8', s: '',  label: 'GPA',         color: EYE.rose },
  { n: '3',   s: '+', label: 'Internships',  color: EYE.skin },
  { n: '8',   s: '+', label: 'Projects',     color: EYE.iris },
]

export const ABOUT_BIG_STATS = [
  { num: '2.5M+',  label: 'Data Points Processed Daily', color: EYE.rose },
  { num: '50K',    label: 'Events per Second (Kafka)',    color: EYE.skin },
  { num: '20+',    label: 'Cats & Dogs Cared For',       color: EYE.warm },
  { num: '99.9%',  label: 'System Availability',         color: EYE.iris },
]

export const CONTACT_INFO = [
  { label: 'Email',    value: 'choi.coco@northeastern.edu', href: 'mailto:choi.coco@northeastern.edu' },
  { label: 'Phone',    value: '(617) 762-8179',             href: 'tel:6177628179' },
  { label: 'Location', value: 'Wellesley, MA',              href: null },
]

export const ABOUT_SOCIALS = [
  { href: 'https://github.com/Cocochoiii',                    label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/coco-choi-5a16511a2/', label: 'LinkedIn' },
]

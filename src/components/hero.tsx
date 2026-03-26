import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import type {AppLocale} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';
import {toAssetUrl} from '@/lib/asset';

export async function Hero({
  locale,
  badge,
  title,
  subtitle,
  bullets
}: {
  locale: AppLocale;
  badge: string;
  title: string;
  subtitle: string;
  bullets: string[];
}) {
  const tCta = await getTranslations({locale, namespace: 'CTA'});

  return (
    <section className="relative section-gap overflow-hidden pt-14">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-white to-orange-50/30" />
        <StitchPattern />
      </div>

      <div className="container-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <p className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            {badge}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{subtitle}</p>
          <ul className="mt-6 space-y-2">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3 text-sm text-slate-700">
                <StitchIcon className="h-2 w-2 flex-shrink-0 text-brand-600" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link 
              href="/contact" 
              className="group relative overflow-hidden rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-500/30"
            >
              <span className="relative z-10">{tCta('requestQuote')}</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full" />
            </Link>
            <a
              href={toAssetUrl('/capability-deck.pdf')}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-all hover:border-brand-300 hover:bg-brand-50"
            >
              {tCta('downloadDeck')}
            </a>
          </div>
        </div>

        <div className="relative z-10">
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-soft transition-all hover:shadow-2xl hover:shadow-brand-500/20">
            {/* Video Background with Stitch Animation */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
              {/* Animated Stitch Overlay */}
              <StitchAnimation />
              
              {/* Main Image/Video - Using new stitch graphic */}
              <Image
                src={toAssetUrl('/factory/stitch-hero.svg')}
                alt="Premium garment manufacturing with precision stitching"
                width={960}
                height={720}
                priority
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Floating Needle Animation */}
              <FloatingNeedle />
              
              {/* Corner Decorations - Updated gradient to match brand */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-900/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="text-sm font-medium">Premium Quality</div>
                <div className="flex items-center gap-2">
                  <ThreadSpool className="h-5 w-5" />
                  <span className="text-xs">Crafted with Precision</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Animated Stitch Pattern Background
function StitchPattern() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="stitch-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0 L30 60 M0 30 L60 30" stroke="#f59e0b" strokeWidth="0.5" opacity="0.2" />
          <circle cx="30" cy="30" r="2" fill="#d97706" opacity="0.3" />
          <path d="M10 10 Q30 30 50 50" stroke="#d97706" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4 4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stitch-pattern)" />
    </svg>
  );
}

// Stitch Icon Component
function StitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12.5523 2 13 2.44772 13 3V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V3C11 2.44772 11.4477 2 12 2Z" />
      <circle cx="12" cy="5" r="1.5" fill="white" />
      <circle cx="12" cy="12" r="1.5" fill="white" />
      <circle cx="12" cy="19" r="1.5" fill="white" />
    </svg>
  );
}

// Animated Stitch Line
function StitchAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Animated dashed stitch lines - Updated to brand colors */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2f847a" stopOpacity="0" />
            <stop offset="50%" stopColor="#2f847a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2f847a" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal stitch line */}
        <path
          d="M-50 120 Q150 110, 350 120 T750 120"
          stroke="url(#thread-gradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          className="animate-stitch-horizontal"
          opacity="0.4"
        />
        
        {/* Vertical stitch line */}
        <path
          d="M480 -50 Q470 100, 480 250 T480 550"
          stroke="url(#thread-gradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          className="animate-stitch-vertical"
          opacity="0.4"
        />
        
        {/* Decorative circles (stitch points) - Brand color */}
        {[...Array(5)].map((_, i) => (
          <circle
            key={i}
            cx={150 + i * 120}
            cy={120 + Math.sin(i) * 20}
            r="3"
            fill="#2f847a"
            opacity="0.6"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

// Floating Needle Animation
function FloatingNeedle() {
  return (
    <div className="pointer-events-none absolute top-4 right-4 h-24 w-24 animate-float opacity-60">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Needle */}
        <ellipse cx="50" cy="50" rx="8" ry="40" fill="url(#needle-gradient)" transform="rotate(-45 50 50)" />
        <circle cx="50" cy="25" r="4" fill="#cbd5e1" transform="rotate(-45 50 25)" />
        
        {/* Thread - Updated to brand teal color */}
        <path
          d="M50 10 Q60 30, 50 50 Q40 70, 50 90"
          stroke="#2f847a"
          strokeWidth="2"
          fill="none"
          className="animate-thread"
        />
        
        <defs>
          <linearGradient id="needle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Thread Spool Icon
function ThreadSpool({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Updated to brand teal colors */}
      <rect x="8" y="3" width="8" height="18" rx="2" fill="#2f847a" />
      <rect x="7" y="5" width="10" height="2" fill="#1d5651" />
      <rect x="7" y="17" width="10" height="2" fill="#1d5651" />
      <path d="M10 8 L10 16" stroke="#f3f8f7" strokeWidth="1.5" />
      <path d="M14 8 L14 16" stroke="#f3f8f7" strokeWidth="1.5" />
    </svg>
  );
}

// Video Background Component (Optional - for future video integration)
export function StitchVideoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Placeholder for video - replace with actual video file */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        poster="/factory/video-poster.jpg"
      >
        {/* Uncomment and add actual video files */}
        {/* <source src="/factory/stitching-video.mp4" type="video/mp4" /> */}
        {/* <source src="/factory/stitching-video.webm" type="video/webm" /> */}
      </video>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/80 via-white/60 to-orange-50/50" />
      
      {/* Animated stitch overlay on top of video */}
      <StitchPattern />
    </div>
  );
}

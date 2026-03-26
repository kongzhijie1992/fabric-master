'use client';

import Image from 'next/image';
import {toAssetUrl} from '@/lib/asset';
import type {AppLocale} from '@/i18n/routing';

export function StitchShowcase({ locale }: { locale: AppLocale }) {
  // INTENTIONAL ERROR FOR TESTING: Uncomment the next line to trigger the Error Boundary
  // if (process.env.NODE_ENV === 'development') { throw new Error('Test Error for ErrorBoundary'); }
  
  const features = locale === 'zh' ? [
    {
      title: '精密车缝',
      description: '每英寸 8-10 针，确保线迹均匀美观',
      icon: '🧵',
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      title: '品质检验',
      description: '三道质检流程，零缺陷标准',
      icon: '✅',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      title: '定制工艺',
      description: '支持特殊针法和装饰工艺',
      icon: '✨',
      gradient: 'from-purple-400 to-pink-500'
    }
  ] : [
    {
      title: 'Precision Stitching',
      description: '8-10 stitches per inch for uniform, beautiful seams',
      icon: '🧵',
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      title: 'Quality Inspection',
      description: 'Three-stage QC process with zero-defect standard',
      icon: '✅',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      title: 'Custom Craftsmanship',
      description: 'Special stitch patterns and decorative techniques',
      icon: '✨',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-orange-50 py-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/2 top-0 h-[600px] w-[600px] animate-float opacity-20">
          <Image
            src={toAssetUrl('/factory/stitch-pattern.svg')}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute -right-1/2 bottom-0 h-[600px] w-[600px] animate-float opacity-20" style={{ animationDelay: '2s' }}>
          <Image
            src={toAssetUrl('/factory/stitch-pattern.svg')}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="container-shell relative z-10">
        {/* Section Header with Decorative Elements */}
        <div className="relative mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md">
            <NeedleIcon className="h-5 w-5 text-brand-600" />
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              {locale === 'zh' ? '精湛工艺' : 'Craftsmanship'}
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {locale === 'zh' ? '我们的核心优势' : 'Our Core Strengths'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            {locale === 'zh' 
              ? '结合传统工艺与现代技术，打造卓越品质' 
              : 'Combining traditional craftsmanship with modern technology for exceptional quality'}
          </p>
        </div>

        {/* Feature Cards with Visual Effects */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white p-1 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              
              {/* Content Card */}
              <div className="relative flex h-full flex-col rounded-[22px] bg-white p-6">
                {/* Icon with Animation */}
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-3xl shadow-lg`}>
                  <span className="animate-bounce">{feature.icon}</span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 flex-1 text-base leading-relaxed text-slate-600">
                  {feature.description}
                </p>

                {/* Decorative Stitch Line */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-300 to-transparent" />
                  <StitchIcon className="h-4 w-4 text-brand-600" />
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-300 to-transparent" />
                </div>

                {/* Hover Arrow */}
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span>{locale === 'zh' ? '了解更多' : 'Learn More'}</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Visual Element */}
        <div className="mt-12 flex justify-center">
          <div className="relative h-24 w-full max-w-3xl overflow-hidden rounded-full border-2 border-brand-200 bg-white/50 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
                  <div className="h-8 w-0.5 bg-gradient-to-b from-brand-300 to-transparent" />
                </div>
              ))}
            </div>
            
            {/* Floating Thread Animation */}
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 50 Q100 30, 200 50 T400 50 T600 50 T800 50"
                stroke="#F59E0B"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5 3"
                className="animate-sew"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// Icon Components
function NeedleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C12.5523 2 13 2.44772 13 3V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V3C11 2.44772 11.4477 2 12 2Z" />
      <circle cx="12" cy="5" r="2" fill="white" />
    </svg>
  );
}

function StitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="6" r="3" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="18" r="3" />
    </svg>
  );
}

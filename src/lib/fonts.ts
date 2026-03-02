import localFont from 'next/font/local';

export const appFont = localFont({
  src: [
    {
      path: '../../public/fonts/DejaVuSans.ttf',
      weight: '400',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-app',
  fallback: [
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    'Noto Sans CJK SC',
    'WenQuanYi Micro Hei',
    'Arial',
    'sans-serif'
  ]
});

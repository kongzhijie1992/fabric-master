'use client';

import Script from 'next/script';

export function BaiduTongji({siteId}: {siteId: string}) {
  return (
    <Script
      id="baidu-tongji"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `var _hmt = _hmt || [];(function(){var hm=document.createElement('script');hm.src='https://hm.baidu.com/hm.js?${siteId}';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(hm,s);})();`
      }}
    />
  );
}

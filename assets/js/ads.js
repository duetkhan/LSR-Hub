/* LSR Hub AdSense integration. Keep disabled until Google AdSense approves the site.
   After approval, set publisherId to ca-pub-XXXXXXXXXXXXXXXX and optionally add manual slot IDs.
   Auto ads may place responsive display, in-feed/in-article and eligible overlay formats as Google decides.
   Never add fake clicks, forced redirects, or ads that resemble tool buttons/download controls. */
(function(){
  const config = window.LSR_AD_CONFIG = {
    provider: 'adsense',
    publisherId: '', // Fill only with your real ca-pub ID after account setup.
    autoAds: true,
    slots: { top: '', inContent: '', sidebar: '', bottom: '' }
  };
  const id = config.publisherId;
  if (!/^ca-pub-\d{16}$/.test(id)) return; // No ad script loads until a valid publisher ID is configured.
  const s=document.createElement('script');s.async=true;
  s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(id);
  s.crossOrigin='anonymous';s.onload=function(){
    if(config.autoAds){window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.push({google_ad_client:id,enable_page_level_ads:true});}
    document.querySelectorAll('[data-ad-slot]').forEach(function(el){
      const key=el.getAttribute('data-ad-slot'),slot=config.slots[key];
      if(!slot || !/^\d{6,}$/.test(slot)) return;
      el.classList.add('ad-ready');el.innerHTML='<ins class="adsbygoogle ad-inner" style="display:block" data-ad-client="'+id+'" data-ad-slot="'+slot+'" data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){console.warn('AdSense slot could not initialize',e);}
    });
  };
  document.head.appendChild(s);
})();

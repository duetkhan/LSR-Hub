/* LSR HUB — replaceable ad integration points
 * Step 1: get approved ad code from the provider dashboard.
 * Step 2: choose provider in assets/js/config.js.
 * Step 3: paste the code only into the matching function/slot below.
 *
 * Adsterra formats can include display/banner, native/social bar, popunder and direct-link/smartlink,
 * depending on account eligibility. Their code types are not interchangeable.
 * Do not put popunder/direct-link code inside a visible banner slot.
 * AdSense requires separate approved publisher/slot IDs and its own code.
 */
(function(){
  const config = window.LSR_AD_CONFIG || {provider:"none",slots:{}};
  const slots = {
    "top-banner":"topBanner",
    "in-content":"inContent",
    "below-tool":"belowTool",
    "footer-banner":"footerBanner"
  };
  function clearPlaceholder(el){ el.innerHTML=""; el.classList.add("ad-live"); }
  function loadAdSense(el, slotKey){
    if(!config.adsenseClient) return false;
    // AD-SENSE SLOT PLACEHOLDER:
    // After AdSense approval, set adsenseClient in config.js and replace this block
    // with the official responsive <ins class="adsbygoogle"> markup and slot ID.
    // Do not copy another publisher's client/slot ID.
    el.innerHTML = '<div class="ad-placeholder"><span class="ad-symbol">AD</span><span><b>AdSense slot ready</b><small>Paste approved AdSense slot markup here</small></span></div>';
    return true;
  }
  function loadAdsterra(el, slotKey){
    // ADSTERRA SLOT PLACEHOLDER:
    // Paste the exact banner/native script snippet from your Adsterra publisher dashboard here.
    // Keep the provider's script and container exactly as provided. Each placement may use a different ID.
    // Example placeholder only — NOT working ad code:
    // el.innerHTML = '<!-- PASTE APPROVED ADSTERRA CODE FOR THIS PLACEMENT HERE -->';
    return false;
  }
  document.querySelectorAll("[data-ad-slot]").forEach(el=>{
    const key=slots[el.dataset.adSlot];
    if(!key) return;
    const slotConfig=(config.slots||{})[key]||{};
    if(slotConfig.enabled===false) return;
    const provider=slotConfig.provider==="auto"?config.provider:slotConfig.provider;
    if(provider==="adsense") loadAdSense(el,key);
    else if(provider==="adsterra") loadAdsterra(el,key);
  });
  // SITE-WIDE FORMAT PLACEHOLDERS (not normal in-page banners):
  // SOCIAL BAR: paste approved Social Bar code here only if enabled and policy-compliant.
  // POPUNDER: paste approved Popunder code here only if enabled; avoid disruptive/repeated triggering.
  // INTERSTITIAL: paste its separate approved code here only if the account provides it and you intentionally enable it.
  // DIRECT LINK/SMARTLINK: use only on a clearly labelled, user-initiated outbound link.
  // These high-impact formats remain OFF by default. Never make ads look like tool buttons.
})();

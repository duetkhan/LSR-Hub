/* LSR HUB AD CONFIG
 * Keep ad network selection in one place.
 * Values: "none", "adsterra", "adsense".
 * This file intentionally contains no real ad scripts. Paste only code supplied by your approved account.
 */
window.LSR_AD_CONFIG = {
  provider: "none",
  // AdSense publisher ID, e.g. ca-pub-XXXXXXXXXXXXXXXX (only after approval)
  adsenseClient: "",
  // Set true only after reading the network policy and checking user experience.
  enableHighImpactFormats: false,
  slots: {
    topBanner: { enabled: true, provider: "auto", format: "responsive-banner" },
    inContent: { enabled: true, provider: "auto", format: "native-or-display" },
    belowTool: { enabled: true, provider: "auto", format: "responsive-banner" },
    footerBanner: { enabled: false, provider: "auto", format: "responsive-banner" },
    socialBar: { enabled: false, provider: "adsterra", format: "social-bar" },
    popunder: { enabled: false, provider: "adsterra", format: "popunder" },
    directLink: { enabled: false, provider: "adsterra", format: "direct-link" },
    interstitial: { enabled: false, provider: "adsterra", format: "interstitial" }
  }
};

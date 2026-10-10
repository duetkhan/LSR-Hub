# LSR Hub — unified static website

এই প্যাকেজে রয়েছে:
- সুন্দর responsive mobile-first design, বাংলা/ইংরেজি toggle
- Word Counter, Image Compressor, Age Calculator, Unit Converter, QR Maker, Password Generator
- Helpful Guides section (এখানে পরে নিজস্ব, মানসম্মত আর্টিকেল যোগ করতে হবে)
- Privacy, Terms, Contact, ads.txt, robots.txt, sitemap.xml
- এক জায়গায় ad configuration; ভবিষ্যতে provider বদলানোর জন্য adapter placeholders

## Vercel-এ প্রকাশ
1. ZIP extract করো।
2. GitHub-এ নতুন repository বানিয়ে ZIP-এর ভেতরের ফাইলগুলো root-এ upload/commit করো (পুরো `lsr-unified-site` folder-এর ভিতরে আরেকটি folder রেখে দিলে root ভুল হতে পারে)।
3. Vercel → Add New → Project → GitHub repository Import.
4. Framework Preset: Other; Build Command ফাঁকা; Output Directory `.` (অথবা default static output); Deploy.
5. Deploy হওয়ার পর মোবাইলে tool tests করো। `robots.txt` ও `sitemap.xml`-এ YOUR-DOMAIN.example নিজের আসল domain দিয়ে বদলাও।

## Ads — replaceable setup
- `assets/js/config.js`-এ `provider: "none"` default. আগে website approval না পাওয়া পর্যন্ত এটাই রাখো।
- Adsterra অনুমোদন হলে `provider: "adsterra"` করে `assets/js/ads.js`-এর `loadAdsterra()`-তে dashboard থেকে পাওয়া exact banner/native code সংশ্লিষ্ট placement-এ বসাও।
- Social Bar/Popunder site-wide formats; আলাদা code এবং account approval/terms লাগতে পারে। `assets/js/ads.js`-এর site-wide placeholder-এ বসানোর আগে চালু করার প্রয়োজন ও user experience যাচাই করো। High-impact formats default OFF.
- Direct Link/Smartlink কোনো banner div-এ বসে না; ব্যবহারকারী স্পষ্টভাবে click করে এমন লেবেলযুক্ত লিংকে ব্যবহার করতে হয়। Misleading download/button text ব্যবহার কোরো না।
- AdSense-এ বদলাতে `config.js`-এ provider `adsense` করো, approved publisher client ID/slot IDs বসাও এবং `loadAdSense()`-এ Google-এর dashboard থেকে নেওয়া official responsive ad markup বসাও। Adsterra script রেখে পাশাপাশি সব format চালু কোরো না।
- Ads.txt-এ ad network dashboard-এ দেওয়া exact record যোগ করো। Placeholder/অনুমান করা publisher ID ব্যবহার করবে না।
- Ad placement placeholder থাকা মানেই ad চলবে বা account approve হবে—এমন নয়।

## Policy / quality checklist
- Contact email placeholder বদলাও।
- Privacy policy-তে প্রকৃত ad provider, analytics/cookies ও consent details update করো।
- Guide cards-এ placeholder “coming soon”; ads apply করার আগে এগুলোকে বাস্তব, original, useful articles দিয়ে replace করো। Empty/placeholder content রেখে approval আশা কোরো না।
- Ad clicks/impressions কখনো নিজে বা অন্যকে দিয়ে artificially বাড়াবে না। Facebook traffic genuine, relevant, non-incentivized হতে হবে.
- Ad network policies and Vercel current plan terms review করো before monetization.
- এই package একটি static frontend; login, database, download backend বা earning/withdrawal system নেই.

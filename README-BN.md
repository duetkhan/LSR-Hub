# LSR Hub Pro — বাংলা নির্দেশিকা

এটি একটি multi-page, responsive static website starter। এক পেজে সবকিছু জড়ো করা হয়নি: Home, All Tools, individual tool pages, Guides, Blog, About, Contact এবং legal pages আলাদা।

## Vercel-এ deploy
1. ZIP extract করুন।
2. GitHub repository-র root-এ ZIP-এর ভেতরের ফাইলগুলো upload/replace করুন (পুরো `lsr-hub-pro` ফোল্ডারকে আরেকটি nested folder হিসেবে রাখবেন না)।
3. Commit করুন; Vercel connected থাকলে redeploy হবে। Static HTML-এর জন্য build command দরকার নেই, output directory root (`.`) রাখুন।
4. `robots.txt`, `sitemap.xml`, `ads.txt`-এর placeholder domain/records বদলান।

## বিজ্ঞাপন
- `assets/js/ads.js`-এ placeholder configuration আছে; default provider `none`।
- Adsterra dashboard থেকে পাওয়া exact script-ই ব্যবহার করবেন। Social Bar/Popunder script তাদের নির্দেশনা অনুযায়ী বসান।
- Smartlink একটি regular URL; শুধু স্পষ্ট label-সহ, ব্যবহারকারী নিজে click করে এমন link/button-এ দিন। কোনো tool button, download button বা navigation-কে ছদ্মবেশে বিজ্ঞাপন বানাবেন না।
- সব ad format একসঙ্গে চালাবেন না। আগে একটি banner/native unit ও প্রয়োজন হলে একটি Smartlink CTA পরীক্ষা করুন।
- AdSense ব্যবহার করলে তাদের policy, consent requirements এবং site eligibility আলাদাভাবে যাচাই করুন।

## আগে পরীক্ষা করা জরুরি
- Image Compressor: browser canvas দিয়ে JPG output তৈরি করে।
- Word Counter, JSON Formatter, URL Encoder, Case Converter, Password Generator, Age Calculator, Unit Converter, BMI Calculator, Color Picker: browser-side utilities।
- QR Generator: QRCodeJS CDN লাগে।
- Image to PDF: এই build-এ স্পষ্টভাবে preview/disabled; PDF library integrate না করে live feature হিসেবে প্রচার করবেন না।
- Contact form static placeholder; বার্তা পাঠাতে backend/form service লাগবে।
- Legal pages starter templates; আপনার প্রকৃত data practice অনুযায়ী edit করুন।

## নোট
এই প্রজেক্টে কোনো Adsterra account, live ad code, approval, analytics, backend বা guaranteed earnings অন্তর্ভুক্ত নেই। Genuine traffic তৈরি করুন; bot/incentivized clicks বা accidental clicks কখনো ব্যবহার করবেন না।

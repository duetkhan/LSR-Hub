# LSR Hub: Tools & AdSense setup

## Included tools
- Existing utilities: image compressor, word counter, text case converter, JSON formatter, URL encoder/decoder, password generator, QR generator, color picker, age calculator, BMI calculator, unit converter.
- New PDF/document tools: Image to PDF, Word (DOCX) to PDF, PDF to Word (editable DOCX text extraction), Merge PDF, Split PDF.

## Important conversion limitations
- Word to PDF extracts text from DOCX and creates a readable PDF; it does not reproduce complex Word layout, embedded images, tables, or typography exactly.
- PDF to Word extracts selectable text. It does not OCR scanned documents and does not preserve exact page layout.
- Browser-based PDF libraries load from cdnjs, so the first use needs internet access. Very large files can exceed mobile device memory.
- Image to PDF supports JPG, PNG and WebP; PDF page size follows each image's dimensions.
- No file is intentionally uploaded to an LSR Hub server by these tools; processing is client-side. Third-party CDN requests still occur to load library scripts.

## AdSense activation (only after approval)
1. Create an AdSense account and submit `https://lsr-hub-portal.vercel.app/` for review.
2. Do not add a made-up publisher ID or slot ID. After approval, edit `assets/js/ads.js` and replace the empty `publisherId` with your actual `ca-pub-XXXXXXXXXXXXXXXX`.
3. If using manual ad units, fill `slots.top`, `slots.inContent`, `slots.sidebar`, and `slots.bottom` with the actual numeric slot IDs from AdSense. If using Auto ads only, leave slots empty and keep `autoAds: true`.
4. Replace the comments in `ads.txt` with the exact seller record supplied by AdSense, normally `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`. Use the numeric publisher ID without `ca-`.
5. Redeploy on Vercel and verify the live site and `https://lsr-hub-portal.vercel.app/ads.txt`.

## Policy / layout notes
- AdSense approval and ad formats are controlled by Google; this code cannot guarantee approval or that every format will be served.
- Ads should remain visually distinct from tool controls, download links, and navigation. Do not incentivize clicks or use popunders/forced redirects.
- Check the current Google publisher policies and consent requirements for your visitors' locations before enabling ads.
- Keep privacy policy disclosures accurate for the actual ads and analytics you enable.

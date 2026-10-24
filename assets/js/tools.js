document.addEventListener('DOMContentLoaded', () => {
    const $ = s => document.querySelector(s);
    const out = $('#result');
    const show = t => {
        if (out) out.textContent = t;
    };

    const btn = (id, fn) => {
        const e = $(id);
        if (e) e.addEventListener('click', fn);
    };

    const copy = async t => {
        try {
            await navigator.clipboard.writeText(t);
            show('Copied to clipboard.');
        } catch (e) {
            show('Clipboard access was blocked. Select and copy the result manually.');
        }
    };

    const save = (blob, name) => {
        const a = $('#download');
        if (!a) return;

        if (a.dataset.url) URL.revokeObjectURL(a.dataset.url);

        const url = URL.createObjectURL(blob);
        a.dataset.url = url;
        a.href = url;
        a.download = name;
        a.hidden = false;
    };

    const kind = document.body.dataset.tool;
    const input = $('#textInput');

    const bytes = n => n < 1024
        ? `${n} B`
        : n < 1048576
            ? `${(n / 1024).toFixed(1)} KB`
            : `${(n / 1048576).toFixed(2)} MB`;

    // WORD COUNTER
    if (kind === 'word' && input) {
        const update = () => {
            const t = input.value.trim();
            const w = t ? t.split(/\s+/u).length : 0;

            show(
                `Words: ${w}\n` +
                `Characters: ${input.value.length}\n` +
                `Characters without spaces: ${input.value.replace(/\s/g, '').length}\n` +
                `Sentences: ${(t.match(/[.!?।]+(?=\s|$)/g) || []).length}\n` +
                `Paragraphs: ${input.value.split(/\n\s*\n/).filter(x => x.trim()).length}\n` +
                `Reading time: ${Math.max(1, Math.ceil(w / 200))} min`
            );
        };

        input.addEventListener('input', update);
        update();

        btn('#clear', () => {
            input.value = '';
            update();
        });
    }

    // JSON FORMATTER
    if (kind === 'json') {
        btn('#run', () => {
            try {
                const parsed = JSON.parse(input.value);
                show(JSON.stringify(parsed, null, 2));
            } catch (e) {
                show('Invalid JSON: ' + e.message);
            }
        });

        btn('#copy', () => copy(out.textContent));

        btn('#clear', () => {
            input.value = '';
            show('');
        });
    }

    // URL ENCODER / DECODER
    if (kind === 'url') {
        btn('#encode', () => show(encodeURIComponent(input.value)));

        btn('#decode', () => {
            try {
                show(decodeURIComponent(input.value.replace(/\+/g, ' ')));
            } catch (e) {
                show('Could not decode: malformed percent-encoding.');
            }
        });

        btn('#copy', () => copy(out.textContent));
    }

    // CASE CONVERTER
    if (kind === 'case') {
        btn('#upper', () => show(input.value.toLocaleUpperCase()));
        btn('#lower', () => show(input.value.toLocaleLowerCase()));

        btn('#title', () => {
            show(
                input.value.toLocaleLowerCase().replace(
                    /(^|[\s-])([\p{L}\p{N}])/gu,
                    (m, a, b) => a + b.toLocaleUpperCase()
                )
            );
        });

        btn('#sentence', () => {
            show(
                input.value.toLocaleLowerCase().replace(
                    /(^\s*|[.!?।]\s+)([\p{L}])/gu,
                    (m, a, b) => a + b.toLocaleUpperCase()
                )
            );
        });

        btn('#copy', () => copy(out.textContent));

        btn('#clear', () => {
            input.value = '';
            show('');
        });
    }

    // PASSWORD GENERATOR
    if (kind === 'password') {
        const gen = () => {
            const n = Math.min(
                128,
                Math.max(8, Number($('#length').value) || 16)
            );

            const sets = [
                'abcdefghijkmnopqrstuvwxyz',
                'ABCDEFGHJKLMNPQRSTUVWXYZ',
                '23456789'
            ];

            if ($('#symbols')?.checked) {
                sets.push('!@#$%^&*()-_=+[]{}?');
            }

            const chars = sets.join('');
            const arr = new Uint32Array(n);
            crypto.getRandomValues(arr);

            const result = Array.from(
                arr,
                x => chars[x % chars.length]
            );

            sets.forEach(set => {
                if (!result.some(c => set.includes(c))) {
                    const i =
                        crypto.getRandomValues(new Uint32Array(1))[0] % n;

                    result[i] =
                        set[
                            crypto.getRandomValues(new Uint32Array(1))[0]
                            % set.length
                        ];
                }
            });

            for (let i = result.length - 1; i > 0; i--) {
                const j =
                    crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);

                [result[i], result[j]] = [result[j], result[i]];
            }

            show(result.join(''));
        };

        btn('#generate', gen);
        btn('#copy', () => copy(out.textContent));
        gen();
    }

    // AGE CALCULATOR
    if (kind === 'age') {
        btn('#calculate', () => {
            const v = $('#birth').value;

            if (!v) {
                return show('Please select your date of birth.');
            }

            const parts = v.split('-').map(Number);

            if (parts.length !== 3 || !parts.every(Number.isInteger)) {
                return show('Please select a valid date of birth.');
            }

            const b = new Date(parts[0], parts[1] - 1, parts[2]);
            const n = new Date();

            if (
                b.getFullYear() !== parts[0] ||
                b.getMonth() !== parts[1] - 1 ||
                b.getDate() !== parts[2]
            ) {
                return show('Please select a valid date of birth.');
            }

            const today = new Date(
                n.getFullYear(),
                n.getMonth(),
                n.getDate()
            );

            if (b > today) {
                return show('Date of birth cannot be in the future.');
            }

            let y = today.getFullYear() - b.getFullYear();
            let m = today.getMonth() - b.getMonth();
            let d = today.getDate() - b.getDate();

            if (d < 0) {
                m--;
                d += new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    0
                ).getDate();
            }

            if (m < 0) {
                y--;
                m += 12;
            }

            show(
                `Age: ${y} years, ${m} months and ${d} days.\n` +
                `Total months: ${y * 12 + m}\n` +
                `Next birthday: ${(() => {
                    let next = new Date(
                        today.getFullYear(),
                        b.getMonth(),
                        b.getDate()
                    );

                    if (next < today) {
                        next.setFullYear(next.getFullYear() + 1);
                    }

                    return next.toLocaleDateString();
                })()}`
            );
        });
    }

    // UNIT CONVERTER
    if (kind === 'unit') {
        btn('#convert', () => {
            const raw = $('#value').value.trim();
            const v = Number(raw);
            const u = $('#unit').value;

            const fn = {
                'km-mi': x => `${x} km = ${(x * 0.621371).toFixed(4)} miles`,
                'mi-km': x => `${x} miles = ${(x / 0.621371).toFixed(4)} km`,
                'kg-lb': x => `${x} kg = ${(x * 2.20462262).toFixed(4)} lb`,
                'lb-kg': x => `${x} lb = ${(x / 2.20462262).toFixed(4)} kg`,
                'c-f': x => `${x}°C = ${(x * 9 / 5 + 32).toFixed(2)}°F`,
                'f-c': x => `${x}°F = ${((x - 32) * 5 / 9).toFixed(2)}°C`,
                'cm-in': x => `${x} cm = ${(x / 2.54).toFixed(3)} inches`,
                'in-cm': x => `${x} inches = ${(x * 2.54).toFixed(3)} cm`,
                'm-ft': x => `${x} m = ${(x * 3.28084).toFixed(3)} ft`,
                'ft-m': x => `${x} ft = ${(x / 3.28084).toFixed(3)} m`,
                'l-gal': x => `${x} L = ${(x / 3.785411784).toFixed(3)} US gallons`,
                'gal-l': x => `${x} US gallons = ${(x * 3.785411784).toFixed(3)} L`
            };

            show(
                raw !== '' && Number.isFinite(v) && fn[u]
                    ? fn[u](v)
                    : 'Enter a valid number and unit.'
            );
        });
    }

    // BMI CALCULATOR
    if (kind === 'bmi') {
        btn('#calculate', () => {
            const h = Number($('#height').value) / 100;
            const w = Number($('#weight').value);

            if (
                !Number.isFinite(h) ||
                !Number.isFinite(w) ||
                h <= 0 ||
                w <= 0 ||
                h > 3 ||
                w > 1000
            ) {
                return show('Enter a valid height (in cm) and weight (in kg).');
            }

            const b = w / (h * h);
            const cat = b < 18.5
                ? 'Underweight'
                : b < 25
                    ? 'Healthy range'
                    : b < 30
                        ? 'Overweight'
                        : 'Obesity range';

            show(
                `BMI: ${b.toFixed(1)}\n` +
                `Screening category: ${cat}\n` +
                `This is a general screening measure, not a diagnosis.`
            );
        });
    }

    // COLOR TOOL
    if (kind === 'color') {
        const p = $('#color');

        const u = () => {
            if (!p) return;

            show(
                `HEX: ${p.value.toUpperCase()}\n` +
                `RGB: ${parseInt(p.value.slice(1, 3), 16)}, ` +
                `${parseInt(p.value.slice(3, 5), 16)}, ` +
                `${parseInt(p.value.slice(5, 7), 16)}`
            );

            const sw = $('#swatch');
            if (sw) sw.style.background = p.value;
        };

        if (p) p.addEventListener('input', u);

        btn('#copy', () => {
            if (p) copy(p.value.toUpperCase());
        });

        u();
    }

    // IMAGE COMPRESSOR
    if (kind === 'image') {
        btn('#compress', () => {
            const fileInput = $('#imageFile');
            const widthInput = $('#maxWidth');
            const qualityInput = $('#quality');
            const f = fileInput?.files?.[0];

            if (!f) return show('Choose an image first.');

            if (!f.type.startsWith('image/')) {
                return show('Please choose a valid image file.');
            }

            const maxWidth = Number(widthInput.value);
            const quality = Number(qualityInput.value);

            if (
                !Number.isInteger(maxWidth) ||
                maxWidth < 100 ||
                maxWidth > 6000
            ) {
                return show(
                    'Maximum width must be a whole number between 100 and 6000 pixels.'
                );
            }

            if (
                !Number.isFinite(quality) ||
                quality < 10 ||
                quality > 100
            ) {
                return show('JPG quality must be between 10 and 100.');
            }

            show('Processing image…');

            const reader = new FileReader();

            reader.onerror = () => show('Could not read this image.');

            reader.onload = () => {
                const im = new Image();

                im.onerror = () => {
                    show('This image format could not be decoded by your browser.');
                };

                im.onload = () => {
                    try {
                        if (!im.naturalWidth || !im.naturalHeight) {
                            return show('The selected image has invalid dimensions.');
                        }

                        const c = document.createElement('canvas');
                        const scale = Math.min(
                            1,
                            maxWidth / im.naturalWidth
                        );

                        c.width = Math.max(
                            1,
                            Math.round(im.naturalWidth * scale)
                        );

                        c.height = Math.max(
                            1,
                            Math.round(im.naturalHeight * scale)
                        );

                        const ctx = c.getContext('2d');

                        if (!ctx) {
                            return show('Could not create the image canvas.');
                        }

                        // JPG does not support transparency.
                        // Flatten transparent areas onto white.
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, c.width, c.height);
                        ctx.drawImage(im, 0, 0, c.width, c.height);

                        c.toBlob(b => {
                            if (!b || !b.size) {
                                return show('Could not process this image.');
                            }

                            save(b, 'lsr-compressed.jpg');

                            const reduction =
                                ((1 - b.size / f.size) * 100).toFixed(1);

                            show(
                                `Original size: ${bytes(f.size)}\n` +
                                `Compressed size: ${bytes(b.size)}\n` +
                                `Dimensions: ${c.width} × ${c.height}\n` +
                                `${Number(reduction) >= 0
                                    ? `Saved: ${reduction}% smaller`
                                    : `Output is ${Math.abs(Number(reduction)).toFixed(1)}% larger`
                                }\n` +
                                `Output format: JPG\n` +
                                `Note: transparency is flattened to white and animated GIFs become a still image.`
                            );
                        }, 'image/jpeg', quality / 100);
                    } catch (e) {
                        show('Could not process this image: ' + e.message);
                    }
                };

                im.src = reader.result;
            };

            reader.readAsDataURL(f);
        });
    }

    // IMAGE TO PDF
    if (kind === 'imagepdf') {
        const files = $('#imageFiles');

        if (files) {
            files.addEventListener('change', () => {
                $('#fileList').textContent = files.files.length
                    ? Array.from(files.files)
                        .map(f => `${f.name} (${bytes(f.size)})`)
                        .join('\n')
                    : 'No images selected.';
            });
        }

        btn('#makePdf', async () => {
            try {
                if (!window.PDFLib) {
                    return show('PDF library did not load. Check your internet connection and retry.');
                }

                const fs = Array.from(files?.files || []);

                if (!fs.length) {
                    return show('Choose at least one JPG, PNG or WebP image.');
                }

                show('Creating PDF…');

                const pdf = await window.PDFLib.PDFDocument.create();

                for (const f of fs) {
                    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
                        throw new Error(`Unsupported image: ${f.name}. Use JPG, PNG or WebP.`);
                    }

                    const buf = await f.arrayBuffer();
                    let img;

                    if (f.type === 'image/jpeg') {
                        img = await pdf.embedJpg(buf);
                    } else if (f.type === 'image/png') {
                        img = await pdf.embedPng(buf);
                    } else {
                        const data = await new Promise((resolve, reject) => {
                            const r = new FileReader();
                            r.onerror = reject;
                            r.onload = () => resolve(r.result);
                            r.readAsDataURL(f);
                        });

                        const image = await new Promise((resolve, reject) => {
                            const i = new Image();
                            i.onload = () => resolve(i);
                            i.onerror = reject;
                            i.src = data;
                        });

                        const canvas = document.createElement('canvas');
                        canvas.width = image.naturalWidth;
                        canvas.height = image.naturalHeight;
                        canvas.getContext('2d').drawImage(image, 0, 0);

                        const jpg = await new Promise(resolve => {
                            canvas.toBlob(resolve, 'image/jpeg', 0.92);
                        });

                        if (!jpg) throw new Error(`Could not convert ${f.name}.`);

                        img = await pdf.embedJpg(await jpg.arrayBuffer());
                    }

                    const page = pdf.addPage([img.width, img.height]);

                    page.drawImage(img, {
                        x: 0,
                        y: 0,
                        width: img.width,
                        height: img.height
                    });
                }

                const bytesOut = await pdf.save();

                save(
                    new Blob([bytesOut], { type: 'application/pdf' }),
                    'lsr-images.pdf'
                );

                show(
                    `Created PDF successfully.\n` +
                    `Pages: ${fs.length}\n` +
                    `Output size: ${bytes(bytesOut.length)}`
                );
            } catch (e) {
                show('Could not create PDF: ' + e.message);
            }
        });
    }

    // WORD TO PDF
    if (kind === 'wordtopdf') {
        btn('#convertDocx', async () => {
            try {
                const f = $('#docxFile').files[0];

                if (!f) return show('Choose a DOCX file first.');

                if (!window.mammoth || !window.jspdf) {
                    return show('Conversion libraries did not load. Check your internet connection.');
                }

                show('Reading Word document…');

                const result = await mammoth.extractRawText({
                    arrayBuffer: await f.arrayBuffer()
                });

                const text = result.value.trim();

                if (!text) return show('No readable text was found in this DOCX.');

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    unit: 'pt',
                    format: 'a4'
                });

                const margin = 48;
                const width = doc.internal.pageSize.getWidth() - margin * 2;
                const lineHeight = 16;
                let y = margin;

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);

                for (const para of text.split(/\n{2,}/)) {
                    const lines = doc.splitTextToSize(para, width);

                    for (const line of lines) {
                        if (y > doc.internal.pageSize.getHeight() - margin) {
                            doc.addPage();
                            y = margin;
                        }

                        doc.text(line, margin, y);
                        y += lineHeight;
                    }

                    y += 8;
                }

                const blob = doc.output('blob');

                save(
                    blob,
                    (f.name.replace(/\.docx$/i, '') || 'document') + '.pdf'
                );

                show(
                    `Converted text to PDF.\n` +
                    `Source: ${f.name}\n` +
                    `Extracted characters: ${text.length}\n` +
                    `Note: advanced formatting, tables and images may not be preserved.`
                );
            } catch (e) {
                show('Conversion failed: ' + e.message);
            }
        });
    }

    // PDF TO WORD
    if (kind === 'pdftoword') {
        btn('#convertPdfWord', async () => {
            try {
                const f = $('#pdfFile').files[0];

                if (!f) return show('Choose a PDF file first.');

                if (!window.pdfjsLib || !window.docx) {
                    return show('Conversion libraries did not load. Check your internet connection.');
                }

                pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

                show('Extracting text from PDF…');

                const pdf = await pdfjsLib.getDocument({
                    data: await f.arrayBuffer()
                }).promise;

                const paragraphs = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const pg = await pdf.getPage(i);
                    const content = await pg.getTextContent();
                    const line = content.items.map(x => x.str).join(' ').trim();

                    paragraphs.push(
                        new docx.Paragraph({
                            children: [
                                new docx.TextRun(
                                    line || '[No selectable text on this page]'
                                )
                            ],
                            spacing: { after: 160 }
                        })
                    );
                }

                const blob = await docx.Packer.toBlob(
                    new docx.Document({
                        sections: [{ children: paragraphs }]
                    })
                );

                save(
                    blob,
                    (f.name.replace(/\.pdf$/i, '') || 'document') + '.docx'
                );

                show(
                    `Created editable DOCX.\n` +
                    `PDF pages: ${pdf.numPages}\n` +
                    `Text pages extracted: ${paragraphs.length}\n` +
                    `Scanned pages without selectable text need OCR and may appear blank.`
                );
            } catch (e) {
                show('Conversion failed: ' + e.message);
            }
        });
    }

    // PDF MERGE
    if (kind === 'pdfmerge') {
        const files = $('#pdfFiles');

        if (files) {
            files.addEventListener('change', () => {
                $('#fileList').textContent = files.files.length
                    ? Array.from(files.files)
                        .map(f => `${f.name} (${bytes(f.size)})`)
                        .join('\n')
                    : 'No files selected.';
            });
        }

        btn('#mergePdfs', async () => {
            try {
                const fs = Array.from(files?.files || []);

                if (fs.length < 2) {
                    return show('Choose at least two PDF files.');
                }

                if (!window.PDFLib) {
                    return show('PDF library did not load. Check your internet connection.');
                }

                show('Merging PDFs…');

                const merged = await window.PDFLib.PDFDocument.create();

                for (const f of fs) {
                    if (
                        f.type !== 'application/pdf' &&
                        !f.name.toLowerCase().endsWith('.pdf')
                    ) {
                        throw new Error(`${f.name} is not a PDF.`);
                    }

                    const src = await window.PDFLib.PDFDocument.load(
                        await f.arrayBuffer()
                    );

                    const pages = await merged.copyPages(
                        src,
                        src.getPageIndices()
                    );

                    pages.forEach(p => merged.addPage(p));
                }

                const data = await merged.save();

                save(
                    new Blob([data], { type: 'application/pdf' }),
                    'lsr-merged.pdf'
                );

                show(
                    `Merged successfully.\n` +
                    `Files: ${fs.length}\n` +
                    `Pages: ${merged.getPageCount()}\n` +
                    `Output size: ${bytes(data.length)}`
                );
            } catch (e) {
                show('Could not merge PDFs: ' + e.message);
            }
        });
    }

    // PDF SPLITTER
    if (kind === 'pdfsplit') {
        const fInput = $('#pdfFile');

        if (fInput) {
            fInput.addEventListener('change', async () => {
                try {
                    const f = fInput.files[0];

                    if (!f) return;

                    if (!window.PDFLib) {
                        show('PDF library did not load. Check your internet connection and reload the page.');
                        return;
                    }

                    const pdf = await window.PDFLib.PDFDocument.load(
                        await f.arrayBuffer()
                    );

                    const pageCount = pdf.getPageCount();

                    $('#endPage').value = pageCount;
                    $('#startPage').max = pageCount;
                    $('#endPage').max = pageCount;

                    show(
                        `PDF loaded. Total pages: ${pageCount}. Enter an inclusive page range.`
                    );
                } catch (e) {
                    show('Could not read PDF: ' + e.message);
                }
            });
        }

        btn('#splitPdf', async () => {
            try {
                const f = fInput?.files?.[0];

                if (!f) return show('Choose a PDF file first.');

                if (!window.PDFLib) {
                    return show('PDF library did not load. Check your internet connection.');
                }

                const pdf = await window.PDFLib.PDFDocument.load(
                    await f.arrayBuffer()
                );

                const start = Number($('#startPage').value);
                const end = Number($('#endPage').value);
                const total = pdf.getPageCount();

                if (
                    !Number.isInteger(start) ||
                    !Number.isInteger(end) ||
                    start < 1 ||
                    end < start ||
                    end > total
                ) {
                    return show(`Enter a valid range from 1 to ${total}.`);
                }

                const outPdf = await window.PDFLib.PDFDocument.create();

                const indices = Array.from(
                    { length: end - start + 1 },
                    (_, i) => start - 1 + i
                );

                const pages = await outPdf.copyPages(pdf, indices);

                pages.forEach(p => outPdf.addPage(p));

                const data = await outPdf.save();

                save(
                    new Blob([data], { type: 'application/pdf' }),
                    `lsr-pages-${start}-${end}.pdf`
                );

                show(
                    `Extracted pages ${start}–${end}.\n` +
                    `Output pages: ${pages.length}\n` +
                    `Output size: ${bytes(data.length)}`
                );
            } catch (e) {
                show('Could not split PDF: ' + e.message);
            }
        });
    }
});

if (kind === 'pdfsplit') {
    const fInput = $('#pdfFile');
    let pageCount = 0;

    if (fInput) {
        fInput.addEventListener('change', async () => {
            try {
                const f = fInput.files[0];
                if (!f) return;

                pageCount = 0;

                if (!window.PDFLib) {
                    show(
                        'PDF library did not load. Check your internet connection and reload the page.'
                    );
                    return;
                }

                const pdf = await window.PDFLib.PDFDocument.load(
                    await f.arrayBuffer()
                );

                pageCount = pdf.getPageCount();

                $('#endPage').value = pageCount;
                $('#startPage').max = pageCount;
                $('#endPage').max = pageCount;

                show(
                    `PDF loaded. Total pages: ${pageCount}. Enter an inclusive page range.`
                );
            } catch (e) {
                pageCount = 0;
                show('Could not read PDF: ' + e.message);
            }
        });
    }

    btn('#splitPdf', async () => {
        try {
            const f = fInput.files[0];

            if (!f) {
                return show('Choose a PDF file first.');
            }

            if (!window.PDFLib) {
                return show(
                    'PDF library did not load. Check your internet connection.'
                );
            }

            const pdf = await window.PDFLib.PDFDocument.load(
                await f.arrayBuffer()
            );

            const start = Number($('#startPage').value);
            const end = Number($('#endPage').value);
            const totalPages = pdf.getPageCount();

            if (
                !Number.isInteger(start) ||
                !Number.isInteger(end) ||
                start < 1 ||
                end < start ||
                end > totalPages
            ) {
                return show(
                    `Enter a valid range from 1 to ${totalPages}.`
                );
            }

            const outPdf = await window.PDFLib.PDFDocument.create();

            const indices = Array.from(
                { length: end - start + 1 },
                (_, i) => start - 1 + i
            );

            const pages = await outPdf.copyPages(pdf, indices);

            pages.forEach(page => outPdf.addPage(page));

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

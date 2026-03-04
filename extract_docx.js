const mammoth = require('mammoth');
const fs = require('fs');

mammoth.convertToHtml({ path: "app/public/Статья 1.docx" })
    .then(function (result) {
        const html = result.value;
        fs.writeFileSync('extracted_article_1.html', html);
        console.log("Extraction complete.");
    })
    .catch(console.error);

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const filePath = path.join(__dirname, '../public/Статья 1.docx');

mammoth.convertToHtml({ path: filePath })
    .then(function (result) {
        const html = result.value;
        const messages = result.messages;
        // Optionally convert basic HTML to Markdown or keep it as HTML
        fs.writeFileSync(path.join(__dirname, 'article1.html'), html, 'utf8');
        console.log("Success! Extracted to article1.html");
    })
    .catch(console.error);

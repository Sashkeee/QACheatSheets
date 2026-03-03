const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const docPath = path.join(__dirname, "../public/Статья 1.docx");
const outPath = path.join(__dirname, "article1_utf8.md");

mammoth.convertToMarkdown({ path: docPath })
    .then(function (result) {
        fs.writeFileSync(outPath, result.value, "utf8");
        console.log("Successfully extracted to article1_utf8.md");
    })
    .catch(function (err) {
        console.error(err);
    });

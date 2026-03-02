import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Public directory created at:', publicDir);
} else {
    console.log('Public directory already exists.');
}

const images = [
    { src: 'C:/Users/user/.gemini/antigravity/brain/7a68a032-332b-44ce-aebf-615b3282adba/test_design_techniques_diagram_1772435468641.png', dest: 'test_design_techniques_diagram.png' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/7a68a032-332b-44ce-aebf-615b3282adba/sql_joins_diagram_1772436191249.png', dest: 'sql_joins_diagram.png' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/7a68a032-332b-44ce-aebf-615b3282adba/api_concept_art_1772436274316.png', dest: 'api_diagram.png' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/7a68a032-332b-44ce-aebf-615b3282adba/owasp_security_diagram_v2_1772457282411.png', dest: 'security_diagram.png' }
];

images.forEach(img => {
    if (fs.existsSync(img.src)) {
        fs.copyFileSync(img.src, path.join(publicDir, img.dest));
        console.log(`Copied ${img.dest}`);
    } else {
        console.error(`Source not found: ${img.src}`);
    }
});

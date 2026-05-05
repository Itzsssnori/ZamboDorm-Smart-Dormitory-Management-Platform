const fs = require('fs');
const path = require('path');

const htmlDir = 'C:\\Users\\ACER\\Documents\\Claudes Files\\HTMLProject-ZamboDorm\\ver2\\ZamboDorm-Smart-Dormitory-Management-Platform\\ZamboDorm\\html';
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const variablesLink = '<link rel="stylesheet" href="../css/variables.css">';
const styleLink = '<link rel="stylesheet" href="../css/style.css">';

files.forEach(filename => {
    const filepath = path.join(htmlDir, filename);
    const content = fs.readFileSync(filepath, 'utf8');

    // More precise regex: match only variables.css and style.css
    // We look for the filename preceded by either a slash or the start of the href attribute value
    const varRegex = /<link\s+[^>]*href=["'][^"']*(?:[\/\\]|^)variables\.css["'][^>]*>/gi;
    const styleRegex = /<link\s+[^>]*href=["'][^"']*(?:[\/\\]|^)style\.css["'][^>]*>/gi;

    let newContent = content.replace(varRegex, '');
    newContent = newContent.replace(styleRegex, '');

    // Find insertion point
    let insertionPoint = -1;
    // Prefer after </title>
    const titleMatch = /<\/title>/i.exec(newContent);
    if (titleMatch) {
        insertionPoint = titleMatch.index + titleMatch[0].length;
    } else {
        // Fallback: after last <meta>
        const metaMatches = [...newContent.matchAll(/<meta[^>]*>/gi)];
        if (metaMatches.length > 0) {
            const lastMeta = metaMatches[metaMatches.length - 1];
            insertionPoint = lastMeta.index + lastMeta[0].length;
        } else {
            // Fallback: after <head>
            const headMatch = /<head[^>]*>/i.exec(newContent);
            if (headMatch) {
                insertionPoint = headMatch.index + headMatch[0].length;
            }
        }
    }

    if (insertionPoint !== -1) {
        const linksToInsert = '\n  ' + variablesLink + '\n  ' + styleLink;
        let finalContent = newContent.slice(0, insertionPoint) + linksToInsert + newContent.slice(insertionPoint);
        
        // Clean up: avoid more than two consecutive newlines
        finalContent = finalContent.replace(/\n\s*\n\s*\n/g, '\n\n');

        if (content !== finalContent) {
            fs.writeFileSync(filepath, finalContent, 'utf8');
            console.log('Updated ' + filename);
        } else {
            console.log('No changes for ' + filename);
        }
    } else {
        console.log('Warning: Could not find head or title in ' + filename);
    }
});

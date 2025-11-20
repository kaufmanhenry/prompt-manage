const fs = require('fs');
const path = require('path');

const locales = [
    'en', 'zh', 'es', 'ar', 'pt', 'id', 'fr', 'ja', 'ru', 'de',
    'ko', 'tr', 'it', 'vi', 'th', 'pl', 'nl', 'hi', 'bn', 'fa'
];

const messagesDir = path.join(__dirname, '../messages');
const enMessagesPath = path.join(messagesDir, 'en.json');

if (!fs.existsSync(enMessagesPath)) {
    console.error('Error: messages/en.json not found!');
    process.exit(1);
}

const enContent = fs.readFileSync(enMessagesPath, 'utf-8');

locales.forEach(locale => {
    const localePath = path.join(messagesDir, `${locale}.json`);
    if (!fs.existsSync(localePath)) {
        console.log(`Creating ${locale}.json...`);
        fs.writeFileSync(localePath, enContent);
    } else {
        console.log(`${locale}.json already exists.`);
    }
});

console.log('All locale files generated successfully!');

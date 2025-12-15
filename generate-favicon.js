const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
    try {
        const inputPath = path.join(__dirname, 'images', 'favicon.png');

        // 다양한 크기의 PNG 생성
        const sizes = [16, 32, 48, 64, 128, 256];

        for (const size of sizes) {
            const outputPath = path.join(__dirname, 'images', `favicon-${size}.png`);
            await sharp(inputPath)
                .resize(size, size)
                .png()
                .toFile(outputPath);
            console.log(`favicon-${size}.png 생성 완료!`);
        }

        // 기본 favicon.png도 32x32로 리사이즈
        const favicon32 = path.join(__dirname, 'images', 'favicon-32.png');
        fs.copyFileSync(favicon32, path.join(__dirname, 'favicon.png'));

        console.log('모든 파비콘 생성 완료!');
    } catch (error) {
        console.error('오류 발생:', error);
    }
}

generateFavicon();

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminWebp = require('imagemin-webp');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
    const files = await imagemin(['dist/assets/images/*.{jpg,png}'], {
        destination: 'dist/assets/images',
        plugins: [
            imageminMozjpeg({
                quality: 80
            }),
            imageminPngquant({
                quality: [0.8, 0.9]
            }),
            imageminWebp({
                quality: 60
            }),
        ],
    });

    console.log(files);
})();

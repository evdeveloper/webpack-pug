import FontFaceObserver from 'fontfaceobserver';

(function () {
    const fontObserver = new FontFaceObserver('TT Wellingtons', {
        weight: 600,
    });

    const marquee = document.querySelector('.header-marquee');
    if (!marquee) return;

    const marqueeInner = marquee.querySelector('.header-marquee__inner');
    const textSpan = marquee.querySelector('.header-marquee__text');
    const textSpanWidth = textSpan.clientWidth;

    const minimalWidth = marquee.clientWidth * 2;

    const copies = Math.ceil(minimalWidth / textSpanWidth);
    let n = copies;

    while (n > 0) {
        const clone = textSpan.cloneNode(true);
        marqueeInner.append(clone);

        n--;
    }

    fontObserver.load().then(() => {
        const textSpanWidth = textSpan.clientWidth;
        const animationSpeed = 16 / 10;
        const offset = textSpanWidth;
        let transform = 0;

        const animate = () => {
            let id;
            if (!((transform += animationSpeed) > offset)) {
                marqueeInner.style.transform = `translateX(-${transform}px)`;
            } else {
                transform = 0;
                marqueeInner.style.transform = `translateX(-${offset}px)`;
            }
            id = requestAnimationFrame(animate);

            return id;
        };

        animate();
    });
})();

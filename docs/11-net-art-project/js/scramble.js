
(function () {
    const el = document.querySelector('.glitch');
    if (!el) return;

    const final = el.getAttribute('data-final') || el.getAttribute('data-text') || el.textContent.trim();
    if (!final) return;

    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓░<>/\\|!?@#$%&*';

    const framesPerChar = 4;
    const holdMs = 1400;
    let frame = 0;
    const scrambleFrames = final.length * framesPerChar + 8;

    function randomChar() {
        return charset[Math.floor(Math.random() * charset.length)];
    }

    function applyText(str) {
        el.textContent = str;
        el.setAttribute('data-text', str);
    }

    function tick() {
        const unlocked = Math.min(final.length, Math.floor(frame / framesPerChar));
        let out = '';

        for (let i = 0; i < final.length; i++) {
            const c = final[i];
            if (c === ' ') {
                out += ' ';
                continue;
            }
            out += i < unlocked ? c : randomChar();
        }

        applyText(out);
        frame += 1;

        if (frame < scrambleFrames) {
            requestAnimationFrame(tick);
            return;
        }

        applyText(final);
        setTimeout(startCycle, holdMs);
    }

    function startCycle() {
        frame = 0;
        applyText('');
        requestAnimationFrame(tick);
    }

    startCycle();
})();

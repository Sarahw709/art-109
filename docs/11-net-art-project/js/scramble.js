/**
 * Scrambled text: random chars reveal left → right, then lock to final title.
 * Keeps data-text in sync so .glitch ::before / ::after stay aligned.
 */
(function () {
    const el = document.querySelector('.glitch');
    if (!el) return;

    const final = el.getAttribute('data-final') || el.textContent.trim();
    if (!final) return;
    const charset = '█▓▒░<>/\\|{}[]$#@!%&*+-=?:;ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let frame = 0;
    const framesPerChar = 5;
    const totalFrames = final.length * framesPerChar + 12;

    function randomChar() {
        return charset[Math.floor(Math.random() * charset.length)];
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
            if (i < unlocked) {
                out += c;
            } else {
                out += randomChar();
            }
        }

        el.textContent = out;
        el.setAttribute('data-text', out);

        frame += 1;
        if (frame < totalFrames) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = final;
            el.setAttribute('data-text', final);
        }
    }

    el.textContent = '';
    el.setAttribute('data-text', '');
    requestAnimationFrame(tick);
})();

(function () {
    const hint = document.querySelector('.click-hint');

    const PHRASES = [
        'today was a long day',
        'did i do enough today?',
        'i feel like i was too quiet',
        'does anyone even like me',
        'what if i dont have any real friends',
        'why do i look the way i do',
        'i have to stop picking at my face',
        'but i cant stop',
        'why am i the way i am',
        'maybe something is wrong with me',
        'im so insufferable',
        'whats the point',
        'STOP TOUCHING YOUR FACE',
        'how do i turn off my brain',
        'why did you talk so much',
        'none of your friends like you',
    ];

    const DEFAULT_PHRASE = 'hello';

    function randomPhrase() {
        if (PHRASES.length === 0) return DEFAULT_PHRASE;
        return PHRASES[Math.floor(Math.random() * PHRASES.length)];
    }

    function placePhrase() {
        const el = document.createElement('span');
        el.className = 'click-phrase';
        el.textContent = randomPhrase();

        // Random position (keep away from edges so text stays on screen)
        const margin = 24;
        const w = window.innerWidth - margin * 2;
        const h = window.innerHeight - margin * 2;
        el.style.left = `${margin + Math.random() * w}px`;
        el.style.top = `${margin + Math.random() * h}px`;

        document.body.appendChild(el);
    }

    function onPageClick() {
        if (hint && hint.parentNode) {
            hint.classList.add('is-hidden');
            const removeHint = () => {
                if (hint.parentNode) hint.remove();
            };
            hint.addEventListener('transitionend', removeHint, { once: true });
            setTimeout(removeHint, 500);
        }
        placePhrase();
    }

    document.addEventListener('click', onPageClick);
})();

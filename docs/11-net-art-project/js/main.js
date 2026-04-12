/**
 * Each click: show a phrase at a random position on the screen.
 * Edit PHRASES or use a single string in DEFAULT_PHRASE.
 */
(function () {
    const PHRASES = [
        'overthink',
        'again',
        'pause',
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

    document.addEventListener('click', placePhrase);
})();

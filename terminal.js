(() => {
    'use strict';

    const { owner, personnel, research, projects } = window.PORTFOLIO;

    const root = document.documentElement;
    const screen = document.getElementById('screen');
    const scroller = document.getElementById('scroller');
    const header = document.getElementById('header');
    const view = document.getElementById('view');
    const prompt = document.getElementById('prompt');
    const promptText = document.getElementById('prompt-text');
    const tintMatrices = document.querySelectorAll('.tint-matrix');
    const tintMatricesSoft = document.querySelectorAll('.tint-matrix-soft');
    const TINT_SOFT_STRENGTH = 0.5; // desktop images/videos: 20% less tint

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Settings ---

    const SETTINGS_KEY = 'termlink-settings';
    const PHOSPHORS = ['green', 'amber', 'white'];

    const settings = Object.assign(
        { phosphor: 'green', sound: true, render: reduceMotion ? 'instant' : 'animated' },
        readSettings()
    );
    if (!PHOSPHORS.includes(settings.phosphor)) settings.phosphor = 'green';

    function readSettings() {
        try {
            return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {}
    }

    // Images are drawn as luminance mapped onto the current phosphor colour.
    function applyPhosphor() {
        root.dataset.phosphor = settings.phosphor;
        const rgb = getComputedStyle(root).getPropertyValue('--fg-rgb').trim().split(/\s+/).map(v => Number(v) / 255);
        const luma = [0.2126, 0.7152, 0.0722];
        // strength 1 = full phosphor tint; lower values mix the original colour back in.
        const matrix = strength => rgb.map((channel, i) =>
            luma.map((weight, j) => (strength * weight * channel * 0.92 + (i === j ? 1 - strength : 0)).toFixed(4)).join(' ') + ' 0 0'
        ).concat('0 0 0 1 0').join('  ');
        const full = matrix(1);
        const soft = matrix(TINT_SOFT_STRENGTH);
        tintMatrices.forEach(m => m.setAttribute('values', full));
        tintMatricesSoft.forEach(m => m.setAttribute('values', soft));
    }

    // --- Sound (synthesised; no audio files) ---

    const Sound = (() => {
        let ctx = null;
        let out = null;
        let noise = null;

        function unlock() {
            if (!settings.sound) return;
            if (!ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                ctx = new AudioCtx();
                out = ctx.createGain();
                out.gain.value = 0.35;
                out.connect(ctx.destination);
                noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.25), ctx.sampleRate);
                const data = noise.getChannelData(0);
                for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            }
            if (ctx.state === 'suspended') ctx.resume();
        }

        const live = () => settings.sound && ctx && ctx.state === 'running';

        // A burst of band-passed noise: the relay/keyboard clicks of the terminal.
        function click(freq, q, volume, duration, delay = 0) {
            if (!live()) return;
            const t = ctx.currentTime + delay;
            const src = ctx.createBufferSource();
            const band = ctx.createBiquadFilter();
            const amp = ctx.createGain();
            src.buffer = noise;
            band.type = 'bandpass';
            band.frequency.value = freq;
            band.Q.value = q;
            amp.gain.setValueAtTime(volume, t);
            amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
            src.connect(band);
            band.connect(amp);
            amp.connect(out);
            src.start(t, Math.random() * 0.2);
            src.stop(t + duration + 0.01);
        }

        function beep(freq, volume, duration, delay = 0) {
            if (!live()) return;
            const t = ctx.currentTime + delay;
            const osc = ctx.createOscillator();
            const amp = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            amp.gain.setValueAtTime(volume, t);
            amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
            osc.connect(amp);
            amp.connect(out);
            osc.start(t);
            osc.stop(t + duration + 0.01);
        }

        return {
            unlock,
            tick: () => click(2600 + Math.random() * 2400, 1.4, 0.5, 0.012),
            move: () => {
                click(1700, 3, 0.6, 0.025);
                beep(1250, 0.02, 0.025);
            },
            enter: () => {
                click(800, 1.2, 0.9, 0.05);
                click(2400, 2, 0.5, 0.03, 0.04);
            },
            back: () => click(1200, 1.2, 0.7, 0.04),
            error: () => beep(150, 0.05, 0.22)
        };
    })();

    // --- Markup helpers ---

    const esc = value => String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

    const bracket = text =>
        `<span aria-hidden="true">[</span><span class="t-label">${esc(text)}</span><span aria-hidden="true">]</span>`;

    const navItem = (text, route) => `<a class="t-item" href="#${route}">${bracket(text)}</a>`;
    const linkItem = (text, href) =>
        `<a class="t-item" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${bracket(text)}</a>`;
    const actionItem = (text, action) => `<button type="button" class="t-item" data-action="${action}">${bracket(text)}</button>`;
    const returnItem = parent => `<a class="t-item" href="#${parent}" data-back>${bracket('Return')}</a>`;

    const shortUrl = url => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

    function meta(pairs) {
        return `<dl class="t-meta">${pairs.map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
    }

    function figure(item) {
        const tone = item.tone ? ` tone-${item.tone}` : '';
        const caption = item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : '';
        if (item.video) {
            return `<figure class="t-fig">`
                + `<div class="t-frame"><video class="t-img${tone}" src="${esc(encodeURI(item.video))}#t=0.1" preload="metadata"${reduceMotion ? '' : ' autoplay'} muted loop playsinline${item.caption ? ` aria-label="${esc(item.caption)}"` : ''}></video></div>`
                + caption
                + actionItem('Play Recording', 'play')
                + `</figure>`;
        }
        return `<figure class="t-fig">`
            + `<div class="t-frame"><img class="t-img${tone}" src="${esc(encodeURI(item.image))}" alt="${esc(item.alt || item.caption || '')}" decoding="async"></div>`
            + caption
            + `</figure>`;
    }

    function table(data) {
        const head = `<thead><tr>${data.head.map(cell => `<th scope="col">${esc(cell)}</th>`).join('')}</tr></thead>`;
        const rows = data.rows.map(row =>
            `<tr>${row.map((cell, i) => `<td${i ? ` data-label="${esc(data.head[i])}"` : ''}>${esc(cell)}</td>`).join('')}</tr>`
        ).join('');
        return `<table class="t-table">${head}<tbody>${rows}</tbody></table>`;
    }

    function block(b) {
        if (b.h) return `<h2 class="t-h">${esc(b.h)}</h2>`;
        if (b.sub) return `<h3 class="t-sub">${esc(b.sub)}</h3>`;
        if (b.p) return `<p>${b.p}</p>`;
        if (b.list) return `<ul class="t-list">${b.list.map(li => `<li>- ${li}</li>`).join('')}</ul>`;
        if (b.steps) return `<ol class="t-list">${b.steps.map((li, i) => `<li>${i + 1}. ${li}</li>`).join('')}</ol>`;
        if (b.media) return `<div class="t-media${b.media.length === 1 ? ' is-single' : ''}">${b.media.map(figure).join('')}</div>`;
        if (b.link) return linkItem(b.label, b.link);
        if (b.table) return table(b.table);
        return '';
    }

    // --- Views ---

    const phosphorLabel = () => 'Display: ' + settings.phosphor[0].toUpperCase() + settings.phosphor.slice(1);
    const soundLabel = () => 'Sound: ' + (settings.sound ? 'On' : 'Off');
    const renderLabel = () => 'Text Rendering: ' + (settings.render === 'animated' ? 'Typed' : 'Instant');

    const views = {
        main: () =>
            `<div>${owner.lines.map(line => `<p class="t-upper">${esc(line)}</p>`).join('')}</div>`
            + `<nav aria-label="Main menu">`
            + navItem('Project Archive', '/archive')
            + navItem('Research Records', '/research')
            + navItem('Personnel File', '/personnel')
            + navItem('Resume & Contact', '/contact')
            + `</nav>`
            + `<nav aria-label="Settings">${navItem('Configuration', '/config')}</nav>`,

        archive: () =>
            `<h1>Project Archive</h1>`
            + `<nav aria-label="Projects">${projects.map(p => navItem(p.label, '/archive/' + p.id)).join('')}</nav>`
            + returnItem('/'),

        project: p => {
            const pairs = p.stack ? p.meta.concat([['Stack', p.stack.join(', ')]]) : p.meta;
            return `<h1>${esc(p.title || p.label)}</h1>`
                + meta(pairs)
                + p.body.map(block).join('')
                + returnItem('/archive');
        },

        research: () =>
            `<h1>Research Records</h1>`
            + research.map(r =>
                `<h2 class="t-h">${esc(r.title)}</h2>`
                + meta(r.meta)
                + `<p>${esc(r.summary)}</p>`
                + `<h3 class="t-sub">Citation</h3>`
                + `<p>${esc(r.citation)}</p>`
            ).join('')
            + returnItem('/'),

        personnel: () =>
            `<h1>Personnel File</h1>`
            + `<div class="t-dossier">`
            + `<figure class="t-portrait"><div class="t-frame"><img class="t-img" src="${esc(encodeURI(personnel.portrait))}" alt="Portrait of ${esc(owner.name)}"></div></figure>`
            + meta(personnel.meta)
            + `</div>`
            + personnel.body.map(text => `<p>${esc(text)}</p>`).join('')
            + returnItem('/'),

        contact: () =>
            `<h1>Resume &amp; Contact</h1>`
            + `<nav aria-label="Contact">`
            + `<a class="t-item" href="${esc(owner.resume)}" download data-action="resume">${bracket('Download Resume')}</a>`
            + `<a class="t-item" href="mailto:${esc(owner.email)}">${bracket('Email: ' + owner.email)}</a>`
            + linkItem('GitHub: ' + shortUrl(owner.github), owner.github)
            + linkItem('LinkedIn: ' + shortUrl(owner.linkedin), owner.linkedin)
            + `</nav>`
            + `<p class="t-status" hidden></p>`
            + returnItem('/'),

        config: () =>
            `<h1>Configuration</h1>`
            + `<nav aria-label="Settings">`
            + actionItem(phosphorLabel(), 'phosphor')
            + actionItem(soundLabel(), 'sound')
            + actionItem(renderLabel(), 'render')
            + `</nav>`
            + returnItem('/'),

        missing: () => `<p class="t-upper">Error: record not found</p>` + returnItem('/')
    };

    const pages = {
        research: 'Research Records',
        personnel: 'Personnel File',
        contact: 'Resume & Contact',
        config: 'Configuration'
    };

    function resolve(path) {
        const [section, id, ...rest] = path.split('/').filter(Boolean);
        if (!section) return { key: '/', parent: null, title: '', render: views.main };
        if (section === 'archive' && !id) {
            return { key: '/archive', parent: '/', title: 'Project Archive', render: views.archive };
        }
        if (section === 'archive' && !rest.length) {
            const project = projects.find(p => p.id === id);
            if (project) {
                return { key: '/archive/' + project.id, parent: '/archive', title: project.title || project.label, render: () => views.project(project) };
            }
        }
        if (pages[section] && !id) {
            return { key: '/' + section, parent: '/', title: pages[section], render: views[section] };
        }
        return { key: path, parent: '/', title: 'Error', render: views.missing };
    }

    const currentPath = () => decodeURIComponent(location.hash.replace(/^#/, '')) || '/';

    // --- Typewriter ---

    const BASE_CPS = 260;     // characters per second on short screens
    const MAX_SECONDS = 1.5;  // long records speed up so they finish within this

    let typing = null;        // { finish } while text is printing

    // Blanks every text node under the roots and hides every element, recording the
    // order they should come back in.
    function collect(parent, ops) {
        for (const node of Array.from(parent.childNodes)) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (!node.nodeValue.trim()) continue;
                ops.push({ node, text: node.nodeValue, pos: 0 });
                node.nodeValue = '';
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.classList.add('tw');
                if (node.classList.contains('t-frame')) {
                    ops.push({ el: node, media: true });
                    continue;
                }
                ops.push({ el: node });
                collect(node, ops);
            }
        }
    }

    function reveal(op) {
        if (op.node) op.node.nodeValue = op.text;
        else op.el.classList.remove('tw');
    }

    function typeOut(roots) {
        const ops = [];
        roots.forEach(r => collect(r, ops));

        return new Promise(resolve => {
            const caret = document.createElement('span');
            caret.className = 'caret';
            caret.setAttribute('aria-hidden', 'true');

            const chars = ops.reduce((sum, op) => sum + (op.text ? op.text.length : 0), 0);
            const cps = Math.max(BASE_CPS, chars / MAX_SECONDS);
            const mediaCost = cps * 0.18;
            let i = 0;
            let budget = 0;
            let last = performance.now();
            let lastTick = 0;
            let frameId = 0;

            function finish() {
                cancelAnimationFrame(frameId);
                for (; i < ops.length; i++) reveal(ops[i]);
                caret.remove();
                roots.forEach(r => r.removeAttribute('aria-busy'));
                typing = null;
                resolve();
            }

            function frame(now) {
                budget += Math.min(now - last, 100) / 1000 * cps;
                last = now;
                let typed = 0;
                let node = null;

                while (i < ops.length) {
                    const op = ops[i];
                    if (op.media) {
                        if (budget < 1) break;
                        op.el.classList.remove('tw');
                        op.el.classList.add('is-scanning');
                        budget -= mediaCost;
                        i++;
                    } else if (op.el) {
                        op.el.classList.remove('tw');
                        i++;
                    } else {
                        const n = Math.min(op.text.length - op.pos, Math.floor(budget));
                        if (n <= 0) break;
                        op.pos += n;
                        budget -= n;
                        typed += n;
                        node = op.node;
                        node.nodeValue = op.text.slice(0, op.pos);
                        if (op.pos < op.text.length) break;
                        i++;
                    }
                }

                if (i >= ops.length) return finish();
                if (node) node.after(caret);
                if (typed && now - lastTick > 45) {
                    Sound.tick();
                    lastTick = now;
                }
                frameId = requestAnimationFrame(frame);
            }

            typing = { finish };
            if (settings.render === 'instant') return finish();
            roots.forEach(r => r.setAttribute('aria-busy', 'true'));
            frameId = requestAnimationFrame(frame);
        });
    }

    // Types the chosen command after the prompt before the screen changes.
    function echo(text) {
        if (settings.render === 'instant') return Promise.resolve();
        const command = text.toUpperCase();
        const delay = Math.max(8, Math.min(22, 180 / command.length));
        return new Promise(resolve => {
            let n = 0;
            const timer = setInterval(() => {
                promptText.textContent = command.slice(0, ++n);
                if (n % 2) Sound.tick();
                if (n >= command.length) {
                    clearInterval(timer);
                    setTimeout(resolve, 110);
                }
            }, delay);
        });
    }

    // --- Screen state ---

    let current = null;
    let renderId = 0;
    let headerShown = false;
    let busy = false;
    let items = [];
    let sel = -1;
    const memory = {};   // last selected item per screen

    function show(path) {
        const route = resolve(path);
        const id = ++renderId;
        const previous = current && current.key;
        if (typing) typing.finish();

        current = route;
        busy = false;
        document.title = route.title ? `${route.title} - Nicholas Harrison` : 'Nicholas Harrison - Portfolio';
        view.innerHTML = route.render();
        prompt.hidden = true;
        promptText.textContent = '';
        scroller.scrollTop = 0;
        items = [];
        sel = -1;

        const roots = headerShown ? [view] : [header, view];
        header.hidden = false;
        headerShown = true;
        typeOut(roots).then(() => {
            if (id === renderId) ready(previous);
        });
    }

    // Highlights the entry for the screen just left, else the last selection, else the first item,
    // but only if it is already on screen so long records still open at the top.
    function ready(previous) {
        prompt.hidden = false;
        items = Array.from(view.querySelectorAll('.t-item'));
        const cameFrom = items.findIndex(el => el.getAttribute('href') === '#' + previous && !('back' in el.dataset));
        const index = [cameFrom, memory[current.key], 0].find(i => items[i] && inView(items[i]));
        if (index != null) select(index, { quiet: true });
    }

    function select(index, { focus = true, scroll = false, quiet = false } = {}) {
        const el = items[index];
        if (!el) return;
        if (index !== sel) {
            if (items[sel]) items[sel].classList.remove('is-selected');
            sel = index;
            el.classList.add('is-selected');
            memory[current.key] = index;
            if (!quiet) Sound.move();
        }
        if (focus && document.activeElement !== el) el.focus({ preventScroll: true });
        if (scroll) el.scrollIntoView({ block: 'nearest' });
    }

    function inView(el) {
        const r = el.getBoundingClientRect();
        const s = scroller.getBoundingClientRect();
        const middle = r.top + r.height / 2;
        return middle > s.top && middle < s.bottom;
    }

    const scrollDistance = () => scroller.clientHeight * 0.4;

    function canScroll(dir) {
        return dir > 0
            ? scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 1
            : scroller.scrollTop > 0;
    }

    // Close enough that selecting it only needs a short scroll.
    function nearby(el, dir) {
        const r = el.getBoundingClientRect();
        const s = scroller.getBoundingClientRect();
        const reach = scrollDistance() / 2;
        return dir > 0 ? r.top < s.bottom + reach : r.bottom > s.top - reach;
    }

    // Arrow keys walk the items, but scroll through long text between them first.
    function step(dir) {
        const cur = items[sel];
        if (!cur || !inView(cur)) {
            const visible = items.filter(inView);
            if (visible.length) {
                select(items.indexOf(dir > 0 ? visible[0] : visible[visible.length - 1]), { scroll: true });
                return;
            }
        } else {
            const next = items[sel + dir];
            if (next && (nearby(next, dir) || !canScroll(dir))) {
                select(sel + dir, { scroll: true });
                return;
            }
        }
        if (canScroll(dir)) {
            scroller.scrollBy({ top: dir * scrollDistance(), behavior: reduceMotion ? 'auto' : 'smooth' });
        }
    }

    // --- Navigation ---

    const trail = [];        // mirrors this tab's history so Esc can step back instead of forward
    let replacing = false;

    function onRoute() {
        const path = currentPath();
        const key = resolve(path).key;
        if (replacing) {
            trail[trail.length - 1] = key;
            replacing = false;
        } else if (trail.length > 1 && trail[trail.length - 2] === key) {
            trail.pop();
        } else if (trail[trail.length - 1] !== key) {
            trail.push(key);
        }
        show(path);
    }

    function goBack() {
        if (!current || current.parent == null) return;
        Sound.back();
        if (trail.length > 1 && trail[trail.length - 2] === current.parent) {
            history.back();
        } else {
            replacing = true;
            location.replace('#' + current.parent);
        }
    }

    function go(item, route) {
        const id = renderId;
        busy = true;
        Sound.enter();
        echo(item.querySelector('.t-label').textContent).then(() => {
            if (id !== renderId) return;
            busy = false;
            if (currentPath() === route) show(route);
            else location.hash = route;
        });
    }

    // --- Actions ---

    function relabel(item, text) {
        item.querySelector('.t-label').textContent = text;
    }

    function toggleVideo(video) {
        if (!video) return;
        Sound.enter();
        if (video.paused) {
            const playing = video.play();
            if (playing) playing.catch(() => {});
        } else {
            video.pause();
        }
    }

    function syncVideo(video, playing) {
        const fig = video.closest('.t-fig');
        const item = fig && fig.querySelector('[data-action="play"]');
        if (item) relabel(item, playing ? 'Stop Recording' : 'Play Recording');
    }

    function showStatus(text) {
        const status = view.querySelector('.t-status');
        if (!status) return;
        status.hidden = false;
        status.textContent = text;
        typeOut([status]);
    }

    async function fetchResume(item) {
        const href = item.getAttribute('href');
        Sound.enter();
        let found = false;
        try {
            found = (await fetch(href, { method: 'HEAD', cache: 'no-store' })).ok;
        } catch (e) {}
        if (found) {
            const link = document.createElement('a');
            link.href = href;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            link.remove();
            showStatus('Download started: ' + href);
        } else {
            Sound.error();
            showStatus('Error: ' + href + ' not found on server');
        }
    }

    const actions = {
        phosphor(item) {
            settings.phosphor = PHOSPHORS[(PHOSPHORS.indexOf(settings.phosphor) + 1) % PHOSPHORS.length];
            saveSettings();
            applyPhosphor();
            relabel(item, phosphorLabel());
            Sound.enter();
        },
        sound(item) {
            settings.sound = !settings.sound;
            saveSettings();
            relabel(item, soundLabel());
            if (settings.sound) {
                Sound.unlock();
                Sound.enter();
            }
        },
        render(item) {
            settings.render = settings.render === 'animated' ? 'instant' : 'animated';
            saveSettings();
            relabel(item, renderLabel());
            Sound.enter();
        },
        play(item) {
            toggleVideo(item.closest('.t-fig').querySelector('video'));
        },
        resume: fetchResume
    };

    function activate(item, event) {
        if (busy) {
            event.preventDefault();
            return;
        }
        select(items.indexOf(item), { quiet: true });

        const action = item.dataset.action;
        if (action) {
            event.preventDefault();
            actions[action](item);
            return;
        }

        const href = item.getAttribute('href') || '';
        if (!href.startsWith('#')) {
            Sound.enter();
            return;
        }
        if (event.ctrlKey || event.metaKey || event.shiftKey) return;
        event.preventDefault();
        if ('back' in item.dataset) goBack();
        else go(item, href.slice(1));
    }

    // --- Input ---

    document.addEventListener('keydown', event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        Sound.unlock();

        const key = event.key;
        const down = key === 'ArrowDown' || key === 's' || key === 'S';
        const up = key === 'ArrowUp' || key === 'w' || key === 'W';
        const back = key === 'Escape' || key === 'Backspace';

        if (typing) {
            if (back) {
                event.preventDefault();
                goBack();
            } else if (down || up || key === 'Enter' || key === ' ') {
                event.preventDefault();
                typing.finish();
            }
            return;
        }
        if (busy) {
            if (down || up || back || key === 'Enter') event.preventDefault();
            return;
        }

        if (down || up) {
            event.preventDefault();
            step(down ? 1 : -1);
        } else if (key === 'Enter' && items[sel]) {
            event.preventDefault();
            items[sel].click();
        } else if (back) {
            event.preventDefault();
            goBack();
        }
    });

    document.addEventListener('pointerdown', () => Sound.unlock(), true);

    // Any click while text is printing just finishes the printing.
    screen.addEventListener('click', event => {
        if (!typing) return;
        event.preventDefault();
        event.stopPropagation();
        typing.finish();
    }, true);

    view.addEventListener('click', event => {
        const item = event.target.closest('.t-item');
        if (item) {
            activate(item, event);
            return;
        }
        const video = event.target.closest('video');
        if (video) toggleVideo(video);
    });

    view.addEventListener('pointerover', event => {
        if (typing || event.pointerType === 'touch') return;
        const index = items.indexOf(event.target.closest('.t-item'));
        if (index >= 0) select(index);
    });

    view.addEventListener('focusin', event => {
        const index = items.indexOf(event.target.closest('.t-item'));
        if (index >= 0) select(index, { focus: false, quiet: true });
    });

    view.addEventListener('play', event => syncVideo(event.target, true), true);
    view.addEventListener('pause', event => syncVideo(event.target, false), true);

    window.addEventListener('hashchange', onRoute);

    // --- Boot ---

    applyPhosphor();

    const fontReady = document.fonts
        ? Promise.race([document.fonts.load('1em "Share Tech Mono"'), new Promise(r => setTimeout(r, 1200))]).catch(() => {})
        : Promise.resolve();

    fontReady.then(() => {
        trail.push(resolve(currentPath()).key);
        show(currentPath());
    });
})();

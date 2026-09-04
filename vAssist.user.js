// ==UserScript==
// @name         vAssist
// @version      1.0.0
// @description  Помічник для тестів: Classtime, Всеосвіта, Naurok
// @author       vAssist
// @license      MIT
// @match        https://www.classtime.com/*
// @match        https://classtime.com/*
// @match        https://vseosvita.ua/*
// @match        https://*.vseosvita.ua/*
// @match        https://naurok.com.ua/*
// @match        https://*.naurok.com.ua/*
// @match        https://naurok.ua/*
// @match        https://*.naurok.ua/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var host = location.hostname;
    var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);

    var style = document.createElement('style');
    style.textContent = `
#th-panel{
  --c-muted:rgba(235,235,245,.6);--c-text:#fff;--c-blue:#0a84ff;--c-red:#ff453a;
  --c-bg:rgba(28,28,30,.88);--c-cell:rgba(44,44,46,.95);--c-line:rgba(84,84,88,.65);
  --c-press:rgba(255,255,255,.08);
  position:fixed;right:16px;bottom:16px;z-index:2147483647;width:min(292px,calc(100vw - 24px));
  padding:12px;display:flex;flex-direction:column;gap:10px;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  color:var(--c-text);background:var(--c-bg);border-radius:22px;
  box-shadow:0 12px 40px rgba(0,0,0,.55);border:.5px solid rgba(255,255,255,.12);
  backdrop-filter:saturate(180%) blur(40px);-webkit-backdrop-filter:saturate(180%) blur(40px);
  transform-origin:100% 100%;
  transition:opacity .42s cubic-bezier(.32,.72,0,1),transform .42s cubic-bezier(.32,.72,0,1);
}
#th-panel.th-prep,#th-restore.th-prep{opacity:0;transform:translateY(18px) scale(.92);pointer-events:none}
#th-panel.th-out,#th-restore.th-out{
  opacity:0;transform:translateY(14px) scale(.94);pointer-events:none;
  transition:opacity .28s cubic-bezier(.4,0,1,1),transform .28s cubic-bezier(.4,0,1,1);
}
#th-panel .th-head{padding:4px 6px 2px;text-align:center}
#th-panel .th-meta{font-size:12px;font-weight:500;color:var(--c-muted);line-height:1.2}
#th-panel .th-meta .th-dot{margin:0 5px;opacity:.55}
#th-panel .th-title{
  margin-top:3px;font-size:15px;font-weight:600;line-height:1.3;color:var(--c-text);
  word-break:break-word;user-select:text;-webkit-user-select:text;cursor:text;
}
#th-panel .th-actions,#th-panel .th-foot{
  display:flex;flex-direction:column;overflow:hidden;border-radius:14px;background:var(--c-cell);
}
#th-panel .th-btn,#th-panel .th-fbtn{
  appearance:none;border:0;background:transparent;margin:0;width:100%;min-height:44px;
  padding:11px 14px;font:inherit;font-size:17px;text-align:center;cursor:pointer;color:var(--c-blue);
}
#th-panel .th-btn:active,#th-panel .th-fbtn:active{background:var(--c-press)}
#th-panel .th-btn[disabled]{opacity:.4;cursor:not-allowed}
#th-panel .th-btn.th-copy{font-weight:600}
#th-panel .th-btn+.th-btn,#th-panel .th-fbtn+.th-fbtn{border-top:.5px solid var(--c-line)}
#th-panel .th-fbtn{color:var(--c-muted);font-size:16px}
#th-panel .th-fbtn.th-danger{color:var(--c-red)}
#th-panel .th-credits{display:flex;flex-direction:column;align-items:center;gap:2px;padding:2px 4px 0;text-align:center}
#th-panel .th-credits span{font-size:11px;font-weight:500;color:var(--c-muted)}
#th-panel .th-credits a{font-size:12px;font-weight:500;color:var(--c-blue);text-decoration:none}
#th-restore{
  position:fixed;right:16px;bottom:16px;z-index:2147483647;border:0;border-radius:999px;
  min-height:36px;padding:8px 16px;font:600 15px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  color:#fff;background:#0a84ff;cursor:pointer;box-shadow:0 8px 24px rgba(10,132,255,.32);
  transform-origin:100% 100%;
  transition:opacity .42s cubic-bezier(.32,.72,0,1),transform .42s cubic-bezier(.32,.72,0,1);
}
#th-restore:active{opacity:.82;transform:scale(.97)}
@media (max-width:640px){
  #th-panel{right:10px;bottom:10px;width:min(270px,calc(100vw - 20px));padding:10px;border-radius:20px}
  #th-panel .th-btn,#th-panel .th-fbtn{min-height:42px;font-size:16px}
}
`;
    (document.head || document.documentElement).appendChild(style);

    var gone = false;
    var hidden = false;
    var busy = false;
    var remount = null;

    function ok() { return !gone && !hidden; }

    function onEnd(el, ms, cb) {
        var done = false;
        function finish() {
            if (done) return;
            done = true;
            el.removeEventListener('transitionend', onTr);
            cb();
        }
        function onTr(e) {
            if (e.target === el && (e.propertyName === 'opacity' || e.propertyName === 'transform')) finish();
        }
        el.addEventListener('transitionend', onTr);
        setTimeout(finish, ms);
    }

    function fadeIn(el) {
        el.classList.add('th-prep');
        el.classList.remove('th-out');
        void el.offsetWidth;
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { el.classList.remove('th-prep'); });
        });
    }

    function fadeOut(el, ms, cb) {
        el.classList.remove('th-prep');
        void el.offsetWidth;
        el.classList.add('th-out');
        onEnd(el, ms, cb);
    }

    function mount(el) {
        document.body.appendChild(el);
        fadeIn(el);
    }

    function showRestore() {
        if (document.getElementById('th-restore')) return;
        var btn = document.createElement('button');
        btn.id = 'th-restore';
        btn.textContent = 'Показати меню';
        btn.onclick = function () {
            if (busy) return;
            busy = true;
            fadeOut(btn, 300, function () {
                btn.remove();
                hidden = false;
                busy = false;
                if (remount) remount();
            });
        };
        mount(btn);
    }

    function makePanel(platform) {
        var panel = document.createElement('div');
        panel.id = 'th-panel';

        var head = document.createElement('div');
        head.className = 'th-head';
        var meta = document.createElement('div');
        meta.className = 'th-meta';
        var platformEl = document.createElement('span');
        platformEl.textContent = platform;
        var dot = document.createElement('span');
        dot.className = 'th-dot';
        dot.textContent = '·';
        var brand = document.createElement('span');
        brand.textContent = 'vAssist';
        meta.append(platformEl, dot, brand);
        var title = document.createElement('div');
        title.className = 'th-title';
        head.append(meta, title);

        var actions = document.createElement('div');
        actions.className = 'th-actions';

        var foot = document.createElement('div');
        foot.className = 'th-foot';

        var hide = document.createElement('button');
        hide.className = 'th-fbtn';
        hide.textContent = 'Сховати';
        hide.onclick = function () {
            if (busy) return;
            busy = true;
            hidden = true;
            fadeOut(panel, 300, function () {
                panel.remove();
                busy = false;
                showRestore();
            });
        };

        var kill = document.createElement('button');
        kill.className = 'th-fbtn th-danger';
        kill.textContent = 'Прибрати';
        kill.onclick = function () {
            if (busy) return;
            busy = true;
            gone = true;
            fadeOut(panel, 300, function () {
                panel.remove();
                var r = document.getElementById('th-restore');
                if (r) r.remove();
                busy = false;
            });
        };

        var credits = document.createElement('div');
        credits.className = 'th-credits';
        var cl = document.createElement('span');
        cl.textContent = 'Credits';
        var a = document.createElement('a');
        a.href = 'https://github.com/kalinvo/vAssist-naurok';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'https://github.com/kalinvo/vAssist-naurok';
        credits.append(cl, a);

        foot.append(hide, kill);
        panel.append(head, actions, foot, credits);
        return { panel: panel, title: title, actions: actions };
    }

    function btn(label, cls) {
        var b = document.createElement('button');
        b.className = 'th-btn ' + (cls || 'th-copy');
        b.textContent = label;
        b._lab = label;
        return b;
    }

    function copyText(text) {
        if (!text) return Promise.resolve(false);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () {
                return fallbackCopy(text);
            });
        }
        return Promise.resolve(fallbackCopy(text));
    }

    function fallbackCopy(text) {
        try {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;top:-9999px';
            document.body.appendChild(ta);
            ta.select();
            var ok = document.execCommand('copy');
            ta.remove();
            return ok;
        } catch (e) {
            return false;
        }
    }

    function flash(b, msg) {
        var old = b._lab || b.textContent;
        b.textContent = msg;
        setTimeout(function () { b.textContent = old; }, 1400);
    }

    function imgs(root) {
        if (!root) return [];
        var seen = {};
        var out = [];
        root.querySelectorAll('img[src]').forEach(function (img) {
            var cs = getComputedStyle(img);
            if (cs.visibility === 'hidden' || cs.display === 'none') return;
            var src = img.getAttribute('src');
            if (!src || src.indexOf('data:') === 0 || seen[src]) return;
            seen[src] = 1;
            out.push(src);
        });
        return out;
    }

    function txt(node) {
        if (!node) return '';
        var blocks = node.querySelectorAll('.public-DraftStyleDefault-block');
        if (blocks.length) {
            var lines = [];
            blocks.forEach(function (b) {
                var t = (b.textContent || '').trim();
                if (t) lines.push(t);
            });
            if (lines.length) return lines.join('\n');
        }
        return (node.textContent || '').trim().replace(/\s+/g, ' ');
    }

    function htmlParts(html) {
        if (!html) return { text: '', imgs: [] };
        var div = document.createElement('div');
        div.innerHTML = html;
        var list = [];
        div.querySelectorAll('img[src]').forEach(function (img) {
            var src = img.getAttribute('src');
            if (src && src.indexOf('data:') !== 0) list.push(src);
        });
        return { text: (div.textContent || '').trim().replace(/\s+/g, ' '), imgs: list };
    }

    function bootWhenReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    }

    if (host.endsWith('classtime.com')) initClasstime();
    else if (host.endsWith('vseosvita.ua')) initVseosvita();
    else if (host.endsWith('naurok.com.ua') || host.endsWith('naurok.ua')) initNaurok();

    function initClasstime() {
        function formatQ(root) {
            if (!root) return '';
            var parts = [];
            var titleEl = root.querySelector('[data-testid="student-session-question-title"]');
            parts.push('Питання: ' + (titleEl ? txt(titleEl) : ''));

            var desc = root.querySelector('.css-11afdt7-questionDescription');
            if (desc) {
                var content = desc.querySelector('.styles__paragraphWithLinks-f74d2d, .styles__content-b0c472');
                if (content) {
                    var d = txt(content);
                    if (d) parts.push('Опис: ' + d);
                }
                var qi = imgs(desc);
                if (qi.length) parts.push('Зображення: ' + qi.join(' '));
            }

            var ans = root.querySelector('[data-testid="questions-answers-list"]');
            if (!ans) return parts.join('\n');

            var table = ans.querySelector('table');
            if (table) {
                parts.push('', formatTable(table));
                return parts.join('\n');
            }

            var sorter = ans.querySelectorAll('[data-testid="student-sorter-choice"]');
            if (sorter.length) {
                var lines = ['Варіанти відповідей (потрібно впорядкувати):'];
                sorter.forEach(function (item, i) {
                    var orderEl = item.querySelector('.css-1bzqaxw-choiceOrder');
                    var contentEl = item.querySelector('[data-testid="student-sorter-choice-content"]');
                    var order = orderEl ? (orderEl.textContent || '').trim() : String(i + 1);
                    var text = contentEl ? txt(contentEl) : '';
                    var im = contentEl ? imgs(contentEl) : [];
                    var line = order + '. ' + text;
                    if (im.length) line += ' [img: ' + im.join(' ') + ']';
                    lines.push(line);
                });
                parts.push('', lines.join('\n'));
                return parts.join('\n');
            }

            var choices = ans.querySelectorAll('[data-testid="choice-wrapper"]');
            if (choices.length) {
                var clines = ['Варіанти відповідей:'];
                choices.forEach(function (c, i) {
                    var label = c.querySelector('.MuiFormControlLabel-label, .styles__label-bcf8a5');
                    var text = label ? txt(label) : txt(c);
                    var im = imgs(c);
                    var line = (i + 1) + '. ' + text;
                    if (im.length) line += ' [img: ' + im.join(' ') + ']';
                    clines.push(line);
                });
                parts.push('', clines.join('\n'));
                return parts.join('\n');
            }

            if (ans.querySelector('textarea, [contenteditable="true"], input[type="text"]')) {
                parts.push('', 'Варіанти відповідей: (вільна відповідь)');
            }
            return parts.join('\n');
        }

        function formatTable(table) {
            var out = ['Таблиця відповідей:'];
            var headers = [];
            table.querySelectorAll('thead th').forEach(function (th, i) {
                if (i === 0 && !th.textContent.trim()) return;
                headers.push(txt(th));
            });
            out.push('Колонки: ' + headers.join(' | '));
            table.querySelectorAll('tbody tr').forEach(function (row, i) {
                var rh = row.querySelector('th');
                out.push((i + 1) + '. ' + (rh ? txt(rh) : 'Рядок ' + (i + 1)));
            });
            out.push('(Потрібно обрати відповідність у кожному рядку.)');
            return out.join('\n');
        }

        function copyOne() {
            var q = document.querySelector('#sessionQuestion');
            return q ? formatQ(q) : null;
        }

        function waitIdx(n, ms) {
            return new Promise(function (resolve) {
                var t0 = Date.now();
                (function tick() {
                    var lab = document.querySelector('[data-testid="student-session-question-number"]');
                    var m = lab && (lab.textContent || '').match(/(\d+)/);
                    if (m && parseInt(m[1], 10) === n) return setTimeout(resolve, 50);
                    if (Date.now() - t0 > ms) return resolve();
                    setTimeout(tick, 40);
                })();
            });
        }

        async function copyAll() {
            var tabs = document.querySelectorAll('[data-testid^="undefined-"]');
            if (!tabs.length) return null;
            var prev = document.querySelector('[data-testid^="undefined-"][aria-selected="true"]');
            var chunks = [];
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].click();
                await waitIdx(i + 1, 800);
                var q = document.querySelector('#sessionQuestion');
                chunks.push('--- Питання ' + (i + 1) + ' ---\n' + (q ? formatQ(q) : '(не вдалося прочитати)'));
            }
            if (prev) try { prev.click(); } catch (e) {}
            return chunks.join('\n\n');
        }

        function getTitle() {
            var t = document.querySelector('[data-testid="student-session-title"]');
            return t ? (t.textContent || '').trim() : '';
        }

        var ui = { panel: null, title: null, last: '' };

        function ensure() {
            if (!ok()) return;
            if (ui.panel && document.body.contains(ui.panel)) return;
            if (!document.body) return;

            ui.last = '';
            var shell = makePanel('Classtime');
            shell.title.textContent = 'Очікую сесію...';

            var b1 = btn('Скопіювати питання', 'th-copy');
            b1.onclick = function () {
                var text = copyOne();
                if (!text) return flash(b1, 'Не знайдено');
                copyText(text).then(function (ok) { flash(b1, ok ? 'Скопійовано' : 'Помилка'); });
            };

            var b2 = btn('Скопіювати увесь тест', 'th-copy-all');
            b2.onclick = async function () {
                b2.disabled = true;
                b2.textContent = 'Збираю...';
                try {
                    var text = await copyAll();
                    if (!text) return flash(b2, 'Не знайдено');
                    var ok = await copyText(text);
                    flash(b2, ok ? 'Скопійовано' : 'Помилка');
                } catch (e) {
                    flash(b2, 'Помилка');
                } finally {
                    b2.disabled = false;
                }
            };

            shell.actions.append(b1, b2);
            ui.panel = shell.panel;
            ui.title = shell.title;
            mount(shell.panel);
        }

        function update() {
            if (!ui.title) return;
            var t = getTitle() || 'Classtime';
            if (ui.last !== t) {
                ui.title.textContent = t;
                ui.last = t;
            }
        }

        var obs = new MutationObserver(function () { ensure(); update(); });
        bootWhenReady(function () {
            remount = function () { ensure(); update(); };
            ensure();
            update();
            obs.observe(document.documentElement, { childList: true, subtree: true });
        });
    }

    function initVseosvita() {
        var css = document.createElement('style');
        css.id = mobile ? 'th-vo-mobile' : 'th-vo-fix';
        css.textContent = mobile
            ? '#header-container,.v-main-header,.main-header_wrap{display:none!important}'
            : '.full-screen-container{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;width:100vw!important;height:100vh!important;z-index:0!important}'
              + '.full-screen-container>.animation-test__container{pointer-events:none!important}'
              + '.v-calc-height-go,#header-container{position:relative!important;z-index:1!important}';
        (document.head || document.documentElement).appendChild(css);

        var patched = false;

        function vueRoot() {
            var all = document.querySelectorAll('*');
            for (var i = 0; i < all.length; i++) {
                if (!all[i].__vue__) continue;
                var r = all[i].__vue__;
                while (r.$parent) r = r.$parent;
                return r;
            }
            return null;
        }

        function patchVue() {
            var root = vueRoot();
            if (!root) return false;
            try {
                if ('is_full_screen_required' in root) root.is_full_screen_required = false;
                if ('is_full_screen_mode' in root) root.is_full_screen_mode = true;
                if ('is_full_screen_show_exit_dlg' in root) root.is_full_screen_show_exit_dlg = false;
            } catch (e) {
                return false;
            }
            ['is_full_screen_required', 'is_full_screen_show_exit_dlg'].forEach(function (k) {
                try { root.$watch(k, function (v) { if (v !== false) root[k] = false; }); } catch (e) {}
            });
            try { root.$watch('is_full_screen_mode', function (v) { if (v !== true) root.is_full_screen_mode = true; }); } catch (e) {}
            patched = true;
            return true;
        }

        (function retry(n) {
            if (patched || patchVue() || n > 80) return;
            setTimeout(function () { retry(n + 1); }, 250);
        })(0);

        function isQuestUrl(url) {
            return url && url.indexOf('/ext/test-designer/testing-pupil/') !== -1;
        }

        var _fetch = window.fetch && window.fetch.bind(window);
        if (_fetch) {
            window.fetch = async function (input, init) {
                var url = typeof input === 'string' ? input : (input && input.url) || String(input);
                var resp = await _fetch(input, init);
                if (isQuestUrl(url) && resp.ok) {
                    try {
                        var clone = resp.clone();
                        if ((clone.headers.get('content-type') || '').indexOf('application/json') !== -1) {
                            capture(await clone.json());
                        }
                    } catch (e) {}
                }
                return resp;
            };
        }

        var XHR = window.XMLHttpRequest;
        if (XHR && XHR.prototype) {
            var _open = XHR.prototype.open;
            var _send = XHR.prototype.send;
            XHR.prototype.open = function (m, u) {
                try { this.__vo_url = String(u || ''); } catch (e) {}
                return _open.apply(this, arguments);
            };
            XHR.prototype.send = function () {
                var url = this.__vo_url || '';
                if (isQuestUrl(url)) {
                    var xhr = this;
                    xhr.addEventListener('readystatechange', function () {
                        if (xhr.readyState !== 4) return;
                        try {
                            var ct = (xhr.getResponseHeader && xhr.getResponseHeader('content-type')) || '';
                            if (ct.indexOf('application/json') !== -1) {
                                var data = JSON.parse(xhr.responseText || 'null');
                                if (data) capture(data);
                            }
                        } catch (e) {}
                    });
                }
                return _send.apply(this, arguments);
            };
        }

        var state = { quest: null, num: null, total: null };

        function capture(data) {
            if (!data) return;
            var d = data.data || {};
            if (Array.isArray(d.testQuests) && d.testQuests.length) state.quest = d.testQuests[0];
            if (typeof d.quest_num === 'number') state.num = d.quest_num;
            if (typeof d.cnt_quest === 'number') state.total = d.cnt_quest;
            update();
        }

        function getTitle() {
            var sels = ['.v-test-title', '.test-title', '[class*="test-title"]', 'h1.vo-title', '.v-test-go h1', '.v-test-go h2', 'main h1'];
            for (var i = 0; i < sels.length; i++) {
                var el = document.querySelector(sels[i]);
                if (!el) continue;
                var t = (el.textContent || '').trim();
                if (t.length > 3) return t;
            }
            try {
                var root = vueRoot();
                if (root) {
                    var keys = ['testName', 'test_name', 'title', 'test_title', 'name'];
                    for (var k = 0; k < keys.length; k++) {
                        if (typeof root[keys[k]] === 'string' && root[keys[k]].trim().length > 3) return root[keys[k]].trim();
                    }
                }
            } catch (e) {}
            var doc = (document.title || '').trim();
            return doc && doc.toLowerCase().indexOf('проход') === -1 ? doc : '';
        }

        function formatQ(q) {
            var parts = [];
            var hp = htmlParts(q.quest_desc || '');
            parts.push('Питання: ' + (hp.text || '(без тексту)'));
            if (hp.imgs.length) parts.push('Зображення: ' + hp.imgs.join(' '));
            if (q.input_bit === 1 || (q.answer_arr && !q.answer_arr.length)) {
                parts.push('', 'Варіанти відповідей: (вільна відповідь)');
            } else if (q.answer_arr && q.answer_arr.length) {
                parts.push('', 'Варіанти відповідей:');
                q.answer_arr.forEach(function (ans, i) {
                    var p = htmlParts(ans);
                    var line = (i + 1) + '. ' + (p.text || '(порожньо)');
                    if (p.imgs.length) line += ' [img: ' + p.imgs.join(' ') + ']';
                    parts.push(line);
                });
            }
            return parts.join('\n');
        }

        function fromDom() {
            var root = document.querySelector('.v-test-question, .v-test-questions-block');
            if (!root) return null;
            var parts = [];
            var titleEl = root.querySelector('.v-test-questions-title');
            parts.push('Питання: ' + (titleEl ? txt(titleEl) : ''));
            var im = imgs(root);
            if (im.length) parts.push('Зображення: ' + im.join(' '));
            var radios = root.querySelectorAll('.v-test-questions-radio-block label');
            if (radios.length) {
                parts.push('', 'Варіанти відповідей:');
                radios.forEach(function (lbl, i) {
                    var t = (lbl.textContent || '').trim().replace(/\s+/g, ' ');
                    var li = imgs(lbl);
                    var line = (i + 1) + '. ' + t;
                    if (li.length) line += ' [img: ' + li.join(' ') + ']';
                    parts.push(line);
                });
            } else if (root.querySelector('textarea, input[type="text"]')) {
                parts.push('', 'Варіанти відповідей: (вільна відповідь)');
            }
            return parts.join('\n');
        }

        function copyOne() {
            return state.quest ? formatQ(state.quest) : fromDom();
        }

        var ui = { panel: null, title: null, last: '' };

        function ensure() {
            if (!ok()) return;
            if (ui.panel && document.body.contains(ui.panel)) return;
            if (!document.body) return;

            ui.last = '';
            var shell = makePanel('Всеосвіта');
            shell.title.textContent = 'Очікую дані тесту...';

            var b1 = btn('Скопіювати питання', 'th-copy');
            b1.onclick = function () {
                var text = copyOne();
                if (!text) return flash(b1, 'Не знайдено');
                copyText(text).then(function (ok) { flash(b1, ok ? 'Скопійовано' : 'Помилка'); });
            };

            shell.actions.appendChild(b1);
            ui.panel = shell.panel;
            ui.title = shell.title;
            mount(shell.panel);
        }

        function update() {
            if (!ui.title) return;
            var base = getTitle() || 'Всеосвіта: тестування';
            var t = base;
            if (state.num != null && state.total != null) t = base + ' · Питання ' + state.num + '/' + state.total;
            if (ui.last !== t) {
                ui.title.textContent = t;
                ui.last = t;
            }
        }

        var obs = new MutationObserver(function () { ensure(); update(); });
        bootWhenReady(function () {
            remount = function () { ensure(); update(); };
            ensure();
            update();
            obs.observe(document.documentElement, { childList: true, subtree: true });
        });
    }

    function initNaurok() {
        var state = { title: '', questions: [], curId: null };

        function isSessionUrl(url) {
            return url && /\/api2\/test\/sessions\//.test(url);
        }

        function norm(q) {
            return {
                id: String(q.id),
                type: q.type,
                content: q.content || '',
                image: q.image || null,
                options: (q.options || []).map(function (o) {
                    return { id: String(o.id), value: o.value || '', image: o.image || null };
                })
            };
        }

        function capture(data) {
            if (!data) return;
            if (data.settings && data.settings.name) state.title = data.settings.name;
            if (Array.isArray(data.questions) && data.questions.length) state.questions = data.questions.map(norm);
            if (data.session && data.session.latest_question != null) state.curId = String(data.session.latest_question);
            update();
        }

        var _fetch = window.fetch && window.fetch.bind(window);
        if (_fetch) {
            window.fetch = async function (input, init) {
                var url = typeof input === 'string' ? input : (input && input.url) || String(input);
                var resp = await _fetch(input, init);
                if (isSessionUrl(url) && resp.ok) {
                    try {
                        var clone = resp.clone();
                        if ((clone.headers.get('content-type') || '').indexOf('application/json') !== -1) {
                            capture(await clone.json());
                        }
                    } catch (e) {}
                }
                return resp;
            };
        }

        var XHR = window.XMLHttpRequest;
        if (XHR && XHR.prototype) {
            var _open = XHR.prototype.open;
            var _send = XHR.prototype.send;
            XHR.prototype.open = function (m, u) {
                try { this.__n_url = String(u || ''); } catch (e) {}
                return _open.apply(this, arguments);
            };
            XHR.prototype.send = function () {
                var url = this.__n_url || '';
                if (isSessionUrl(url)) {
                    var xhr = this;
                    xhr.addEventListener('readystatechange', function () {
                        if (xhr.readyState !== 4) return;
                        try {
                            var ct = (xhr.getResponseHeader && xhr.getResponseHeader('content-type')) || '';
                            if (ct.indexOf('application/json') !== -1) {
                                var data = JSON.parse(xhr.responseText || 'null');
                                if (data) capture(data);
                            }
                        } catch (e) {}
                    });
                }
                return _send.apply(this, arguments);
            };
        }

        function formatQ(q) {
            var parts = [];
            var hp = htmlParts(q.content);
            parts.push('Питання: ' + (hp.text || '(без тексту)'));
            var all = [];
            if (q.image) all.push(q.image);
            hp.imgs.forEach(function (i) { if (all.indexOf(i) === -1) all.push(i); });
            if (all.length) parts.push('Зображення: ' + all.join(' '));

            if (!q.options || !q.options.length) {
                parts.push('', 'Варіанти відповідей: (вільна відповідь)');
            } else {
                parts.push('', 'Варіанти відповідей' + (q.type === 'multiquiz' ? ' (можна декілька):' : ':'));
                q.options.forEach(function (opt, i) {
                    var p = htmlParts(opt.value);
                    var oi = [];
                    if (opt.image) oi.push(opt.image);
                    p.imgs.forEach(function (im) { if (oi.indexOf(im) === -1) oi.push(im); });
                    var line = (i + 1) + '. ' + (p.text || '(порожньо)');
                    if (oi.length) line += ' [img: ' + oi.join(' ') + ']';
                    parts.push(line);
                });
            }
            return parts.join('\n');
        }

        function current() {
            if (!state.questions.length) return null;
            if (state.curId) {
                for (var i = 0; i < state.questions.length; i++) {
                    if (state.questions[i].id === state.curId) return state.questions[i];
                }
            }
            var els = document.querySelectorAll('[data-question-id], [data-id][class*="question"]');
            for (var j = 0; j < els.length; j++) {
                var id = els[j].getAttribute('data-question-id') || els[j].getAttribute('data-id');
                if (!id) continue;
                for (var k = 0; k < state.questions.length; k++) {
                    if (state.questions[k].id === String(id)) return state.questions[k];
                }
            }
            return state.questions[0];
        }

        function copyOne() {
            var q = current();
            return q ? formatQ(q) : null;
        }

        function copyAll() {
            if (!state.questions.length) return null;
            var head = state.title ? 'Тест: ' + state.title + '\n\n' : '';
            return head + state.questions.map(function (q, i) {
                return '--- Питання ' + (i + 1) + ' ---\n' + formatQ(q);
            }).join('\n\n');
        }

        var ui = { panel: null, title: null, last: '' };

        function ensure() {
            if (!ok()) return;
            if (ui.panel && document.body.contains(ui.panel)) return;
            if (!document.body) return;

            ui.last = '';
            var shell = makePanel('Naurok');
            shell.title.textContent = 'Очікую дані тесту...';

            var b1 = btn('Скопіювати питання', 'th-copy');
            b1.onclick = function () {
                var text = copyOne();
                if (!text) return flash(b1, 'Ще немає даних');
                copyText(text).then(function (ok) { flash(b1, ok ? 'Скопійовано' : 'Помилка'); });
            };

            var b2 = btn('Скопіювати увесь тест', 'th-copy-all');
            b2.onclick = function () {
                var text = copyAll();
                if (!text) return flash(b2, 'Ще немає даних');
                copyText(text).then(function (ok) { flash(b2, ok ? 'Скопійовано' : 'Помилка'); });
            };

            shell.actions.append(b1, b2);
            ui.panel = shell.panel;
            ui.title = shell.title;
            mount(shell.panel);
        }

        function update() {
            if (!ui.title) return;
            var t = 'Naurok: очікую дані тесту...';
            if (state.title && state.questions.length) t = state.title + ' · ' + state.questions.length + ' питань';
            else if (state.title) t = state.title;
            if (ui.last !== t) {
                ui.title.textContent = t;
                ui.last = t;
            }
        }

        var obs = new MutationObserver(function () { ensure(); update(); });
        bootWhenReady(function () {
            remount = function () { ensure(); update(); };
            ensure();
            update();
            obs.observe(document.documentElement, { childList: true, subtree: true });
        });
    }
})();

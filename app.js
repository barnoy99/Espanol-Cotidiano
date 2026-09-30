(function () {
  'use strict';

  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyBEL3bYGB6oeGCNZ4hRzhNqa1yq_eUlgCc",
    authDomain: "francais-quotidien.firebaseapp.com",
    databaseURL: "https://francais-quotidien-default-rtdb.firebaseio.com",
    projectId: "francais-quotidien"
  };
  // Writes are only permitted under progress/ in this Firebase project.
  var DB_PATH = 'progress/fannySpanish';
  var LS_KEY = 'fannyES_v1';

  // Listening speed ladder (speechSynthesis rate). Auto-adjusted in Écouter.
  var RATES = [0.6, 0.75, 0.9, 1.05, 1.2];
  var RATE_NAMES = ['Très lent', 'Lent', 'Normal', 'Rapide', 'Très rapide'];
  var UP_AFTER = 3;    // correct in a row at this speed → faster
  var DOWN_AFTER = 2;  // misses in a row → slower

  var $ = function (id) { return document.getElementById(id); };
  var byId = {};
  PHRASES.forEach(function (p) { byId[p.id] = p; });

  // A "key" names one sentence: "12:m" is phrase 12's main, "12:a" its alt.
  function sentence(key) {
    var parts = key.split(':'), p = byId[parts[0]];
    if (!p) return null;
    return parts[1] === 'a' ? { p: p, es: p.alt_es, fr: p.alt_fr } : { p: p, es: p.es, fr: p.fr };
  }
  function allKeys() {
    var out = [];
    PHRASES.forEach(function (p) { out.push(p.id + ':m', p.id + ':a'); });
    return out;
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // ── State ─────────────────────────────────────────────
  // rvQueue: Réviser order; the front is the current card. "Je savais" sends
  //   it to the back, "À revoir" puts it back a few cards ahead.
  // hfPos: position in the hands-free sequence (every main + alt, data order).
  // lsCycle/lsPos: shuffled pass over every sentence for Écouter.
  var state = loadLocal() || {};
  // A device that has never saved must take the cloud copy even if she taps
  // something before the cloud read returns.
  var startedFresh = !state.updatedAt;
  function loadLocal() { try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch (e) { return null; } }

  function reconcile(s) {
    s.fs = s.fs || 21;
    s.rvKnown = s.rvKnown || {};
    s.rvAgain = s.rvAgain || {};
    var seen = {};
    s.rvQueue = (s.rvQueue || []).filter(function (id) {
      if (!byId[id] || seen[id]) return false;
      return (seen[id] = true);
    });
    PHRASES.forEach(function (p) { if (!seen[p.id]) s.rvQueue.push(p.id); });
    s.hfPos = s.hfPos || 0;
    var keys = allKeys(), have = {};
    s.lsCycle = (s.lsCycle || []).filter(function (k) {
      if (!sentence(k) || have[k]) return false;
      return (have[k] = true);
    });
    var missing = keys.filter(function (k) { return !have[k]; });
    if (missing.length) s.lsCycle = s.lsCycle.concat(shuffle(missing));
    s.lsPos = Math.min(s.lsPos || 0, s.lsCycle.length);
    if (s.lsRate === undefined) s.lsRate = 1;
    s.lsUp = s.lsUp || 0; s.lsDown = s.lsDown || 0;
    s.lsOk = s.lsOk || 0; s.lsDone = s.lsDone || 0;
    return s;
  }
  reconcile(state);

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function countToday() {
    if (state.dayDate !== today()) { state.dayDate = today(); state.dayCount = 0; }
    state.dayCount = (state.dayCount || 0) + 1;
  }

  // ── Sync ──────────────────────────────────────────────
  // Last write wins by updatedAt. Until the cloud has been read, saves stay
  // local so a stale device cannot overwrite newer cloud progress.
  var db = null, cloudReadOk = false, pushTimer = null;
  try { firebase.initializeApp(FIREBASE_CONFIG); db = firebase.database(); } catch (e) {}

  function save() {
    state.updatedAt = Date.now();
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, 800);
  }
  function push() {
    if (!db || !cloudReadOk) return;
    db.ref(DB_PATH).set(JSON.parse(JSON.stringify(state))).then(function () {
      setSync('✓ Progrès enregistrés');
    }).catch(function () {});
  }
  function setSync(t) { $('home-sync').textContent = t; }

  function readCloud() {
    if (!db) return;
    db.ref(DB_PATH).once('value').then(function (snap) {
      var cloud = snap.val();
      cloudReadOk = true;
      if (cloud && (startedFresh || (cloud.updatedAt || 0) > (state.updatedAt || 0))) {
        state = reconcile(cloud);
        try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
        setFs(state.fs);
        if (current === 'home') renderHome();
      } else if (state.updatedAt) {
        push();
      }
      setSync('✓ Progrès synchronisés');
    }).catch(function () { setSync('Hors ligne — les progrès restent sur ce téléphone'); });
  }

  // ── Speech ────────────────────────────────────────────
  var voices = { es: null, fr: null };
  function pickVoices() {
    if (!window.speechSynthesis) return;
    var vs = speechSynthesis.getVoices();
    var find = function (re) { return vs.filter(function (v) { return re.test(v.lang); }); };
    var es = find(/^es/i), fr = find(/^fr/i);
    voices.es = find(/^es[-_]ES/i)[0] || es[0] || null;
    voices.fr = find(/^fr[-_]FR/i)[0] || fr[0] || null;
  }
  if (window.speechSynthesis) { pickVoices(); speechSynthesis.onvoiceschanged = pickVoices; }

  // speak(text, lang, rate, onEnd). onEnd fires once, and also on a timeout
  // in case the engine never reports the end (happens on some Androids),
  // so the hands-free loop can never stall. A cancelled utterance also
  // fires onend, so callers guard with a generation token.
  function speak(text, lang, rate, onEnd) {
    var done = false, guard = null;
    var finish = function () { if (done) return; done = true; clearTimeout(guard); if (onEnd) onEnd(); };
    if (!window.speechSynthesis) { if (onEnd) setTimeout(finish, 1500); return false; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    var v = voices[lang];
    u.lang = v ? v.lang : (lang === 'es' ? 'es-ES' : 'fr-FR');
    if (v) u.voice = v;
    u.rate = rate;
    u.onend = finish;
    u.onerror = finish;
    guard = setTimeout(finish, 4000 + text.length * 120 / rate);
    speechSynthesis.speak(u);
    return true;
  }
  function stopSpeech() { if (window.speechSynthesis) speechSynthesis.cancel(); }

  var audioCtx = null;
  function initAudio() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) {}
  }
  function ding(high, cb) {
    if (!audioCtx) { if (cb) cb(); return; }
    try {
      var osc = audioCtx.createOscillator(), g = audioCtx.createGain();
      osc.connect(g); g.connect(audioCtx.destination);
      osc.frequency.value = high ? 880 : 520;
      g.gain.value = 0.3;
      osc.start();
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {}
    setTimeout(function () { if (cb) cb(); }, 350);
  }

  var wakeLock = null;
  function lockScreen() {
    if (!('wakeLock' in navigator)) return;
    navigator.wakeLock.request('screen').then(function (wl) {
      wakeLock = wl;
      wl.addEventListener('release', function () { wakeLock = null; });
    }).catch(function () {});
  }
  function unlockScreen() { if (wakeLock) { wakeLock.release().catch(function () {}); wakeLock = null; } }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && hf.active && !wakeLock) lockScreen();
  });

  // ── Navigation ────────────────────────────────────────
  var current = 'home';
  function show(name) {
    if (current === 'hands') hfStop();
    stopSpeech();
    current = name;
    Array.prototype.forEach.call(document.querySelectorAll('.screen'), function (s) {
      s.classList.toggle('active', s.id === 'screen-' + name);
    });
    window.scrollTo(0, 0);
    if (name === 'home') renderHome();
    if (name === 'revise') rvRender();
    if (name === 'hands') hfIntro();
    if (name === 'listen') lsStart();
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-go]'), function (b) {
    b.onclick = function () { initAudio(); show(b.dataset.go); };
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-home]'), function (b) {
    b.onclick = function () { show('home'); };
  });

  function renderHome() {
    var known = PHRASES.filter(function (p) { return state.rvKnown[p.id]; }).length;
    $('sub-revise').textContent = known
      ? known + ' phrase' + (known > 1 ? 's' : '') + ' sue' + (known > 1 ? 's' : '') + ' sur ' + PHRASES.length
      : PHRASES.length + ' phrases : le français, puis l\'espagnol';
    $('sub-listen').textContent = state.lsDone
      ? 'Vitesse actuelle : ' + RATE_NAMES[state.lsRate].toLowerCase()
      : 'L\'espagnol parlé, de plus en plus vite';
    var n = state.dayDate === today() ? state.dayCount || 0 : 0;
    $('home-day').textContent = n ? 'Aujourd\'hui : ' + n + ' phrase' + (n > 1 ? 's' : '') + ' pratiquée' + (n > 1 ? 's' : '') + '. ¡Muy bien!' : '';
  }

  function setFs(n) {
    state.fs = Math.max(16, Math.min(30, n));
    document.documentElement.style.setProperty('--fs', state.fs + 'px');
  }
  $('fs-plus').onclick = function () { setFs(state.fs + 2); save(); };
  $('fs-minus').onclick = function () { setFs(state.fs - 2); save(); };

  // ── Réviser ───────────────────────────────────────────
  var rvShownAt = 0;
  function rvRender() {
    var p = byId[state.rvQueue[0]];
    var known = PHRASES.filter(function (x) { return state.rvKnown[x.id]; }).length;
    $('rv-count').textContent = '✓ ' + known + ' / ' + PHRASES.length;
    $('rv-ctx').textContent = p.ctx + (state.rvAgain[p.id] && !state.rvKnown[p.id] ? ' · ↺' : '');
    $('rv-fr').textContent = p.fr;
    $('rv-es').textContent = p.es;
    $('rv-alt-es').textContent = p.alt_es;
    $('rv-alt-fr').textContent = p.alt_fr;
    $('rv-answer').hidden = true;
    $('rv-bar-ask').hidden = false;
    $('rv-bar-rate').hidden = true;
    window.scrollTo(0, 0);
  }
  $('rv-reveal').onclick = function () {
    var p = byId[state.rvQueue[0]];
    $('rv-answer').hidden = false;
    $('rv-bar-ask').hidden = true;
    $('rv-bar-rate').hidden = false;
    rvShownAt = Date.now();
    speak(p.es, 'es', 0.85);
  };
  Array.prototype.forEach.call(document.querySelectorAll('[data-say]'), function (b) {
    b.onclick = function () {
      var p = byId[state.rvQueue[0]], w = b.dataset.say;
      speak(w === 'alt' ? p.alt_es : p.es, 'es', w === 'main-slow' ? 0.6 : 0.85);
    };
  });
  // The rating buttons appear where the reveal button was; ignore taps in
  // the first moment so a double tap on "Voir" cannot also rate the card.
  function rvRate(knew) {
    if (Date.now() - rvShownAt < 500) return;
    var id = state.rvQueue.shift();
    if (knew) {
      state.rvKnown[id] = (state.rvKnown[id] || 0) + 1;
      state.rvQueue.push(id);
    } else {
      state.rvAgain[id] = (state.rvAgain[id] || 0) + 1;
      delete state.rvKnown[id];
      state.rvQueue.splice(Math.min(4, state.rvQueue.length), 0, id);
    }
    countToday();
    save();
    stopSpeech();
    rvRender();
  }
  $('rv-ok').onclick = function () { rvRate(true); };
  $('rv-again').onclick = function () { rvRate(false); };

  // ── Mains libres ──────────────────────────────────────
  // Per sentence: French prompt → pause to say it in Spanish → Spanish slowly
  // → pause to repeat → Spanish at normal speed → pause to repeat → next.
  var HF_THINK = 7, HF_REPEAT = 6, HF_NEXT = 2;
  var hf = { active: false, paused: false, gen: 0, timer: null, resume: null };
  var hfKeys = allKeys();

  function hfIntro() {
    hf.active = false;
    $('hf-intro').hidden = false;
    $('hf-run').hidden = true;
    $('hf-bar-start').hidden = false;
    $('hf-bar-run').hidden = true;
    $('hf-count').textContent = '';
  }
  $('hf-start').onclick = function () {
    initAudio();
    hf.active = true; hf.paused = false;
    $('hf-intro').hidden = true;
    $('hf-run').hidden = false;
    $('hf-bar-start').hidden = true;
    $('hf-bar-run').hidden = false;
    $('hf-pause').textContent = '⏸ Pause';
    lockScreen();
    hfSentence();
  };
  function hfStop() {
    hf.active = false;
    hfCancel();
    unlockScreen();
  }
  function hfCancel() {
    hf.gen++;
    clearInterval(hf.timer); hf.timer = null;
    hf.resume = null;
    stopSpeech();
  }
  function hfPhase(t, num) {
    $('hf-phase').textContent = t;
    $('hf-num').textContent = num;
  }
  // Each stage records itself as the resume point, so Reprendre re-runs the
  // stage that was interrupted (a sentence restarts from its beginning).
  function hfStage(fn) {
    var gen = hf.gen;
    hf.resume = fn;
    fn(function (next) { return function () { if (gen === hf.gen && hf.active && !hf.paused) next(); }; });
  }
  function hfCountdown(label, secs, then) {
    hfStage(function (guard) {
      var left = secs;
      hfPhase(label, left);
      var go = guard(then);
      hf.timer = setInterval(function () {
        left--;
        if (left <= 0) { clearInterval(hf.timer); hf.timer = null; go(); }
        else $('hf-num').textContent = left;
      }, 1000);
    });
  }
  function hfSay(label, text, lang, rate, high, then) {
    hfStage(function (guard) {
      hfPhase(label, '♪');
      ding(high, guard(function () { speak(text, lang, rate, guard(then)); }));
    });
  }
  function hfSentence() {
    hfCancel();
    var key = hfKeys[state.hfPos % hfKeys.length];
    var s = sentence(key);
    $('hf-count').textContent = (state.hfPos % hfKeys.length + 1) + ' / ' + hfKeys.length;
    $('hf-ctx').textContent = s.p.ctx;
    $('hf-fr').textContent = s.fr;
    $('hf-es').textContent = s.es;
    $('hf-es').hidden = true;
    var showEs = function () { $('hf-es').hidden = false; };
    hfSay('En français…', s.fr, 'fr', 0.95, false, function () {
      hfCountdown('À vous : dites-le en espagnol', HF_THINK, function () {
        showEs();
        hfSay('En espagnol, lentement', s.es, 'es', 0.65, true, function () {
          hfCountdown('Répétez !', HF_REPEAT, function () {
            hfSay('Encore une fois', s.es, 'es', 0.9, true, function () {
              hfCountdown('Répétez !', HF_REPEAT, function () {
                countToday();
                state.hfPos = (state.hfPos + 1) % hfKeys.length;
                save();
                hfCountdown('Suivante…', HF_NEXT, hfSentence);
              });
            });
          });
        });
      });
    });
  }
  $('hf-pause').onclick = function () {
    if (!hf.paused) {
      var resume = hf.resume;
      hfCancel();
      hf.resume = resume;
      hf.paused = true;
      $('hf-pause').textContent = '▶ Reprendre';
      $('hf-phase').textContent = 'En pause';
      unlockScreen();
    } else {
      hf.paused = false;
      $('hf-pause').textContent = '⏸ Pause';
      initAudio();
      lockScreen();
      var r = hf.resume;
      if (r) hfStage(r); else hfSentence();
    }
  };
  function hfJump(d) {
    state.hfPos = (state.hfPos + d + hfKeys.length) % hfKeys.length;
    save();
    hf.paused = false;
    $('hf-pause').textContent = '⏸ Pause';
    initAudio();
    hfSentence();
  }
  $('hf-prev').onclick = function () { hfJump(-1); };
  $('hf-next').onclick = function () { hfJump(1); };

  // ── Écouter et comprendre ─────────────────────────────
  // A Spanish sentence is spoken; she picks its meaning among three French
  // sentences. The speed climbs after UP_AFTER right answers in a row and
  // drops after DOWN_AFTER misses. An answer given after the slow replay still
  // counts as right, but does not push the speed up.
  var ls = { key: null, answered: false, usedSlow: false };

  function lsKey() {
    if (state.lsPos >= state.lsCycle.length) { state.lsCycle = shuffle(allKeys()); state.lsPos = 0; }
    return state.lsCycle[state.lsPos];
  }
  function lsSpeed() {
    $('ls-speed-name').textContent = RATE_NAMES[state.lsRate];
    var h = '';
    for (var i = 0; i < RATES.length; i++) h += '<i class="' + (i <= state.lsRate ? 'on' : '') + '"></i>';
    $('ls-dots').innerHTML = h;
    $('ls-slower').disabled = state.lsRate === 0;
    $('ls-faster').disabled = state.lsRate === RATES.length - 1;
  }
  function lsPlay(slow) {
    var s = sentence(ls.key);
    speak(s.es, 'es', slow ? RATES[0] : RATES[state.lsRate]);
  }
  // Distractors come from nearby phrases (same theme, similar vocabulary) so
  // the right answer cannot be spotted from the topic alone.
  function lsOptions(key) {
    // Neighbours by position in data.js (sections are contiguous there; ids
    // are not in file order).
    var s = sentence(key), at = PHRASES.indexOf(s.p), pool = [];
    PHRASES.forEach(function (p, i) {
      if (i !== at && Math.abs(i - at) <= 6) pool.push(p.fr, p.alt_fr);
    });
    pool = shuffle(pool.filter(function (f) { return f !== s.fr; }));
    return shuffle([s.fr, pool[0], pool[1]]);
  }
  function lsStart(msg) {
    ls.key = lsKey(); ls.answered = false; ls.usedSlow = false;
    var s = sentence(ls.key);
    lsSpeed();
    $('ls-msg').textContent = msg || '';
    $('ls-count').textContent = state.lsDone ? '✓ ' + state.lsOk + ' / ' + state.lsDone : '';
    $('ls-result').hidden = true;
    $('ls-bar-next').hidden = true;
    var h = '';
    lsOptions(ls.key).forEach(function (f) {
      h += '<button class="opt" data-fr="' + esc(f) + '">' + esc(f) + '</button>';
    });
    h += '<button class="opt idk" data-fr="">🤷 Je ne sais pas</button>';
    $('ls-opts').innerHTML = h;
    Array.prototype.forEach.call($('ls-opts').querySelectorAll('.opt'), function (b) {
      b.onclick = function () { lsAnswer(b, b.dataset.fr === s.fr); };
    });
    $('ls-es').textContent = s.es;
    $('ls-fr').textContent = s.fr;
    setTimeout(function () { if (current === 'listen' && !ls.answered) lsPlay(false); }, 400);
  }
  function lsAnswer(btn, right) {
    if (ls.answered) return;
    ls.answered = true;
    var s = sentence(ls.key);
    Array.prototype.forEach.call($('ls-opts').querySelectorAll('.opt'), function (b) {
      b.disabled = true;
      if (b.dataset.fr === s.fr) b.classList.add('right');
    });
    if (!right) btn.classList.add('wrong');
    state.lsDone++;
    state.lsPos++;
    countToday();
    var msg = '';
    if (right) {
      state.lsOk++;
      state.lsDown = 0;
      if (!ls.usedSlow) state.lsUp++;
      msg = '✓ ¡Muy bien!';
      if (state.lsUp >= UP_AFTER && state.lsRate < RATES.length - 1) {
        state.lsRate++; state.lsUp = 0;
        ls.nextMsg = 'Bravo ! On accélère un peu : ' + RATE_NAMES[state.lsRate].toLowerCase() + '.';
      }
    } else {
      state.lsUp = 0;
      state.lsDown++;
      msg = 'Voici ce qui a été dit :';
      if (state.lsDown >= DOWN_AFTER && state.lsRate > 0) {
        state.lsRate--; state.lsDown = 0;
        ls.nextMsg = 'On ralentit un peu : ' + RATE_NAMES[state.lsRate].toLowerCase() + '.';
      }
      // Replay it slowly with the words on screen, to link sound and text.
      setTimeout(function () { if (current === 'listen') speak(s.es, 'es', RATES[0]); }, 300);
    }
    $('ls-msg').textContent = msg;
    $('ls-result').hidden = false;
    $('ls-bar-next').hidden = false;
    $('ls-result').scrollIntoView({ block: 'center', behavior: 'smooth' });
    $('ls-count').textContent = '✓ ' + state.lsOk + ' / ' + state.lsDone;
    save();
  }
  $('ls-play').onclick = function () { lsPlay(false); };
  $('ls-slow').onclick = function () { if (!ls.answered) ls.usedSlow = true; lsPlay(true); };
  $('ls-next').onclick = function () { var m = ls.nextMsg; ls.nextMsg = null; lsStart(m); };
  $('ls-slower').onclick = function () {
    if (state.lsRate > 0) { state.lsRate--; state.lsUp = state.lsDown = 0; save(); lsSpeed(); lsPlay(false); }
  };
  $('ls-faster').onclick = function () {
    if (state.lsRate < RATES.length - 1) { state.lsRate++; state.lsUp = state.lsDown = 0; save(); lsSpeed(); lsPlay(false); }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ── Start ─────────────────────────────────────────────
  setFs(state.fs);
  renderHome();
  readCloud();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
})();

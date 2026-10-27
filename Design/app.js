/* ============================================================
   Aster — 原型交互
   仅用于演示：播放状态、进度、切歌、歌词跟随、开关
   ============================================================ */
(function () {
  'use strict';

  var TRACKS = [
    { title: '山茶夜语', artist: 'Aster Studio', dur: 278 },
    { title: '紫色霓虹', artist: '深夜电台',   dur: 232 },
    { title: '雨落窗台', artist: '城市噪音',   dur: 252 },
    { title: '低频心跳', artist: 'Aster Studio', dur: 206 },
    { title: '花瓣与霓虹', artist: '夜晚合辑', dur: 304 },
    { title: '只放给凌晨', artist: 'Nox',      dur: 227 },
    { title: '山茶花开在别处', artist: '现场录音', dur: 261 }
  ];

  var KEY = 'aster.prototype';
  var state = {
    index: 0,
    playing: false,
    pos: 96
  };

  /* ---------- 持久化 ---------- */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (typeof s.index === 'number') state.index = s.index;
        if (typeof s.playing === 'boolean') state.playing = s.playing;
        if (typeof s.pos === 'number') state.pos = s.pos;
      }
    } catch (e) { /* 忽略 */ }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 忽略 */ }
  }

  /* ---------- 元素 ---------- */
  var bar = document.getElementById('playerbar');
  var npArt = document.querySelector('.np-art');
  var miniTitle = document.querySelector('.mini-title');
  var miniArtist = document.querySelector('.mini-artist');

  /* ---------- 进度渲染 ---------- */
  function fmt(t) {
    t = Math.max(0, Math.round(t));
    return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
  }

  function renderProgress() {
    var track = TRACKS[state.index];
    var pct = Math.min(100, (state.pos / track.dur) * 100);

    var barFill = document.querySelector('.pb-progress .fill');
    if (barFill) barFill.style.width = pct + '%';

    var rangeFill = document.querySelector('.range .fill');
    if (rangeFill) rangeFill.style.width = pct + '%';

    var knob = document.querySelector('.range .knob');
    if (knob) knob.style.left = pct + '%';

    var miniFill = document.querySelector('.mini-bar i');
    if (miniFill) miniFill.style.width = pct + '%';

    var cur = document.getElementById('np-cur');
    if (cur) cur.textContent = fmt(state.pos);
    var total = document.getElementById('np-total');
    if (total) total.textContent = fmt(track.dur);
    var miniTime = document.querySelector('.mini-time');
    if (miniTime) miniTime.textContent = fmt(state.pos) + ' / ' + fmt(track.dur);
    var miniBar = document.querySelector('.mini-bar');
    if (miniBar) {
      var mb = miniBar.parentElement.querySelector('.mini-time');
      if (mb) mb.textContent = fmt(state.pos) + ' / ' + fmt(track.dur);
    }
  }

  /* ---------- 曲目渲染 ---------- */
  function renderTrack() {
    var track = TRACKS[state.index];
    var t = document.getElementById('pb-title');
    if (t) t.textContent = track.title;
    var a = document.getElementById('pb-artist');
    if (a) a.textContent = track.artist;
    if (miniTitle) miniTitle.textContent = track.title;
    if (miniArtist) miniArtist.textContent = track.artist;

    var npTitle = document.querySelector('.np-title');
    if (npTitle) npTitle.textContent = track.title;
    var npArtist = document.querySelector('.np-artist');
    if (npArtist) npArtist.textContent = track.artist + ' · 深夜紫调';
  }

  function renderPlaying() {
    if (bar) bar.classList.toggle('playing', state.playing);
    document.documentElement.classList.toggle('is-playing', state.playing);
    var eq = document.querySelector('.tr-row.active');
    if (eq) eq.classList.toggle('paused', !state.playing);
  }

  function renderAll() {
    renderTrack();
    renderPlaying();
    renderProgress();
  }

  /* ---------- 播放控制 ---------- */
  function toggle() {
    state.playing = !state.playing;
    renderPlaying();
    save();
  }

  function skip(dir) {
    state.index = (state.index + dir + TRACKS.length) % TRACKS.length;
    state.pos = 0;
    renderAll();
    save();
  }

  /* ---------- 计时 ---------- */
  setInterval(function () {
    if (!state.playing) return;
    var track = TRACKS[state.index];
    state.pos += 0.5;
    if (state.pos >= track.dur) {
      state.pos = 0;
      state.index = (state.index + 1) % TRACKS.length;
      renderTrack();
    }
    renderProgress();
  }, 500);

  /* ---------- 事件绑定 ---------- */
  document.addEventListener('click', function (e) {
    var tgl = e.target.closest('[data-toggle]');
    if (tgl) { toggle(); return; }

    var prev = e.target.closest('[data-prev]');
    if (prev) { skip(-1); return; }

    var next = e.target.closest('[data-next]');
    if (next) { skip(1); return; }

    var like = e.target.closest('[data-like]');
    if (like) {
      e.preventDefault();
      like.classList.toggle('liked');
      return;
    }

    var play = e.target.closest('[data-play]');
    if (play) {
      e.preventDefault();
      e.stopPropagation();
      var name = play.getAttribute('data-play');
      var idx = TRACKS.findIndex(function (t) { return t.title === name; });
      state.index = idx >= 0 ? idx : 0;
      state.pos = 0;
      state.playing = true;
      renderAll();
      save();
      return;
    }

    var lyric = e.target.closest('.lyric');
    if (lyric) {
      document.querySelectorAll('.lyric').forEach(function (l) {
        l.classList.remove('active', 'near');
      });
      lyric.classList.add('active');
      // 相邻句降低对比，营造"当前句"节奏
      var sibs = Array.prototype.slice.call(lyric.parentElement.children);
      var i = sibs.indexOf(lyric);
      [i - 1, i + 1].forEach(function (k) {
        if (sibs[k]) sibs[k].classList.add('near');
      });
      return;
    }

    var sw = e.target.closest('.switch');
    if (sw) { sw.classList.toggle('on'); return; }

    var row = e.target.closest('.tr-row');
    if (row && row.dataset.title) {
      var ri = TRACKS.findIndex(function (t) { return t.title === row.dataset.title; });
      if (ri >= 0) {
        state.index = ri;
        state.pos = 0;
        state.playing = true;
        renderAll();
        save();
        document.querySelectorAll('.tr-row').forEach(function (r) { r.classList.remove('active'); });
        row.classList.add('active');
      }
    }
  });

  /* 搜索快捷聚焦 */
  document.addEventListener('keydown', function (e) {
    var input = document.querySelector('.search input');
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (input) { input.focus(); input.select(); }
      return;
    }
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      toggle();
    }
  });

  /* 进度条点击跳转 */
  var range = document.querySelector('.range');
  if (range) {
    range.addEventListener('click', function (e) {
      var r = range.getBoundingClientRect();
      var pct = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      state.pos = pct * TRACKS[state.index].dur;
      renderProgress();
      save();
    });
  }

  /* ---------- 窗口控制：缩小 / 全屏 / 关闭 ---------- */
  var restoreChip = document.createElement('div');
  restoreChip.className = 'win-restore';
  restoreChip.innerHTML =
    '<svg class="icon" viewBox="0 0 512 512"><use href="#app-icon"/></svg>' +
    '<div>Aster<small>已最小化 · 点击恢复</small></div>';
  document.body.appendChild(restoreChip);

  var closedState = document.createElement('div');
  closedState.className = 'closed-state';
  closedState.innerHTML =
    '<svg class="icon" viewBox="0 0 512 512"><use href="#app-icon"/></svg>' +
    '<h2>Aster 已关闭</h2>' +
    '<p>音乐在后台继续，直到你重新打开它。</p>' +
    '<button data-reopen>重新打开</button>';
  document.body.appendChild(closedState);

  document.addEventListener('click', function (e) {
    if (document.body.classList.contains('is-min')) {
      document.body.classList.remove('is-min');
      return;
    }
    if (e.target.closest('[data-reopen]')) {
      document.body.classList.remove('is-closed');
      return;
    }
    var wc = e.target.closest('[data-wc]');
    if (!wc) return;
    var act = wc.getAttribute('data-wc');
    if (act === 'min') {
      document.body.classList.add('is-min');
    } else if (act === 'max') {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(function () {});
        }
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else if (act === 'close') {
      document.body.classList.add('is-closed');
    }
  });

  /* ---------- 播放队列弹出层 ---------- */
  var queueBtn = document.querySelector('[data-queue]');
  if (queueBtn) {
    var pop = document.createElement('div');
    pop.className = 'queues';
    pop.innerHTML =
      '<div class="queues-head"><strong>播放队列</strong><span data-clear>清空</span></div>' +
      '<div class="queues-list"></div>';
    document.body.appendChild(pop);
    var queueList = pop.querySelector('.queues-list');

    var renderQueue = function () {
      queueList.innerHTML = '';
      TRACKS.forEach(function (t, i) {
        var row = document.createElement('div');
        row.className = 'q-row' + (i === state.index ? ' current' : '');
        row.innerHTML =
          '<div class="q-cover c' + ((i % 5) + 1) + '"></div>' +
          '<div class="q-meta"><strong>' + t.title + '</strong><span>' + t.artist + '</span></div>' +
          (i === state.index
            ? '<span class="q-eq"><i></i><i></i><i></i></span>'
            : '<span class="q-time">' + fmt(t.dur) + '</span>');
        row.addEventListener('click', function () {
          state.index = i;
          state.pos = 0;
          state.playing = true;
          renderAll();
          renderQueue();
          save();
        });
        queueList.appendChild(row);
      });
    };

    queueBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      renderQueue();
      var open = pop.classList.toggle('open');
      queueBtn.classList.toggle('on', open);
    });

    pop.addEventListener('click', function (e) {
      if (e.target.closest('[data-clear]')) {
        queueList.innerHTML = '<div class="queues-empty">队列已清空</div>';
        return;
      }
      e.stopPropagation();
    });

    document.addEventListener('click', function () {
      pop.classList.remove('open');
      queueBtn.classList.remove('on');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        pop.classList.remove('open');
        queueBtn.classList.remove('on');
      }
    });
  }

  /* ---------- 全屏状态（绿键图标随之切换） ---------- */
  document.addEventListener('fullscreenchange', function () {
    document.documentElement.classList.toggle('is-fullscreen', !!document.fullscreenElement);
  });
  document.documentElement.classList.toggle('is-fullscreen', !!document.fullscreenElement);

  /* ---------- 设置页：标签点击定位 + 滚动联动 ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.set-tabs a'));
  if (tabs.length) {
    var page = document.querySelector('.set-page');
    var items = tabs.map(function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      return sec ? { a: a, sec: sec } : null;
    }).filter(Boolean);

    var activate = function (a) {
      tabs.forEach(function (t) { t.classList.remove('on'); });
      a.classList.add('on');
    };

    items.forEach(function (it) {
      it.a.addEventListener('click', function (e) {
        e.preventDefault();
        if (page) {
          // 以当前实际位置计算，避免依赖预存的 offset
          var top = it.sec.getBoundingClientRect().top
                  - page.getBoundingClientRect().top
                  + page.scrollTop
                  - 128;
          page.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
        activate(it.a);
      });
    });

    if (page) {
      var raf = null;
      var spy = function () {
        raf = null;
        var line = page.getBoundingClientRect().top + 150;
        var cur = items[0];
        items.forEach(function (it) {
          if (it.sec.getBoundingClientRect().top <= line) cur = it;
        });
        if (cur) activate(cur.a);
      };
      page.addEventListener('scroll', function () {
        if (!raf) raf = requestAnimationFrame(spy);
      }, { passive: true });
    }
  }

  /* ---------- 页面切换：不支持跨文档过渡时做淡出 ---------- */
  if (document.documentElement.classList.contains('no-vt')) {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      var a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;

      var url;
      try { url = new URL(a.getAttribute('href'), location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search && url.hash === location.hash) return;

      e.preventDefault();
      document.body.classList.add('page-leave');
      setTimeout(function () { location.href = url.href; }, 170);
    });
  }

  /* ---------- 侧边栏：一级菜单切换右侧二级菜单 ---------- */
  var railItems = Array.prototype.slice.call(document.querySelectorAll('.rail-item[data-section]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.subpanel[data-section]'));

  if (railItems.length && panels.length) {
    var section = (panels.filter(function (p) { return !p.hidden; })[0] || panels[0])
      .getAttribute('data-section');

    var showSection = function (next) {
      section = next;

      railItems.forEach(function (item) {
        item.classList.toggle('on', item.getAttribute('data-section') === next);
      });

      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-section') !== next;
      });
    };

    railItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var next = item.getAttribute('data-section');

        // 已在当前分组：再点一次进入该分组的默认页
        if (next === section) {
          location.href = next === 'music' ? 'index.html' : 'notes.html';
          return;
        }

        showSection(next);
      });
    });

    showSection(section);
  }

  /* ---------- 启动 ---------- */
  load();
  renderAll();
})();

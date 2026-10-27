/* ============================================================
   Aster — 小工具原型交互
   记事本 / 待办清单 / 专注，状态存在 localStorage
   ============================================================ */
(function () {
  'use strict';

  var NOTES_KEY = 'aster.notes';
  var TODOS_KEY = 'aster.todos';
  var FOCUS_KEY = 'aster.focus';

  /* ---------- 存储 ---------- */
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 无痕模式忽略 */ }
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function ago(ts) {
    var diff = Date.now() - ts;
    var min = Math.floor(diff / 60000);
    if (min < 1) return '刚刚';
    if (min < 60) return min + ' 分钟前';
    var hour = Math.floor(min / 60);
    if (hour < 24) return hour + ' 小时前';
    var day = Math.floor(hour / 24);
    if (day === 1) return '昨天';
    if (day < 7) return day + ' 天前';
    var d = new Date(ts);
    return (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日';
  }

  function countWords(text) {
    return text.replace(/\s+/g, '').length;
  }

  /* ---------- 种子数据 ---------- */
  function seedNotes() {
    return [
      {
        id: uid(),
        title: '雨声与和弦',
        body: '副歌那句「让紫色的光替我呼吸」，可以再压半拍。\n\n前奏只留雨声和低音，第四小节再进鼓。',
        at: Date.now() - 1000 * 60 * 60 * 3
      },
      {
        id: uid(),
        title: '下张合辑的顺序',
        body: '1. 山茶夜语\n2. 紫色霓虹\n3. 雨落窗台\n4. 只放给凌晨\n\n结尾不要 fade out，留一段空白。',
        at: Date.now() - 1000 * 60 * 60 * 26
      },
      {
        id: uid(),
        title: '深夜录音设备清单',
        body: '· 动圈麦 + 防喷罩\n· 关掉房间的灯，只留一盏台灯\n· 录之前先听 10 分钟雨声，把速度放慢',
        at: Date.now() - 1000 * 60 * 60 * 24 * 3
      }
    ];
  }

  function seedTodos() {
    return [
      { id: uid(), text: '整理「山茶与雨」的歌单顺序', done: false, at: Date.now() - 1000 * 60 * 60 * 5 },
      { id: uid(), text: '给新歌补一段专辑文案', done: false, at: Date.now() - 1000 * 60 * 90 },
      { id: uid(), text: '导出 10 月的播放记录', done: true, at: Date.now() - 1000 * 60 * 60 * 30 },
      { id: uid(), text: '买一包浅烘咖啡豆', done: false, at: Date.now() - 1000 * 60 * 20 }
    ];
  }

  function ensureNotes() {
    var notes = read(NOTES_KEY, null);
    if (!notes || !notes.length) {
      notes = seedNotes();
      write(NOTES_KEY, notes);
    }
    return notes;
  }

  function ensureTodos() {
    var todos = read(TODOS_KEY, null);
    if (!todos || !todos.length) {
      todos = seedTodos();
      write(TODOS_KEY, todos);
    }
    return todos;
  }

  /* ============================================================
     记事本
     ============================================================ */
  function initNotes() {
    var listEl = document.getElementById('noteList');
    if (!listEl) return;

    var summaryEl = document.getElementById('noteSummary');
    var titleEl = document.getElementById('noteTitle');
    var bodyEl = document.getElementById('noteBody');
    var updatedEl = document.getElementById('noteUpdated');
    var wordsEl = document.getElementById('noteWords');
    var deleteBtn = document.getElementById('noteDelete');
    var newBtn = document.getElementById('noteNew');

    var notes = ensureNotes();

    var currentId = notes.length ? notes[0].id : null;
    var saveTimer = null;

    function current() {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === currentId) return notes[i];
      }
      return null;
    }

    function saveSoon() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { write(NOTES_KEY, notes); }, 400);
    }

    function paintSummary() {
      if (summaryEl) summaryEl.textContent = notes.length + ' 条笔记';
    }

    function paintList() {
      listEl.innerHTML = '';
      if (!notes.length) {
        listEl.innerHTML = '<div class="note-list-empty">还没有笔记</div>';
        return;
      }

      notes.forEach(function (note) {
        var item = document.createElement('a');
        item.className = 'note-item' + (note.id === currentId ? ' on' : '');
        item.href = '#';
        item.dataset.id = note.id;
        item.innerHTML =
          '<h4></h4><p></p><time></time>';
        item.querySelector('h4').textContent = note.title.trim() || '未命名笔记';
        item.querySelector('p').textContent = (note.body || '').replace(/\s+/g, ' ').trim() || '空笔记';
        item.querySelector('time').textContent = ago(note.at);
        item.addEventListener('click', function (e) {
          e.preventDefault();
          select(note.id);
        });
        listEl.appendChild(item);
      });
    }

    function paintEditor() {
      var note = current();
      var disabled = !note;

      titleEl.disabled = disabled;
      bodyEl.disabled = disabled;
      deleteBtn.disabled = disabled;

      if (!note) {
        titleEl.value = '';
        bodyEl.value = '';
        updatedEl.textContent = '—';
        wordsEl.textContent = '0 字';
        return;
      }

      titleEl.value = note.title;
      bodyEl.value = note.body;
      updatedEl.textContent = '更新于 ' + ago(note.at);
      wordsEl.textContent = countWords(note.body) + ' 字';
    }

    function select(id) {
      currentId = id;
      paintList();
      paintEditor();
    }

    function touchActive() {
      var note = current();
      if (!note) return;

      note.at = Date.now();
      updatedEl.textContent = '刚刚更新';
      wordsEl.textContent = countWords(note.body) + ' 字';

      var item = listEl.querySelector('[data-id="' + note.id + '"]');
      if (item) {
        item.querySelector('h4').textContent = note.title.trim() || '未命名笔记';
        item.querySelector('p').textContent = (note.body || '').replace(/\s+/g, ' ').trim() || '空笔记';
        item.querySelector('time').textContent = ago(note.at);
      }
    }

    titleEl.addEventListener('input', function () {
      var note = current();
      if (!note) return;
      note.title = titleEl.value;
      touchActive();
      saveSoon();
    });

    bodyEl.addEventListener('input', function () {
      var note = current();
      if (!note) return;
      note.body = bodyEl.value;
      touchActive();
      saveSoon();
    });

    if (newBtn) {
      newBtn.addEventListener('click', function () {
        var note = { id: uid(), title: '', body: '', at: Date.now() };
        notes.unshift(note);
        currentId = note.id;
        paintSummary();
        paintList();
        paintEditor();
        titleEl.focus();
        write(NOTES_KEY, notes);
      });
    }

    deleteBtn.addEventListener('click', function () {
      var note = current();
      if (!note) return;

      notes = notes.filter(function (n) { return n.id !== note.id; });
      currentId = notes.length ? notes[0].id : null;
      paintSummary();
      paintList();
      paintEditor();
      write(NOTES_KEY, notes);
    });

    /* 键盘：⌘S 立即保存 */
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        write(NOTES_KEY, notes);
      }
    });

    paintSummary();
    paintList();
    paintEditor();
  }

  /* ============================================================
     待办清单
     ============================================================ */
  function initTodos() {
    var listEl = document.getElementById('todoList');
    if (!listEl) return;

    var inputEl = document.getElementById('todoInput');
    var addBtn = document.getElementById('todoAdd');
    var filtersEl = document.getElementById('todoFilters');
    var summaryEl = document.getElementById('todoSummary');
    var footEl = document.getElementById('todoFoot');
    var clearBtn = document.getElementById('todoClear');
    var doneEl = document.getElementById('todoDone');
    var openEl = document.getElementById('todoOpen');
    var rateEl = document.getElementById('todoRate');

    var todos = ensureTodos();

    var filter = 'all';

    function remaining() {
      return todos.filter(function (t) { return !t.done; }).length;
    }

    function save() { write(TODOS_KEY, todos); }

    function paint() {
      var visible = todos.filter(function (t) {
        if (filter === 'open') return !t.done;
        if (filter === 'done') return t.done;
        return true;
      });

      listEl.innerHTML = '';

      if (!visible.length) {
        listEl.innerHTML = '<div class="todo-empty">' +
          (filter === 'done' ? '还没有完成的事' : '这里空着，先加一件小事') + '</div>';
      } else {
        visible.forEach(function (todo) {
          var row = document.createElement('div');
          row.className = 'todo' + (todo.done ? ' done' : '');
          row.innerHTML =
            '<label class="ck"><input type="checkbox"><i></i><span class="todo-text"></span></label>' +
            '<span class="todo-time"></span>' +
            '<button class="todo-del" aria-label="删除"><svg class="icon"><use href="#i-plus"/></svg></button>';

          var box = row.querySelector('input');
          box.checked = todo.done;
          box.addEventListener('change', function () {
            todo.done = box.checked;
            save();
            paint();
          });

          row.querySelector('.todo-text').textContent = todo.text;
          row.querySelector('.todo-time').textContent = ago(todo.at);
          row.querySelector('.todo-del').addEventListener('click', function (e) {
            e.preventDefault();
            todos = todos.filter(function (t) { return t.id !== todo.id; });
            save();
            paint();
          });

          listEl.appendChild(row);
        });
      }

      var done = todos.length - remaining();
      if (summaryEl) summaryEl.textContent = done + ' / ' + todos.length + ' 已完成';
      if (doneEl) doneEl.textContent = done;
      if (openEl) openEl.textContent = remaining();
      if (rateEl) rateEl.textContent = (todos.length ? Math.round(done / todos.length * 100) : 0) + '%';
      if (footEl) {
        footEl.textContent = todos.length === 0
          ? '还没有待办'
          : (remaining() === 0 ? '今天的都做完了' : '还剩 ' + remaining() + ' 件');
      }
    }

    function add() {
      var text = inputEl.value.trim();
      if (!text) { inputEl.focus(); return; }

      todos.unshift({ id: uid(), text: text, done: false, at: Date.now() });
      inputEl.value = '';
      save();
      paint();
      inputEl.focus();
    }

    addBtn.addEventListener('click', add);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); add(); }
    });

    filtersEl.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-filter]');
      if (!chip) return;

      filter = chip.dataset.filter;
      Array.prototype.forEach.call(filtersEl.querySelectorAll('.chip'), function (c) {
        c.classList.toggle('on', c === chip);
      });
      paint();
    });

    clearBtn.addEventListener('click', function () {
      todos = todos.filter(function (t) { return !t.done; });
      save();
      paint();
    });

    paint();
  }

  /* ============================================================
     专注
     ============================================================ */
  function initFocus() {
    var timeEl = document.getElementById('focusTime');
    if (!timeEl) return;

    var stateEl = document.getElementById('focusState');
    var ringEl = document.getElementById('ringFill');
    var startBtn = document.getElementById('focusStart');
    var startText = document.getElementById('focusStartText');
    var resetBtn = document.getElementById('focusReset');
    var presetsEl = document.getElementById('focusPresets');
    var sessionsEl = document.getElementById('focusSessions');
    var minutesEl = document.getElementById('focusMinutes');
    var goalEl = document.getElementById('focusGoal');

    var CIRC = 2 * Math.PI * 104;
    var GOAL = 4;

    var today = new Date().toDateString();
    var stats = read(FOCUS_KEY, { date: today, sessions: 0, minutes: 0 });
    if (stats.date !== today) {
      stats = { date: today, sessions: 0, minutes: 0 };
      write(FOCUS_KEY, stats);
    }

    var preset = 25;
    var total = preset * 60;
    var left = total;
    var timer = null;
    var running = false;

    if (ringEl) {
      ringEl.style.strokeDasharray = CIRC;
      ringEl.style.strokeDashoffset = CIRC;
    }

    function paintStats() {
      if (sessionsEl) sessionsEl.textContent = stats.sessions;
      if (minutesEl) minutesEl.textContent = '共 ' + stats.minutes + ' 分钟';
      if (goalEl) goalEl.textContent = Math.min(GOAL, stats.sessions);
    }

    function paint() {
      var m = Math.floor(left / 60);
      var s = left % 60;
      timeEl.textContent = m + ':' + pad(s);

      if (ringEl) {
        var progress = total === 0 ? 0 : (total - left) / total;
        ringEl.style.strokeDashoffset = CIRC * (1 - progress);
      }

      startText.textContent = running ? '暂停' : (left === total ? '开始' : '继续');
      stateEl.textContent = running ? '专注中' : (left === total ? '准备开始' : '已暂停');

      document.title = running
        ? timeEl.textContent + ' · 专注中 · Aster'
        : '专注 · Aster';
    }

    function stop() {
      running = false;
      clearInterval(timer);
      timer = null;
      paint();
    }

    function tick() {
      left -= 1;
      if (left <= 0) {
        left = 0;
        stop();
        stats.sessions += 1;
        stats.minutes += preset;
        write(FOCUS_KEY, stats);
        paintStats();
        stateEl.textContent = '完成一段 · 休息一下';
        startText.textContent = '再来一段';
        left = total;
        timeEl.textContent = Math.floor(total / 60) + ':00';
        if (ringEl) ringEl.style.strokeDashoffset = CIRC;
        return;
      }
      paint();
    }

    startBtn.addEventListener('click', function () {
      if (running) { stop(); return; }

      if (left <= 0) left = total;
      running = true;
      timer = setInterval(tick, 1000);
      paint();
    });

    resetBtn.addEventListener('click', function () {
      stop();
      left = total;
      paint();
    });

    presetsEl.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-min]');
      if (!chip) return;

      preset = parseInt(chip.dataset.min, 10);
      total = preset * 60;
      left = total;
      stop();
      paint();

      Array.prototype.forEach.call(presetsEl.querySelectorAll('.preset'), function (c) {
        c.classList.toggle('on', c === chip);
      });
    });

    paintStats();
    paint();
  }

  /* ============================================================
     首页：问候语与工具统计
     ============================================================ */
  function initHome() {
    var greeting = document.getElementById('greeting');
    if (greeting) {
      var d = new Date();
      var h = d.getHours();
      var word = h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
      greeting.textContent = (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · ' + word;
    }

    var notesStat = document.querySelector('[data-notes-stat]');
    if (notesStat) {
      var notes = ensureNotes();
      if (!notes.length) {
        notesStat.textContent = '还没有笔记，写下第一句';
      } else {
        var latest = notes[0].title || '未命名笔记';
        notesStat.textContent = notes.length + ' 条笔记 · 最近「' + latest + '」';
      }
    }

    var todosStat = document.querySelector('[data-todos-stat]');
    if (todosStat) {
      var todos = ensureTodos();
      var open = todos.filter(function (t) { return !t.done; }).length;
      todosStat.textContent = todos.length === 0
        ? '今天还没有安排'
        : (open === 0 ? '今天的都做完了' : '还剩 ' + open + ' 件待办');
    }

    var focusStat = document.querySelector('[data-focus-stat]');
    if (focusStat) {
      var stats = read(FOCUS_KEY, { date: new Date().toDateString(), sessions: 0, minutes: 0 });
      var today = new Date().toDateString();
      focusStat.textContent = (stats.date === today && stats.sessions > 0)
        ? '今日已专注 ' + stats.minutes + ' 分钟'
        : '25 分钟，只做一件事';
    }
  }

  initNotes();
  initTodos();
  initFocus();
  initHome();
})();

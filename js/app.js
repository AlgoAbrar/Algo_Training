/* =========================================================
   AlgoAbrar Tracker — app.js
   DOM rendering + event wiring. Depends on data.js being
   loaded first (workoutPlan, rankSystem, UserStats, helpers).
========================================================= */

const userStats = new UserStats();
let selectedDay = todaysWorkoutDay();
let radarChartInstance = null;

/* ---------------- Small helpers ---------------- */

function $(id) { return document.getElementById(id); }

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, tone) {
  const container = $('toast-container');
  const el = document.createElement('div');
  const color = tone === 'good' ? 'var(--green)' : tone === 'warn' ? 'var(--ember-2)' : 'var(--brass)';
  el.className = 'toast card px-4 py-2.5 text-sm font-mono pointer-events-auto max-w-xs text-center';
  el.style.borderColor = color;
  el.style.color = 'var(--bone)';
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ---------------- Navigation ---------------- */

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const target = $('page-' + page);
  if (target) target.classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  if (page === 'progress') renderRadarChart();
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.page));
});

/* ---------------- Dashboard ---------------- */

function renderDashboard() {
  $('avatar-initial').textContent = (userStats.name || 'F').charAt(0).toUpperCase();
  $('profile-name').textContent = (userStats.name || 'Fighter').toUpperCase();

  const rank = getRankForLevel(userStats.level);
  const rankPill = $('rank-pill');
  rankPill.style.background = hexToRgba(rank.color, 0.16);
  rankPill.style.color = rank.color;
  $('rank-name').textContent = rank.name.toUpperCase();
  $('btn-avatar').style.color = rank.color;

  $('level-number').textContent = userStats.level;

  // const need = userStats.level >= 100 ? 0 : getXpRequiredForLevel(userStats.level);
  // $('xp-label').textContent = userStats.level >= 100 ? 'MAX LEVEL' : `${userStats.currentXp} / ${need}`;
  // const pct = userStats.level >= 100 ? 100 : Math.min(100, (userStats.currentXp / need) * 100);
  // $('xp-fill').style.width = pct + '%';
  const need = userStats.level >= 300 ? 0 : getXpRequiredForLevel(userStats.level);
  $('xp-label').textContent = userStats.level >= 300 ? 'MAX LEVEL' : `${userStats.currentXp} / ${need}`;
  const pct = userStats.level >= 300 ? 100 : Math.min(100, (userStats.currentXp / need) * 100);
  $('xp-fill').style.width = pct + '%';

  $('topbar-streak').textContent = userStats.currentStreak;
  $('stat-streak').textContent = userStats.currentStreak;
  $('stat-longest').textContent = userStats.longestStreak;
  $('stat-workouts').textContent = userStats.totalWorkoutsCompleted;
  $('stat-totalxp').textContent = userStats.totalXp;

  renderWeeklySchedule();
}

function renderWeeklySchedule() {
  const container = $('weekly-schedule');
  container.innerHTML = '';
  const today = todaysWorkoutDay();
  const todayDate = todayStr();

  DAY_ORDER.forEach(dayId => {
    const workout = workoutPlan[dayId];
    const doneToday = userStats.workoutHistory.some(h => h.date === todayDate && h.dayId === dayId);
    const isToday = dayId === today;

    const btn = document.createElement('button');
    btn.className = 'card p-2.5 flex flex-col items-center gap-1 relative';
    if (isToday) btn.style.borderColor = 'var(--ember)';
    btn.innerHTML = `
      ${isToday ? `<span class="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono px-1.5 py-0.5 rounded-full" style="background:var(--ember);color:var(--bone);">TODAY</span>` : ''}
      <span class="text-[9px] font-mono tracking-widest text-[var(--bone-dim)]">${dayId.slice(0, 3).toUpperCase()}</span>
      <span class="font-display text-xs leading-tight text-center">${workout.label}</span>
      ${doneToday
        ? `<span class="text-[8px] font-mono" style="color:var(--green);">✓ DONE</span>`
        : `<span class="text-[8px] font-mono text-[var(--bone-dim)]">${workout.exercises.length}</span>`}
    `;
    btn.addEventListener('click', () => {
      selectedDay = dayId;
      $('day-select').value = dayId;
      renderWorkoutPage();
      navigateTo('workout');
    });
    container.appendChild(btn);
  });
}

/* ---------------- Workout Logger ---------------- */

function populateDaySelect() {
  const select = $('day-select');
  select.innerHTML = '';
  DAY_ORDER.forEach(dayId => {
    const opt = document.createElement('option');
    opt.value = dayId;
    opt.textContent = `${workoutPlan[dayId].dayName} — ${workoutPlan[dayId].label}`;
    select.appendChild(opt);
  });
  select.value = selectedDay;
  select.addEventListener('change', () => {
    selectedDay = select.value;
    renderWorkoutPage();
  });
}

function renderDailyStructure() {
  const list = $('daily-structure-list');
  list.innerHTML = DAILY_STRUCTURE.map(step => `
    <div class="flex items-baseline justify-between gap-2 pb-2 border-b border-dashed border-[var(--line)] last:border-none last:pb-0">
      <div class="pr-2">
        <div class="text-sm font-semibold">${step.title}</div>
        <div class="text-xs text-[var(--bone-dim)] mt-0.5">${step.detail}</div>
      </div>
      <span class="font-mono text-[10px] text-[var(--brass)] flex-shrink-0">${step.duration}</span>
    </div>
  `).join('');
}

function renderWorkoutPage() {
  const workout = workoutPlan[selectedDay];
  $('workout-type-label').textContent = workout.label.toUpperCase();
  $('workout-day-label').textContent = workout.dayName;
  $('workout-goal-label').textContent = workout.goal;

  if (!userStats.inProgress[selectedDay]) userStats.inProgress[selectedDay] = [];
  const checked = userStats.inProgress[selectedDay];

  const list = $('exercise-list');
  list.innerHTML = '';
  workout.exercises.forEach(ex => {
    const isDone = checked.includes(ex.id);
    const scheme = ex.sets ? `${ex.sets}×${ex.reps}` : ex.reps;
    const card = document.createElement('div');
    card.className = 'exercise-card p-3.5' + (isDone ? ' done' : '');
    card.innerHTML = `
      <div class="flex items-start gap-3">
        <button class="check-circle ${isDone ? 'checked' : ''} mt-0.5" data-exercise-id="${ex.id}">
          ${isDone ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>' : ''}
        </button>
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline justify-between gap-2">
            <span class="font-display text-base">${ex.name}</span>
            <span class="font-mono text-xs text-[var(--brass)] flex-shrink-0">${scheme}</span>
          </div>
          <p class="text-xs text-[var(--bone-dim)] mt-1 leading-relaxed">${ex.formCues}</p>
        </div>
      </div>
    `;
    card.querySelector('.check-circle').addEventListener('click', () => toggleExercise(ex.id));
    list.appendChild(card);
  });

  updateSessionXp();
}

function toggleExercise(exerciseId) {
  const checked = userStats.inProgress[selectedDay];
  const pos = checked.indexOf(exerciseId);
  if (pos === -1) checked.push(exerciseId); else checked.splice(pos, 1);
  userStats.save();
  renderWorkoutPage();
}

function updateSessionXp() {
  const checked = userStats.inProgress[selectedDay] || [];
  const total = workoutPlan[selectedDay].exercises.length;
  let xp = checked.length * XP_PER_EXERCISE;
  if (checked.length === total && total > 0) xp += XP_COMPLETION_BONUS;
  $('session-xp').textContent = '+' + xp;
}

$('btn-complete-workout').addEventListener('click', completeWorkout);

function completeWorkout() {
  const checked = userStats.inProgress[selectedDay] || [];
  if (checked.length === 0) {
    showToast('Check off at least one item first.', 'warn');
    return;
  }

  const result = userStats.completeWorkout(selectedDay, checked);

  renderWorkoutPage();
  renderDashboard();

  if (result.leveledUp) {
    showLevelUpModal(result.newLevel);
  } else {
    showToast(`Workout logged. +${result.xpEarned} XP earned.`, 'good');
  }
}

function showLevelUpModal(newLevel) {
  $('levelup-number').textContent = newLevel;
  const rank = getRankForLevel(newLevel);
  const rankEl = $('levelup-rank');
  rankEl.textContent = rank.name.toUpperCase();
  rankEl.style.color = rank.color;
  $('modal-levelup').classList.remove('hidden');
}
$('btn-levelup-close').addEventListener('click', () => {
  $('modal-levelup').classList.add('hidden');
});

/* ---------------- Progress ---------------- */

function renderRadarChart() {
  const stats = userStats.getRadarData();
  const ctx = $('radar-chart').getContext('2d');
  const data = {
    labels: stats.map(s => s.category),
    datasets: [{
      data: stats.map(s => s.value),
      backgroundColor: 'rgba(196,64,42,0.22)',
      borderColor: '#E0553B',
      borderWidth: 2,
      pointBackgroundColor: '#C9A24B',
      pointBorderColor: '#0B0D0E',
      pointRadius: 4,
    }]
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: '#2A2D30' },
        grid: { color: '#2A2D30' },
        pointLabels: { color: '#EDE6D6', font: { family: 'JetBrains Mono', size: 10 } },
        ticks: { display: false, stepSize: 25 },
        suggestedMin: 0, suggestedMax: 100,
      }
    },
    plugins: { legend: { display: false } },
  };
  if (radarChartInstance) {
    radarChartInstance.data = data;
    radarChartInstance.options = options;
    radarChartInstance.update();
  } else {
    radarChartInstance = new Chart(ctx, { type: 'radar', data, options });
  }
}

$('measurement-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const entry = {};
  let hasValue = false;
  ['weight', 'bodyFat', 'chest', 'waist', 'arms', 'legs'].forEach(key => {
    const val = fd.get(key);
    if (val !== '' && val !== null) {
      entry[key] = parseFloat(val);
      hasValue = true;
    }
  });
  if (!hasValue) {
    showToast('Enter at least one measurement.', 'warn');
    return;
  }
  userStats.addProgress(entry);
  form.reset();
  renderLatestMeasurement();
  renderMeasurementHistory();
  renderPlanPage();
  showToast('Measurement saved.', 'good');
});

function renderLatestMeasurement() {
  const el = $('latest-measurement');
  const latest = userStats.getLatestProgress();
  if (!latest) {
    el.innerHTML = '<span class="text-sm text-[var(--bone-dim)]">No measurements logged yet.</span>';
    return;
  }
  const fields = [
    ['weight', 'WEIGHT', 'kg'], ['bodyFat', 'BODY FAT', '%'], ['chest', 'CHEST', 'cm'],
    ['waist', 'WAIST', 'cm'], ['arms', 'ARMS', 'cm'], ['legs', 'LEGS', 'cm'],
  ];
  el.innerHTML = `<div class="text-[10px] font-mono text-[var(--bone-dim)] tracking-widest mb-2">${latest.date}</div>
    <div class="grid grid-cols-3 gap-3">
      ${fields.filter(f => latest[f[0]] !== undefined).map(f => `
        <div>
          <div class="text-[9px] font-mono text-[var(--bone-dim)] tracking-widest">${f[1]}</div>
          <div class="font-display text-lg">${latest[f[0]]}<span class="text-xs text-[var(--bone-dim)] ml-0.5">${f[2]}</span></div>
        </div>
      `).join('')}
    </div>`;
}

function renderMeasurementHistory() {
  const container = $('measurement-history');
  container.innerHTML = '';
  if (userStats.progressHistory.length === 0) {
    container.innerHTML = '<div class="text-sm text-[var(--bone-dim)] px-1">Your logged sessions will show up here.</div>';
    return;
  }
  [...userStats.progressHistory].reverse().slice(0, 20).forEach(entry => {
    const row = document.createElement('div');
    row.className = 'card px-4 py-2.5 flex items-center justify-between';
    const parts = [];
    if (entry.weight !== undefined) parts.push(`${entry.weight}kg`);
    if (entry.bodyFat !== undefined) parts.push(`${entry.bodyFat}% BF`);
    if (entry.chest !== undefined) parts.push(`Chest ${entry.chest}cm`);
    if (entry.waist !== undefined) parts.push(`Waist ${entry.waist}cm`);
    if (entry.arms !== undefined) parts.push(`Arms ${entry.arms}cm`);
    if (entry.legs !== undefined) parts.push(`Legs ${entry.legs}cm`);
    row.innerHTML = `
      <span class="text-[11px] font-mono text-[var(--bone-dim)]">${entry.date}</span>
      <span class="text-xs font-mono text-right">${parts.join(' · ')}</span>
    `;
    container.appendChild(row);
  });
}

/* ---------------- Plan (nutrition / kegel / recovery) ---------------- */

function renderPlanPage() {
  const form = $('body-stats-form');
  form.elements.heightCm.value = userStats.heightCm;
  form.elements.weightKg.value = userStats.weightKg;
  form.elements.age.value = userStats.age;

  renderNutrition();
  renderKegelButton();

  $('nutrition-tips-list').innerHTML = NUTRITION_TIPS.map(tip => `
    <div class="card px-3.5 py-2.5 text-xs text-[var(--bone-dim)] leading-relaxed">${tip}</div>
  `).join('');

  $('flexibility-list').innerHTML = FLEXIBILITY_FOCUS.map(f => `
    <div class="card px-3.5 py-2.5 flex items-baseline justify-between gap-2">
      <span class="font-display text-sm">${f.area}</span>
      <span class="text-xs text-[var(--bone-dim)] text-right">${f.notes}</span>
    </div>
  `).join('');

  $('recovery-tips-list').innerHTML = RECOVERY_TIPS.map(tip => `
    <div class="card px-3.5 py-2.5 text-xs text-[var(--bone-dim)] leading-relaxed">${tip}</div>
  `).join('');
}

function renderNutrition() {
  const n = userStats.getNutrition();
  $('nutrition-target').textContent = n.target;
  $('nutrition-protein').textContent = n.proteinG + 'g';
  $('nutrition-fat').textContent = n.fatG + 'g';
  $('nutrition-carbs').textContent = n.carbG + 'g';
  $('nutrition-bmr').textContent = n.bmr + ' kcal';
  $('nutrition-tdee').textContent = n.tdee + ' kcal';
}

function renderKegelButton() {
  const btn = $('btn-log-kegel');
  if (userStats.didLogKegelToday()) {
    btn.textContent = "DONE FOR TODAY ✓";
    btn.disabled = true;
    btn.classList.add('btn-ghost');
    btn.classList.remove('btn-primary');
  } else {
    btn.textContent = "LOG TODAY'S SET";
    btn.disabled = false;
    btn.classList.remove('btn-ghost');
    btn.classList.add('btn-primary');
  }
}

$('body-stats-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const heightCm = parseFloat(fd.get('heightCm'));
  const weightKg = parseFloat(fd.get('weightKg'));
  const age = parseInt(fd.get('age'), 10);
  if (!heightCm || !weightKg || !age) {
    showToast('Fill in height, weight, and age.', 'warn');
    return;
  }
  userStats.updateBodyStats(heightCm, weightKg, age);
  renderNutrition();
  showToast('Targets recalculated.', 'good');
});

$('btn-log-kegel').addEventListener('click', () => {
  const result = userStats.logKegelSet();
  if (result.alreadyLogged) {
    showToast("Already logged today's set.", 'warn');
    return;
  }
  renderKegelButton();
  renderDashboard();
  if (result.leveledUp) {
    showLevelUpModal(result.newLevel);
  } else {
    showToast(`Kegel set logged. +${result.xpEarned} XP.`, 'good');
  }
});

/* ---------------- Videos ---------------- */

function parseYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/embed\/([^/?]+)/);
    if (m) return m[1];
  } catch (e) { /* invalid url */ }
  return null;
}

$('video-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const url = fd.get('url').trim();
  const title = fd.get('title').trim();
  const notes = fd.get('notes').trim();
  const videoId = parseYouTubeId(url);
  if (!videoId) {
    showToast('Could not read that YouTube link.', 'warn');
    return;
  }
  userStats.addVideo({ url, title, notes, videoId });
  form.reset();
  renderVideoLibrary();
  showToast('Added to your fight tape library.', 'good');
});

function renderVideoLibrary() {
  const container = $('video-list');
  container.innerHTML = '';
  if (userStats.videoLibrary.length === 0) {
    container.innerHTML = `
      <div class="card p-6 text-center">
        <div class="font-display text-lg text-[var(--bone-dim)]">NO TAPE YET</div>
        <p class="text-xs text-[var(--bone-dim)] mt-1">Add a YouTube link above to start building your library.</p>
      </div>`;
    return;
  }
  [...userStats.videoLibrary].reverse().forEach(video => {
    const card = document.createElement('div');
    card.className = 'card p-3 flex gap-3';
    card.innerHTML = `
      <a href="${video.url}" target="_blank" rel="noopener" class="flex-shrink-0">
        <img src="https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg" alt="" class="w-24 h-16 object-cover rounded-md border border-[var(--line)]">
      </a>
      <div class="flex-1 min-w-0">
        <a href="${video.url}" target="_blank" rel="noopener" class="font-display text-sm leading-tight block truncate">${escapeHtml(video.title)}</a>
        ${video.notes ? `<p class="text-xs text-[var(--bone-dim)] mt-1 line-clamp-2">${escapeHtml(video.notes)}</p>` : ''}
        <div class="flex items-center justify-between mt-1.5">
          <span class="text-[10px] font-mono text-[var(--bone-dim)]">${video.dateAdded}</span>
          <button class="text-[10px] font-mono text-[var(--ember-2)]" data-delete="${video.id}">REMOVE</button>
        </div>
      </div>
    `;
    card.querySelector('[data-delete]').addEventListener('click', () => {
      userStats.removeVideo(video.id);
      renderVideoLibrary();
    });
    container.appendChild(card);
  });
}

/* ---------------- Settings / Backup ---------------- */

$('btn-settings').addEventListener('click', () => $('modal-settings').classList.remove('hidden'));
$('btn-close-settings').addEventListener('click', () => $('modal-settings').classList.add('hidden'));

$('btn-export').addEventListener('click', () => {
  const payload = {
    name: userStats.name, heightCm: userStats.heightCm, weightKg: userStats.weightKg, age: userStats.age,
    level: userStats.level, totalXp: userStats.totalXp, currentXp: userStats.currentXp,
    currentStreak: userStats.currentStreak, longestStreak: userStats.longestStreak,
    totalWorkoutsCompleted: userStats.totalWorkoutsCompleted, lastWorkoutDate: userStats.lastWorkoutDate,
    lastKegelDate: userStats.lastKegelDate, workoutHistory: userStats.workoutHistory,
    progressHistory: userStats.progressHistory, videoLibrary: userStats.videoLibrary,
    inProgress: userStats.inProgress,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `algoabrar-tracker-backup-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Backup downloaded.', 'good');
});

$('input-import').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      userStats.replaceAll(parsed);
      renderAll();
      $('modal-settings').classList.add('hidden');
      showToast('Backup restored.', 'good');
    } catch (err) {
      showToast('That file could not be read.', 'warn');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

$('btn-reset').addEventListener('click', () => {
  if (confirm('This will permanently erase all progress on this device. Continue?')) {
    userStats.resetAll();
    renderAll();
    $('modal-settings').classList.add('hidden');
    showToast('All data reset.', 'good');
  }
});

/* ---------------- Rename ---------------- */

$('btn-rename').addEventListener('click', openRename);
$('btn-avatar').addEventListener('click', openRename);
function openRename() {
  $('input-rename').value = userStats.name || '';
  $('modal-rename').classList.remove('hidden');
  $('input-rename').focus();
}
$('btn-cancel-rename').addEventListener('click', () => $('modal-rename').classList.add('hidden'));
$('btn-save-rename').addEventListener('click', () => {
  const val = $('input-rename').value.trim();
  userStats.name = val || 'Fighter';
  userStats.save();
  renderDashboard();
  $('modal-rename').classList.add('hidden');
});

/* ---------------- Init ---------------- */

function renderAll() {
  renderDashboard();
  populateDaySelect();
  renderDailyStructure();
  renderWorkoutPage();
  renderLatestMeasurement();
  renderMeasurementHistory();
  renderPlanPage();
  renderVideoLibrary();
}

document.addEventListener('DOMContentLoaded', renderAll);

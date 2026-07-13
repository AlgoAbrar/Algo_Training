const STORAGE_KEY = 'algoabrar_tracker_v2';

const PUSH_EXERCISES = [
  { id: 'push-1', name: 'Smith Machine Incline Press', sets: 4, reps: '8-12', formCues: 'Bench at 30-45°, bar over upper chest, elbows tucked ~45°, press up explosively without locking out. Slight arch in lower back.' },
  { id: 'push-2', name: 'Dumbbell Flat Bench Press', sets: 3, reps: '10-12', formCues: 'Palms facing each other or slightly rotated, lower until elbows are just below shoulders at ~45°, press up and squeeze at the top.' },
  { id: 'push-3', name: 'Cable Crossover Machine', sets: 3, reps: '12-15', formCues: 'Slight elbow bend, bring handles together in front of chest, squeeze pecs, control the return. Vary the angle to hit different parts of the chest.' },
  { id: 'push-4', name: 'Dumbbell Overhead Shoulder Press', sets: 3, reps: '8-12', formCues: 'Seated with back support, press dumbbells overhead without locking elbows, core tight to protect the lower back.' },
  { id: 'push-5', name: 'Cable Lateral Raises', sets: 3, reps: '15', formCues: 'Slight elbow bend, raise arm out to the side leading with the elbow until parallel to the floor. No swinging.' },
  { id: 'push-6', name: 'Assisted Dip Machine', sets: 3, reps: 'to failure', formCues: 'Elbows tucked for triceps focus (or flared slightly for chest). Descend until shoulders are below elbows, press back up.' },
  { id: 'push-7', name: 'Cable Tricep Pushdowns', sets: 3, reps: '12-15', formCues: 'Elbows pinned to sides, push the bar down to full extension, squeeze triceps, control the return.' },
  { id: 'push-8', name: 'Battle Ropes (Conditioning)', sets: 5, reps: '30s work / 30s rest', formCues: 'Feet shoulder-width, knees soft, core engaged. Alternating waves, slams, or circles — generate power from the hips.' },
];

const PULL_EXERCISES = [
  { id: 'pull-1', name: 'Weight Assisted Pull-up Machine', sets: 4, reps: 'to failure', formCues: 'Wide grip for lats, closer grip for upper back/biceps. Pull chin above the bar, squeeze shoulder blades, control the descent.' },
  { id: 'pull-2', name: 'Cable Row Machine', sets: 3, reps: '10-12', formCues: 'Feet on the footplate, slight knee bend, pull the handle to your lower abdomen, squeeze shoulder blades, control the stretch forward.' },
  { id: 'pull-3', name: 'Plate Loaded Wide Pull Down', sets: 3, reps: '10-12', formCues: 'Overhand wide grip, lean back slightly, pull the bar to your upper chest focusing on the lats. Full range of motion.' },
  { id: 'pull-4', name: 'Pullover Machine', sets: 3, reps: '12-15', formCues: 'Elbows on the pads, extend arms overhead, pull the handle down in an arc toward your hips, engaging the lats.' },
  { id: 'pull-5', name: 'Pec Deck / Rear Delt Machine (Reverse Fly)', sets: 3, reps: '15', formCues: 'Handles at shoulder height, slight elbow bend, push handles back and out, squeezing shoulder blades together.' },
  { id: 'pull-6', name: 'EZ Curl Barbell Bicep Curls', sets: 3, reps: '10-12', formCues: 'Underhand grip, elbows tucked to sides, curl up squeezing the biceps at the top, no swinging.' },
  { id: 'pull-7', name: 'Arm Curl Machine', sets: 3, reps: '12-15', formCues: 'Elbows aligned with the pivot point, underhand grip, curl up squeezing the biceps, control the descent.' },
  { id: 'pull-8', name: 'Core: Abdominal Crunch Machine', sets: 4, reps: '15-20', formCues: 'Pads resting on chest and shins, contract the abs to crunch forward exhaling, control the return.' },
];

const LEGS_EXERCISES = [
  { id: 'legs-1', name: 'Hack Squat Machine', sets: 4, reps: '8-12', formCues: 'Shoulders under the pads, back flat against the pad, lower until thighs are parallel or slightly below, drive through the heels.' },
  { id: 'legs-2', name: 'Leg Press Machine', sets: 3, reps: '10-15', formCues: 'Feet shoulder-width, slightly higher on the platform to emphasize glutes/hamstrings, lower back stays pressed against the pad.' },
  { id: 'legs-3', name: 'Leg Extension Machine', sets: 3, reps: '12-15', formCues: 'Pad on shins above the ankles, extend fully squeezing quads at the top, control the descent.' },
  { id: 'legs-4', name: 'Leg Curl Machine', sets: 3, reps: '12-15', formCues: 'Pad on lower calves, curl legs toward glutes squeezing hamstrings, control the negative.' },
  { id: 'legs-5', name: 'Hip Abductor Machine', sets: 3, reps: '15-20', formCues: 'Legs against the pads, push outward against resistance engaging glute medius/minimus, control the return.' },
  { id: 'legs-6', name: 'Calf Raise Machine', sets: 4, reps: '15-20', formCues: 'Balls of feet on the platform edge, lower heels for a deep stretch, push up onto the balls of the feet, squeeze at the top.' },
  { id: 'legs-7', name: 'Treadmill Sprints (Conditioning)', sets: 10, reps: '30s sprint / 30s walk', formCues: 'Brisk walk into a full 30s sprint — upright posture, arms pumping, knees high — then 30s walk. Repeat.' },
];

const RECOVERY_EXERCISES = [
  { id: 'rec-1', name: 'Light Cardio', sets: null, reps: '30-45 min', formCues: 'Treadmill or bicycle at a conversational pace. Keeps blood flowing without adding fatigue.' },
  { id: 'rec-2', name: 'Full-Body Flexibility Session', sets: null, reps: '30-60 min', formCues: 'Yoga, Pilates, or a full stretching routine. Hold each stretch 30-60s — hips, hamstrings, shoulders, chest, spine.' },
  { id: 'rec-3', name: 'Foam Rolling / Self-Myofascial Release', sets: null, reps: '10-15 min', formCues: 'Roll major muscle groups worked this week to ease soreness and improve blood flow.' },
  { id: 'rec-4', name: 'Pelvic Floor (Kegel) Set', sets: 3, reps: '10-15', formCues: 'Contract the pelvic floor (PC muscle) for 5 seconds, relax for 5 seconds. Do this set anywhere — desk, car, couch.' },
];

const workoutPlan = {
  friday:    { id: 'friday',    dayName: 'Friday',    label: 'Recovery',  category: 'Recovery', goal: 'Joint health, pelvic floor strengthening', exercises: RECOVERY_EXERCISES },
  saturday:  { id: 'saturday',  dayName: 'Saturday',  label: 'Legs B',    category: 'Legs',     goal: 'Explosive leg power, cardiovascular endurance', exercises: LEGS_EXERCISES },
  sunday:    { id: 'sunday',    dayName: 'Sunday',    label: 'Pull B',    category: 'Pull',     goal: 'Grip strength, rotational core', exercises: PULL_EXERCISES },
  monday:    { id: 'monday',    dayName: 'Monday',    label: 'Push A',    category: 'Push',     goal: 'Upper body pushing strength, chest sculpting', exercises: PUSH_EXERCISES },
  tuesday:   { id: 'tuesday',   dayName: 'Tuesday',   label: 'Pull A',    category: 'Pull',     goal: 'Pulling power, posture correction', exercises: PULL_EXERCISES },
  wednesday: { id: 'wednesday', dayName: 'Wednesday', label: 'Legs A',    category: 'Legs',     goal: 'Lower body power, glute/leg leaning', exercises: LEGS_EXERCISES },
  thursday:  { id: 'thursday',  dayName: 'Thursday',  label: 'Push B',    category: 'Push',     goal: 'Hypertrophy, shoulder stability', exercises: PUSH_EXERCISES },
  };

const DAY_ORDER = [ 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const DAILY_STRUCTURE = [
  { title: 'Dynamic Warm-up', duration: '5-10 min', detail: '5 min light cardio (treadmill/bike) to raise heart rate, then arm circles, torso twists, leg swings, hip rotations.' },
  { title: 'Resistance Training', duration: '45-60 min', detail: 'The lifts below. Mind-muscle connection, controlled eccentrics, rest 60-90s between sets.' },
  { title: 'Conditioning & Core', duration: '10-15 min', detail: 'Battle ropes / sprints / core work — built into the exercise list below for each day.' },
  { title: 'Cool Down & Flexibility', duration: '10 min', detail: 'Static stretching for the muscles worked today. Hold each stretch 30-60s.' },
];

const FLEXIBILITY_FOCUS = [
  { area: 'Hips', notes: 'Hip flexor stretch, pigeon pose, butterfly stretch' },
  { area: 'Hamstrings', notes: 'Standing or seated hamstring stretch' },
  { area: 'Shoulders', notes: 'Cross-body arm stretch, overhead triceps stretch' },
  { area: 'Chest', notes: 'Doorway chest stretch' },
  { area: 'Spine', notes: 'Cat-cow, spinal twists' },
];

const NUTRITION_TIPS = [
  'Prioritize whole foods: lean proteins, complex carbs (oats, brown rice, quinoa, sweet potatoes), healthy fats (avocado, nuts, olive oil).',
  'Hydration: 3-4 liters of water a day.',
  'Meal timing: spread macros across 4-6 meals, protein + carbs around your workouts.',
  'Consistency: track intake initially so you learn real portion sizes.',
];

const RECOVERY_TIPS = [
  'Sleep 7-9 hours a night — this is when muscle repairs and hormones regulate.',
  'Manage stress: meditation, deep breathing, or time outdoors all help recovery and fat loss.',
  'Sharp pain is not the same as soreness. If something feels wrong, take an extra rest day.',
];

const rankSystem = [
  { minLevel: 1,   maxLevel: 4,   name: 'Rookie Fighter',    color: '#8B8D93' },
  { minLevel: 5,   maxLevel: 9,   name: 'Cage Warrior',      color: '#5B7FA6' },
  { minLevel: 10,  maxLevel: 14,  name: 'Iron Fist',         color: '#4FA3A8' },
  { minLevel: 15,  maxLevel: 19,  name: 'Shadow Striker',    color: '#7C5CAD' },
  { minLevel: 20,  maxLevel: 24,  name: 'Beast Mode',        color: '#B5442E' },
  { minLevel: 25,  maxLevel: 29,  name: 'Titan Warrior',     color: '#C4692B' },
  { minLevel: 30,  maxLevel: 34,  name: 'Combat Master',     color: '#C9A24B' },
  { minLevel: 35,  maxLevel: 39,  name: 'Apex Predator',     color: '#B8517A' },
  { minLevel: 40,  maxLevel: 49,  name: 'Legendary Fighter', color: '#6C5FA8' },
  { minLevel: 50,  maxLevel: 59,  name: 'Champion',          color: '#4E8B5C' },
  { minLevel: 60,  maxLevel: 74,  name: 'Hall of Famer',     color: '#8A5FA6' },
  { minLevel: 75,  maxLevel: 99,  name: 'Living Legend',     color: '#A6499A' },
  { minLevel: 100, maxLevel: 100, name: 'GOAT Fighter',      color: '#D4AF37' },
];

function getRankForLevel(level) {
  return rankSystem.find(tier => level >= tier.minLevel && level <= tier.maxLevel) || rankSystem[0];
}

const XP_PER_EXERCISE = 5;
const XP_COMPLETION_BONUS = 10;
const XP_KEGEL_BONUS = 5;

function getXpRequiredForLevel(level) {
  return Math.round(100 * Math.pow(1.1, level - 1));
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetween(a, b) {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db - da) / 86400000);
}

function todaysWorkoutDay() {
  const map = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };
  return map[new Date().getDay()];
}

function computeNutrition(heightCm, weightKg, age, activityFactor, deficit) {
  activityFactor = activityFactor || 1.725;
  deficit = deficit === undefined ? 750 : deficit;

  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const tdee = bmr * activityFactor;
  const target = Math.max(1200, tdee - deficit);

  const proteinG = 2.0 * weightKg;
  const proteinKcal = proteinG * 4;

  const fatKcal = target * 0.25;
  const fatG = fatKcal / 9;

  const carbKcal = Math.max(0, target - proteinKcal - fatKcal);
  const carbG = carbKcal / 4;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: Math.round(target),
    proteinG: Math.round(proteinG),
    proteinKcal: Math.round(proteinKcal),
    fatG: Math.round(fatG),
    fatKcal: Math.round(fatKcal),
    carbG: Math.round(carbG),
    carbKcal: Math.round(carbKcal),
  };
}

class UserStats {
  constructor() {
    this.load();
  }

  defaults() {
    return {
      name: 'Saiyedul Abrar',
      heightCm: 182,
      weightKg: 110,
      age: 24,
      level: 1,
      totalXp: 0,
      currentXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalWorkoutsCompleted: 0,
      lastWorkoutDate: null,
      lastKegelDate: null,
      workoutHistory: [],
      progressHistory: [],
      videoLibrary: [],
      inProgress: {}, 
    };
  }

  load() {
    let data = {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) data = JSON.parse(saved);
    } catch (e) {
      console.error('AlgoAbrar Tracker: failed to read saved data, starting fresh.', e);
    }
    Object.assign(this, this.defaults(), data);
  }

  save() {
    const { name, heightCm, weightKg, age, level, totalXp, currentXp, currentStreak,
      longestStreak, totalWorkoutsCompleted, lastWorkoutDate, lastKegelDate,
      workoutHistory, progressHistory, videoLibrary, inProgress } = this;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      name, heightCm, weightKg, age, level, totalXp, currentXp, currentStreak,
      longestStreak, totalWorkoutsCompleted, lastWorkoutDate, lastKegelDate,
      workoutHistory, progressHistory, videoLibrary, inProgress,
    }));
  }

  replaceAll(data) {
    Object.assign(this, this.defaults(), data);
    this.save();
  }

  resetAll() {
    Object.assign(this, this.defaults());
    this.save();
  }

  addXp(amount) {
    this.totalXp += amount;
    let levelsGained = 0;
    if (this.level < 300) {
      this.currentXp += amount;
      while (this.level < 300 && this.currentXp >= getXpRequiredForLevel(this.level)) {
        this.currentXp -= getXpRequiredForLevel(this.level);
        this.level += 1;
        levelsGained += 1;
      }
      if (this.level >= 300) {
        this.level = 300;
        this.currentXp = 0;
      }
    }
    this.save();
    return { leveledUp: levelsGained > 0, levelsGained, newLevel: this.level };
  }

  completeWorkout(dayId, completedExerciseIds) {
    const workout = workoutPlan[dayId];
    if (!workout) throw new Error(`Unknown workout day: ${dayId}`);

    const completedCount = completedExerciseIds.length;
    const fullyCompleted = completedCount === workout.exercises.length && completedCount > 0;
    let xpEarned = completedCount * XP_PER_EXERCISE;
    if (fullyCompleted) xpEarned += XP_COMPLETION_BONUS;

    const today = todayStr();
    if (this.lastWorkoutDate !== today) {
      if (this.lastWorkoutDate && daysBetween(this.lastWorkoutDate, today) === 1) {
        this.currentStreak += 1;
      } else {
        this.currentStreak = 1;
      }
      this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
      this.lastWorkoutDate = today;
    }

    this.totalWorkoutsCompleted += 1;
    this.workoutHistory.push({
      date: today,
      dayId,
      category: workout.category,
      label: workout.label,
      exercisesCompleted: completedCount,
      totalExercises: workout.exercises.length,
      xpEarned,
    });

    this.inProgress[dayId] = [];

    const levelResult = this.addXp(xpEarned);
    this.save();

    return { xpEarned, fullyCompleted, ...levelResult };
  }

  logKegelSet() {
    const today = todayStr();
    if (this.lastKegelDate === today) return { alreadyLogged: true, xpEarned: 0 };
    this.lastKegelDate = today;
    const result = this.addXp(XP_KEGEL_BONUS);
    return { alreadyLogged: false, xpEarned: XP_KEGEL_BONUS, ...result };
  }

  didLogKegelToday() {
    return this.lastKegelDate === todayStr();
  }

  addProgress(entry) {
    this.progressHistory.push({ date: todayStr(), ...entry });
    if (entry.weight) this.weightKg = entry.weight;
    this.save();
  }

  getLatestProgress() {
    return this.progressHistory.length ? this.progressHistory[this.progressHistory.length - 1] : null;
  }

  addVideo(video) {
    this.videoLibrary.push({ id: Date.now().toString(36), dateAdded: todayStr(), ...video });
    this.save();
  }

  removeVideo(id) {
    this.videoLibrary = this.videoLibrary.filter(v => v.id !== id);
    this.save();
  }

  getRadarData() {
    return [
      { category: 'Strength', value: Math.min(100, (this.level / 100) * 100) },
      { category: 'Endurance', value: Math.min(100, (this.currentStreak / 30) * 100) },
      { category: 'Consistency', value: Math.min(100, (this.totalWorkoutsCompleted / 150) * 100) },
      { category: 'Progress', value: Math.min(100, (this.totalXp / 10000) * 100) },
      { category: 'Dedication', value: Math.min(100, (this.longestStreak / 60) * 100) },
    ];
  }

  getNutrition() {
    return computeNutrition(this.heightCm, this.weightKg, this.age);
  }

  updateBodyStats(heightCm, weightKg, age) {
    if (heightCm) this.heightCm = heightCm;
    if (weightKg) this.weightKg = weightKg;
    if (age) this.age = age;
    this.save();
  }
}

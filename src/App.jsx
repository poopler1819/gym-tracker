import { useState, useMemo } from "react";

// ─── EXERCISE LIBRARY ───────────────────────────────────────────────────────
// Each exercise has: name, baseWeight, weeklyIncrease, sets, reps, alt, guide
// Weight = baseWeight + (weekNum - 1) * weeklyIncrease
// Smith machine assumed — bar ~15kg already factored into plate math shown in guide

const EXERCISES = {
  // ── CHEST ──────────────────────────────────────────────────────────────────
  "Flat Bench Press (Smith)": {
    sets: "4", reps: "6–8", baseWeight: 50, inc: 2.5, unit: "kg total",
    guide: "Set the Smith machine bar at chest height. Lie flat, grip slightly wider than shoulder-width. Lower bar to mid-chest (2–3 sec), press back up explosively. Keep shoulder blades pinched together throughout. Bar should touch just below your nipple line.",
    warmup: "1 set × 10 reps with bar only (15 kg), then 1 set × 6 reps at half your working weight before your main sets.",
    swaps: [
      "Dumbbell Flat Press",
      "Machine Chest Press",
      "Cable Chest Press (low pulley)",
      "Hammer Strength Chest Press",
      "Barbell Flat Press",
      "Cable Crossover (mid)",
    ],  },
  "Incline Bench Press (Smith)": {
    sets: "4", reps: "8–10", baseWeight: 40, inc: 2.5, unit: "kg total",
    guide: "Set bench to 30–45°. Grip slightly narrower than flat bench. Lower bar to upper chest (not neck). Incline targets the upper chest — the area that makes your chest look fuller from the front. Control the descent; don't bounce off the chest.",
    warmup: "1 set × 10 reps bar only, then 1 light set at 60% working weight.",
    swaps: [
      "Incline Dumbbell Press",
      "Machine Incline Press",
      "Cable Incline Press",
      "Hammer Strength Incline Press",
      "Smith Machine Incline Press (free)",
      "Landmine Press",
    ],  },
  "Low Cable Fly": {
    sets: "3", reps: "12–15", baseWeight: 8, inc: 1, unit: "kg each side",
    guide: "Set both cables at the lowest position (near the floor). Stand in the centre, step forward slightly. With a slight elbow bend, bring your hands upward and inward in an arc, meeting at chest height. This targets the lower chest — the same area that decline bench would — but without any decline setup. Squeeze the chest hard at the top, lower slowly. Keep your torso still throughout.",
    warmup: "No separate warm-up needed if done after press movements.",
    swaps: [
      "Pec Deck Machine (lower setting)",
      "Machine Chest Fly (lower arc)",
      "Cable Crossover (high to low)",
      "Dumbbell Fly (slight decline)",
      "Resistance Machine Fly",
      "Cable Crossover (arms low)",
    ],  },
  "Incline Dumbbell Press": {
    sets: "4", reps: "8–10", baseWeight: 14, inc: 1.25, unit: "kg each",
    guide: "Set bench to 30–45°. Hold dumbbells at chest level, elbows at 45° from your body. Press upward and slightly inward, bringing dumbbells close together at the top without touching. Lower slowly until you feel a full stretch in the upper chest. The incline angle targets the upper chest — the area that makes your chest look fuller when wearing a shirt. Control every rep.",
    warmup: "1 set × 10 reps at 8 kg each before working sets.",
    swaps: [
      "Incline Smith Machine Press",
      "Machine Incline Press",
      "Cable Incline Press",
      "Incline Barbell Press",
      "Hammer Strength Incline",
      "Seated Chest Press Machine",
    ],  },
  "Close-Grip Bench Press (Smith)": {
    sets: "3", reps: "8–10", baseWeight: 35, inc: 2.5, unit: "kg total",
    guide: "Hands shoulder-width or slightly closer. This shifts load from chest to triceps — great for overall pressing strength and arm thickness. Keep elbows tucked close to your body throughout. Full range of motion.",
    warmup: "1 set × 10 reps bar only.",
    swaps: [
      "EZ Bar Skull Crusher",
      "Tricep Rope Pushdown",
      "Machine Tricep Press",
      "Overhead Dumbbell Tricep Extension",
      "Cable Tricep Pushdown (bar)",
      "Dips (assisted machine)",
    ],  },
  "Cable Fly (mid)": {
    sets: "3", reps: "12–15", baseWeight: 10, inc: 1.25, unit: "kg each side",
    guide: "Set cables at chest height. Step forward, lean slightly. Arms wide like a hug, slight bend in elbows — keep that bend fixed. Bring hands together in front of chest, squeeze hard for 1 second at the peak. Slowly return. This is an isolation move — focus on feeling the chest, not just moving the weight.",
    warmup: "No separate warm-up needed if done after press movements.",
    swaps: [
      "Pec Deck Machine",
      "Dumbbell Fly (flat bench)",
      "Machine Chest Fly",
      "Cable Crossover (low to mid)",
      "Resistance Machine Fly",
      "Cable Crossover (high to mid)",
    ],  },
  "Dumbbell Pullover": {
    sets: "3", reps: "10–12", baseWeight: 14, inc: 1, unit: "kg",
    guide: "Lie across a bench (upper back only on bench, hips dropped). Hold one dumbbell with both hands above chest. Lower it back over your head in an arc, feeling a deep stretch in the chest and lats. Pull back over the chest. Keep a slight bend in elbows throughout. Great for expanding the ribcage.",
    warmup: "Start with 2–3 reps at a lighter weight to feel the stretch.",
    swaps: [
      "Cable Straight-Arm Pulldown",
      "Pec Deck Machine",
      "Machine Chest Press",
      "Cable Crossover (mid)",
      "Seated Chest Press Machine",
      "Hammer Strength Chest Press",
    ],  },
  "Push-Up (weighted)": {
    sets: "3", reps: "12–15", baseWeight: 10, inc: 2.5, unit: "kg plate on back",
    guide: "Have a training partner place a weight plate on your upper back, or use a weighted vest. Standard push-up form — hands slightly wider than shoulders, body in a straight line from head to heels. Lower chest to 2–3 cm from floor, press up fully. If no partner, do slow push-ups (3 sec down, 1 sec up) for the same effect.",
    warmup: "5 bodyweight push-ups before loading.",
    swaps: [
      "Machine Chest Press",
      "Dumbbell Flat Press",
      "Cable Chest Press",
      "Hammer Strength Chest Press",
      "Seated Chest Press Machine",
      "Bodyweight Push-Up (slow tempo)",
    ],  },

  // ── BACK ───────────────────────────────────────────────────────────────────
  "Double DB Bent-Over Row": {
    sets: "4", reps: "8–10", baseWeight: 18, inc: 1.25, unit: "kg each",
    guide: "Hinge at hips until torso is ~45°, slight knee bend. Hold dumbbells hanging down. Row both to your lower ribs simultaneously, driving elbows back and up. Squeeze shoulder blades together at the top for 1 second. Lower slowly. Keep your back flat — not rounded. This is your primary back thickness builder.",
    warmup: "1 set × 10 reps at 10 kg each before working sets.",
    swaps: [
      "Chest-Supported Dumbbell Row",
      "Machine Row",
      "T-Bar Row",
      "Landmine Row",
      "Cable Row (wide grip)",
      "Hammer Strength Row",
    ],  },
  "Bent-Over Barbell Row (Smith)": {
    sets: "4", reps: "8–10", baseWeight: 40, inc: 2.5, unit: "kg total",
    guide: "Hinge at hips, overhand grip just outside shoulder-width. Pull bar to your lower abs (not upper chest). Elbows drive back and slightly flared. The Smith machine keeps the path fixed — use this to your advantage by focusing entirely on squeezing the back. Return slowly.",
    warmup: "1 warm-up set × 10 reps bar only.",
    swaps: [
      "T-Bar Row",
      "Machine Row",
      "Landmine Row",
      "Chest-Supported Dumbbell Row",
      "Cable Row (underhand)",
      "Hammer Strength Row",
    ],  },
  "Lat Pulldown": {
    sets: "4", reps: "8–10", baseWeight: 35, inc: 2.5, unit: "kg stack",
    guide: "Sit with thighs under pads. Wide overhand grip. Lean back slightly (15°). Pull bar to your upper chest, leading with your elbows — imagine pushing your elbows into your back pockets. Squeeze lats at the bottom. Slowly return to full arm extension. This builds the V-taper width.",
    warmup: "1 set × 10 reps at 15 kg before working weight.",
    swaps: [
      "Assisted Pull-Up Machine",
      "Single-Arm Lat Pulldown",
      "Cable Row (wide grip)",
      "Hammer Strength Lat Pulldown",
      "Straight-Arm Pulldown",
      "Neutral-Grip Pulldown",
    ],  },
  "Pull-Up": {
    sets: "4", reps: "6–10", baseWeight: 0, inc: 0, unit: "bodyweight",
    guide: "Hang with overhand grip, hands shoulder-width or wider. Pull until chin clears the bar, driving elbows down and back. Fully extend arms at the bottom. If you can't do 6 reps, use the assisted pull-up machine or a resistance band looped over the bar for support. Add a weight belt when you can do 10+ easily.",
    warmup: "2–3 slow negatives (jump to top, lower slowly over 5 sec).",
    swaps: [
      "Assisted Pull-Up Machine",
      "Lat Pulldown",
      "Neutral-Grip Pulldown",
      "Single-Arm Lat Pulldown",
      "Hammer Strength Lat Pulldown",
      "Inverted Row (Smith Machine)",
    ],  },
  "Seated Cable Row": {
    sets: "3", reps: "10–12", baseWeight: 30, inc: 2.5, unit: "kg stack",
    guide: "Sit upright, feet on platform, slight knee bend. Row the handle to your navel — not your chest. Elbows travel back close to your sides. At the end position, squeeze shoulder blades together and hold 1 second. Return with control, letting your shoulder blades protract fully at the front — this full range builds more thickness.",
    warmup: "No separate warm-up if done after compound rows.",
    swaps: [
      "Chest-Supported Dumbbell Row",
      "Machine Row",
      "Hammer Strength Row",
      "Cable Row (underhand grip)",
      "Low Cable Row (wide grip)",
      "Landmine Row",
    ],  },
  "Single-Arm DB Row": {
    sets: "3", reps: "10–12 each", baseWeight: 20, inc: 1.25, unit: "kg",
    guide: "Place one hand and same-side knee on a bench. Other foot on floor. Dumbbell hanging. Row to your hip — not your armpit. Think about driving your elbow toward the ceiling. At the top, your elbow should be higher than your back. Hold 1 second, lower slowly. Keep hips square.",
    warmup: "2–3 reps at light weight to rehearse the path.",
    swaps: [
      "Cable Single-Arm Row",
      "Chest-Supported Dumbbell Row",
      "Machine Row",
      "Hammer Strength Single-Arm Row",
      "Landmine Single-Arm Row",
      "Low Cable Single-Arm Row",
    ],  },
  "Face Pull": {
    sets: "3", reps: "15", baseWeight: 12, inc: 1.25, unit: "kg stack",
    guide: "Set cable at forehead height, use rope attachment. Pull rope to your face, splitting it so hands go either side of your head, elbows flare high and wide. This directly targets the rear delts and rotator cuff — critical for shoulder health and posture. Go light and focus on the squeeze. Never rush this one.",
    warmup: "Not required — light weight used throughout.",
    swaps: [
      "Reverse Pec Deck",
      "Rear Delt Dumbbell Fly",
      "Cable Rear Delt Fly",
      "Bent-Over Rear Delt Fly",
      "Band Pull-Apart",
      "Machine Rear Delt Fly",
    ],  },
  "Straight-Arm Pulldown": {
    sets: "3", reps: "12", baseWeight: 15, inc: 1.25, unit: "kg stack",
    guide: "Stand at cable, high pulley, overhand grip on bar or rope. Arms almost fully extended (slight elbow bend). Pull down in an arc to your thighs, keeping arms straight throughout. This isolates the lat without involving biceps — great for building that lower lat fullness. Lean forward slightly.",
    warmup: "Not required.",
    swaps: [
      "Dumbbell Pullover (on bench)",
      "Cable Pullover",
      "Lat Pushdown (machine)",
      "Straight-Arm Cable Row",
      "Kneeling Cable Pulldown",
      "Incline Dumbbell Pullover",
    ],  },

  // ── ARMS ───────────────────────────────────────────────────────────────────
  "Barbell Bicep Curl": {
    sets: "4", reps: "8–10", baseWeight: 20, inc: 1.25, unit: "kg total",
    guide: "Stand with EZ bar or straight bar. Underhand grip shoulder-width. Keep elbows pinned to your sides — they should not move forward. Curl to chin height, squeeze hard, lower slowly over 3 seconds. The slow descent is where most of the growth happens. Don't swing your back.",
    warmup: "1 set × 12 reps at bar only (10 kg).",
    swaps: [
      "EZ Bar Curl",
      "Cable Curl (low pulley)",
      "Preacher Curl Machine",
      "Spider Curl",
      "Machine Bicep Curl",
      "Reverse Barbell Curl",
    ],  },
  "Incline Dumbbell Curl": {
    sets: "3", reps: "10–12", baseWeight: 9, inc: 1, unit: "kg each",
    guide: "Set bench to 60°. Sit back and let arms hang behind your torso. This pre-stretches the long head of the bicep for a deeper range of motion. Curl without letting elbows travel forward. You'll feel a much stronger stretch at the bottom than standing curls — that's the point. Go lighter than you think.",
    warmup: "Not required — done after barbell curls.",
    swaps: [
      "Cable Curl (low pulley)",
      "Preacher Curl Machine",
      "Spider Curl",
      "Single-Arm Cable Curl",
      "Machine Bicep Curl",
      "Scott Curl (EZ Bar)",
    ],  },
  "Hammer Curl": {
    sets: "4", reps: "10–12", baseWeight: 10, inc: 1, unit: "kg each",
    guide: "Neutral grip (palms facing each other). Curl upward keeping the neutral grip throughout — don't rotate your wrist. This targets the brachialis (muscle under the bicep) which pushes the bicep up, making your arms look thicker. Also builds forearm size. Keep elbows fixed.",
    warmup: "Not required.",
    swaps: [
      "Rope Cable Curl (neutral grip)",
      "Cross-Body Hammer Curl",
      "Machine Curl (neutral grip)",
      "Cable Hammer Curl",
      "Reverse Dumbbell Curl",
      "Zottman Curl",
    ],  },
  "Concentration Curl": {
    sets: "3", reps: "10–12 each", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Sit on bench, feet wide. Rest back of upper arm on your inner thigh. Curl to your shoulder. This eliminates all momentum — pure bicep contraction. Hold the peak for 2 seconds each rep. At 70 kg your biceps are relatively fresh — this should give you a serious pump. Go slowly.",
    warmup: "Not required.",
    swaps: [
      "Preacher Curl Machine",
      "Spider Curl",
      "Single-Arm Cable Curl",
      "Scott Curl (EZ Bar)",
      "Machine Bicep Curl",
      "Cable Drag Curl",
    ],  },
  "Skull Crusher (EZ Bar)": {
    sets: "4", reps: "8–10", baseWeight: 20, inc: 1.25, unit: "kg total",
    guide: "Lie on bench, EZ bar above your chest. Lower bar to your forehead (hence the name) by bending elbows only — upper arms stay vertical and still. Press back up to full extension. This is the best long-head tricep builder. Keep upper arms perpendicular to the floor throughout. Use a spotter if possible.",
    warmup: "1 set × 10 reps at bar only (10 kg).",
    swaps: [
      "Cable Overhead Tricep Extension",
      "Dumbbell Skull Crusher",
      "Machine Tricep Extension",
      "EZ Bar Close-Grip Press",
      "Cable Tricep Pushdown (bar)",
      "Dips (assisted machine)",
    ],  },
  "Tricep Rope Pushdown": {
    sets: "4", reps: "10–12", baseWeight: 15, inc: 1.25, unit: "kg stack",
    guide: "Set cable high, attach rope. Grip rope with thumbs up. Elbows pinned to sides. Push rope down, splitting the ends apart at the bottom for full contraction. Hold 1 second at full extension. Return slowly. Keep your torso slightly forward leaning. This hits the lateral head — the part that makes your tricep look wide from the back.",
    warmup: "Not required.",
    swaps: [
      "V-Bar Pushdown",
      "Single-Arm Cable Pushdown",
      "Machine Tricep Press",
      "Cable Tricep Pushdown (bar)",
      "Reverse-Grip Pushdown",
      "Dips (assisted machine)",
    ],  },
  "Overhead Tricep Extension": {
    sets: "3", reps: "10–12", baseWeight: 14, inc: 1, unit: "kg",
    guide: "Hold one dumbbell with both hands overhead, elbows framing your head. Lower behind your head by bending only at the elbows, feeling a deep stretch in the long head of the tricep. Press back up. The long head runs along the back of the arm — training it overhead is the only way to fully stretch it. Keep your elbows pointed forward, not flaring.",
    warmup: "2 slow reps at lighter weight to feel the stretch.",
    swaps: [
      "EZ Bar Overhead Extension",
      "Cable Overhead Tricep Extension",
      "Machine Tricep Extension",
      "Single-Arm Overhead Extension",
      "Dumbbell Kickback",
      "Tricep Dips (assisted machine)",
    ],  },
  "Reverse Curl": {
    sets: "2", reps: "15", baseWeight: 10, inc: 0.5, unit: "kg total",
    guide: "Overhand grip (palms facing down) on a barbell or EZ bar. Curl the same way as a normal curl. This targets the brachioradialis and forearm extensors — building forearm thickness that makes your whole arm look bigger. Keep elbows fixed. Much lighter than regular curls is normal.",
    warmup: "Not required.",
    swaps: [
      "EZ Bar Reverse Curl",
      "Cable Reverse Curl",
      "Wrist Roller",
      "Dumbbell Reverse Curl",
      "Barbell Wrist Curl",
      "Cable Wrist Curl",
    ],  },

  // ── LEGS ───────────────────────────────────────────────────────────────────
  "Step-Up with Dumbbells": {
    sets: "4", reps: "10–12 each", baseWeight: 12, inc: 1.25, unit: "kg each hand",
    guide: "Use a bench or box at knee height. Step up leading with one foot, drive through the heel to stand fully upright on the box. Step down with control. Alternate legs. Keep your torso upright. This unilateral movement corrects muscle imbalances between legs. Feel the quad and glute of the working leg — don't push off the back foot.",
    warmup: "5 bodyweight step-ups each leg before loading.",
    swaps: [
      "Smith Machine Step-Up",
      "Smith Machine Reverse Lunge",
      "Hack Squat Machine",
      "Leg Press (single leg)",
      "Split Squat (Smith Machine)",
      "Cable Pull-Through",
    ],  },
  "Glute Bridge / Hip Thrust": {
    sets: "4", reps: "10–12", baseWeight: 30, inc: 2.5, unit: "kg across hips",
    guide: "Upper back on bench, barbell across hip crease (use a pad). Feet flat on floor, shoulder-width. Drive hips up by squeezing glutes hard — not by hyperextending your lower back. At the top, shins should be vertical, body forms a straight line from knees to shoulders. Hold top position 1–2 seconds. Lower slowly. This is the best glute builder and directly improves your leg appearance.",
    warmup: "10 bodyweight glute bridges on the floor before loading.",
    swaps: [
      "Smith Machine Hip Thrust",
      "Cable Pull-Through",
      "Single-Leg Hip Thrust",
      "Glute Kickback Machine",
      "Cable Glute Kickback",
      "45° Hyperextension",
    ],  },
  "Leg Press": {
    sets: "4", reps: "10–12", baseWeight: 60, inc: 5, unit: "kg",
    guide: "Feet shoulder-width on the platform, toes pointed slightly out. Lower the sled until knees reach 90° — not beyond. Press back up without locking your knees at the top. Keep your lower back pressed against the seat throughout. Don't let your hips lift off the seat at the bottom. A wider, higher foot placement targets glutes more; lower targets quads.",
    warmup: "1 set × 15 reps at 30 kg before working weight.",
    swaps: [
      "Hack Squat Machine",
      "Smith Machine Reverse Lunge",
      "Single-Leg Leg Press",
      "Pendulum Squat Machine",
      "V-Squat Machine",
      "Belt Squat Machine",
    ],  },
  "Walking Lunge": {
    sets: "4", reps: "10 each leg", baseWeight: 10, inc: 1.25, unit: "kg each hand",
    guide: "Take a big step forward, lower your rear knee toward the floor (without touching), then step your back foot forward to begin the next rep. Keep your torso upright and core braced. Front knee should track over your toes, not caving inward. This builds quad size, glute size, and functional strength simultaneously. If space is limited, do reverse lunges in place.",
    warmup: "10 bodyweight lunges each leg before loading.",
    swaps: [
      "Smith Machine Reverse Lunge",
      "Smith Machine Forward Lunge",
      "Split Squat (Smith Machine)",
      "Hack Squat Machine",
      "Single-Leg Leg Press",
      "Cable Split Squat",
    ],  },
  "Leg Curl (Machine)": {
    sets: "4", reps: "10–12", baseWeight: 25, inc: 2.5, unit: "kg stack",
    guide: "Lie face down on the machine. Pad should sit just above your heels. Curl your heels toward your glutes, squeezing the hamstrings hard at the top. Lower slowly — hamstrings respond extremely well to slow eccentrics. Don't let your hips lift off the pad at the top. Point toes slightly to feel the outer hamstring more.",
    warmup: "1 set × 15 reps at 10 kg.",
    swaps: [
      "Seated Leg Curl Machine",
      "Single-Leg Lying Leg Curl",
      "Cable Leg Curl (ankle strap)",
      "Nordic Hamstring Curl",
      "Swiss Ball Leg Curl",
      "Glute Ham Raise",
    ],  },
  "Leg Extension (Machine)": {
    sets: "3", reps: "12–15", baseWeight: 25, inc: 2.5, unit: "kg stack",
    guide: "Sit upright, pad across your shins just above the ankle. Extend legs to full lockout, squeezing the quad hard at the top. Hold 1 second. Lower slowly. This isolates the quad fully — no other muscle can help here. Don't swing or use momentum. If you feel knee discomfort, reduce range of motion slightly.",
    warmup: "Not required if done after leg press.",
    swaps: [
      "Single-Leg Extension",
      "Cable Leg Extension (ankle strap)",
      "Leg Press (close stance)",
      "Hack Squat Machine (narrow)",
      "VMO Step-Up",
      "Terminal Knee Extension (cable)",
    ],  },
  "Standing Calf Raise": {
    sets: "4", reps: "15–20", baseWeight: 40, inc: 5, unit: "kg",
    guide: "Use the calf raise machine or a Smith machine. Position toes forward or slightly outward. Rise onto the balls of your feet as high as possible, hold 1 second at the top. Lower slowly below the starting point for a full stretch — this bottom stretch is crucial for calf growth. Calves are worked in daily walking so they need both heavy weight and high reps to grow. Go slow.",
    warmup: "10 bodyweight calf raises on a step edge.",
    swaps: [
      "Seated Calf Raise Machine",
      "Leg Press Calf Raise",
      "Smith Machine Calf Raise",
      "Single-Leg Calf Raise",
      "Donkey Calf Raise Machine",
      "Cable Calf Raise",
    ],  },

  // ── SHOULDERS ──────────────────────────────────────────────────────────────
  "Seated DB Shoulder Press": {
    sets: "4", reps: "8–10", baseWeight: 16, inc: 1.25, unit: "kg each",
    guide: "Sit on a bench with back support. Dumbbells at ear level, elbows at 90°. Press straight up, bringing dumbbells close together at the top without touching. Lower back to ear level — full range. This is your primary shoulder mass builder. Don't press in front of your face — press straight overhead. Keep core tight to protect lower back.",
    warmup: "1 set × 10 reps at 8 kg each.",
    swaps: [
      "Smith Machine Overhead Press",
      "Machine Shoulder Press",
      "Cable Shoulder Press",
      "Barbell Overhead Press",
      "Hammer Strength Shoulder Press",
      "Landmine Press",
    ],  },
  "Arnold Press": {
    sets: "4", reps: "10–12", baseWeight: 12, inc: 1, unit: "kg each",
    guide: "Start with dumbbells at chin height, palms facing you. As you press up, rotate your wrists so palms face forward at the top. Reverse on the way down. This rotation recruits all three heads of the deltoid in one movement — front, side, and rear. Go lighter than your regular press. Control the rotation — don't just spin the wrists.",
    warmup: "Not required if done after shoulder press.",
    swaps: [
      "Smith Machine Overhead Press",
      "Machine Shoulder Press",
      "Cable Shoulder Press",
      "Dumbbell Shoulder Press (partial rotation)",
      "Barbell Overhead Press",
      "Hammer Strength Shoulder Press",
    ],  },
  "Lateral Raise": {
    sets: "4", reps: "12–15", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Stand with dumbbells at sides. Raise arms out to the sides to shoulder height — lead with your elbows, not your hands. At the top, tilt dumbbells slightly so the front is lower than the back (like pouring a jug) — this protects the shoulder joint. Lower slowly over 3 seconds. This builds the side delt, which makes your shoulders look wide. Never go heavy here — strict form only.",
    warmup: "Not required.",
    swaps: [
      "Cable Lateral Raise",
      "Machine Lateral Raise",
      "Single-Arm Cable Lateral Raise",
      "Leaning Cable Lateral Raise",
      "Cable Y-Raise",
      "Machine Lateral Raise (unilateral)",
    ],  },
  "Front Raise": {
    sets: "3", reps: "12", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Stand, dumbbells in front of thighs. Raise one or both arms forward to shoulder height, thumbs up. Keep a slight elbow bend. Lower slowly. This targets the anterior (front) deltoid. Many people skip this but it adds fullness to the front of the shoulder. Don't swing; use a strict controlled movement.",
    warmup: "Not required.",
    swaps: [
      "Cable Front Raise",
      "Plate Front Raise",
      "Incline Dumbbell Front Raise",
      "Cable Crossover Front Raise",
      "Barbell Front Raise",
      "Machine Front Raise",
    ],  },
  "Rear Delt Fly": {
    sets: "4", reps: "12–15", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Hinge forward at hips 90°, dumbbells hanging below chest. Raise arms out to sides like wings, leading with elbows. Squeeze shoulder blades together at the top. Lower slowly. The rear delt is the most neglected shoulder muscle — training it balances the shoulder, improves posture, and gives your shoulder that 3D rounded look from behind. Go light and feel every rep.",
    warmup: "Not required.",
    swaps: [
      "Reverse Pec Deck",
      "Cable Rear Delt Fly",
      "Face Pull",
      "Bent-Over Dumbbell Rear Fly",
      "Machine Rear Delt Fly",
      "Cable W-Raise",
    ],  },
  "Dumbbell Shrug": {
    sets: "4", reps: "12–15", baseWeight: 20, inc: 2.5, unit: "kg each",
    guide: "Hold heavy dumbbells at sides. Shrug your shoulders straight up toward your ears as high as possible. Hold 1 second at the top. Lower slowly. Do not roll your shoulders — straight up and down only. This builds the trapezius which connects your neck to your shoulders, giving that powerful thick upper back look.",
    warmup: "Not required.",
    swaps: [
      "Smith Machine Shrug",
      "Barbell Shrug",
      "Cable Shrug",
      "Machine Shrug",
      "Hex Bar Shrug",
      "Behind-Back Barbell Shrug",
    ],  },
  "Cable Lateral Raise": {
    sets: "3", reps: "12–15 each", baseWeight: 5, inc: 0.5, unit: "kg each side",
    guide: "Stand side-on to a low cable. Cross-body grip (use the hand furthest from the cable). Raise arm out to the side to shoulder height. The cable provides constant tension throughout the movement — unlike dumbbells which are easiest at the bottom. This is why it's worth doing after dumbbell laterals. Keep elbow slightly bent, wrist neutral.",
    warmup: "Not required.",
    swaps: [
      "Machine Lateral Raise",
      "Single-Arm Cable Lateral Raise",
      "Leaning Cable Lateral Raise",
      "Cable Y-Raise",
      "Machine Lateral Raise (unilateral)",
      "Dumbbell Lateral Raise",
    ],  },
};

// ─── WEEKLY EXERCISE ROTATION ────────────────────────────────────────────────
// Each muscle group rotates exercises each week for variety + full development
// REST_TIME: compound = 120s, isolation = 90s
const REST_TIMES = {
  "Flat Bench Press (Smith)": 120,
  "Incline Bench Press (Smith)": 120,
  "Close-Grip Bench Press (Smith)": 120,
  "Incline Dumbbell Press": 120,
  "Low Cable Fly": 90,
  "Cable Fly (mid)": 90,
  "Double DB Bent-Over Row": 120,
  "Bent-Over Barbell Row (Smith)": 120,
  "Lat Pulldown": 120,
  "Pull-Up": 120,
  "Seated Cable Row": 90,
  "Single-Arm DB Row": 90,
  "Face Pull": 90,
  "Straight-Arm Pulldown": 90,
  "Barbell Bicep Curl": 90,
  "Incline Dumbbell Curl": 90,
  "Hammer Curl": 90,
  "Concentration Curl": 90,
  "Skull Crusher (EZ Bar)": 90,
  "Tricep Rope Pushdown": 90,
  "Overhead Tricep Extension": 90,
  "Step-Up with Dumbbells": 120,
  "Glute Bridge / Hip Thrust": 120,
  "Leg Press": 120,
  "Walking Lunge": 120,
  "Leg Curl (Machine)": 90,
  "Leg Extension (Machine)": 90,
  "Standing Calf Raise": 90,
  "Seated DB Shoulder Press": 120,
  "Arnold Press": 120,
  "Lateral Raise": 90,
  "Rear Delt Fly": 90,
  "Front Raise": 90,
  "Dumbbell Shrug": 90,
  "Cable Lateral Raise": 90,
};

const WEEKLY_ROTATION = {
  Chest: [
    ["Flat Bench Press (Smith)", "Incline Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Low Cable Fly"],         // Wk1
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Incline Dumbbell Press", "Low Cable Fly", "Cable Fly (mid)"],          // Wk2
    ["Flat Bench Press (Smith)", "Incline Bench Press (Smith)", "Close-Grip Bench Press (Smith)", "Cable Fly (mid)", "Low Cable Fly"],  // Wk3
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Incline Dumbbell Press", "Low Cable Fly", "Cable Fly (mid)"],          // Wk4
    ["Flat Bench Press (Smith)", "Close-Grip Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Low Cable Fly"],       // Wk5
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Low Cable Fly", "Incline Dumbbell Press", "Cable Fly (mid)"],          // Wk6
    ["Flat Bench Press (Smith)", "Incline Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Low Cable Fly"],          // Wk7
    ["Incline Bench Press (Smith)", "Close-Grip Bench Press (Smith)", "Flat Bench Press (Smith)", "Low Cable Fly", "Cable Fly (mid)"],  // Wk8
    ["Flat Bench Press (Smith)", "Incline Bench Press (Smith)", "Incline Dumbbell Press", "Low Cable Fly", "Cable Fly (mid)"],          // Wk9
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Low Cable Fly"],          // Wk10 deload
  ],
  Back: [
    ["Lat Pulldown", "Double DB Bent-Over Row", "Seated Cable Row", "Single-Arm DB Row", "Face Pull"],       // Wk1
    ["Pull-Up", "Bent-Over Barbell Row (Smith)", "Single-Arm DB Row", "Seated Cable Row", "Face Pull"],      // Wk2
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Seated Cable Row", "Single-Arm DB Row", "Face Pull"], // Wk3
    ["Pull-Up", "Double DB Bent-Over Row", "Bent-Over Barbell Row (Smith)", "Seated Cable Row", "Face Pull"],// Wk4
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Single-Arm DB Row", "Seated Cable Row", "Face Pull"], // Wk5
    ["Pull-Up", "Double DB Bent-Over Row", "Bent-Over Barbell Row (Smith)", "Single-Arm DB Row", "Face Pull"],// Wk6
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Seated Cable Row", "Double DB Bent-Over Row", "Face Pull"], // Wk7
    ["Pull-Up", "Double DB Bent-Over Row", "Single-Arm DB Row", "Seated Cable Row", "Face Pull"],            // Wk8
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Double DB Bent-Over Row", "Seated Cable Row", "Face Pull"], // Wk9
    ["Lat Pulldown", "Double DB Bent-Over Row", "Seated Cable Row", "Single-Arm DB Row", "Face Pull"],       // Wk10 deload
  ],
  Arms: [
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Concentration Curl"],         // Wk1
    ["Incline Dumbbell Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Overhead Tricep Extension", "Concentration Curl"], // Wk2
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Incline Dumbbell Curl", "Tricep Rope Pushdown", "Concentration Curl"],// Wk3
    ["Hammer Curl", "Skull Crusher (EZ Bar)", "Barbell Bicep Curl", "Overhead Tricep Extension", "Tricep Rope Pushdown"],  // Wk4
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Incline Dumbbell Curl"],      // Wk5
    ["Incline Dumbbell Curl", "Skull Crusher (EZ Bar)", "Concentration Curl", "Tricep Rope Pushdown", "Overhead Tricep Extension"], // Wk6
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Concentration Curl"],         // Wk7
    ["Incline Dumbbell Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Overhead Tricep Extension", "Tricep Rope Pushdown"],// Wk8
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Incline Dumbbell Curl", "Tricep Rope Pushdown", "Concentration Curl"],// Wk9
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Concentration Curl"],         // Wk10 deload
  ],
  Legs: [
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)"],              // Wk1
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Leg Curl (Machine)", "Walking Lunge"],              // Wk2
    ["Step-Up with Dumbbells", "Leg Press", "Glute Bridge / Hip Thrust", "Walking Lunge", "Leg Curl (Machine)"],              // Wk3
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Leg Press", "Walking Lunge"],              // Wk4
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)"],              // Wk5
    ["Step-Up with Dumbbells", "Leg Press", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Walking Lunge"],              // Wk6
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)"],              // Wk7
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Leg Press", "Walking Lunge"],              // Wk8
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)"],              // Wk9
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)"],              // Wk10 deload
  ],
  Shoulders: [
    ["Seated DB Shoulder Press", "Arnold Press", "Lateral Raise", "Rear Delt Fly", "Dumbbell Shrug"],   // Wk1
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Front Raise"],      // Wk2
    ["Seated DB Shoulder Press", "Arnold Press", "Rear Delt Fly", "Lateral Raise", "Dumbbell Shrug"],   // Wk3
    ["Seated DB Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Arnold Press", "Front Raise"],      // Wk4
    ["Seated DB Shoulder Press", "Arnold Press", "Lateral Raise", "Rear Delt Fly", "Dumbbell Shrug"],   // Wk5
    ["Seated DB Shoulder Press", "Rear Delt Fly", "Arnold Press", "Lateral Raise", "Front Raise"],      // Wk6
    ["Seated DB Shoulder Press", "Arnold Press", "Lateral Raise", "Rear Delt Fly", "Dumbbell Shrug"],   // Wk7
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Front Raise"],      // Wk8
    ["Seated DB Shoulder Press", "Arnold Press", "Rear Delt Fly", "Lateral Raise", "Dumbbell Shrug"],   // Wk9
    ["Seated DB Shoulder Press", "Arnold Press", "Lateral Raise", "Rear Delt Fly", "Dumbbell Shrug"],   // Wk10 deload
  ],
};

// ─── SCHEDULE BUILDER ────────────────────────────────────────────────────────
// 100 training days + rest days (2-on 1-rest = ~150 total days)
const buildSchedule = () => {
  const groups = ["Chest", "Back", "Arms", "Legs", "Shoulders"];
  const schedule = [];
  let groupIdx = 0;
  let trainingCount = 0;
  let totalDay = 1;
  while (trainingCount < 100) {
    // 2 training days
    for (let t = 0; t < 2 && trainingCount < 100; t++) {
      const g = groups[groupIdx % groups.length];
      const weekNum = Math.ceil((trainingCount + 1) / 10); // 10 training days per "week" for progression
      schedule.push({ day: totalDay, group: g, trainingDay: trainingCount + 1, weekNum });
      groupIdx++;
      trainingCount++;
      totalDay++;
    }
    // 1 rest day
    schedule.push({ day: totalDay, group: "Rest", trainingDay: null, weekNum: null });
    totalDay++;
  }
  return schedule;
};

const SCHEDULE = buildSchedule();

// ─── WEIGHT CALCULATOR ───────────────────────────────────────────────────────
const getWeight = (exName, weekNum) => {
  const ex = EXERCISES[exName];
  if (!ex) return "";
  const isDeload = weekNum === 10;
  const raw = ex.baseWeight + (weekNum - 1) * ex.inc;
  const actual = isDeload ? Math.round(raw * 0.6 * 2) / 2 : raw;
  return `${actual} ${ex.unit}`;
};

const getPlateNote = (exName, weekNum) => {
  const ex = EXERCISES[exName];
  if (!ex || !ex.unit.includes("total")) return null;
  const isDeload = weekNum === 10;
  const raw = ex.baseWeight + (weekNum - 1) * ex.inc;
  const total = isDeload ? Math.round(raw * 0.6 * 2) / 2 : raw;
  const barWeight = 15; // Smith machine
  const platesTotal = total - barWeight;
  if (platesTotal <= 0) return `Bar only (${barWeight} kg Smith bar)`;
  const perSide = platesTotal / 2;
  return `Smith bar ${barWeight} kg + ${perSide} kg per side`;
};

// ─── MUSCLE GROUP CONFIG ──────────────────────────────────────────────────────
const MG = {
  Chest:     { color: "#1A6FA8", bg: "#EEF4FB", icon: "🏋️" },
  Back:      { color: "#6B3FA0", bg: "#F4EEFB", icon: "🔱" },
  Arms:      { color: "#E8533F", bg: "#FFF0EE", icon: "💪" },
  Legs:      { color: "#2F7E4A", bg: "#EEF8F2", icon: "🦵" },
  Shoulders: { color: "#C07A20", bg: "#FBF5EE", icon: "🏅" },
  Rest:      { color: "#888888", bg: "#F5F5F5", icon: "🛌" },
};

const TIPS = {
  Chest:     "Retract your shoulder blades before every press. A full stretch at the bottom of each rep triggers more muscle growth than a partial range.",
  Back:      "Every pull starts with the elbow, not the hand. Imagine your hands as hooks — your back does the work.",
  Arms:      "Slow the eccentric (lowering) to 3 seconds on every curl and extension. That's where most of the growth stimulus comes from.",
  Legs:      "Drive through your full foot, not just the toes. Control every descent — don't let gravity do the work.",
  Shoulders: "Keep lateral raises strict and light. Going heavy ruins form and shifts load away from the delts. Feel the muscle, not just the movement.",
  Rest:      "Muscles grow during rest, not during training. Today is just as important as a training day.",
};

const CARDIO_GUIDE = `After every training session: 15–20 min incline treadmill walk at gradient 8–10%, speed 5–6 km/h. This keeps your heart rate in the fat-burning zone (65–75% max HR) without burning muscle. Alternatively: 10 min staircase climb or 15 min stationary bike at moderate resistance. Do NOT do intense cardio right after leg day — a brisk walk is sufficient.`;

const WARMUP_GENERAL = `Before every session: 5 min light cardio (treadmill walk or bike) to raise your core temperature. Then do 10 arm circles each direction, 10 hip circles, 10 shoulder rolls. Always do 1–2 warm-up sets of your first exercise at 40–50% of your working weight before your main sets.`;

const WEEK_LABELS = {
  1: { label: "Foundation", note: "Learn every movement. Form over weight.", color: "#2F7E4A" },
  2: { label: "Build", note: "Add 2.5 kg to upper body, 5 kg to lower body if Week 1 felt manageable.", color: "#1A6FA8" },
  3: { label: "Build", note: "Same increases if reps were clean. Push to leave only 1 rep in the tank.", color: "#1A6FA8" },
  4: { label: "Overload", note: "Introduce drop sets on your last set of each exercise.", color: "#C07A20" },
  5: { label: "Overload", note: "Push your heaviest sets yet. Form must stay clean.", color: "#C07A20" },
  6: { label: "Peak", note: "Max effort week. Go heavier on compound lifts.", color: "#E8533F" },
  7: { label: "Peak", note: "Volume peak — add an extra set to your main lifts.", color: "#E8533F" },
  8: { label: "Peak", note: "Final heavy push. Note your best weights this week.", color: "#E8533F" },
  9: { label: "Taper", note: "Reduce volume slightly, keep intensity high.", color: "#6B3FA0" },
  10: { label: "Deload", note: "Weights drop to 60%. High reps, perfect form. Let your body recover and consolidate gains.", color: "#888" },
};

// ─── APP ──────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "workout-completed-v1";
const EDITS_KEY = "workout-edits-v1";
const ALT_SWAPS_KEY = "workout-alt-swaps-v1";
const PROGRESSION_KEY = "workout-progression-v1";
const EX_DONE_KEY = "workout-ex-done-v1";
const ADMIN_PIN = "1989";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [filter, setFilter] = useState("All");
  const [openGuide, setOpenGuide] = useState(null);
  const [showCardio, setShowCardio] = useState(false);
  const [showWarmup, setShowWarmup] = useState(false);
  const [showProgression, setShowProgression] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ── Edit mode state ──
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // customEdits: { "MuscleGroup-weekIdx-exIdx": { name, sets, reps, weight } }
  const [customEdits, setCustomEdits] = useState({});
  const [editTarget, setEditTarget] = useState(null); // { muscleGroup, weekIdx, exIdx, exName }
  const [editForm, setEditForm] = useState({ name: "", sets: "", reps: "", weight: "" });
  const [editSaved, setEditSaved] = useState(false);

  // Load saved progress + edits on mount
  useState(() => {
    (async () => {
      try {
        const v1 = localStorage.getItem(STORAGE_KEY);
        if (v1) {
          const parsed = JSON.parse(v1);
          if (Array.isArray(parsed)) setCompleted(new Set(parsed));
        }
      } catch (e) {}
      try {
        const v2 = localStorage.getItem(EDITS_KEY);
        if (v2) {
          const parsed = JSON.parse(v2);
          if (parsed && typeof parsed === "object") setCustomEdits(parsed);
        }
      } catch (e) {}
    })();
  }, []);

  const saveToStorage = (newSet) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]));
      const now = new Date();
      setLastSaved(`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`);
    } catch (e) {}
  };

  const saveEditsToStorage = (newEdits) => {
    try { localStorage.setItem(EDITS_KEY, JSON.stringify(newEdits)); } catch (e) {}
  };

  // PIN handlers
  const handlePinSubmit = () => {
    if (pinInput === ADMIN_PIN) {
      setAdminUnlocked(true);
      setEditMode(true);
      setShowPinEntry(false);
      setPinInput("");
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const lockEditMode = () => {
    setAdminUnlocked(false);
    setEditMode(false);
    setEditTarget(null);
  };

  // Edit helpers
  const getEditKey = (muscleGroup, weekIdx, exIdx) => `${muscleGroup}-${weekIdx}-${exIdx}`;

  const getExerciseData = (muscleGroup, weekIdx, exIdx) => {
    const key = getEditKey(muscleGroup, weekIdx, exIdx);
    const base = WEEKLY_ROTATION[muscleGroup]?.[weekIdx]?.[exIdx];
    if (!base) return null;
    const custom = customEdits[key];
    const baseEx = EXERCISES[base] || {};
    return {
      name: custom?.name || base,
      sets: custom?.sets || baseEx.sets || "3",
      reps: custom?.reps || baseEx.reps || "10",
      weight: custom?.weight || "",
      isCustom: !!custom,
      originalName: base,
    };
  };

  const openEditForm = (muscleGroup, weekIdx, exIdx) => {
    const ex = getExerciseData(muscleGroup, weekIdx, exIdx);
    if (!ex) return;
    setEditTarget({ muscleGroup, weekIdx, exIdx });
    setEditForm({ name: ex.name, sets: ex.sets, reps: ex.reps, weight: ex.weight });
    setEditSaved(false);
  };

  const saveEdit = () => {
    if (!editTarget) return;
    const { muscleGroup, weekIdx, exIdx } = editTarget;
    const key = getEditKey(muscleGroup, weekIdx, exIdx);
    const originalName = WEEKLY_ROTATION[muscleGroup]?.[weekIdx]?.[exIdx];
    const isUnchanged =
      editForm.name === originalName &&
      editForm.sets === (EXERCISES[originalName]?.sets || "") &&
      editForm.reps === (EXERCISES[originalName]?.reps || "") &&
      editForm.weight === "";
    const newEdits = { ...customEdits };
    if (isUnchanged) {
      delete newEdits[key];
    } else {
      newEdits[key] = { ...editForm };
    }
    setCustomEdits(newEdits);
    saveEditsToStorage(newEdits);
    setEditTarget(null);
    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 2000);
  };

  const resetEdit = (muscleGroup, weekIdx, exIdx) => {
    const key = getEditKey(muscleGroup, weekIdx, exIdx);
    const newEdits = { ...customEdits };
    delete newEdits[key];
    setCustomEdits(newEdits);
    saveEditsToStorage(newEdits);
  };

  const selEntry = selected != null ? SCHEDULE[selected] : null;
  const group = selEntry ? MG[selEntry.group] : null;

  const trainingDone = useMemo(() => [...completed].filter(i => SCHEDULE[i]?.group !== "Rest").length, [completed]);
  const restDone = useMemo(() => [...completed].filter(i => SCHEDULE[i]?.group === "Rest").length, [completed]);
  const progressPct = Math.round((trainingDone / 100) * 100);

  const filteredEntries = useMemo(() => {
    if (filter === "All") return SCHEDULE.map((s, i) => ({ ...s, idx: i }));
    return SCHEDULE.map((s, i) => ({ ...s, idx: i })).filter(s => s.group === filter);
  }, [filter]);

  const toggleComplete = (idx) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      saveToStorage(next);
      return next;
    });
  };

  const resetProgress = () => {
    setCompleted(new Set());
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setShowResetConfirm(false);
    setLastSaved(null);
  };



  // ── Exercise done ticks ──
  // exDone: { "scheduleIdx-exIdx": true }
  const [exDone, setExDone] = useState({});

  useState(() => {
    (async () => {
      try {
        const v = localStorage.getItem(EX_DONE_KEY);
        if (v) { const p = JSON.parse(v); if (p && typeof p === "object") setExDone(p); }
      } catch (e) {}
    })();
  }, []);

  const saveExDone = (newDone) => {
    try { localStorage.setItem(EX_DONE_KEY, JSON.stringify(newDone)); } catch (e) {}
  };

  const toggleExDone = (schedIdx, exIdx, exName) => {
    const key = `${schedIdx}-${exIdx}`;
    const newDone = { ...exDone };
    if (newDone[key]) {
      delete newDone[key];
      cancelTimer();
    } else {
      newDone[key] = true;
      if (exName) startRestTimer(exName);
    }
    setExDone(newDone);
    saveExDone(newDone);
  };

  const isExDone = (schedIdx, exIdx) => !!exDone[`${schedIdx}-${exIdx}`];

  // ── Rest timer state ──
  const [restTimer, setRestTimer] = useState(null); // { seconds, total, exName }
  const [timerInterval, setTimerInterval] = useState(null);

  const startRestTimer = (exName) => {
    if (timerInterval) clearInterval(timerInterval);
    const seconds = REST_TIMES[exName] || 90;
    setRestTimer({ seconds, total: seconds, exName });
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (!prev || prev.seconds <= 1) {
          clearInterval(interval);
          return null;
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const cancelTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setRestTimer(null);
    setTimerInterval(null);
  };

  // ── Swap selection state ──
  // swapSelections: { "scheduleIdx-exIdx": "Exercise Name" | null }
  const [swapSelections, setSwapSelections] = useState({});
  const [openSwapPicker, setOpenSwapPicker] = useState(null); // "scheduleIdx-exIdx"

  useState(() => {
    (async () => {
      try {
        const v = localStorage.getItem(ALT_SWAPS_KEY);
        if (v) { const p = JSON.parse(v); if (p && typeof p === "object") setSwapSelections(p); }
      } catch (e) {}
    })();
  }, []);

  const saveSwapSelections = (newSwaps) => {
    try { localStorage.setItem(ALT_SWAPS_KEY, JSON.stringify(newSwaps)); } catch (e) {}
  };

  const selectSwap = (schedIdx, exIdx, exerciseName) => {
    const key = `${schedIdx}-${exIdx}`;
    const newSwaps = { ...swapSelections };
    if (exerciseName === null) {
      delete newSwaps[key];
    } else {
      newSwaps[key] = exerciseName;
    }
    setSwapSelections(newSwaps);
    saveSwapSelections(newSwaps);
    setOpenSwapPicker(null);
  };

  const getSwapSelection = (schedIdx, exIdx) => swapSelections[`${schedIdx}-${exIdx}`] || null;
  const isUsingAlt = (schedIdx, exIdx) => !!swapSelections[`${schedIdx}-${exIdx}`];

  // ── Auto-progression state ──
  // progression: { "exName": { suggestedWeight: number, lastRating: string, streak: number } }
  const [progression, setProgression] = useState({});

  useState(() => {
    (async () => {
      try {
        const v = localStorage.getItem(PROGRESSION_KEY);
        if (v) { const p = JSON.parse(v); if (p && typeof p === "object") setProgression(p); }
      } catch (e) {}
    })();
  }, []);

  const saveProgression = (newProg) => {
    try { localStorage.setItem(PROGRESSION_KEY, JSON.stringify(newProg)); } catch (e) {}
  };

  // Called when a log is saved — compute new progression suggestion
  const computeProgression = (exName, logEntries, baseWeightStr) => {
    if (!logEntries || !logEntries.length) return;
    const ratings = logEntries.map(s => s.feeling).filter(Boolean);
    if (!ratings.length) return;

    // Parse the current base weight (strip non-numeric except dot)
    const currentWeight = parseFloat((baseWeightStr || "0").replace(/[^0-9.]/g, "")) || 0;
    const unit = (baseWeightStr || "").replace(/[0-9. ]/g, "").trim();
    const isBothHands = unit.includes("each") || unit.includes("each hand");
    const increment = isBothHands ? 1 : 2.5;

    const easyCount = ratings.filter(r => r === "easy").length;
    const hardCount = ratings.filter(r => r === "hard").length;
    const goodCount = ratings.filter(r => r === "good").length;
    const total = ratings.length;

    let newWeight = currentWeight;
    let advice = "";
    let badge = "";

    if (easyCount >= Math.ceil(total * 0.6)) {
      // Majority easy — increase
      newWeight = currentWeight + increment;
      advice = `Most sets felt easy. Try ${newWeight} ${unit} next session.`;
      badge = "🟢 Go heavier";
    } else if (hardCount >= Math.ceil(total * 0.6)) {
      // Majority hard — decrease
      newWeight = Math.max(currentWeight - increment, 0);
      advice = `Most sets were a struggle. Drop to ${newWeight} ${unit} next session and focus on form.`;
      badge = "🔴 Ease back";
    } else {
      // Mixed / good — stay the same
      newWeight = currentWeight;
      advice = `Good effort. Stay at ${currentWeight} ${unit} next session and aim to complete all reps cleanly.`;
      badge = "🟡 Stay the same";
    }

    const newProg = {
      ...progression,
      [exName]: { suggestedWeight: newWeight, unit, advice, badge, lastUpdated: Date.now() }
    };
    setProgression(newProg);
    saveProgression(newProg);
  };

  const weekGroups = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < Math.ceil(SCHEDULE.length / 7); w++) {
      weeks.push(SCHEDULE.slice(w * 7, w * 7 + 7).map((s, i) => ({ ...s, idx: w * 7 + i })));
    }
    return weeks;
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#FAFAF9", color: "#1C1C1C" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "#111", color: "#fff", padding: "20px 16px 16px" }}>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#666", marginBottom: 4 }}>Hypertrophy Programme</div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Look Bigger. Get Leaner.</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>178 cm · 70 kg · Smith Machine · 2 on / 1 rest</div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {[["Training", `${trainingDone}/100`], ["Rest", `${restDone} done`], ["Progress", `${progressPct}%`]].map(([l, v]) => (
            <div key={l} style={{ flex: 1, background: "#1a1a1a", borderRadius: 10, padding: "8px 0", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{v}</div>
              <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, background: "#222", borderRadius: 8, height: 7, overflow: "hidden" }}>
          <div style={{ width: `${progressPct}%`, background: "#E8533F", height: "100%", borderRadius: 8, transition: "width 0.5s" }} />
        </div>

        {/* Save status + reset */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={{ fontSize: 10, color: lastSaved ? "#4CAF50" : "#555" }}>
            {lastSaved ? `✅ Saved at ${lastSaved}` : "Progress auto-saves when you mark days"}
          </div>
          {!showResetConfirm ? (
            <button onClick={() => setShowResetConfirm(true)}
              style={{ background: "none", border: "1px solid #333", color: "#666", borderRadius: 6, padding: "3px 10px", fontSize: 10, cursor: "pointer" }}>
              Reset all
            </button>
          ) : (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#E8533F" }}>Erase all progress?</span>
              <button onClick={resetProgress}
                style={{ background: "#E8533F", border: "none", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 10, cursor: "pointer", fontWeight: 700 }}>
                Yes
              </button>
              <button onClick={() => setShowResetConfirm(false)}
                style={{ background: "#333", border: "none", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 10, cursor: "pointer" }}>
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── QUICK GUIDES ── */}
      <div style={{ background: "#1a1a2e", padding: "10px 16px", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {[
          ["🔥 Cardio Guide", showCardio, setShowCardio],
          ["🤸 Warm-Up Guide", showWarmup, setShowWarmup],
          ["📈 Progression", showProgression, setShowProgression],
        ].map(([label, open, setter]) => (
          <button key={label} onClick={() => setter(!open)}
            style={{ background: open ? "#E8533F" : "#2a2a3e", color: open ? "#fff" : "#aaa", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            {label}
          </button>
        ))}
        {/* Edit mode button */}
        <button onClick={() => { if (adminUnlocked) { lockEditMode(); } else { setShowPinEntry(!showPinEntry); setPinError(false); setPinInput(""); }}}
          style={{ marginLeft: "auto", background: editMode ? "#4CAF50" : "#2a2a3e", color: editMode ? "#fff" : "#aaa",
            border: editMode ? "none" : "1px solid #444", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
          {editMode ? "✏️ Editing ON — Lock" : "⚙️ Edit Workout"}
        </button>
      </div>

      {/* PIN Entry */}
      {showPinEntry && !adminUnlocked && (
        <div style={{ background: "#12122a", padding: "14px 16px", borderBottom: "2px solid #6B3FA0" }}>
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8 }}>Enter PIN to unlock edit mode</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="password" inputMode="numeric" maxLength={4} value={pinInput}
              onChange={e => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={e => e.key === "Enter" && handlePinSubmit()}
              placeholder="····"
              style={{ background: "#222", border: `1px solid ${pinError ? "#E8533F" : "#444"}`, color: "#fff",
                borderRadius: 8, padding: "8px 14px", fontSize: 18, letterSpacing: 6, width: 90, textAlign: "center" }} />
            <button onClick={handlePinSubmit}
              style={{ background: "#6B3FA0", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Unlock
            </button>
            <button onClick={() => { setShowPinEntry(false); setPinInput(""); }}
              style={{ background: "#222", color: "#888", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
          {pinError && <div style={{ fontSize: 11, color: "#E8533F", marginTop: 6 }}>Incorrect PIN. Try again.</div>}
        </div>
      )}

      {/* Edit mode banner */}
      {editMode && (
        <div style={{ background: "#1a3a1a", padding: "8px 16px", borderBottom: "2px solid #4CAF50", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 11, color: "#4CAF50", fontWeight: 700 }}>
            ✏️ Edit Mode ON — tap any exercise then tap ✏️ to customise it
          </div>
          {editSaved && <div style={{ fontSize: 11, color: "#4CAF50" }}>✅ Saved!</div>}
        </div>
      )}

      {/* Edit Form Modal */}
      {editTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#fff", width: "100%", borderRadius: "16px 16px 0 0", padding: "20px 16px 32px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>✏️ Edit Exercise</div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>
              {editTarget.muscleGroup} Day · Week {editTarget.weekIdx + 1} · Exercise {editTarget.exIdx + 1}
            </div>

            {[
              ["Exercise name", "name", "text", "e.g. Dumbbell Fly"],
              ["Sets", "sets", "text", "e.g. 4"],
              ["Reps", "reps", "text", "e.g. 8–10"],
              ["Weight override", "weight", "text", "e.g. 20 kg each (leave blank for auto)"],
            ].map(([label, field, type, placeholder]) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5 }}>{label}</div>
                <input type={type} value={editForm[field]}
                  onChange={e => setEditForm(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd",
                    fontSize: 13, boxSizing: "border-box", background: "#fafafa" }} />
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={saveEdit}
                style={{ flex: 1, background: "#4CAF50", color: "#fff", border: "none", borderRadius: 10,
                  padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Save Changes
              </button>
              <button onClick={() => { resetEdit(editTarget.muscleGroup, editTarget.weekIdx, editTarget.exIdx); setEditTarget(null); }}
                style={{ background: "#FFF0EE", color: "#E8533F", border: "1px solid #E8533F", borderRadius: 10,
                  padding: "12px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Reset to Default
              </button>
              <button onClick={() => setEditTarget(null)}
                style={{ background: "#F5F5F5", color: "#888", border: "none", borderRadius: 10,
                  padding: "12px 14px", fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showCardio && (
        <div style={{ background: "#FFF8E1", borderBottom: "2px solid #FFE082", padding: "12px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#C07A20", marginBottom: 6 }}>🔥 POST-WORKOUT CARDIO</div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>{CARDIO_GUIDE}</div>
        </div>
      )}
      {showWarmup && (
        <div style={{ background: "#EEF4FB", borderBottom: "2px solid #C5D5FF", padding: "12px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1A6FA8", marginBottom: 6 }}>🤸 GENERAL WARM-UP (EVERY SESSION)</div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>{WARMUP_GENERAL}</div>
        </div>
      )}
      {showProgression && (
        <div style={{ background: "#F4EEFB", borderBottom: "2px solid #C5AAFF", padding: "12px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B3FA0", marginBottom: 8 }}>📈 10-WEEK PROGRESSION PLAN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(WEEK_LABELS).map(([wk, { label, note, color }]) => (
              <div key={wk} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color, background: "#fff", borderRadius: 5, padding: "2px 6px", minWidth: 44, textAlign: "center", marginTop: 1 }}>WK {wk}</span>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color }}>{label} — </span>
                  <span style={{ fontSize: 11, color: "#555" }}>{note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FILTER TABS ── */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #eee" }}>
        {["All", "Chest", "Back", "Arms", "Legs", "Shoulders", "Rest"].map(f => {
          const mg = MG[f] || { color: "#111", icon: "📋" };
          const active = filter === f;
          return (
            <button key={f} onClick={() => { setFilter(f); setSelected(null); }}
              style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
                background: active ? mg.color : "#F2F2F2", color: active ? "#fff" : "#555", transition: "all 0.2s" }}>
              {mg.icon} {f}
            </button>
          );
        })}
      </div>

      {/* ── GRID ── */}
      <div style={{ padding: "14px 16px" }}>
        {filter === "All" ? (
          weekGroups.map((days, wi) => {
            const wkNum = wi + 1;
            const wkLabel = WEEK_LABELS[Math.ceil(wkNum / (SCHEDULE.length / 7 / 10))] || WEEK_LABELS[1];
            const calWeek = wkNum;
            return (
              <div key={wi} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#aaa", textTransform: "uppercase", marginBottom: 6 }}>
                  Calendar Week {calWeek}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
                  {days.map(({ day, group: g, trainingDay, idx }) => {
                    const mg = MG[g];
                    const isSel = selected === idx;
                    const isDone = completed.has(idx);
                    return (
                      <div key={idx} onClick={() => setSelected(isSel ? null : idx)}
                        style={{ borderRadius: 8, padding: "7px 3px", textAlign: "center", cursor: "pointer",
                          background: isSel ? mg.color : isDone ? "#E8F5E9" : mg.bg,
                          border: `2px solid ${isSel ? mg.color : isDone ? "#4CAF50" : "transparent"}`,
                          transition: "all 0.2s", opacity: isDone && !isSel ? 0.7 : 1 }}>
                        <div style={{ fontSize: 13 }}>{mg.icon}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: isSel ? "#fff" : mg.color }}>D{day}</div>
                        {trainingDay && <div style={{ fontSize: 8, color: isSel ? "rgba(255,255,255,0.7)" : "#aaa" }}>T{trainingDay}</div>}
                        {isDone && <div style={{ fontSize: 8 }}>✅</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {filteredEntries.map(({ day, group: g, trainingDay, idx }) => {
              const mg = MG[g];
              const isSel = selected === idx;
              const isDone = completed.has(idx);
              return (
                <div key={idx} onClick={() => setSelected(isSel ? null : idx)}
                  style={{ borderRadius: 10, padding: "10px 6px", textAlign: "center", cursor: "pointer",
                    background: isSel ? mg.color : isDone ? "#E8F5E9" : mg.bg,
                    border: `2px solid ${isSel ? mg.color : isDone ? "#4CAF50" : "transparent"}`,
                    transition: "all 0.2s" }}>
                  <div style={{ fontSize: 18 }}>{mg.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isSel ? "#fff" : mg.color }}>Day {day}</div>
                  {trainingDay && <div style={{ fontSize: 10, color: isSel ? "rgba(255,255,255,0.7)" : "#aaa" }}>Training #{trainingDay}</div>}
                  {isDone && <div style={{ fontSize: 10 }}>✅</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── DETAIL PANEL ── */}
      {selected != null && selEntry && group && (
        <div style={{ margin: "0 16px 24px", borderRadius: 14, background: "#fff", border: `2px solid ${group.color}`, overflow: "hidden" }}>

          {/* Header */}
          <div style={{ background: group.color, padding: "14px 18px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase" }}>
              {selEntry.group === "Rest" ? `Day ${selEntry.day} · Rest Day` : `Day ${selEntry.day} · Training Day ${selEntry.trainingDay} · Week ${selEntry.weekNum}`}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 2 }}>
              {group.icon} {selEntry.group === "Rest" ? "Rest Day" : `${selEntry.group} Day`}
            </div>
            {selEntry.weekNum && WEEK_LABELS[selEntry.weekNum] && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
                Week {selEntry.weekNum}: {WEEK_LABELS[selEntry.weekNum].label} — {WEEK_LABELS[selEntry.weekNum].note}
              </div>
            )}
          </div>

          {/* Tip bar */}
          <div style={{ background: group.bg, padding: "9px 18px", borderBottom: "1px solid #eee" }}>
            <span style={{ fontSize: 10, color: group.color, fontWeight: 700 }}>💡 Tip: </span>
            <span style={{ fontSize: 11, color: "#555" }}>{TIPS[selEntry.group]}</span>
          </div>

          {selEntry.group !== "Rest" ? (() => {
            const exNames = WEEKLY_ROTATION[selEntry.group][(selEntry.weekNum || 1) - 1] || WEEKLY_ROTATION[selEntry.group][0];
            return (
              <div style={{ padding: "14px 16px" }}>

                {/* Warm-up reminder */}
                <div style={{ background: "#EEF4FB", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#1A6FA8" }}>
                  <strong>🤸 Before you start:</strong> 5 min treadmill walk + 1–2 warm-up sets of your first exercise at 50% weight. Tap the warm-up guide above for details.
                </div>

                {(() => {
                  const exNames2 = WEEKLY_ROTATION[selEntry.group][(selEntry.weekNum || 1) - 1] || [];
                  const doneCount = exNames2.filter((_, idx2) => isExDone(selected, idx2)).length;
                  const totalCount = exNames2.length;
                  const allDone = doneCount === totalCount;
                  return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#888", textTransform: "uppercase" }}>
                        Exercises this session
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700,
                        color: allDone ? "#2F7E4A" : "#888",
                        background: allDone ? "#E8F5E9" : "#F5F5F5",
                        borderRadius: 8, padding: "3px 10px" }}>
                        {allDone ? "🎉 All done!" : `${doneCount} / ${totalCount} done`}
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {exNames.map((exName, i) => {
                    const weekIdx = (selEntry.weekNum || 1) - 1;
                    const exData = getExerciseData(selEntry.group, weekIdx, i) || {};
                    const displayName = exData.name || exName;
                    const ex = EXERCISES[displayName] || EXERCISES[exName] || {};
                    const displaySets = exData.sets || ex.sets || "—";
                    const displayReps = exData.reps || ex.reps || "—";
                    const displayWeight = exData.weight || getWeight(exName, selEntry.weekNum || 1);
                    const plateNote = !exData.weight ? getPlateNote(exName, selEntry.weekNum || 1) : null;
                    const guideKey = `${selected}-${i}`;
                    const guideOpen = openGuide === guideKey;
                    const isCustomised = exData.isCustom;

                    // Swap logic
                    const swapKey = `${selected}-${i}`;
                    const swapPickerOpen = openSwapPicker === swapKey;
                    const selectedSwap = getSwapSelection(selected, i);
                    const usingAlt = !!selectedSwap;
                    const activeExName = selectedSwap || displayName;
                    const progData = progression[displayName];

                    const exIsDone = isExDone(selected, i);

                    return (
                      <div key={i} style={{ borderRadius: 10, overflow: "hidden",
                        border: `1px solid ${exIsDone ? "#4CAF50" : guideOpen ? group.color : isCustomised ? "#4CAF50" : usingAlt ? "#C07A20" : "#eee"}`,
                        opacity: exIsDone ? 0.75 : 1, transition: "all 0.2s" }}>
                        {/* Exercise row */}
                        <div style={{ padding: "10px 12px", background: exIsDone ? "#F0FFF4" : guideOpen ? group.bg : "#fff" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                <div style={{ fontWeight: 700, fontSize: 13,
                                  color: exIsDone ? "#2F7E4A" : usingAlt ? "#C07A20" : "#1C1C1C",
                                  textDecoration: exIsDone ? "line-through" : "none" }}>
                                  {activeExName}
                                </div>
                                {exIsDone && <span style={{ fontSize: 12 }}>✅</span>}
                                {isCustomised && !exIsDone && <span style={{ fontSize: 9, background: "#E8F5E9", color: "#4CAF50", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>EDITED</span>}
                                {usingAlt && !exIsDone && <span style={{ fontSize: 9, background: "#FBF5EE", color: "#C07A20", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>SWAPPED</span>}
                              </div>
                              {usingAlt && (
                                <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>
                                  Original: {displayName}
                                </div>
                              )}
                              {(() => {
                                const isCompound = (REST_TIMES[displayName] || REST_TIMES[exName] || 90) === 120;
                                const dropWeight = (() => {
                                  const num = parseFloat((displayWeight || "").replace(/[^0-9.]/g, ""));
                                  const unit = (displayWeight || "").replace(/[0-9. ]/g, "").trim();
                                  if (!num) return null;
                                  return `${Math.round(num * 0.7 * 2) / 2} ${unit}`;
                                })();
                                return (
                                  <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 11, background: "#F5F5F5", borderRadius: 5, padding: "2px 7px", color: "#555" }}>
                                      {displaySets} sets × {displayReps} reps
                                    </span>
                                    <span style={{ fontSize: 11, background: group.bg, borderRadius: 5, padding: "2px 7px", color: group.color, fontWeight: 700 }}>
                                      🏋️ {displayWeight}
                                    </span>
                                    {!isCompound && dropWeight && (
                                      <span style={{ fontSize: 11, background: "#FFF0EE", borderRadius: 5, padding: "2px 7px", color: "#E8533F", fontWeight: 700 }}>
                                        🔥 Set 3 drop → {dropWeight} to failure
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                              {plateNote && (
                                <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>📐 {plateNote}</div>
                              )}
                              {/* Auto-progression badge */}
                              {progData && (
                                <div style={{ marginTop: 6, background: progData.badge.includes("heavier") ? "#EEF8F2" : progData.badge.includes("Ease") ? "#FFF0EE" : "#FFF8E1",
                                  borderRadius: 6, padding: "4px 8px", display: "inline-block" }}>
                                  <span style={{ fontSize: 10, fontWeight: 700,
                                    color: progData.badge.includes("heavier") ? "#2F7E4A" : progData.badge.includes("Ease") ? "#E8533F" : "#C07A20" }}>
                                    {progData.badge}
                                  </span>
                                  <span style={{ fontSize: 10, color: "#666", marginLeft: 4 }}>{progData.advice}</span>
                                </div>
                              )}

                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginLeft: 8, marginTop: 2 }}>
                              {/* Swap picker button */}
                              {ex.swaps && ex.swaps.length > 0 && (
                                <button onClick={() => setOpenSwapPicker(swapPickerOpen ? null : swapKey)}
                                  style={{ background: usingAlt ? "#C07A20" : "#FBF5EE", color: usingAlt ? "#fff" : "#C07A20",
                                    border: `1px solid #C07A20`, borderRadius: 8, padding: "5px 8px",
                                    fontSize: 9, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                  {swapPickerOpen ? "✕ Close" : usingAlt ? "⟳ Swap" : "⟳ Swap"}
                                </button>
                              )}
                              {/* Done tick button */}
                              <button onClick={() => toggleExDone(selected, i, activeExName)}
                                style={{ background: exIsDone ? "#4CAF50" : "#F0FFF4",
                                  color: exIsDone ? "#fff" : "#4CAF50",
                                  border: "1px solid #4CAF50", borderRadius: 8, padding: "5px 8px",
                                  fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                {exIsDone ? "✅" : "☐"}
                              </button>
                              {editMode && (
                                <button onClick={() => openEditForm(selEntry.group, weekIdx, i)}
                                  style={{ background: "#4CAF50", color: "#fff", border: "none", borderRadius: 8,
                                    padding: "5px 8px", fontSize: 9, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                  ✏️ Edit
                                </button>
                              )}

                              <button onClick={() => setOpenGuide(guideOpen ? null : guideKey)}
                                style={{ background: guideOpen ? group.color : "#F0F0F0", color: guideOpen ? "#fff" : "#555",
                                  border: "none", borderRadius: 8, padding: "5px 8px", fontSize: 9, fontWeight: 700,
                                  cursor: "pointer", whiteSpace: "nowrap" }}>
                                {guideOpen ? "✕" : "📖 Guide"}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Guide panel */}
                        {guideOpen && (
                          <div style={{ background: "#FAFEFF", borderTop: `1px dashed ${group.color}`, padding: "12px 14px" }}>
                            {ex.warmup && (
                              <div style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#1A6FA8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>🤸 Warm-Up</div>
                                <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>{ex.warmup}</div>
                              </div>
                            )}
                            <div style={{ marginBottom: 10 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: group.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>📖 How to Perform</div>
                              <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>{ex.guide || "Refer to your coach or a trainer for guidance on this exercise."}</div>
                            </div>
                          </div>
                        )}

                        {/* Swap picker panel */}
                        {swapPickerOpen && ex.swaps && (
                          <div style={{ background: "#FBF5EE", borderTop: "1px dashed #C07A20", padding: "12px 14px" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#C07A20", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                              ⟳ Swap Exercise — choose one
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                              {/* Default option */}
                              <button
                                onClick={() => selectSwap(selected, i, null)}
                                style={{
                                  padding: "10px 14px", borderRadius: 9, textAlign: "left", cursor: "pointer",
                                  background: !selectedSwap ? "#C07A20" : "#fff",
                                  border: `1px solid ${!selectedSwap ? "#C07A20" : "#ddd"}`,
                                  color: !selectedSwap ? "#fff" : "#444",
                                  fontSize: 12, fontWeight: !selectedSwap ? 700 : 400,
                                }}>
                                {!selectedSwap && "✓ "}{displayName} <span style={{ fontSize: 10, opacity: 0.7 }}>(default)</span>
                              </button>
                              {ex.swaps.map((swapName, si) => (
                                <button
                                  key={si}
                                  onClick={() => selectSwap(selected, i, swapName)}
                                  style={{
                                    padding: "10px 14px", borderRadius: 9, textAlign: "left", cursor: "pointer",
                                    background: selectedSwap === swapName ? "#C07A20" : "#fff",
                                    border: `1px solid ${selectedSwap === swapName ? "#C07A20" : "#ddd"}`,
                                    color: selectedSwap === swapName ? "#fff" : "#444",
                                    fontSize: 12, fontWeight: selectedSwap === swapName ? 700 : 400,
                                  }}>
                                  {selectedSwap === swapName && "✓ "}{swapName}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Cardio finisher */}
                <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "#FFF8E1", border: "1px solid #FFE082" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#C07A20" }}>🔥 Post-Workout Cardio</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4, lineHeight: 1.5 }}>
                    15–20 min incline treadmill walk (gradient 8–10%, 5–6 km/h) after this session. Tap the Cardio Guide above for full details.
                  </div>
                </div>
              </div>
            );
          })() : (
            <div style={{ padding: "24px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🛌</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Rest Day</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 8, lineHeight: 1.7 }}>
                Muscles grow during rest, not during training. This day is just as important as a workout day.
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["💧 Hydration", "Drink 3–4 litres of water today even though you're not training."],
                  ["🥩 Protein", "Still hit your protein target — eggs, chicken, fish, legumes. Muscle repairs on rest days."],
                  ["🚶 Light activity", "A 20–30 min casual walk is fine and helps circulation and recovery. No intense exercise."],
                  ["😴 Sleep", "Aim for 7–8 hours. Growth hormone is released during deep sleep."],
                ].map(([title, desc]) => (
                  <div key={title} style={{ background: "#F5F5F5", borderRadius: 10, padding: "10px 14px", textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#444" }}>{title}</div>
                    <div style={{ fontSize: 11, color: "#777", marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mark complete */}
          <div style={{ padding: "0 16px 18px" }}>
            <button onClick={() => toggleComplete(selected)}
              style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: "pointer",
                fontWeight: 700, fontSize: 14,
                background: completed.has(selected) ? "#E8F5E9" : group.color,
                color: completed.has(selected) ? "#2F7E4A" : "#fff",
                marginTop: 10, transition: "all 0.2s" }}>
              {completed.has(selected) ? "✅ Completed — Undo?" : `Mark ${selEntry.group === "Rest" ? "Rest Day" : `Day ${selEntry.day}`} Complete`}
            </button>
          </div>
        </div>
      )}

      {/* ── REST TIMER ── */}
      {restTimer && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 300, background: "#111", borderRadius: 16, padding: "14px 20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)", minWidth: 220, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
            ⏱ Rest Timer
          </div>
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8, maxWidth: 200 }}>
            {restTimer.exName}
          </div>
          {/* Countdown ring */}
          <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 10px" }}>
            <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#333" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none"
                stroke={restTimer.seconds > restTimer.total * 0.4 ? "#4CAF50" : restTimer.seconds > restTimer.total * 0.2 ? "#C07A20" : "#E8533F"}
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - restTimer.seconds / restTimer.total)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{restTimer.seconds}</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>
            {restTimer.seconds > 0 ? "seconds remaining" : "Rest complete — next set!"}
          </div>
          <button onClick={cancelTimer}
            style={{ background: "#333", color: "#aaa", border: "none", borderRadius: 8,
              padding: "6px 18px", fontSize: 11, cursor: "pointer" }}>
            Skip
          </button>
        </div>
      )}

      {/* ── NUTRITION ── */}
      <div style={{ margin: "0 16px 32px", padding: "16px", borderRadius: 14, background: "#111", color: "#fff" }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>🥗 Eating to Look Bigger (No Supplements)</div>
        {[
          ["Protein", "110–120 g/day from real food — eggs, chicken breast, fish, tofu, lentils, Greek yoghurt. Aim for a palm-sized portion at every meal."],
          ["Carbs", "Don't avoid them. Rice, oats, sweet potato, and bread fuel your training and support muscle growth."],
          ["Fats", "Avocado, eggs, nuts, olive oil — support testosterone production and joint health."],
          ["Timing", "Eat a proper meal 1–2 hrs before training. Have protein-rich food within 30–60 min post-workout."],
          ["Rest days", "Eat slightly less on rest days — still hit protein, but reduce carbs a little to stay in a mild deficit for fat loss."],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#E8533F", minWidth: 55, paddingTop: 1 }}>{k}</span>
            <span style={{ fontSize: 11, color: "#bbb", lineHeight: 1.6 }}>{v}</span>
          </div>
        ))}
        <div style={{ fontSize: 10, color: "#444", marginTop: 4, lineHeight: 1.6 }}>
          ⚠️ To look bigger AND lose fat simultaneously: eat more on training days, slightly less on rest days. No need to count calories — just be consistent with protein and don't skip meals before or after training.
        </div>
      </div>
    </div>
  );
}

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
    alt: "Dumbbell Flat Press — same movement pattern, greater range of motion at the bottom. Use same total weight split across two dumbbells.",
  },
  "Incline Bench Press (Smith)": {
    sets: "4", reps: "8–10", baseWeight: 40, inc: 2.5, unit: "kg total",
    guide: "Set bench to 30–45°. Grip slightly narrower than flat bench. Lower bar to upper chest (not neck). Incline targets the upper chest — the area that makes your chest look fuller from the front. Control the descent; don't bounce off the chest.",
    warmup: "1 set × 10 reps bar only, then 1 light set at 60% working weight.",
    alt: "Incline Dumbbell Press — set bench to 30–45°, press dumbbells up and in. Easier to set up than the Smith on incline.",
  },
  "Low Cable Fly": {
    sets: "3", reps: "12–15", baseWeight: 8, inc: 1, unit: "kg each side",
    guide: "Set both cables at the lowest position (near the floor). Stand in the centre, step forward slightly. With a slight elbow bend, bring your hands upward and inward in an arc, meeting at chest height. This targets the lower chest — the same area that decline bench would — but without any decline setup. Squeeze the chest hard at the top, lower slowly. Keep your torso still throughout.",
    warmup: "No separate warm-up needed if done after press movements.",
    alt: "Pec Deck Machine (lower setting) — sit at the pec deck, set the arms low to replicate the upward fly arc targeting the lower chest.",
  },
  "Incline Dumbbell Press": {
    sets: "4", reps: "8–10", baseWeight: 14, inc: 1.25, unit: "kg each",
    guide: "Set bench to 30–45°. Hold dumbbells at chest level, elbows at 45° from your body. Press upward and slightly inward, bringing dumbbells close together at the top without touching. Lower slowly until you feel a full stretch in the upper chest. The incline angle targets the upper chest — the area that makes your chest look fuller when wearing a shirt. Control every rep.",
    warmup: "1 set × 10 reps at 8 kg each before working sets.",
    alt: "Incline Smith Machine Press — same angle and movement, just uses the bar instead of dumbbells. Good if dumbbells feel unstable.",
  },
  "Close-Grip Bench Press (Smith)": {
    sets: "3", reps: "8–10", baseWeight: 35, inc: 2.5, unit: "kg total",
    guide: "Hands shoulder-width or slightly closer. This shifts load from chest to triceps — great for overall pressing strength and arm thickness. Keep elbows tucked close to your body throughout. Full range of motion.",
    warmup: "1 set × 10 reps bar only.",
    alt: "EZ Bar Skull Crusher superset with Close-Grip Press — finish the skull crushers and immediately switch to close-grip pressing the same bar for extra tricep volume.",
  },
  "Cable Fly (mid)": {
    sets: "3", reps: "12–15", baseWeight: 10, inc: 1.25, unit: "kg each side",
    guide: "Set cables at chest height. Step forward, lean slightly. Arms wide like a hug, slight bend in elbows — keep that bend fixed. Bring hands together in front of chest, squeeze hard for 1 second at the peak. Slowly return. This is an isolation move — focus on feeling the chest, not just moving the weight.",
    warmup: "No separate warm-up needed if done after press movements.",
    alt: "Pec Deck Machine — sit upright, bring the pads together in front of your chest. Same isolation movement without needing a cable setup.",
  },
  "Dumbbell Pullover": {
    sets: "3", reps: "10–12", baseWeight: 14, inc: 1, unit: "kg",
    guide: "Lie across a bench (upper back only on bench, hips dropped). Hold one dumbbell with both hands above chest. Lower it back over your head in an arc, feeling a deep stretch in the chest and lats. Pull back over the chest. Keep a slight bend in elbows throughout. Great for expanding the ribcage.",
    warmup: "Start with 2–3 reps at a lighter weight to feel the stretch.",
    alt: "Cable Straight-Arm Pulldown — stand at a high cable, arms extended, pull down in an arc to your thighs. Same lat and chest stretch as the pullover.",
  },
  "Push-Up (weighted)": {
    sets: "3", reps: "12–15", baseWeight: 10, inc: 2.5, unit: "kg plate on back",
    guide: "Have a training partner place a weight plate on your upper back, or use a weighted vest. Standard push-up form — hands slightly wider than shoulders, body in a straight line from head to heels. Lower chest to 2–3 cm from floor, press up fully. If no partner, do slow push-ups (3 sec down, 1 sec up) for the same effect.",
    warmup: "5 bodyweight push-ups before loading.",
    alt: "Machine Chest Press — use the plate-loaded or selectorised chest press machine as a direct substitute. Same push pattern, easier to load.",
  },

  // ── BACK ───────────────────────────────────────────────────────────────────
  "Double DB Bent-Over Row": {
    sets: "4", reps: "8–10", baseWeight: 18, inc: 1.25, unit: "kg each",
    guide: "Hinge at hips until torso is ~45°, slight knee bend. Hold dumbbells hanging down. Row both to your lower ribs simultaneously, driving elbows back and up. Squeeze shoulder blades together at the top for 1 second. Lower slowly. Keep your back flat — not rounded. This is your primary back thickness builder.",
    warmup: "1 set × 10 reps at 10 kg each before working sets.",
    alt: "Single-Arm Dumbbell Row — same hinge position, one arm at a time with support on a bench. Allows heavier load and better mind-muscle connection per side.",
  },
  "Bent-Over Barbell Row (Smith)": {
    sets: "4", reps: "8–10", baseWeight: 40, inc: 2.5, unit: "kg total",
    guide: "Hinge at hips, overhand grip just outside shoulder-width. Pull bar to your lower abs (not upper chest). Elbows drive back and slightly flared. The Smith machine keeps the path fixed — use this to your advantage by focusing entirely on squeezing the back. Return slowly.",
    warmup: "1 warm-up set × 10 reps bar only.",
    alt: "T-Bar Row — load one end of a barbell into a landmine or corner, straddle it and row both hands to your chest. Similar compound back stimulus.",
  },
  "Lat Pulldown": {
    sets: "4", reps: "8–10", baseWeight: 35, inc: 2.5, unit: "kg stack",
    guide: "Sit with thighs under pads. Wide overhand grip. Lean back slightly (15°). Pull bar to your upper chest, leading with your elbows — imagine pushing your elbows into your back pockets. Squeeze lats at the bottom. Slowly return to full arm extension. This builds the V-taper width.",
    warmup: "1 set × 10 reps at 15 kg before working weight.",
    alt: "Assisted Pull-Up Machine — use the counterweighted machine to do pull-ups with the same lat-dominant movement. Reduce assistance as you get stronger.",
  },
  "Pull-Up": {
    sets: "4", reps: "6–10", baseWeight: 0, inc: 0, unit: "bodyweight",
    guide: "Hang with overhand grip, hands shoulder-width or wider. Pull until chin clears the bar, driving elbows down and back. Fully extend arms at the bottom. If you can't do 6 reps, use the assisted pull-up machine or a resistance band looped over the bar for support. Add a weight belt when you can do 10+ easily.",
    warmup: "2–3 slow negatives (jump to top, lower slowly over 5 sec).",
    alt: "Assisted Pull-Up Machine — identical movement with a counterweight to reduce effective bodyweight. Step down assistance by 5 kg every 2 weeks.",
  },
  "Seated Cable Row": {
    sets: "3", reps: "10–12", baseWeight: 30, inc: 2.5, unit: "kg stack",
    guide: "Sit upright, feet on platform, slight knee bend. Row the handle to your navel — not your chest. Elbows travel back close to your sides. At the end position, squeeze shoulder blades together and hold 1 second. Return with control, letting your shoulder blades protract fully at the front — this full range builds more thickness.",
    warmup: "No separate warm-up if done after compound rows.",
    alt: "Chest-Supported Dumbbell Row — lie face-down on an incline bench, row both dumbbells up simultaneously. Removes lower back fatigue and isolates the mid-back.",
  },
  "Single-Arm DB Row": {
    sets: "3", reps: "10–12 each", baseWeight: 20, inc: 1.25, unit: "kg",
    guide: "Place one hand and same-side knee on a bench. Other foot on floor. Dumbbell hanging. Row to your hip — not your armpit. Think about driving your elbow toward the ceiling. At the top, your elbow should be higher than your back. Hold 1 second, lower slowly. Keep hips square.",
    warmup: "2–3 reps at light weight to rehearse the path.",
    alt: "Cable Single-Arm Row — use a low cable with a D-handle. Same unilateral movement, constant tension throughout the range of motion.",
  },
  "Face Pull": {
    sets: "3", reps: "15", baseWeight: 12, inc: 1.25, unit: "kg stack",
    guide: "Set cable at forehead height, use rope attachment. Pull rope to your face, splitting it so hands go either side of your head, elbows flare high and wide. This directly targets the rear delts and rotator cuff — critical for shoulder health and posture. Go light and focus on the squeeze. Never rush this one.",
    warmup: "Not required — light weight used throughout.",
    alt: "Reverse Pec Deck — sit facing the machine, grab the handles and pull apart at shoulder height. Identical rear delt recruitment without needing a cable.",
  },
  "Straight-Arm Pulldown": {
    sets: "3", reps: "12", baseWeight: 15, inc: 1.25, unit: "kg stack",
    guide: "Stand at cable, high pulley, overhand grip on bar or rope. Arms almost fully extended (slight elbow bend). Pull down in an arc to your thighs, keeping arms straight throughout. This isolates the lat without involving biceps — great for building that lower lat fullness. Lean forward slightly.",
    warmup: "Not required.",
    alt: "Dumbbell Pullover on Bench — lie across a flat bench, hold one dumbbell overhead and arc it down to your chest. Hits the same lower lat stretch as the cable version.",
  },

  // ── ARMS ───────────────────────────────────────────────────────────────────
  "Barbell Bicep Curl": {
    sets: "4", reps: "8–10", baseWeight: 20, inc: 1.25, unit: "kg total",
    guide: "Stand with EZ bar or straight bar. Underhand grip shoulder-width. Keep elbows pinned to your sides — they should not move forward. Curl to chin height, squeeze hard, lower slowly over 3 seconds. The slow descent is where most of the growth happens. Don't swing your back.",
    warmup: "1 set × 12 reps at bar only (10 kg).",
    alt: "EZ Bar Curl — same standing curl movement, the angled grip reduces wrist strain and shifts load slightly to the outer bicep head.",
  },
  "Incline Dumbbell Curl": {
    sets: "3", reps: "10–12", baseWeight: 9, inc: 1, unit: "kg each",
    guide: "Set bench to 60°. Sit back and let arms hang behind your torso. This pre-stretches the long head of the bicep for a deeper range of motion. Curl without letting elbows travel forward. You'll feel a much stronger stretch at the bottom than standing curls — that's the point. Go lighter than you think.",
    warmup: "Not required — done after barbell curls.",
    alt: "Cable Curl (low pulley) — stand at a low cable with a straight bar or rope. Constant tension throughout the curl, especially at the top where dumbbells go slack.",
  },
  "Hammer Curl": {
    sets: "4", reps: "10–12", baseWeight: 10, inc: 1, unit: "kg each",
    guide: "Neutral grip (palms facing each other). Curl upward keeping the neutral grip throughout — don't rotate your wrist. This targets the brachialis (muscle under the bicep) which pushes the bicep up, making your arms look thicker. Also builds forearm size. Keep elbows fixed.",
    warmup: "Not required.",
    alt: "Rope Cable Curl — attach a rope to a low cable, curl with a neutral grip. Adds constant tension compared to dumbbells and hits the brachialis equally well.",
  },
  "Concentration Curl": {
    sets: "3", reps: "10–12 each", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Sit on bench, feet wide. Rest back of upper arm on your inner thigh. Curl to your shoulder. This eliminates all momentum — pure bicep contraction. Hold the peak for 2 seconds each rep. At 70 kg your biceps are relatively fresh — this should give you a serious pump. Go slowly.",
    warmup: "Not required.",
    alt: "Preacher Curl Machine — rests your upper arm on a pad eliminating all swing. Same strict isolation as a concentration curl but with a more stable setup.",
  },
  "Skull Crusher (EZ Bar)": {
    sets: "4", reps: "8–10", baseWeight: 20, inc: 1.25, unit: "kg total",
    guide: "Lie on bench, EZ bar above your chest. Lower bar to your forehead (hence the name) by bending elbows only — upper arms stay vertical and still. Press back up to full extension. This is the best long-head tricep builder. Keep upper arms perpendicular to the floor throughout. Use a spotter if possible.",
    warmup: "1 set × 10 reps at bar only (10 kg).",
    alt: "Cable Overhead Tricep Extension — attach a rope to a high cable, face away and extend arms overhead. Same long-head stretch as skull crushers with constant cable tension.",
  },
  "Tricep Rope Pushdown": {
    sets: "4", reps: "10–12", baseWeight: 15, inc: 1.25, unit: "kg stack",
    guide: "Set cable high, attach rope. Grip rope with thumbs up. Elbows pinned to sides. Push rope down, splitting the ends apart at the bottom for full contraction. Hold 1 second at full extension. Return slowly. Keep your torso slightly forward leaning. This hits the lateral head — the part that makes your tricep look wide from the back.",
    warmup: "Not required.",
    alt: "V-Bar Pushdown — swap the rope for a V-bar attachment on the same cable. Slightly different grip angle that emphasises the medial tricep head.",
  },
  "Overhead Tricep Extension": {
    sets: "3", reps: "10–12", baseWeight: 14, inc: 1, unit: "kg",
    guide: "Hold one dumbbell with both hands overhead, elbows framing your head. Lower behind your head by bending only at the elbows, feeling a deep stretch in the long head of the tricep. Press back up. The long head runs along the back of the arm — training it overhead is the only way to fully stretch it. Keep your elbows pointed forward, not flaring.",
    warmup: "2 slow reps at lighter weight to feel the stretch.",
    alt: "EZ Bar Overhead Tricep Extension — same movement with an EZ bar for a more comfortable wrist angle. Allows heavier loading than a single dumbbell.",
  },
  "Reverse Curl": {
    sets: "2", reps: "15", baseWeight: 10, inc: 0.5, unit: "kg total",
    guide: "Overhand grip (palms facing down) on a barbell or EZ bar. Curl the same way as a normal curl. This targets the brachioradialis and forearm extensors — building forearm thickness that makes your whole arm look bigger. Keep elbows fixed. Much lighter than regular curls is normal.",
    warmup: "Not required.",
    alt: "EZ Bar Reverse Curl — the angled EZ bar grip is easier on the wrists than a straight bar while hitting the same brachioradialis and forearm extensors.",
  },

  // ── LEGS ───────────────────────────────────────────────────────────────────
  "Step-Up with Dumbbells": {
    sets: "4", reps: "10–12 each", baseWeight: 12, inc: 1.25, unit: "kg each hand",
    guide: "Use a bench or box at knee height. Step up leading with one foot, drive through the heel to stand fully upright on the box. Step down with control. Alternate legs. Keep your torso upright. This unilateral movement corrects muscle imbalances between legs. Feel the quad and glute of the working leg — don't push off the back foot.",
    warmup: "5 bodyweight step-ups each leg before loading.",
    alt: "Smith Machine Step-Up — hold the bar across your upper back on the Smith machine for a more stable and heavier loaded step-up.",
  },
  "Glute Bridge / Hip Thrust": {
    sets: "4", reps: "10–12", baseWeight: 30, inc: 2.5, unit: "kg across hips",
    guide: "Upper back on bench, barbell across hip crease (use a pad). Feet flat on floor, shoulder-width. Drive hips up by squeezing glutes hard — not by hyperextending your lower back. At the top, shins should be vertical, body forms a straight line from knees to shoulders. Hold top position 1–2 seconds. Lower slowly. This is the best glute builder and directly improves your leg appearance.",
    warmup: "10 bodyweight glute bridges on the floor before loading.",
    alt: "Smith Machine Hip Thrust — same movement with the bar running in the Smith track. Easier to load heavy without a spotter and keeps the bar path fixed.",
  },
  "Leg Press": {
    sets: "4", reps: "10–12", baseWeight: 60, inc: 5, unit: "kg",
    guide: "Feet shoulder-width on the platform, toes pointed slightly out. Lower the sled until knees reach 90° — not beyond. Press back up without locking your knees at the top. Keep your lower back pressed against the seat throughout. Don't let your hips lift off the seat at the bottom. A wider, higher foot placement targets glutes more; lower targets quads.",
    warmup: "1 set × 15 reps at 30 kg before working weight.",
    alt: "Hack Squat Machine — similar quad-dominant push movement in a fixed track. Slightly more upright torso angle which reduces lower back involvement.",
  },
  "Walking Lunge": {
    sets: "4", reps: "10 each leg", baseWeight: 10, inc: 1.25, unit: "kg each hand",
    guide: "Take a big step forward, lower your rear knee toward the floor (without touching), then step your back foot forward to begin the next rep. Keep your torso upright and core braced. Front knee should track over your toes, not caving inward. This builds quad size, glute size, and functional strength simultaneously. If space is limited, do reverse lunges in place.",
    warmup: "10 bodyweight lunges each leg before loading.",
    alt: "Smith Machine Reverse Lunge — step backward under the Smith bar. The fixed path makes it easier to keep balance and allows heavier loading than dumbbells.",
  },
  "Leg Curl (Machine)": {
    sets: "4", reps: "10–12", baseWeight: 25, inc: 2.5, unit: "kg stack",
    guide: "Lie face down on the machine. Pad should sit just above your heels. Curl your heels toward your glutes, squeezing the hamstrings hard at the top. Lower slowly — hamstrings respond extremely well to slow eccentrics. Don't let your hips lift off the pad at the top. Point toes slightly to feel the outer hamstring more.",
    warmup: "1 set × 15 reps at 10 kg.",
    alt: "Seated Leg Curl Machine — if your gym has both lying and seated versions, the seated variant puts the hamstring in a greater stretch position and builds more mass.",
  },
  "Leg Extension (Machine)": {
    sets: "3", reps: "12–15", baseWeight: 25, inc: 2.5, unit: "kg stack",
    guide: "Sit upright, pad across your shins just above the ankle. Extend legs to full lockout, squeezing the quad hard at the top. Hold 1 second. Lower slowly. This isolates the quad fully — no other muscle can help here. Don't swing or use momentum. If you feel knee discomfort, reduce range of motion slightly.",
    warmup: "Not required if done after leg press.",
    alt: "Cable Leg Extension — attach an ankle strap to a low cable, stand facing away and extend your leg forward. Constant tension unlike the machine which is easier at the bottom.",
  },
  "Standing Calf Raise": {
    sets: "4", reps: "15–20", baseWeight: 40, inc: 5, unit: "kg",
    guide: "Use the calf raise machine or a Smith machine. Position toes forward or slightly outward. Rise onto the balls of your feet as high as possible, hold 1 second at the top. Lower slowly below the starting point for a full stretch — this bottom stretch is crucial for calf growth. Calves are worked in daily walking so they need both heavy weight and high reps to grow. Go slow.",
    warmup: "10 bodyweight calf raises on a step edge.",
    alt: "Seated Calf Raise Machine — targets the soleus (deeper calf muscle) more than standing raises. Use both machines across your sessions for full calf development.",
  },

  // ── SHOULDERS ──────────────────────────────────────────────────────────────
  "Seated DB Shoulder Press": {
    sets: "4", reps: "8–10", baseWeight: 16, inc: 1.25, unit: "kg each",
    guide: "Sit on a bench with back support. Dumbbells at ear level, elbows at 90°. Press straight up, bringing dumbbells close together at the top without touching. Lower back to ear level — full range. This is your primary shoulder mass builder. Don't press in front of your face — press straight overhead. Keep core tight to protect lower back.",
    warmup: "1 set × 10 reps at 8 kg each.",
    alt: "Smith Machine Overhead Press — set the bench upright inside the Smith machine. Fixed bar path removes the stability demand and lets you focus purely on shoulder load.",
  },
  "Arnold Press": {
    sets: "4", reps: "10–12", baseWeight: 12, inc: 1, unit: "kg each",
    guide: "Start with dumbbells at chin height, palms facing you. As you press up, rotate your wrists so palms face forward at the top. Reverse on the way down. This rotation recruits all three heads of the deltoid in one movement — front, side, and rear. Go lighter than your regular press. Control the rotation — don't just spin the wrists.",
    warmup: "Not required if done after shoulder press.",
    alt: "Dumbbell Shoulder Press with rotation — if the full Arnold rotation feels awkward, do a partial rotation (palms facing in at the bottom, facing forward at the top). Same recruitment, simpler execution.",
  },
  "Lateral Raise": {
    sets: "4", reps: "12–15", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Stand with dumbbells at sides. Raise arms out to the sides to shoulder height — lead with your elbows, not your hands. At the top, tilt dumbbells slightly so the front is lower than the back (like pouring a jug) — this protects the shoulder joint. Lower slowly over 3 seconds. This builds the side delt, which makes your shoulders look wide. Never go heavy here — strict form only.",
    warmup: "Not required.",
    alt: "Cable Lateral Raise — attach D-handles to low cables, raise both arms simultaneously. Constant tension throughout compared to dumbbells which are easiest at the bottom.",
  },
  "Front Raise": {
    sets: "3", reps: "12", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Stand, dumbbells in front of thighs. Raise one or both arms forward to shoulder height, thumbs up. Keep a slight elbow bend. Lower slowly. This targets the anterior (front) deltoid. Many people skip this but it adds fullness to the front of the shoulder. Don't swing; use a strict controlled movement.",
    warmup: "Not required.",
    alt: "Cable Front Raise — use a low cable with a straight bar or rope. Constant tension through the full range, especially at the top where dumbbells feel lightest.",
  },
  "Rear Delt Fly": {
    sets: "4", reps: "12–15", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Hinge forward at hips 90°, dumbbells hanging below chest. Raise arms out to sides like wings, leading with elbows. Squeeze shoulder blades together at the top. Lower slowly. The rear delt is the most neglected shoulder muscle — training it balances the shoulder, improves posture, and gives your shoulder that 3D rounded look from behind. Go light and feel every rep.",
    warmup: "Not required.",
    alt: "Reverse Pec Deck — sit facing the machine, grip the handles and pull apart to the sides. The most direct machine substitute for rear delt flys with easy weight adjustment.",
  },
  "Dumbbell Shrug": {
    sets: "4", reps: "12–15", baseWeight: 20, inc: 2.5, unit: "kg each",
    guide: "Hold heavy dumbbells at sides. Shrug your shoulders straight up toward your ears as high as possible. Hold 1 second at the top. Lower slowly. Do not roll your shoulders — straight up and down only. This builds the trapezius which connects your neck to your shoulders, giving that powerful thick upper back look.",
    warmup: "Not required.",
    alt: "Smith Machine Shrug or Barbell Shrug — allows heavier loading than dumbbells. Set the bar at hip height, grip and shrug straight up. Good for progressive overload on traps.",
  },
  "Cable Lateral Raise": {
    sets: "3", reps: "12–15 each", baseWeight: 5, inc: 0.5, unit: "kg each side",
    guide: "Stand side-on to a low cable. Cross-body grip (use the hand furthest from the cable). Raise arm out to the side to shoulder height. The cable provides constant tension throughout the movement — unlike dumbbells which are easiest at the bottom. This is why it's worth doing after dumbbell laterals. Keep elbow slightly bent, wrist neutral.",
    warmup: "Not required.",
    alt: "Machine Lateral Raise — many gyms have a dedicated lateral raise machine. Provides the same isolated side delt stimulus with a guided movement arc.",
  },
};

// ─── WEEKLY EXERCISE ROTATION ────────────────────────────────────────────────
// Each muscle group rotates exercises each week for variety + full development
const WEEKLY_ROTATION = {
  Chest: [
    ["Flat Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Dumbbell Pullover", "Push-Up (weighted)"],         // Wk1
    ["Incline Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Low Cable Fly", "Push-Up (weighted)"],  // Wk2
    ["Flat Bench Press (Smith)", "Incline Dumbbell Press", "Close-Grip Bench Press (Smith)", "Cable Fly (mid)", "Dumbbell Pullover"], // Wk3
    ["Low Cable Fly", "Incline Bench Press (Smith)", "Cable Fly (mid)", "Push-Up (weighted)", "Dumbbell Pullover"],  // Wk4
    ["Flat Bench Press (Smith)", "Close-Grip Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Dumbbell Pullover"], // Wk5
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Low Cable Fly", "Cable Fly (mid)", "Push-Up (weighted)"], // Wk6
    ["Flat Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Dumbbell Pullover", "Push-Up (weighted)"],         // Wk7 (repeat Wk1 heavier)
    ["Incline Bench Press (Smith)", "Close-Grip Bench Press (Smith)", "Cable Fly (mid)", "Dumbbell Pullover", "Push-Up (weighted)"], // Wk8
    ["Flat Bench Press (Smith)", "Low Cable Fly", "Incline Dumbbell Press", "Cable Fly (mid)", "Dumbbell Pullover"], // Wk9
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Cable Fly (mid)", "Push-Up (weighted)", "Dumbbell Pullover"],     // Wk10 deload
  ],
  Back: [
    ["Lat Pulldown", "Double DB Bent-Over Row", "Seated Cable Row", "Face Pull", "Straight-Arm Pulldown"],
    ["Pull-Up", "Bent-Over Barbell Row (Smith)", "Single-Arm DB Row", "Face Pull", "Straight-Arm Pulldown"],
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Seated Cable Row", "Single-Arm DB Row", "Face Pull"],
    ["Pull-Up", "Double DB Bent-Over Row", "Seated Cable Row", "Face Pull", "Straight-Arm Pulldown"],
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Single-Arm DB Row", "Seated Cable Row", "Face Pull"],
    ["Pull-Up", "Double DB Bent-Over Row", "Bent-Over Barbell Row (Smith)", "Face Pull", "Straight-Arm Pulldown"],
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Seated Cable Row", "Face Pull", "Single-Arm DB Row"],
    ["Pull-Up", "Double DB Bent-Over Row", "Single-Arm DB Row", "Face Pull", "Straight-Arm Pulldown"],
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Seated Cable Row", "Single-Arm DB Row", "Face Pull"],
    ["Lat Pulldown", "Double DB Bent-Over Row", "Seated Cable Row", "Face Pull", "Straight-Arm Pulldown"],
  ],
  Arms: [
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Concentration Curl", "Overhead Tricep Extension"],
    ["Incline Dumbbell Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Reverse Curl", "Overhead Tricep Extension"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Incline Dumbbell Curl", "Tricep Rope Pushdown", "Concentration Curl", "Reverse Curl"],
    ["Hammer Curl", "Skull Crusher (EZ Bar)", "Barbell Bicep Curl", "Overhead Tricep Extension", "Tricep Rope Pushdown", "Concentration Curl"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Incline Dumbbell Curl", "Overhead Tricep Extension"],
    ["Incline Dumbbell Curl", "Skull Crusher (EZ Bar)", "Concentration Curl", "Tricep Rope Pushdown", "Reverse Curl", "Overhead Tricep Extension"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Concentration Curl", "Overhead Tricep Extension"],
    ["Incline Dumbbell Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Overhead Tricep Extension", "Tricep Rope Pushdown", "Reverse Curl"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Incline Dumbbell Curl", "Tricep Rope Pushdown", "Concentration Curl", "Overhead Tricep Extension"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Concentration Curl", "Overhead Tricep Extension"],
  ],
  Legs: [
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)", "Leg Extension (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Leg Curl (Machine)", "Walking Lunge", "Leg Extension (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Leg Press", "Glute Bridge / Hip Thrust", "Walking Lunge", "Leg Curl (Machine)", "Leg Extension (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Leg Press", "Walking Lunge", "Leg Extension (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)", "Leg Extension (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Leg Press", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Walking Lunge", "Leg Extension (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)", "Leg Extension (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Leg Press", "Walking Lunge", "Leg Extension (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)", "Leg Extension (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Walking Lunge", "Leg Curl (Machine)", "Leg Extension (Machine)", "Standing Calf Raise"],
  ],
  Shoulders: [
    ["Seated DB Shoulder Press", "Arnold Press", "Lateral Raise", "Rear Delt Fly", "Dumbbell Shrug", "Front Raise", "Cable Lateral Raise"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Dumbbell Shrug", "Cable Lateral Raise", "Front Raise"],
    ["Seated DB Shoulder Press", "Arnold Press", "Rear Delt Fly", "Lateral Raise", "Dumbbell Shrug", "Front Raise", "Cable Lateral Raise"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Arnold Press", "Dumbbell Shrug", "Cable Lateral Raise", "Front Raise"],
    ["Seated DB Shoulder Press", "Arnold Press", "Lateral Raise", "Rear Delt Fly", "Dumbbell Shrug", "Front Raise", "Cable Lateral Raise"],
    ["Seated DB Shoulder Press", "Rear Delt Fly", "Arnold Press", "Lateral Raise", "Dumbbell Shrug", "Cable Lateral Raise", "Front Raise"],
    ["Seated DB Shoulder Press", "Arnold Press", "Lateral Raise", "Rear Delt Fly", "Dumbbell Shrug", "Front Raise", "Cable Lateral Raise"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Dumbbell Shrug", "Cable Lateral Raise", "Front Raise"],
    ["Seated DB Shoulder Press", "Arnold Press", "Rear Delt Fly", "Lateral Raise", "Dumbbell Shrug", "Front Raise", "Cable Lateral Raise"],
    ["Seated DB Shoulder Press", "Arnold Press", "Lateral Raise", "Rear Delt Fly", "Dumbbell Shrug", "Front Raise", "Cable Lateral Raise"],
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
const LOGS_KEY = "workout-logs-v1";
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

  // ── Session log state ──
  // logs: { "scheduleIdx-exIdx": [ {set, weight, reps, note}, ... ] }
  const [logs, setLogs] = useState({});
  const [activeLog, setActiveLog] = useState(null); // "scheduleIdx-exIdx"
  const [logDraft, setLogDraft] = useState([]); // array of {weight, reps, note} per set

  // Load logs on mount (append to existing mount loader via separate call)
  useState(() => {
    (async () => {
      try {
        const vl = localStorage.getItem(LOGS_KEY);
        if (vl) {
          const parsed = JSON.parse(vl);
          if (parsed && typeof parsed === "object") setLogs(parsed);
        }
      } catch (e) {}
    })();
  }, []);

  const saveLogsToStorage = (newLogs) => {
    try { localStorage.setItem(LOGS_KEY, JSON.stringify(newLogs)); } catch (e) {}
  };

  const getLogKey = (schedIdx, exIdx) => `${schedIdx}-${exIdx}`;

  const openLog = (schedIdx, exIdx, numSets) => {
    const key = getLogKey(schedIdx, exIdx);
    const existing = logs[key] || [];
    // Pre-fill draft with existing entries or empty slots
    const draft = Array.from({ length: numSets }, (_, i) => ({
      weight: existing[i]?.weight || "",
      reps: existing[i]?.reps || "",
      note: existing[i]?.note || "",
    }));
    setLogDraft(draft);
    setActiveLog(key);
  };

  const saveLog = (key) => {
    const filled = logDraft.filter(s => s.weight || s.reps);
    const newLogs = { ...logs, [key]: filled.length ? logDraft : [] };
    setLogs(newLogs);
    saveLogsToStorage(newLogs);
    setActiveLog(null);
  };

  const clearLog = (key) => {
    const newLogs = { ...logs };
    delete newLogs[key];
    setLogs(newLogs);
    saveLogsToStorage(newLogs);
    setActiveLog(null);
  };

  const updateLogDraft = (setIdx, field, value) => {
    setLogDraft(prev => prev.map((s, i) => i === setIdx ? { ...s, [field]: value } : s));
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

                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 10 }}>Exercises this session</div>

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

                    return (
                      <div key={i} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${guideOpen ? group.color : isCustomised ? "#4CAF50" : "#eee"}` }}>
                        {/* Exercise row */}
                        <div style={{ padding: "10px 12px", background: guideOpen ? group.bg : "#fff" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ fontWeight: 700, fontSize: 13, color: "#1C1C1C" }}>{displayName}</div>
                                {isCustomised && <span style={{ fontSize: 9, background: "#E8F5E9", color: "#4CAF50", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>EDITED</span>}
                              </div>
                              <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 11, background: "#F5F5F5", borderRadius: 5, padding: "2px 7px", color: "#555" }}>
                                  {displaySets} sets × {displayReps} reps
                                </span>
                                <span style={{ fontSize: 11, background: group.bg, borderRadius: 5, padding: "2px 7px", color: group.color, fontWeight: 700 }}>
                                  🏋️ {displayWeight}
                                </span>
                              </div>
                              {plateNote && (
                                <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>📐 {plateNote}</div>
                              )}
                              {/* Log summary */}
                              {(() => {
                                const logKey = getLogKey(selected, i);
                                const entry = logs[logKey];
                                if (!entry || !entry.length) return null;
                                const filled = entry.filter(s => s.weight || s.reps);
                                if (!filled.length) return null;
                                return (
                                  <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {filled.map((s, si) => (
                                      <span key={si} style={{ fontSize: 10, background: "#EEF4FB", color: "#1A6FA8",
                                        borderRadius: 5, padding: "2px 7px", fontWeight: 600 }}>
                                        Set {si+1}: {s.weight && `${s.weight}`}{s.weight && s.reps && " · "}{s.reps && `${s.reps} reps`}{s.note && ` (${s.note})`}
                                      </span>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                            <div style={{ display: "flex", gap: 6, marginLeft: 8, marginTop: 2 }}>
                              {editMode && (
                                <button
                                  onClick={() => openEditForm(selEntry.group, weekIdx, i)}
                                  style={{ background: "#4CAF50", color: "#fff", border: "none", borderRadius: 8,
                                    padding: "5px 9px", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                  ✏️
                                </button>
                              )}
                              {/* Log button */}
                              {(() => {
                                const logKey = getLogKey(selected, i);
                                const hasLog = logs[logKey]?.some(s => s.weight || s.reps);
                                const numSets = parseInt(displaySets) || 3;
                                return (
                                  <button
                                    onClick={() => openLog(selected, i, numSets)}
                                    style={{ background: hasLog ? "#EEF4FB" : "#F0F0F0",
                                      color: hasLog ? "#1A6FA8" : "#555",
                                      border: hasLog ? "1px solid #1A6FA8" : "none",
                                      borderRadius: 8, padding: "5px 9px", fontSize: 10, fontWeight: 700,
                                      cursor: "pointer", whiteSpace: "nowrap" }}>
                                    {hasLog ? "📝✓" : "📝"}
                                  </button>
                                );
                              })()}
                              <button
                                onClick={() => setOpenGuide(guideOpen ? null : guideKey)}
                                style={{ background: guideOpen ? group.color : "#F0F0F0", color: guideOpen ? "#fff" : "#555",
                                  border: "none", borderRadius: 8, padding: "5px 9px", fontSize: 10, fontWeight: 700,
                                  cursor: "pointer", whiteSpace: "nowrap" }}>
                                {guideOpen ? "✕" : "📖"}
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
                            {ex.alt && (
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>⟳ No Equipment Alternative</div>
                                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{ex.alt}</div>
                              </div>
                            )}
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

      {/* ── LOG MODAL ── */}
      {activeLog && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#fff", width: "100%", borderRadius: "16px 16px 0 0", padding: "20px 16px 36px", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}>📝 Log Actual Performance</div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>
              Enter what you actually lifted. Leave blank if you skipped a set.
            </div>

            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
              {["Set", "Weight", "Reps", "Note"].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>

            {logDraft.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr 1fr", gap: 8, marginBottom: 10, alignItems: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#888", textAlign: "center",
                  background: "#F5F5F5", borderRadius: 6, padding: "8px 0" }}>{i + 1}</div>
                <input value={s.weight} onChange={e => updateLogDraft(i, "weight", e.target.value)}
                  placeholder="e.g. 50kg" inputMode="decimal"
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 12, width: "100%", boxSizing: "border-box" }} />
                <input value={s.reps} onChange={e => updateLogDraft(i, "reps", e.target.value)}
                  placeholder="e.g. 8" inputMode="numeric"
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 12, width: "100%", boxSizing: "border-box" }} />
                <input value={s.note} onChange={e => updateLogDraft(i, "note", e.target.value)}
                  placeholder="e.g. easy"
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 12, width: "100%", boxSizing: "border-box" }} />
              </div>
            ))}

            {/* Tip */}
            <div style={{ background: "#FFF8E1", borderRadius: 8, padding: "8px 12px", marginTop: 4, marginBottom: 16, fontSize: 11, color: "#C07A20", lineHeight: 1.5 }}>
              💡 If you hit all reps easily → go heavier next session. If you couldn't complete the reps → keep the same weight until you can.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => saveLog(activeLog)}
                style={{ flex: 1, background: "#1A6FA8", color: "#fff", border: "none", borderRadius: 10,
                  padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Save Log
              </button>
              <button onClick={() => clearLog(activeLog)}
                style={{ background: "#FFF0EE", color: "#E8533F", border: "1px solid #E8533F", borderRadius: 10,
                  padding: "12px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Clear
              </button>
              <button onClick={() => setActiveLog(null)}
                style={{ background: "#F5F5F5", color: "#888", border: "none", borderRadius: 10,
                  padding: "12px 14px", fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
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

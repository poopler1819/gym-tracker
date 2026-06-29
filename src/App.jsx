import { useState, useMemo } from "react";

// ─── SWAP GUIDES LIBRARY ─────────────────────────────────────────────────────
const SWAP_GUIDES = {
  "Assisted Pull-Up Machine": "Set the counterweight so you can complete 8–10 reps. Grip the handles, kneel or stand on the platform. Pull until chin clears the bar, lower slowly. Reduce assistance by 5 kg every 2 weeks.",
  "Band Pull-Apart": "Hold a resistance band at shoulder height with both hands, arms straight. Pull the band apart by squeezing your shoulder blades together until hands are at your sides. Return slowly. Great for rear delts and posture.",
  "Barbell Flat Press": "Same as Smith flat bench but using a free barbell. Lie flat, grip just wider than shoulder-width. Lower to mid-chest, press up. Requires a spotter — don't attempt heavy without one.",
  "Barbell Front Raise": "Hold a barbell with overhand grip, hands shoulder-width. Raise the bar forward to shoulder height with a slight elbow bend. Lower slowly. Targets front deltoid.",
  "Barbell Overhead Press": "Stand or sit, grip barbell just outside shoulder-width. Press directly overhead to full extension. Lower to chin level. Keep core tight to protect your lower back.",
  "Barbell Shrug": "Hold a barbell at hip level with overhand grip. Shrug shoulders straight up toward ears, hold 1 second, lower slowly. Keep neck neutral — don't roll shoulders.",
  "Barbell Wrist Curl": "Sit on a bench, forearms resting on thighs, palms up. Hold a barbell and curl wrists upward as far as possible. Lower slowly. Builds forearm flexors.",
  "Behind-Back Barbell Shrug": "Hold barbell behind your thighs. Shrug straight up. This angle targets the upper traps slightly differently to front shrugs. Keep the bar close to your body.",
  "Belt Squat Machine": "Load the machine, stand on the platforms with the belt around your hips. Descend into a squat with an upright torso. No spinal loading — great for leg training without back fatigue.",
  "Bent-Over Dumbbell Rear Fly": "Hinge forward at hips until torso is nearly parallel to floor. Hold dumbbells hanging down. Raise both arms out to the sides like wings, squeezing rear delts at the top. Lower slowly.",
  "Bent-Over Rear Delt Fly": "Same as Bent-Over Dumbbell Rear Fly. Hinge at hips, raise arms laterally, lead with elbows. Keep a slight bend in elbows throughout.",
  "Bodyweight Push-Up (slow tempo)": "Standard push-up position. Lower your chest to 2–3 cm from the floor over 4 seconds, press up over 1 second. The slow descent massively increases the stimulus without needing weight.",
  "Cable Calf Raise": "Attach an ankle strap to a low cable. Stand on a step or platform, pull the cable upward by rising onto the balls of your feet. Full range of motion — deep stretch at the bottom, full squeeze at the top.",
  "Cable Chest Press": "Set cables at chest height. Stand in the centre, step forward. Press both handles forward and slightly inward, arms extending to near full extension. Return slowly with control.",
  "Cable Chest Press (low pulley)": "Set cables at the lowest position. Stand in the centre, press handles upward and inward in an arc toward chest height. Targets the lower chest with constant tension.",
  "Cable Crossover (arms low)": "Set cables at lowest position. Bring handles upward and together at chest height in a fly motion. Targets the lower chest sweep.",
  "Cable Crossover (high to low)": "Set cables at the highest position. Pull handles downward and together in front of your hips. Targets the lower chest. Lean slightly forward for better range.",
  "Cable Crossover (high to mid)": "Set cables high. Pull handles down and together at chest height. Good all-round chest isolation with constant tension through the full arc.",
  "Cable Crossover (low to mid)": "Set cables at the lowest position. Raise handles upward and together at chest height. Targets the lower chest sweep effectively.",
  "Cable Crossover (mid)": "Set cables at chest height. Bring handles together in front of chest in a fly motion. Classic chest isolation movement with constant tension.",
  "Cable Crossover Front Raise": "Attach a straight bar or single handle to a low cable. Stand facing away and raise the cable forward to shoulder height. Constant tension on the front delt throughout.",
  "Cable Curl (low pulley)": "Attach a straight bar or EZ bar to a low cable. Curl the bar toward your chin keeping elbows pinned to your sides. Cable provides constant tension at the top where dumbbells go slack.",
  "Cable Drag Curl": "Hold a low cable with a straight bar. Instead of curling upward, drag the bar up along your torso — elbows travel back, not forward. Uniquely loads the bicep peak.",
  "Cable Front Raise": "Attach a straight bar to a low cable. Stand facing away, raise the bar forward to shoulder height. Constant tension throughout unlike dumbbells.",
  "Cable Glute Kickback": "Attach ankle strap to a low cable. Face the machine, hold the frame. Kick one leg back and up, squeezing the glute at the top. Keep a slight knee bend. Controlled return.",
  "Cable Hammer Curl": "Attach a rope to a low cable. Curl with a neutral grip (thumbs up), keeping elbows pinned. Same brachialis and brachioradialis stimulus as dumbbell hammer curls but with constant cable tension.",
  "Cable Incline Press": "Set cables low, set bench to 45° incline in the centre of the cable station. Press handles upward at an incline angle. Targets the upper chest with constant tension.",
  "Cable Leg Curl (ankle strap)": "Attach ankle strap to a low cable. Face the machine, hold the frame for support. Curl one heel toward your glutes, squeezing the hamstring at the top. Lower slowly.",
  "Cable Leg Extension (ankle strap)": "Attach ankle strap to a low cable. Face away from the machine. Extend one leg forward against the cable resistance. Isolates the quad with constant tension.",
  "Cable Overhead Tricep Extension": "Attach a rope to a high cable. Face away from the machine. Hold the rope behind your head with elbows framing your face. Extend arms forward to full extension. Targets the long head of the tricep.",
  "Cable Pull-Through": "Attach a rope to a low cable. Stand facing away, feet shoulder-width, rope between your legs. Hinge at hips, letting the rope pull through, then drive hips forward to standing. Targets the glutes and hamstrings.",
  "Cable Pullover": "Set a cable at the highest point. Stand facing the machine with a straight bar attachment. Pull the bar down in an arc from overhead to your thighs with arms mostly extended. Targets lats and chest.",
  "Cable Rear Delt Fly": "Set cables at shoulder height. Stand in the centre and cross your arms to grab opposite handles. Pull handles outward to your sides, squeezing rear delts. Return with control.",
  "Cable Reverse Curl": "Attach a straight bar to a low cable. Grip overhand (palms down). Curl the bar toward your chin. Targets the brachioradialis and forearm extensors.",
  "Cable Row (underhand grip)": "Sit at a low cable, attach a straight bar. Grip underhand (palms up). Row to your lower abs. Underhand grip slightly increases bicep involvement and changes the angle of lat recruitment.",
  "Cable Row (underhand)": "Same as Cable Row underhand grip. Palms face up, row to lower abdomen, elbows travel close to your sides.",
  "Cable Row (wide grip)": "Sit at a low cable with a wide bar attachment. Grip wide, row to your upper abs. Wide grip targets the outer lats and rear delts more than a close grip.",
  "Cable Shoulder Press": "Set cables at shoulder height on both sides. Sit or stand in the centre. Press both handles overhead simultaneously. Constant tension through the full range unlike dumbbells.",
  "Cable Shrug": "Attach a straight bar to a low cable. Stand and shrug the bar upward. Cable keeps constant tension at the bottom of the movement where a barbell shrug is weakest.",
  "Cable Single-Arm Row": "Attach a D-handle to a low cable. Sit or stand, row with one arm at a time. Drive elbow back and up. Great for targeting each side independently.",
  "Cable Split Squat": "Attach a D-handle to a low cable at hip height. Stand side-on, hold handle for light assistance/resistance. Perform a split squat. The cable adds a stability challenge.",
  "Cable Straight-Arm Pulldown": "Stand at a high cable with a straight bar or rope. Arms extended, slight elbow bend. Pull the bar down in an arc to your thighs. Keep arms straight throughout. Isolates the lats without bicep involvement.",
  "Cable Tricep Pushdown (bar)": "Attach a straight bar to a high cable. Push the bar downward to full arm extension, elbows pinned to sides. Hold 1 second at the bottom. The bar grip allows slightly heavier loading than a rope.",
  "Cable W-Raise": "Set cables at shoulder height. Pull both handles toward your face with elbows flaring high and wide, forming a W shape with your arms at the peak. Hits rear delts and rotator cuff.",
  "Cable Wrist Curl": "Attach a straight bar to a low cable. Sit with forearms on your thighs, palms up. Curl wrists upward against the cable resistance. Constant tension builds forearm flexors effectively.",
  "Cable Y-Raise": "Set cables low. Raise both arms upward and outward in a Y shape, thumbs pointing up. Hold briefly at the top. Targets the lower and mid traps and rear delts — great for posture and shoulder health.",
  "Chest-Supported Dumbbell Row": "Set a bench to 30–45° incline. Lie face-down with your chest on the pad. Hold dumbbells hanging below. Row both dumbbells up simultaneously. The bench eliminates lower back fatigue so you can focus purely on the back.",
  "Cross-Body Hammer Curl": "Hold a dumbbell in one hand. Curl it across your body toward the opposite shoulder instead of straight up. Targets the brachialis and outer bicep head from a different angle.",
  "Dips (assisted machine)": "Use the counterweighted dip machine. Grip the handles, lower your body until elbows reach 90°, press back up. Targets triceps primarily with some chest involvement. Reduce assistance over time.",
  "Donkey Calf Raise Machine": "Pad sits across your lower back. Rise onto the balls of your feet as high as possible, lower with a full stretch. The bent-over position uniquely stretches the gastrocnemius for greater growth stimulus.",
  "Dumbbell Flat Press": "Lie flat on a bench. Hold dumbbells at chest level, elbows at 45°. Press upward bringing dumbbells slightly together at the top. Greater range of motion than a barbell. Lower slowly for a full chest stretch.",
  "Dumbbell Fly (flat bench)": "Lie flat, hold dumbbells above chest with a slight elbow bend. Lower arms out to sides in an arc until you feel a deep chest stretch. Squeeze chest to bring dumbbells back together. Keep elbow angle fixed throughout.",
  "Dumbbell Fly (slight decline)": "Lie on a very slightly declined bench. Perform the same fly movement as flat. The slight decline shifts focus to the lower chest fibres.",
  "Dumbbell Kickback": "Hinge forward at the hips. Hold a dumbbell, upper arm parallel to the floor. Extend your forearm back to full arm extension, squeezing the tricep at the top. Return slowly. Keep upper arm completely still.",
  "Dumbbell Lateral Raise": "Stand with dumbbells at sides. Raise arms out to shoulder height with a slight elbow bend. Lead with elbows, not hands. Lower slowly over 3 seconds. Same as the standard lateral raise in your programme.",
  "Dumbbell Pullover (on bench)": "Lie across a flat bench with upper back on the pad, hips dropped. Hold one dumbbell with both hands overhead. Lower it back in an arc over your head, feel the lat and chest stretch, return to start.",
  "Dumbbell Reverse Curl": "Hold dumbbells with an overhand grip (palms down). Curl toward shoulders. Targets the brachioradialis and forearm extensors. Much lighter than a regular curl is normal.",
  "Dumbbell Shoulder Press (partial rotation)": "Start with dumbbells at ear level, palms facing slightly inward. Press upward rotating palms to face forward at the top. A simplified Arnold Press for those finding the full rotation awkward.",
  "Dumbbell Skull Crusher": "Lie on a bench, hold two dumbbells above your chest with elbows slightly angled back. Bend at the elbows lowering the dumbbells toward your temples. Press back up. More wrist-friendly than an EZ bar for some people.",
  "EZ Bar Close-Grip Press": "Lie on a bench, grip the EZ bar on the inner grip (narrow). Lower to your chest, press up with elbows tucked close. Primarily a tricep exercise with some chest involvement.",
  "EZ Bar Curl": "Hold the EZ bar on the outer angled grips. Curl toward your chin with elbows pinned. The angled grip reduces wrist strain compared to a straight bar while loading the bicep equally.",
  "EZ Bar Overhead Extension": "Hold the EZ bar overhead on the inner grip. Lower behind your head by bending only at the elbows. Press back up. More comfortable on wrists than a dumbbell for heavier loading.",
  "EZ Bar Reverse Curl": "Grip the EZ bar overhand on the outer grips. Curl toward your chin. The angled grip is more comfortable on the wrists than a straight bar for reverse curling.",
  "EZ Bar Skull Crusher": "Same as Skull Crusher EZ Bar in your programme. Lie on bench, lower the bar to your forehead by bending only at the elbows. Press back up.",
  "Glute Ham Raise": "Anchor your feet on the GHR machine. Lower your body forward by bending at the knees, using your hamstrings to control the descent. Pull yourself back up by contracting the hamstrings and glutes. Very challenging — use assistance if needed.",
  "Glute Kickback Machine": "Kneel on the machine pad, place one foot on the kick plate. Push the plate back and up, squeezing the glute at full extension. Return with control. Isolates the glute without loading the spine.",
  "Hack Squat Machine": "Load the machine, place feet shoulder-width on the platform. Lower the sled until knees reach 90°, press back up. Similar to leg press but more upright torso. Targets quads heavily.",
  "Hack Squat Machine (narrow)": "Same as Hack Squat but with feet closer together. Narrow stance shifts more emphasis to the outer quad (vastus lateralis), giving the thigh a more defined look from the front.",
  "Hammer Strength Chest Press": "Sit in the machine, grip the handles at chest height. Press forward to near full extension. Hammer Strength machines provide an independent arm movement which helps correct strength imbalances between sides.",
  "Hammer Strength Incline": "Same as Hammer Strength Chest Press but on the incline version. Targets the upper chest. Each arm moves independently.",
  "Hammer Strength Incline Press": "Sit in the incline Hammer Strength machine. Press handles forward and slightly upward. The independent arm movement allows full range without the instability of dumbbells.",
  "Hammer Strength Lat Pulldown": "Sit at the machine, grip the handles overhead. Pull down to upper chest leading with elbows. The independent arm movement helps identify and correct lat imbalances between sides.",
  "Hammer Strength Row": "Sit facing the machine, chest on the pad. Row handles toward your lower chest. Each arm moves independently. The chest support eliminates lower back involvement completely.",
  "Hammer Strength Shoulder Press": "Sit in the machine, grip the handles at ear level. Press overhead. The machine guides the path so you can focus entirely on loading the deltoids without stability concerns.",
  "Hammer Strength Single-Arm Row": "Same as Hammer Strength Row but using one arm at a time. Allows you to focus entirely on one side. Greater range of motion and mind-muscle connection per side.",
  "Hex Bar Shrug": "Stand inside a hex/trap bar, grip the handles at your sides. Shrug straight up. The neutral grip position is easier on the wrists and allows heavier loading than a straight barbell shrug.",
  "Incline Barbell Press": "Set bench to 30–45°. Use a free barbell. Grip slightly narrower than flat bench. Lower to upper chest. Requires a spotter for heavier weights. Targets the upper chest.",
  "Incline Dumbbell Front Raise": "Sit on an incline bench facing forward. Hold dumbbells at your sides. Raise arms forward to shoulder height. The incline increases the range of motion and stretch on the front delt.",
  "Incline Dumbbell Pullover": "Lie on an incline bench with upper back on the pad. Hold one dumbbell overhead with both hands. Lower in an arc over your head, feel the stretch, return. The incline changes the lat and chest stretch angle.",
  "Incline Smith Machine Press": "Set bench to 30–45° inside the Smith machine. Grip slightly narrower than flat press. Lower bar to upper chest, press up. Fixed path makes it stable and safe without a spotter.",
  "Inverted Row (Smith Machine)": "Set the Smith bar at hip height. Lie underneath it, grip overhand. Keep your body straight like a reverse push-up. Pull your chest to the bar. The lower the bar, the harder it is. Great bodyweight back exercise.",
  "Kneeling Cable Pulldown": "Kneel facing a high cable. Grip a wide bar or rope overhead. Pull it down to your upper chest leading with your elbows. Kneeling removes the ability to use body momentum — pure lat work.",
  "Landmine Press": "Insert a barbell into a landmine attachment or wedge one end into a corner. Hold the other end at shoulder height with one or both hands. Press upward and forward in an arc. Shoulder-friendly pressing movement.",
  "Landmine Row": "Straddle a landmine barbell, hinge at hips. Grip the end of the bar with both hands. Row the bar to your lower chest. The arc of the movement hits the mid-back from a unique angle.",
  "Landmine Single-Arm Row": "Same as Landmine Row but using one hand. Stand to the side of the landmine, hinge at hips, row the bar to your hip. Each side works independently.",
  "Lat Pushdown (machine)": "Use a cable or dedicated machine with a straight bar at the top. Stand or sit, arms extended. Push the bar down in an arc toward your thighs. Different from a pulldown as the arms stay mostly straight — isolates the lower lats.",
  "Leaning Cable Lateral Raise": "Hold a low cable with your outside hand. Lean away from the machine so your body is at an angle. Raise the cable arm out to the side. The lean creates a pre-stretch on the delt at the bottom for greater range of motion.",
  "Leg Press (close stance)": "Same as Leg Press but with feet close together in the centre of the platform. Close stance targets the outer quad (vastus lateralis) more and reduces glute involvement.",
  "Leg Press (single leg)": "Perform the leg press with one leg only. Place one foot in the centre of the platform. Press through the heel. Helps identify and correct strength imbalances between legs.",
  "Leg Press Calf Raise": "On the leg press machine, push the sled up and lock your knees. Place only the balls of your feet on the bottom edge of the platform. Rise as high as possible, lower for a full stretch. Safe and effective calf isolation.",
  "Low Cable Row (wide grip)": "Sit at a low cable with a wide bar. Grip wide, row to your upper abdomen. Wide grip targets the outer lats and rear delts. Keep torso upright throughout.",
  "Low Cable Single-Arm Row": "Attach a D-handle to a low cable. Sit or stand, row with one arm. Pull the handle to your hip. Independent arm work helps correct left-right imbalances.",
  "Machine Bicep Curl": "Sit at the preacher or bicep curl machine. Grip the handles and curl against the machine's resistance. The machine locks your upper arms in place for pure bicep isolation.",
  "Machine Chest Fly": "Sit at the pec deck or chest fly machine. Set the arms to your wingspan. Bring the pads together in front of your chest, squeezing hard at the peak. Return slowly. Pure chest isolation with no stabiliser involvement.",
  "Machine Chest Fly (lower arc)": "Same as Machine Chest Fly but set the seat higher so the movement arc targets the lower chest fibres. Squeeze hard at the peak.",
  "Machine Chest Press": "Sit in the chest press machine, adjust seat so handles align with mid-chest. Press forward to near full extension. Return slowly. Safe and easy to load — good for training alone.",
  "Machine Curl (neutral grip)": "Use a machine with neutral grip handles. Curl against the machine's resistance with palms facing each other. Targets the brachialis alongside the bicep.",
  "Machine Front Raise": "Sit at a cable or lever machine set for front raises. Raise the handles from your sides to shoulder height. Machine keeps constant tension compared to dumbbells.",
  "Machine Incline Press": "Sit in the incline chest press machine. Adjust seat for handles at upper chest level. Press upward and slightly forward. Targets the upper chest safely.",
  "Machine Lateral Raise": "Sit at a lateral raise machine, place your arms against the pads. Raise arms out to shoulder height against the machine's resistance. Removes the need for balance and allows pure side delt isolation.",
  "Machine Lateral Raise (unilateral)": "Same as Machine Lateral Raise but one arm at a time. Allows you to focus on each delt independently and correct any imbalances.",
  "Machine Rear Delt Fly": "Sit facing the pec deck machine. Grip the handles with arms extended forward. Pull the handles outward to your sides, squeezing the rear delts. Same as Reverse Pec Deck.",
  "Machine Row": "Sit at the row machine, chest against the pad. Row the handles toward your lower chest. The chest support eliminates lower back fatigue. Focus purely on squeezing the back.",
  "Machine Shoulder Press": "Sit in the shoulder press machine. Adjust the seat so handles are at ear level. Press overhead to full extension. Return slowly. Allows heavy loading without the stability demands of dumbbells.",
  "Machine Shrug": "Use a dedicated shrug machine or the Smith machine. Grip the handles and shrug straight up. Guided movement allows you to focus on trap contraction without grip or balance fatigue.",
  "Machine Tricep Extension": "Sit at a tricep extension machine, grip the handles overhead or at head height. Extend arms to full lockout. Return slowly. Full range without the wrist demands of free weights.",
  "Machine Tricep Press": "Sit at a tricep press-down machine. Push the handles downward to full arm extension. Hold 1 second at full lockout. Similar to a cable pushdown but with a guided movement arc.",
  "Neutral-Grip Pulldown": "Use a close neutral-grip attachment on a lat pulldown machine (palms facing each other). Pull to upper chest. Neutral grip reduces shoulder strain and allows strong lat contraction for most people.",
  "Nordic Hamstring Curl": "Kneel on a mat with feet anchored under a bench or machine. Keep your body straight and slowly lower yourself forward as far as you can control, using your hamstrings to brake the descent. Push yourself back up. One of the most effective hamstring exercises — start with partial range.",
  "Overhead Dumbbell Tricep Extension": "Same as the Overhead Tricep Extension in your programme. Sit upright, hold one dumbbell with both hands overhead. Lower behind your head, press back up. Long head of tricep stretch.",
  "Pec Deck Machine": "Sit upright, place your forearms on the pads. Bring the pads together in front of your chest by squeezing your pecs. Hold 1 second at the peak. Return slowly. One of the best pure chest isolation machines.",
  "Pec Deck Machine (lower setting)": "Same as Pec Deck but raise the seat height so the arc of the movement targets the lower chest fibres. The squeeze and hold at the peak remains the same.",
  "Pendulum Squat Machine": "Load the machine, stand on the platform with your back against the pad. Lower until knees reach 90°, drive back up. The pendulum arc makes this very knee-friendly compared to a standard squat.",
  "Plate Front Raise": "Hold a weight plate with both hands at 9 and 3 o'clock. Raise forward to shoulder height. The plate forces a neutral grip which feels more natural for front raises than dumbbells for many people.",
  "Preacher Curl Machine": "Sit at the preacher bench, upper arms on the angled pad. Curl the bar or handles toward your chin. The pad eliminates all swinging — pure bicep isolation with emphasis on the lower bicep.",
  "Rear Delt Dumbbell Fly": "Hinge forward at hips. Hold dumbbells, raise them out to the sides like wings. Same as Rear Delt Fly in your programme. Squeeze shoulder blades at the top.",
  "Resistance Machine Fly": "Any cable or lever-based chest fly machine. Bring the handles together in front of your chest in a hugging motion. Squeeze at the peak, return slowly.",
  "Reverse Barbell Curl": "Hold a barbell with an overhand grip. Curl toward your chin. Primarily targets the brachioradialis and forearm extensors. Much lighter than a regular curl is expected and normal.",
  "Reverse Dumbbell Curl": "Hold dumbbells with an overhand grip (palms down). Curl toward shoulders. Same forearm and brachioradialis stimulus as a reverse barbell curl.",
  "Reverse Pec Deck": "Sit facing the pec deck machine. Grip the handles with arms extended forward. Pull outward to your sides, squeezing rear delts at the end position. One of the best rear delt isolation exercises.",
  "Reverse-Grip Pushdown": "Use a straight bar on a high cable. Grip underhand (palms up). Push the bar down to full arm extension. This grip shifts more load to the medial tricep head and inner tricep.",
  "Rope Cable Curl (neutral grip)": "Attach a rope to a low cable. Curl with thumbs up (neutral grip). Targets the brachialis and outer bicep. The rope allows each hand to move slightly independently at the top.",
  "Scott Curl (EZ Bar)": "Use the preacher bench with an EZ bar. Same as a preacher curl but the angled EZ bar grip reduces wrist strain. Targets the lower and outer bicep strongly.",
  "Seated Calf Raise Machine": "Sit at the machine, pad across your knees. Rise onto the balls of your feet as high as possible, hold 1 second, lower for a full stretch. The seated position targets the soleus (deeper calf muscle) more than standing raises.",
  "Seated Chest Press Machine": "Sit upright in the chest press machine, handles at mid-chest. Press forward to near full extension. Same as Machine Chest Press.",
  "Seated Leg Curl Machine": "Sit in the machine, pad across the front of your ankles. Curl your heels downward against the resistance. The seated position puts the hamstring in a greater stretch than the lying version — more growth stimulus.",
  "Single-Arm Cable Curl": "Attach a D-handle to a low cable. Curl with one arm at a time. Allows you to focus on peak contraction and squeeze harder than with both arms working simultaneously.",
  "Single-Arm Cable Lateral Raise": "Attach a D-handle to a low cable on one side. Stand side-on, use the far hand to raise the cable arm out to shoulder height. One of the best lateral raise variations for constant tension.",
  "Single-Arm Cable Pushdown": "Attach a D-handle to a high cable. Push down with one arm at a time. Allows full concentration on each tricep head and helps correct any imbalance between arms.",
  "Single-Arm Lat Pulldown": "Use a D-handle on a lat pulldown cable. Pull down with one arm at a time. Allows greater range of motion per side and helps identify lat strength imbalances.",
  "Single-Arm Overhead Extension": "Hold one dumbbell in one hand overhead. Lower behind your head by bending at the elbow. Press back up. Same long head stretch as the two-handed version but isolates each arm.",
  "Single-Leg Calf Raise": "Stand on one foot on the edge of a step. Rise as high as possible, lower for a full stretch. Much more challenging than two-leg calf raises — add a dumbbell for extra resistance when bodyweight feels easy.",
  "Single-Leg Extension": "Perform the leg extension one leg at a time. Corrects quad strength imbalances between legs. Same form as the bilateral version.",
  "Single-Leg Hip Thrust": "Set up the same as a hip thrust but with one leg extended straight. Drive through the planted heel only. Much more challenging — the glute of the working leg takes all the load.",
  "Single-Leg Leg Press": "Perform the leg press with one leg. Place one foot in the centre of the platform. Press through the heel. Identifies and corrects leg strength imbalances.",
  "Single-Leg Lying Leg Curl": "Perform the lying leg curl with one leg at a time. Curl one heel toward your glute, lower slowly. Isolates each hamstring independently.",
  "Smith Machine Calf Raise": "Stand under the Smith machine bar across your upper back. Place the balls of your feet on a step or weight plate. Rise as high as possible, lower for a full stretch. Allows very heavy loading.",
  "Smith Machine Forward Lunge": "Stand under the Smith bar. Step one foot forward into a lunge position. Lower back knee toward the floor, press back up. The fixed bar path makes balance much easier than free weight lunges.",
  "Smith Machine Hip Thrust": "Same as the Glute Bridge Hip Thrust but using the Smith machine bar. Set the bar at hip height, sit with upper back on a bench, drive hips up. The bar moves in a fixed path which makes setup and loading easier.",
  "Smith Machine Incline Press (free)": "Set bench to 30–45° inside the Smith machine but angle the bench slightly off-centre if possible for a more natural press angle. Standard incline pressing movement.",
  "Smith Machine Overhead Press": "Sit or stand under the Smith machine bar at shoulder level. Grip just outside shoulder-width. Press overhead to full extension. Fixed path removes the balance demand — focus entirely on shoulder loading.",
  "Smith Machine Reverse Lunge": "Stand under the Smith bar. Step one foot backward into a reverse lunge. Lower the back knee toward the floor. More knee-friendly than forward lunges for most people.",
  "Smith Machine Shrug": "Set the Smith bar at hip height. Grip and shrug straight up. Fixed path allows heavy loading without grip or balance concerns.",
  "Smith Machine Step-Up": "Set the Smith bar across your upper back. Step up onto a bench or box. Drive through the lead heel. More stable than dumbbell step-ups allowing heavier loading.",
  "Spider Curl": "Lie face-down on an incline bench. Let your arms hang straight down. Curl the dumbbells or bar toward your chin. Gravity loads the bicep from a unique angle — excellent for peak contraction.",
  "Split Squat (Smith Machine)": "Stand in a split stance under the Smith bar. Lower your back knee toward the floor, press back up through the front heel. The bar adds load while the fixed path provides stability.",
  "Straight-Arm Cable Row": "Sit at a cable machine with a straight bar. Keep arms extended and row by pulling elbows back without bending the arms significantly. Different from a regular row — targets the lats with minimal bicep involvement.",
  "Swiss Ball Leg Curl": "Lie on your back, heels on a Swiss ball. Bridge your hips up. Pull the ball toward your glutes by bending your knees. Lower back out. Targets the hamstrings through a unique unstable range of motion.",
  "T-Bar Row": "Load one end of a barbell into a landmine or T-bar attachment. Straddle the bar, hinge at hips. Row both handles to your lower chest. Heavy compound back movement with a different grip angle to standard rows.",
  "Terminal Knee Extension (cable)": "Attach a band or low cable behind you at knee height. Step forward to create tension. Slightly bend the knee then straighten it against the resistance. Specifically targets the VMO (inner quad) — great for knee health.",
  "Tricep Dips (assisted machine)": "Use the counterweighted dip machine. Grip handles, lower body until elbows reach 90°, press back up. Tricep dips target all three tricep heads. Reduce assistance progressively over weeks.",
  "V-Bar Pushdown": "Attach a V-bar to a high cable. Push down to full arm extension with elbows pinned. The V-bar grip shifts load slightly to the medial tricep head compared to a rope which targets the lateral head more.",
  "V-Squat Machine": "Stand in the V-squat machine, back against the pad, feet on the platform. Lower until knees reach 90°, drive back up. More upright torso than a hack squat — takes pressure off the lower back.",
  "VMO Step-Up": "Perform a step-up focusing on a slow, controlled descent — 3 seconds down — with the knee tracking over the toes. Specifically targets the VMO (inner quad tear drop muscle) which is key for knee health and leg definition.",
  "Wrist Roller": "Hold a wrist roller device with arms extended in front. Roll the weight upward by rotating your wrists alternately. Roll back down slowly. Builds forearm size and grip strength comprehensively.",
  "Zottman Curl": "Curl the dumbbells upward with a supinated grip (palms up). At the top, rotate to a pronated grip (palms down). Lower slowly in the pronated position. Trains both the bicep and brachioradialis in one movement.",
  "45° Hyperextension": "Position yourself on the hyperextension bench at 45°. Cross arms over chest or hold a plate. Lower your torso until you feel a hamstring stretch, then raise back to parallel. Targets the lower back, glutes and hamstrings.",
  "Cable Drag Curl": "Hold a low cable bar. Instead of curling upward in an arc, drag the bar up along your torso with elbows travelling back. Uniquely loads the bicep peak through a different movement path.",
};

// ─── EXERCISE LIBRARY ────────────────────────────────────────────────────────
const EXERCISES = {
  "Flat Bench Press (Smith)": {
    sets: "4", reps: "6–8", baseWeight: 50, inc: 2.5, unit: "kg total",
    guide: "Set the Smith machine bar at chest height. Lie flat, grip slightly wider than shoulder-width. Lower bar to mid-chest over 2–3 seconds, press back up explosively. Keep shoulder blades pinched together throughout. Bar should touch just below your nipple line.",
    warmup: "1 set × 10 reps with bar only (15 kg), then 1 set × 6 reps at half your working weight.",
    swaps: ["Dumbbell Flat Press", "Machine Chest Press", "Cable Chest Press (low pulley)", "Hammer Strength Chest Press", "Barbell Flat Press", "Cable Crossover (mid)"],
  },
  "Incline Bench Press (Smith)": {
    sets: "4", reps: "8–10", baseWeight: 40, inc: 2.5, unit: "kg total",
    guide: "Set bench to 30–45°. Grip slightly narrower than flat bench. Lower bar to upper chest. Incline targets the upper chest — the area that makes your chest look fuller from the front. Control the descent.",
    warmup: "1 set × 10 reps bar only, then 1 light set at 60% working weight.",
    swaps: ["Incline Dumbbell Press", "Machine Incline Press", "Cable Incline Press", "Hammer Strength Incline Press", "Smith Machine Incline Press (free)", "Landmine Press"],
  },
  "Incline Dumbbell Press": {
    sets: "4", reps: "8–10", baseWeight: 14, inc: 1.25, unit: "kg each",
    guide: "Set bench to 30–45°. Hold dumbbells at chest level, elbows at 45°. Press upward and slightly inward. Lower slowly until you feel a full stretch in the upper chest. Control every rep.",
    warmup: "1 set × 10 reps at 8 kg each before working sets.",
    swaps: ["Incline Smith Machine Press", "Machine Incline Press", "Cable Incline Press", "Incline Barbell Press", "Hammer Strength Incline", "Seated Chest Press Machine"],
  },
  "Close-Grip Bench Press (Smith)": {
    sets: "3", reps: "8–10", baseWeight: 35, inc: 2.5, unit: "kg total",
    guide: "Hands shoulder-width or slightly closer. Shifts load from chest to triceps. Keep elbows tucked close to your body throughout. Full range of motion.",
    warmup: "1 set × 10 reps bar only.",
    swaps: ["EZ Bar Skull Crusher", "Tricep Rope Pushdown", "Machine Tricep Press", "Overhead Dumbbell Tricep Extension", "Cable Tricep Pushdown (bar)", "Dips (assisted machine)"],
  },
  "Cable Fly (mid)": {
    sets: "3", reps: "12–15", baseWeight: 10, inc: 1.25, unit: "kg each side",
    guide: "Set cables at chest height. Step forward, lean slightly. Arms wide, slight elbow bend — keep that bend fixed. Bring hands together in front of chest, squeeze hard for 1 second. Slowly return.",
    warmup: "No separate warm-up needed if done after press movements.",
    swaps: ["Pec Deck Machine", "Dumbbell Fly (flat bench)", "Machine Chest Fly", "Cable Crossover (low to mid)", "Resistance Machine Fly", "Cable Crossover (high to mid)"],
  },
  "Low Cable Fly": {
    sets: "3", reps: "12–15", baseWeight: 8, inc: 1, unit: "kg each side",
    guide: "Set both cables at the lowest position. Stand in the centre, step forward slightly. Raise both arms upward and inward in an arc, meeting at chest height. Squeeze the chest hard for 1 second at the top. Lower slowly.",
    warmup: "No separate warm-up needed if done after press movements.",
    swaps: ["Pec Deck Machine (lower setting)", "Machine Chest Fly (lower arc)", "Cable Crossover (high to low)", "Dumbbell Fly (slight decline)", "Resistance Machine Fly", "Cable Crossover (arms low)"],
  },
  "Double DB Bent-Over Row": {
    sets: "4", reps: "8–10", baseWeight: 18, inc: 1.25, unit: "kg each",
    guide: "Hinge at hips until torso is ~45°, slight knee bend. Row both dumbbells to your lower ribs simultaneously, driving elbows back and up. Squeeze shoulder blades together at the top for 1 second. Lower slowly. Keep your back flat.",
    warmup: "1 set × 10 reps at 10 kg each before working sets.",
    swaps: ["Chest-Supported Dumbbell Row", "Machine Row", "T-Bar Row", "Landmine Row", "Cable Row (wide grip)", "Hammer Strength Row"],
  },
  "Bent-Over Barbell Row (Smith)": {
    sets: "4", reps: "8–10", baseWeight: 40, inc: 2.5, unit: "kg total",
    guide: "Hinge at hips, overhand grip just outside shoulder-width. Pull bar to your lower abs. Elbows drive back and slightly flared. Return slowly.",
    warmup: "1 warm-up set × 10 reps bar only.",
    swaps: ["T-Bar Row", "Machine Row", "Landmine Row", "Chest-Supported Dumbbell Row", "Cable Row (underhand)", "Hammer Strength Row"],
  },
  "Lat Pulldown": {
    sets: "4", reps: "8–10", baseWeight: 35, inc: 2.5, unit: "kg stack",
    guide: "Sit with thighs under pads. Wide overhand grip. Lean back slightly (15°). Pull bar to your upper chest, leading with your elbows. Squeeze lats at the bottom. Slowly return to full arm extension.",
    warmup: "1 set × 10 reps at 15 kg before working weight.",
    swaps: ["Assisted Pull-Up Machine", "Single-Arm Lat Pulldown", "Cable Row (wide grip)", "Hammer Strength Lat Pulldown", "Straight-Arm Pulldown", "Neutral-Grip Pulldown"],
  },
  "Pull-Up": {
    sets: "4", reps: "6–10", baseWeight: 0, inc: 0, unit: "bodyweight",
    guide: "Hang with overhand grip, hands shoulder-width or wider. Pull until chin clears the bar, driving elbows down and back. Fully extend arms at the bottom. Use the assisted pull-up machine or a resistance band if needed.",
    warmup: "2–3 slow negatives (jump to top, lower slowly over 5 sec).",
    swaps: ["Assisted Pull-Up Machine", "Lat Pulldown", "Neutral-Grip Pulldown", "Single-Arm Lat Pulldown", "Hammer Strength Lat Pulldown", "Inverted Row (Smith Machine)"],
  },
  "Seated Cable Row": {
    sets: "3", reps: "10–12", baseWeight: 30, inc: 2.5, unit: "kg stack",
    guide: "Sit upright, feet on platform, slight knee bend. Row the handle to your navel. Elbows travel back close to your sides. At the end, squeeze shoulder blades together and hold 1 second. Return with control, letting shoulder blades protract fully.",
    warmup: "No separate warm-up if done after compound rows.",
    swaps: ["Chest-Supported Dumbbell Row", "Machine Row", "Hammer Strength Row", "Cable Row (underhand grip)", "Low Cable Row (wide grip)", "Landmine Row"],
  },
  "Single-Arm DB Row": {
    sets: "3", reps: "10–12 each", baseWeight: 20, inc: 1.25, unit: "kg",
    guide: "Place one hand and same-side knee on a bench. Row the dumbbell to your hip — not your armpit. Drive elbow toward the ceiling. At the top, your elbow should be higher than your back. Hold 1 second, lower slowly.",
    warmup: "2–3 reps at light weight to rehearse the path.",
    swaps: ["Cable Single-Arm Row", "Chest-Supported Dumbbell Row", "Machine Row", "Hammer Strength Single-Arm Row", "Landmine Single-Arm Row", "Low Cable Single-Arm Row"],
  },
  "Face Pull": {
    sets: "3", reps: "15", baseWeight: 12, inc: 1.25, unit: "kg stack",
    guide: "Set cable at forehead height, use rope attachment. Pull rope to your face, splitting it so hands go either side of your head, elbows flare high and wide. Targets the rear delts and rotator cuff. Go light and focus on the squeeze.",
    warmup: "Not required.",
    swaps: ["Reverse Pec Deck", "Rear Delt Dumbbell Fly", "Cable Rear Delt Fly", "Bent-Over Rear Delt Fly", "Band Pull-Apart", "Machine Rear Delt Fly"],
  },
  "Barbell Bicep Curl": {
    sets: "4", reps: "8–10", baseWeight: 20, inc: 1.25, unit: "kg total",
    guide: "Stand with EZ bar or straight bar. Underhand grip shoulder-width. Keep elbows pinned to your sides. Curl to chin height, squeeze hard, lower slowly over 3 seconds. Don't swing your back.",
    warmup: "1 set × 12 reps at bar only (10 kg).",
    swaps: ["EZ Bar Curl", "Cable Curl (low pulley)", "Preacher Curl Machine", "Spider Curl", "Machine Bicep Curl", "Reverse Barbell Curl"],
  },
  "Incline Dumbbell Curl": {
    sets: "3", reps: "10–12", baseWeight: 9, inc: 1, unit: "kg each",
    guide: "Set bench to 60°. Sit back and let arms hang behind your torso. This pre-stretches the bicep. Curl without letting elbows travel forward. Go lighter than you think.",
    warmup: "Not required — done after barbell curls.",
    swaps: ["Cable Curl (low pulley)", "Preacher Curl Machine", "Spider Curl", "Single-Arm Cable Curl", "Machine Bicep Curl", "Scott Curl (EZ Bar)"],
  },
  "Hammer Curl": {
    sets: "3", reps: "10–12", baseWeight: 10, inc: 1, unit: "kg each",
    guide: "Neutral grip (palms facing each other). Curl upward keeping the neutral grip throughout. Targets the brachialis which pushes the bicep up, making arms look thicker. Keep elbows fixed.",
    warmup: "Not required.",
    swaps: ["Rope Cable Curl (neutral grip)", "Cross-Body Hammer Curl", "Machine Curl (neutral grip)", "Cable Hammer Curl", "Reverse Dumbbell Curl", "Zottman Curl"],
  },
  "Skull Crusher (EZ Bar)": {
    sets: "4", reps: "8–10", baseWeight: 20, inc: 1.25, unit: "kg total",
    guide: "Lie on bench, EZ bar above your chest. Lower bar to your forehead by bending elbows only — upper arms stay vertical. Press back up to full extension. Keep upper arms perpendicular to the floor throughout.",
    warmup: "1 set × 10 reps at bar only (10 kg).",
    swaps: ["Cable Overhead Tricep Extension", "Dumbbell Skull Crusher", "Machine Tricep Extension", "EZ Bar Close-Grip Press", "Cable Tricep Pushdown (bar)", "Dips (assisted machine)"],
  },
  "Tricep Rope Pushdown": {
    sets: "3", reps: "10–12", baseWeight: 15, inc: 1.25, unit: "kg stack",
    guide: "Set cable high, attach rope. Elbows pinned to sides. Push rope down, splitting the ends apart at the bottom for full contraction. Hold 1 second at full extension. Return slowly.",
    warmup: "Not required.",
    swaps: ["V-Bar Pushdown", "Single-Arm Cable Pushdown", "Machine Tricep Press", "Cable Tricep Pushdown (bar)", "Reverse-Grip Pushdown", "Dips (assisted machine)"],
  },
  "Overhead Tricep Extension": {
    sets: "3", reps: "10–12", baseWeight: 14, inc: 1, unit: "kg",
    guide: "Hold one dumbbell with both hands overhead, elbows framing your head. Lower behind your head by bending only at the elbows, feeling a deep stretch in the long head of the tricep. Press back up. Keep elbows pointed forward, not flaring.",
    warmup: "2 slow reps at lighter weight to feel the stretch.",
    swaps: ["EZ Bar Overhead Extension", "Cable Overhead Tricep Extension", "Machine Tricep Extension", "Single-Arm Overhead Extension", "Dumbbell Kickback", "Tricep Dips (assisted machine)"],
  },
  "Step-Up with Dumbbells": {
    sets: "4", reps: "10–12 each", baseWeight: 12, inc: 1.25, unit: "kg each hand",
    guide: "Use a bench or box at knee height. Step up leading with one foot, drive through the heel to stand fully on the box. Step down with control. Alternate legs. Keep your torso upright.",
    warmup: "5 bodyweight step-ups each leg before loading.",
    swaps: ["Smith Machine Step-Up", "Smith Machine Reverse Lunge", "Hack Squat Machine", "Leg Press (single leg)", "Split Squat (Smith Machine)", "Cable Pull-Through"],
  },
  "Glute Bridge / Hip Thrust": {
    sets: "4", reps: "10–12", baseWeight: 30, inc: 2.5, unit: "kg across hips",
    guide: "Upper back on bench, barbell across hip crease (use a pad). Feet flat on floor, shoulder-width. Drive hips up by squeezing glutes hard. At the top, shins should be vertical. Hold top position 1–2 seconds. Lower slowly.",
    warmup: "10 bodyweight glute bridges on the floor before loading.",
    swaps: ["Smith Machine Hip Thrust", "Cable Pull-Through", "Single-Leg Hip Thrust", "Glute Kickback Machine", "Cable Glute Kickback", "45° Hyperextension"],
  },
  "Leg Press": {
    sets: "4", reps: "10–12", baseWeight: 60, inc: 5, unit: "kg",
    guide: "Feet shoulder-width on the platform, toes pointed slightly out. Lower the sled until knees reach 90°. Press back up without locking your knees. Keep your lower back pressed against the seat throughout.",
    warmup: "1 set × 15 reps at 30 kg before working weight.",
    swaps: ["Hack Squat Machine", "Smith Machine Reverse Lunge", "Single-Leg Leg Press", "Pendulum Squat Machine", "V-Squat Machine", "Belt Squat Machine"],
  },
  "Leg Curl (Machine)": {
    sets: "3", reps: "10–12", baseWeight: 25, inc: 2.5, unit: "kg stack",
    guide: "Lie face down on the machine. Pad should sit just above your heels. Curl your heels toward your glutes, squeezing the hamstrings hard at the top. Lower slowly — hamstrings respond well to slow eccentrics.",
    warmup: "1 set × 15 reps at 10 kg.",
    swaps: ["Seated Leg Curl Machine", "Single-Leg Lying Leg Curl", "Cable Leg Curl (ankle strap)", "Nordic Hamstring Curl", "Swiss Ball Leg Curl", "Glute Ham Raise"],
  },
  "Standing Calf Raise": {
    sets: "3", reps: "15–20", baseWeight: 40, inc: 5, unit: "kg",
    guide: "Position toes forward or slightly outward. Rise onto the balls of your feet as high as possible, hold 1 second at the top. Lower slowly below the starting point for a full stretch. Go slow — the bottom stretch is crucial for calf growth.",
    warmup: "10 bodyweight calf raises on a step edge.",
    swaps: ["Seated Calf Raise Machine", "Leg Press Calf Raise", "Smith Machine Calf Raise", "Single-Leg Calf Raise", "Donkey Calf Raise Machine", "Cable Calf Raise"],
  },
  "Seated DB Shoulder Press": {
    sets: "4", reps: "8–10", baseWeight: 16, inc: 1.25, unit: "kg each",
    guide: "Sit on a bench with back support. Dumbbells at ear level, elbows at 90°. Press straight up, bringing dumbbells close together at the top. Lower back to ear level — full range. Keep core tight.",
    warmup: "1 set × 10 reps at 8 kg each.",
    swaps: ["Smith Machine Overhead Press", "Machine Shoulder Press", "Cable Shoulder Press", "Barbell Overhead Press", "Hammer Strength Shoulder Press", "Landmine Press"],
  },
  "Arnold Press": {
    sets: "4", reps: "10–12", baseWeight: 12, inc: 1, unit: "kg each",
    guide: "Start with dumbbells at chin height, palms facing you. As you press up, rotate your wrists so palms face forward at the top. Reverse on the way down. This rotation recruits all three heads of the deltoid. Go lighter than your regular press.",
    warmup: "Not required if done after shoulder press.",
    swaps: ["Smith Machine Overhead Press", "Machine Shoulder Press", "Cable Shoulder Press", "Dumbbell Shoulder Press (partial rotation)", "Barbell Overhead Press", "Hammer Strength Shoulder Press"],
  },
  "Lateral Raise": {
    sets: "3", reps: "12–15", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Stand with dumbbells at sides. Raise arms out to the sides to shoulder height — lead with your elbows, not your hands. At the top, tilt dumbbells slightly so the front is lower than the back. Lower slowly over 3 seconds. Never go heavy here.",
    warmup: "Not required.",
    swaps: ["Cable Lateral Raise", "Machine Lateral Raise", "Single-Arm Cable Lateral Raise", "Leaning Cable Lateral Raise", "Cable Y-Raise", "Machine Lateral Raise (unilateral)"],
  },
  "Front Raise": {
    sets: "3", reps: "12", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Stand, dumbbells in front of thighs. Raise one or both arms forward to shoulder height, thumbs up. Keep a slight elbow bend. Lower slowly. Targets the anterior (front) deltoid.",
    warmup: "Not required.",
    swaps: ["Cable Front Raise", "Plate Front Raise", "Incline Dumbbell Front Raise", "Cable Crossover Front Raise", "Barbell Front Raise", "Machine Front Raise"],
  },
  "Rear Delt Fly": {
    sets: "3", reps: "12–15", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Hinge forward at hips 90°, dumbbells hanging below chest. Raise arms out to sides like wings, leading with elbows. Squeeze shoulder blades together at the top. Lower slowly. Go light and feel every rep.",
    warmup: "Not required.",
    swaps: ["Reverse Pec Deck", "Cable Rear Delt Fly", "Face Pull", "Bent-Over Dumbbell Rear Fly", "Machine Rear Delt Fly", "Cable W-Raise"],
  },
  "Dumbbell Shrug": {
    sets: "4", reps: "12–15", baseWeight: 20, inc: 2.5, unit: "kg each",
    guide: "Hold heavy dumbbells at sides. Shrug your shoulders straight up toward your ears as high as possible. Hold 1 second at the top. Lower slowly. Do not roll your shoulders — straight up and down only.",
    warmup: "Not required.",
    swaps: ["Smith Machine Shrug", "Barbell Shrug", "Cable Shrug", "Machine Shrug", "Hex Bar Shrug", "Behind-Back Barbell Shrug"],
  },
  "Cable Lateral Raise": {
    sets: "3", reps: "12–15 each", baseWeight: 5, inc: 0.5, unit: "kg each side",
    guide: "Stand side-on to a low cable. Cross-body grip (use the hand furthest from the cable). Raise arm out to the side to shoulder height. The cable provides constant tension throughout. Keep elbow slightly bent, wrist neutral.",
    warmup: "Not required.",
    swaps: ["Machine Lateral Raise", "Single-Arm Cable Lateral Raise", "Leaning Cable Lateral Raise", "Cable Y-Raise", "Machine Lateral Raise (unilateral)", "Dumbbell Lateral Raise"],
  },
  "Concentration Curl": {
    sets: "3", reps: "10–12 each", baseWeight: 8, inc: 0.5, unit: "kg each",
    guide: "Sit on bench, feet wide. Rest back of upper arm on your inner thigh. Curl to your shoulder. This eliminates all momentum — pure bicep contraction. Hold the peak for 2 seconds each rep.",
    warmup: "Not required.",
    swaps: ["Preacher Curl Machine", "Spider Curl", "Single-Arm Cable Curl", "Scott Curl (EZ Bar)", "Machine Bicep Curl", "Cable Drag Curl"],
  },
};

// ─── REST TIMES ──────────────────────────────────────────────────────────────
const REST_TIMES = {
  "Flat Bench Press (Smith)": 120, "Incline Bench Press (Smith)": 120,
  "Close-Grip Bench Press (Smith)": 120, "Incline Dumbbell Press": 120,
  "Low Cable Fly": 90, "Cable Fly (mid)": 90,
  "Double DB Bent-Over Row": 120, "Bent-Over Barbell Row (Smith)": 120,
  "Lat Pulldown": 120, "Pull-Up": 120,
  "Seated Cable Row": 90, "Single-Arm DB Row": 90, "Face Pull": 90,
  "Barbell Bicep Curl": 90, "Incline Dumbbell Curl": 90, "Hammer Curl": 90,
  "Concentration Curl": 90, "Skull Crusher (EZ Bar)": 90,
  "Tricep Rope Pushdown": 90, "Overhead Tricep Extension": 90,
  "Step-Up with Dumbbells": 120, "Glute Bridge / Hip Thrust": 120,
  "Leg Press": 120, "Leg Curl (Machine)": 90, "Standing Calf Raise": 90,
  "Seated DB Shoulder Press": 120, "Arnold Press": 120,
  "Lateral Raise": 90, "Rear Delt Fly": 90, "Front Raise": 90,
  "Dumbbell Shrug": 90, "Cable Lateral Raise": 90,
};

// ─── WEEKLY ROTATION ─────────────────────────────────────────────────────────
const WEEKLY_ROTATION = {
  Chest: [
    ["Flat Bench Press (Smith)", "Incline Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Low Cable Fly"],
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Incline Dumbbell Press", "Low Cable Fly", "Cable Fly (mid)"],
    ["Flat Bench Press (Smith)", "Incline Bench Press (Smith)", "Close-Grip Bench Press (Smith)", "Cable Fly (mid)", "Low Cable Fly"],
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Incline Dumbbell Press", "Low Cable Fly", "Cable Fly (mid)"],
    ["Flat Bench Press (Smith)", "Close-Grip Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Low Cable Fly"],
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Low Cable Fly", "Incline Dumbbell Press", "Cable Fly (mid)"],
    ["Flat Bench Press (Smith)", "Incline Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Low Cable Fly"],
    ["Incline Bench Press (Smith)", "Close-Grip Bench Press (Smith)", "Flat Bench Press (Smith)", "Low Cable Fly", "Cable Fly (mid)"],
    ["Flat Bench Press (Smith)", "Incline Bench Press (Smith)", "Incline Dumbbell Press", "Low Cable Fly", "Cable Fly (mid)"],
    ["Incline Bench Press (Smith)", "Flat Bench Press (Smith)", "Incline Dumbbell Press", "Cable Fly (mid)", "Low Cable Fly"],
  ],
  Back: [
    ["Lat Pulldown", "Double DB Bent-Over Row", "Seated Cable Row", "Single-Arm DB Row", "Face Pull"],
    ["Pull-Up", "Bent-Over Barbell Row (Smith)", "Single-Arm DB Row", "Seated Cable Row", "Face Pull"],
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Seated Cable Row", "Single-Arm DB Row", "Face Pull"],
    ["Pull-Up", "Double DB Bent-Over Row", "Bent-Over Barbell Row (Smith)", "Seated Cable Row", "Face Pull"],
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Single-Arm DB Row", "Seated Cable Row", "Face Pull"],
    ["Pull-Up", "Double DB Bent-Over Row", "Bent-Over Barbell Row (Smith)", "Single-Arm DB Row", "Face Pull"],
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Seated Cable Row", "Double DB Bent-Over Row", "Face Pull"],
    ["Pull-Up", "Double DB Bent-Over Row", "Single-Arm DB Row", "Seated Cable Row", "Face Pull"],
    ["Lat Pulldown", "Bent-Over Barbell Row (Smith)", "Double DB Bent-Over Row", "Seated Cable Row", "Face Pull"],
    ["Lat Pulldown", "Double DB Bent-Over Row", "Seated Cable Row", "Single-Arm DB Row", "Face Pull"],
  ],
  Arms: [
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Overhead Tricep Extension"],
    ["Incline Dumbbell Curl", "Skull Crusher (EZ Bar)", "Barbell Bicep Curl", "Tricep Rope Pushdown", "Overhead Tricep Extension"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Incline Dumbbell Curl", "Overhead Tricep Extension", "Tricep Rope Pushdown"],
    ["Incline Dumbbell Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Overhead Tricep Extension", "Tricep Rope Pushdown"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Overhead Tricep Extension"],
    ["Incline Dumbbell Curl", "Skull Crusher (EZ Bar)", "Barbell Bicep Curl", "Tricep Rope Pushdown", "Overhead Tricep Extension"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Incline Dumbbell Curl", "Overhead Tricep Extension", "Tricep Rope Pushdown"],
    ["Hammer Curl", "Skull Crusher (EZ Bar)", "Barbell Bicep Curl", "Tricep Rope Pushdown", "Overhead Tricep Extension"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Incline Dumbbell Curl", "Tricep Rope Pushdown", "Overhead Tricep Extension"],
    ["Barbell Bicep Curl", "Skull Crusher (EZ Bar)", "Hammer Curl", "Tricep Rope Pushdown", "Overhead Tricep Extension"],
  ],
  Legs: [
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Leg Curl (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Leg Press", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Leg Press", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Leg Press", "Leg Curl (Machine)", "Glute Bridge / Hip Thrust", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Leg Curl (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Leg Curl (Machine)", "Glute Bridge / Hip Thrust", "Leg Press", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Leg Curl (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Leg Press", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Curl (Machine)", "Leg Press", "Standing Calf Raise"],
    ["Step-Up with Dumbbells", "Glute Bridge / Hip Thrust", "Leg Press", "Leg Curl (Machine)", "Standing Calf Raise"],
  ],
  Shoulders: [
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Dumbbell Shrug"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Front Raise"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Arnold Press", "Dumbbell Shrug"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Arnold Press", "Front Raise"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Dumbbell Shrug"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Arnold Press", "Front Raise"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Dumbbell Shrug"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Front Raise"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Arnold Press", "Dumbbell Shrug"],
    ["Seated DB Shoulder Press", "Lateral Raise", "Arnold Press", "Rear Delt Fly", "Dumbbell Shrug"],
  ],
};

// ─── SCHEDULE ────────────────────────────────────────────────────────────────
const buildSchedule = () => {
  const groups = ["Chest", "Back", "Arms", "Legs", "Shoulders"];
  const schedule = [];
  let groupIdx = 0, trainingCount = 0, totalDay = 1;
  while (trainingCount < 100) {
    for (let t = 0; t < 2 && trainingCount < 100; t++) {
      const g = groups[groupIdx % groups.length];
      const weekNum = Math.ceil((trainingCount + 1) / 10);
      schedule.push({ day: totalDay, group: g, trainingDay: trainingCount + 1, weekNum });
      groupIdx++; trainingCount++; totalDay++;
    }
    schedule.push({ day: totalDay, group: "Rest", trainingDay: null, weekNum: null });
    totalDay++;
  }
  return schedule;
};
const SCHEDULE = buildSchedule();

// ─── WEIGHT HELPERS ──────────────────────────────────────────────────────────
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
  const perSide = (total - 15) / 2;
  if (perSide <= 0) return `Bar only (15 kg Smith bar)`;
  return `Smith bar 15 kg + ${perSide} kg per side`;
};

// ─── MG CONFIG ───────────────────────────────────────────────────────────────
const MG = {
  Chest:     { color: "#1A6FA8", bg: "#EEF4FB", icon: "🏋️" },
  Back:      { color: "#6B3FA0", bg: "#F4EEFB", icon: "🔱" },
  Arms:      { color: "#E8533F", bg: "#FFF0EE", icon: "💪" },
  Legs:      { color: "#2F7E4A", bg: "#EEF8F2", icon: "🦵" },
  Shoulders: { color: "#C07A20", bg: "#FBF5EE", icon: "🏅" },
  Rest:      { color: "#888888", bg: "#F5F5F5", icon: "🛌" },
};
const TIPS = {
  Chest: "Retract shoulder blades before every press. Full stretch at the bottom of each rep triggers more growth.",
  Back: "Every pull starts with the elbow, not the hand. Imagine your hands as hooks — your back does the work.",
  Arms: "Slow the eccentric (lowering) to 3 seconds on every curl and extension. That's where most growth comes from.",
  Legs: "Drive through your full foot, not just the toes. Control every descent — don't let gravity do the work.",
  Shoulders: "Keep lateral raises strict and light. Going heavy ruins form and shifts load away from the delts.",
  Rest: "Muscles grow during rest, not during training. Today is just as important as a training day.",
};
const WEEK_LABELS = {
  1: { label: "Foundation", note: "Learn every movement. Form over weight.", color: "#2F7E4A" },
  2: { label: "Build", note: "Add 2.5 kg to upper body, 5 kg to lower body if Week 1 felt manageable.", color: "#1A6FA8" },
  3: { label: "Build", note: "Same increases if reps were clean. Leave only 1 rep in the tank.", color: "#1A6FA8" },
  4: { label: "Overload", note: "Push your hardest sets yet. Form must stay clean.", color: "#C07A20" },
  5: { label: "Overload", note: "Introduce drop sets on isolation exercises if not already.", color: "#C07A20" },
  6: { label: "Peak", note: "Max effort week. Go heavier on compound lifts.", color: "#E8533F" },
  7: { label: "Peak", note: "Volume peak — extra focus on mind-muscle connection.", color: "#E8533F" },
  8: { label: "Peak", note: "Final heavy push. Note your best weights this week.", color: "#E8533F" },
  9: { label: "Taper", note: "Reduce volume slightly, keep intensity high.", color: "#6B3FA0" },
  10: { label: "Deload", note: "Weights drop to 60%. High reps, perfect form. Let your body recover.", color: "#888" },
};
const STORAGE_KEY = "workout-completed-v1";
const SWAPS_KEY = "workout-alt-swaps-v1";
const EX_DONE_KEY = "workout-ex-done-v1";
const PROG_KEY = "workout-progression-v1";

// ─── APP ─────────────────────────────────────────────────────────────────────
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
  const [swapSelections, setSwapSelections] = useState({});
  const [openSwapPicker, setOpenSwapPicker] = useState(null);
  const [exDone, setExDone] = useState({});
  const [progression, setProgression] = useState({});

  // Load all from localStorage on mount
  useState(() => {
    (async () => {
      try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v) { const p = JSON.parse(v); if (Array.isArray(p)) setCompleted(new Set(p)); }
      } catch (e) {}
      try {
        const v = localStorage.getItem(SWAPS_KEY);
        if (v) { const p = JSON.parse(v); if (p && typeof p === "object") setSwapSelections(p); }
      } catch (e) {}
      try {
        const v = localStorage.getItem(EX_DONE_KEY);
        if (v) { const p = JSON.parse(v); if (p && typeof p === "object") setExDone(p); }
      } catch (e) {}
      try {
        const v = localStorage.getItem(PROG_KEY);
        if (v) { const p = JSON.parse(v); if (p && typeof p === "object") setProgression(p); }
      } catch (e) {}
    })();
  }, []);

  const saveCompleted = (s) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...s]));
      const now = new Date();
      setLastSaved(`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`);
    } catch (e) {}
  };
  const saveSwaps = (s) => { try { localStorage.setItem(SWAPS_KEY, JSON.stringify(s)); } catch (e) {} };
  const saveExDone = (s) => { try { localStorage.setItem(EX_DONE_KEY, JSON.stringify(s)); } catch (e) {} };
  const saveProgression = (s) => { try { localStorage.setItem(PROG_KEY, JSON.stringify(s)); } catch (e) {} };

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
      saveCompleted(next);
      return next;
    });
  };

  const resetProgress = () => {
    setCompleted(new Set());
    setExDone({});
    setSwapSelections({});
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(SWAPS_KEY); localStorage.removeItem(EX_DONE_KEY); } catch (e) {}
    setShowResetConfirm(false);
    setLastSaved(null);
  };

  const selectSwap = (schedIdx, exIdx, exerciseName) => {
    const key = `${schedIdx}-${exIdx}`;
    const newSwaps = { ...swapSelections };
    if (exerciseName === null) { delete newSwaps[key]; } else { newSwaps[key] = exerciseName; }
    setSwapSelections(newSwaps);
    saveSwaps(newSwaps);
    setOpenSwapPicker(null);
  };

  const getSwapSelection = (schedIdx, exIdx) => swapSelections[`${schedIdx}-${exIdx}`] || null;
  const isUsingSwap = (schedIdx, exIdx) => !!swapSelections[`${schedIdx}-${exIdx}`];

  const toggleExDone = (schedIdx, exIdx) => {
    const key = `${schedIdx}-${exIdx}`;
    const newDone = { ...exDone };
    if (newDone[key]) { delete newDone[key]; } else { newDone[key] = true; }
    setExDone(newDone);
    saveExDone(newDone);
  };
  const isExDone = (schedIdx, exIdx) => !!exDone[`${schedIdx}-${exIdx}`];

  const weekGroups = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < Math.ceil(SCHEDULE.length / 7); w++) {
      weeks.push(SCHEDULE.slice(w * 7, w * 7 + 7).map((s, i) => ({ ...s, idx: w * 7 + i })));
    }
    return weeks;
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#FAFAF9", color: "#1C1C1C" }}>

      {/* HEADER */}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={{ fontSize: 10, color: lastSaved ? "#4CAF50" : "#444" }}>
            {lastSaved ? `✅ Saved at ${lastSaved}` : "Progress auto-saves when you mark days"}
          </div>
          {!showResetConfirm ? (
            <button onClick={() => setShowResetConfirm(true)} style={{ background: "none", border: "1px solid #333", color: "#555", borderRadius: 6, padding: "3px 10px", fontSize: 10, cursor: "pointer" }}>Reset</button>
          ) : (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#E8533F" }}>Erase all?</span>
              <button onClick={resetProgress} style={{ background: "#E8533F", border: "none", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 10, cursor: "pointer", fontWeight: 700 }}>Yes</button>
              <button onClick={() => setShowResetConfirm(false)} style={{ background: "#333", border: "none", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 10, cursor: "pointer" }}>No</button>
            </div>
          )}
        </div>
      </div>

      {/* QUICK GUIDES */}
      <div style={{ background: "#1a1a2e", padding: "10px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[["🔥 Cardio Guide", showCardio, setShowCardio], ["🤸 Warm-Up", showWarmup, setShowWarmup], ["📈 Progression", showProgression, setShowProgression]].map(([label, open, setter]) => (
          <button key={label} onClick={() => setter(!open)} style={{ background: open ? "#E8533F" : "#2a2a3e", color: open ? "#fff" : "#aaa", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{label}</button>
        ))}
      </div>
      {showCardio && (
        <div style={{ background: "#FFF8E1", borderBottom: "2px solid #FFE082", padding: "12px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#C07A20", marginBottom: 6 }}>🔥 POST-WORKOUT CARDIO</div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>After every training session (except legs day): 15–20 min incline treadmill walk at gradient 8–10%, speed 2.5–3.0 mph. On legs day: 5–10 min flat walk at 0 incline, 2.0–2.5 mph — cool down only. Stop the treadmill gradually, never abruptly, to avoid lightheadedness.</div>
        </div>
      )}
      {showWarmup && (
        <div style={{ background: "#EEF4FB", borderBottom: "2px solid #C5D5FF", padding: "12px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1A6FA8", marginBottom: 6 }}>🤸 WARM-UP (EVERY SESSION)</div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>5 min light treadmill walk. Then 10 arm circles each direction, 10 hip circles, 10 shoulder rolls. Always do 1–2 warm-up sets of your first exercise at 40–50% of your working weight before your main sets.</div>
        </div>
      )}
      {showProgression && (
        <div style={{ background: "#F4EEFB", borderBottom: "2px solid #C5AAFF", padding: "12px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B3FA0", marginBottom: 8 }}>📈 10-WEEK PROGRESSION</div>
          {Object.entries(WEEK_LABELS).map(([wk, { label, note, color }]) => (
            <div key={wk} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color, background: "#fff", borderRadius: 5, padding: "2px 6px", minWidth: 44, textAlign: "center", marginTop: 1 }}>WK {wk}</span>
              <div><span style={{ fontSize: 11, fontWeight: 700, color }}>{label} — </span><span style={{ fontSize: 11, color: "#555" }}>{note}</span></div>
            </div>
          ))}
        </div>
      )}

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #eee" }}>
        {["All", "Chest", "Back", "Arms", "Legs", "Shoulders", "Rest"].map(f => {
          const mg = MG[f] || { color: "#111", icon: "📋" };
          const active = filter === f;
          return (
            <button key={f} onClick={() => { setFilter(f); setSelected(null); }} style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: active ? mg.color : "#F2F2F2", color: active ? "#fff" : "#555", transition: "all 0.2s" }}>
              {mg.icon} {f}
            </button>
          );
        })}
      </div>

      {/* GRID */}
      <div style={{ padding: "14px 16px" }}>
        {filter === "All" ? (
          weekGroups.map((days, wi) => (
            <div key={wi} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#aaa", textTransform: "uppercase", marginBottom: 6 }}>Calendar Week {wi + 1}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
                {days.map(({ day, group: g, trainingDay, idx }) => {
                  const mg = MG[g];
                  const isSel = selected === idx;
                  const isDone = completed.has(idx);
                  return (
                    <div key={idx} onClick={() => setSelected(isSel ? null : idx)} style={{ borderRadius: 8, padding: "7px 3px", textAlign: "center", cursor: "pointer", background: isSel ? mg.color : isDone ? "#E8F5E9" : mg.bg, border: `2px solid ${isSel ? mg.color : isDone ? "#4CAF50" : "transparent"}`, transition: "all 0.2s", opacity: isDone && !isSel ? 0.7 : 1 }}>
                      <div style={{ fontSize: 13 }}>{mg.icon}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: isSel ? "#fff" : mg.color }}>D{day}</div>
                      {trainingDay && <div style={{ fontSize: 8, color: isSel ? "rgba(255,255,255,0.7)" : "#aaa" }}>T{trainingDay}</div>}
                      {isDone && <div style={{ fontSize: 8 }}>✅</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {filteredEntries.map(({ day, group: g, trainingDay, idx }) => {
              const mg = MG[g];
              const isSel = selected === idx;
              const isDone = completed.has(idx);
              return (
                <div key={idx} onClick={() => setSelected(isSel ? null : idx)} style={{ borderRadius: 10, padding: "10px 6px", textAlign: "center", cursor: "pointer", background: isSel ? mg.color : isDone ? "#E8F5E9" : mg.bg, border: `2px solid ${isSel ? mg.color : isDone ? "#4CAF50" : "transparent"}`, transition: "all 0.2s" }}>
                  <div style={{ fontSize: 18 }}>{mg.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isSel ? "#fff" : mg.color }}>Day {day}</div>
                  {trainingDay && <div style={{ fontSize: 10, color: isSel ? "rgba(255,255,255,0.7)" : "#aaa" }}>T#{trainingDay}</div>}
                  {isDone && <div style={{ fontSize: 10 }}>✅</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL PANEL */}
      {selected != null && selEntry && group && (
        <div style={{ margin: "0 16px 24px", borderRadius: 14, background: "#fff", border: `2px solid ${group.color}`, overflow: "hidden" }}>
          <div style={{ background: group.color, padding: "14px 18px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase" }}>
              {selEntry.group === "Rest" ? `Day ${selEntry.day} · Rest Day` : `Day ${selEntry.day} · Training Day ${selEntry.trainingDay} · Week ${selEntry.weekNum}`}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 2 }}>{group.icon} {selEntry.group === "Rest" ? "Rest Day" : `${selEntry.group} Day`}</div>
            {selEntry.weekNum && WEEK_LABELS[selEntry.weekNum] && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
                Week {selEntry.weekNum}: {WEEK_LABELS[selEntry.weekNum].label} — {WEEK_LABELS[selEntry.weekNum].note}
              </div>
            )}
          </div>
          <div style={{ background: group.bg, padding: "9px 18px", borderBottom: "1px solid #eee" }}>
            <span style={{ fontSize: 10, color: group.color, fontWeight: 700 }}>💡 </span>
            <span style={{ fontSize: 11, color: "#555" }}>{TIPS[selEntry.group]}</span>
          </div>

          {selEntry.group !== "Rest" ? (() => {
            const exNames = WEEKLY_ROTATION[selEntry.group][(selEntry.weekNum || 1) - 1] || [];
            const doneCount = exNames.filter((_, idx2) => isExDone(selected, idx2)).length;
            const allDone = doneCount === exNames.length;
            return (
              <div style={{ padding: "14px 16px" }}>
                <div style={{ background: "#EEF4FB", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#1A6FA8" }}>
                  <strong>🤸 Before you start:</strong> 5 min treadmill walk + 1–2 warm-up sets of your first exercise at 50% weight.
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#888", textTransform: "uppercase" }}>Exercises</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: allDone ? "#2F7E4A" : "#888", background: allDone ? "#E8F5E9" : "#F5F5F5", borderRadius: 8, padding: "3px 10px" }}>
                    {allDone ? "🎉 All done!" : `${doneCount} / ${exNames.length} done`}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {exNames.map((exName, i) => {
                    const swapKey = `${selected}-${i}`;
                    const swapPickerOpen = openSwapPicker === swapKey;
                    const selectedSwap = getSwapSelection(selected, i);
                    const usingSwap = !!selectedSwap;
                    const displayName = selectedSwap || exName;
                    const ex = EXERCISES[displayName] || EXERCISES[exName] || {};
                    const baseEx = EXERCISES[exName] || {};
                    const displaySets = ex.sets || baseEx.sets || "3";
                    const displayReps = ex.reps || baseEx.reps || "—";
                    const displayWeight = usingSwap ? (ex.baseWeight ? getWeight(displayName, selEntry.weekNum || 1) : "See guide") : getWeight(exName, selEntry.weekNum || 1);
                    const plateNote = usingSwap ? null : getPlateNote(exName, selEntry.weekNum || 1);
                    const guideKey = `${selected}-${i}`;
                    const guideOpen = openGuide === guideKey;
                    const exIsDone = isExDone(selected, i);
                    const isCompound = (REST_TIMES[displayName] || REST_TIMES[exName] || 90) === 120;
                    const dropWeight = (() => {
                      const num = parseFloat((displayWeight || "").replace(/[^0-9.]/g, ""));
                      const unit = (displayWeight || "").replace(/[0-9. ]/g, "").trim();
                      if (!num) return null;
                      return `${Math.round(num * 0.7 * 2) / 2} ${unit}`;
                    })();
                    // Get guide text — check EXERCISES first, then SWAP_GUIDES
                    const guideText = ex.guide || SWAP_GUIDES[displayName] || "No guide available for this exercise. Search YouTube for a visual demonstration.";
                    const warmupText = ex.warmup || null;
                    // Get swaps for this exercise, filtering out same-day exercises
                    const availableSwaps = (baseEx.swaps || []).filter(s => !exNames.includes(s));

                    return (
                      <div key={i} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${exIsDone ? "#4CAF50" : guideOpen || swapPickerOpen ? group.color : usingSwap ? "#C07A20" : "#eee"}`, opacity: exIsDone ? 0.8 : 1, transition: "all 0.2s" }}>
                        <div style={{ padding: "10px 12px", background: exIsDone ? "#F0FFF4" : guideOpen ? group.bg : "#fff" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                <div style={{ fontWeight: 700, fontSize: 13, color: exIsDone ? "#2F7E4A" : usingSwap ? "#C07A20" : "#1C1C1C", textDecoration: exIsDone ? "line-through" : "none" }}>
                                  {displayName}
                                </div>
                                {exIsDone && <span style={{ fontSize: 12 }}>✅</span>}
                                {usingSwap && !exIsDone && <span style={{ fontSize: 9, background: "#FBF5EE", color: "#C07A20", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>SWAPPED</span>}
                              </div>
                              {usingSwap && <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>Original: {exName}</div>}
                              <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 11, background: "#F5F5F5", borderRadius: 5, padding: "2px 7px", color: "#555" }}>{displaySets} sets × {displayReps} reps</span>
                                <span style={{ fontSize: 11, background: group.bg, borderRadius: 5, padding: "2px 7px", color: group.color, fontWeight: 700 }}>🏋️ {displayWeight}</span>
                                {!isCompound && dropWeight && (
                                  <span style={{ fontSize: 11, background: "#FFF0EE", borderRadius: 5, padding: "2px 7px", color: "#E8533F", fontWeight: 700 }}>🔥 Set 3 drop → {dropWeight} to failure</span>
                                )}
                              </div>
                              {plateNote && <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>📐 {plateNote}</div>}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginLeft: 8, marginTop: 2 }}>
                              <button onClick={() => toggleExDone(selected, i)} style={{ background: exIsDone ? "#4CAF50" : "#F0FFF4", color: exIsDone ? "#fff" : "#4CAF50", border: "1px solid #4CAF50", borderRadius: 8, padding: "5px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                {exIsDone ? "✅" : "☐"}
                              </button>
                              {availableSwaps.length > 0 && (
                                <button onClick={() => setOpenSwapPicker(swapPickerOpen ? null : swapKey)} style={{ background: usingSwap ? "#C07A20" : "#FBF5EE", color: usingSwap ? "#fff" : "#C07A20", border: "1px solid #C07A20", borderRadius: 8, padding: "5px 8px", fontSize: 9, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                  {swapPickerOpen ? "✕" : "⟳ Swap"}
                                </button>
                              )}
                              <button onClick={() => setOpenGuide(guideOpen ? null : guideKey)} style={{ background: guideOpen ? group.color : "#F0F0F0", color: guideOpen ? "#fff" : "#555", border: "none", borderRadius: 8, padding: "5px 8px", fontSize: 9, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                {guideOpen ? "✕" : "📖"}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Guide panel */}
                        {guideOpen && (
                          <div style={{ background: "#FAFEFF", borderTop: `1px dashed ${group.color}`, padding: "12px 14px" }}>
                            {warmupText && (
                              <div style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#1A6FA8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>🤸 Warm-Up</div>
                                <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>{warmupText}</div>
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: group.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>📖 How to Perform</div>
                              <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>{guideText}</div>
                            </div>
                          </div>
                        )}

                        {/* Swap picker */}
                        {swapPickerOpen && (
                          <div style={{ background: "#FBF5EE", borderTop: "1px dashed #C07A20", padding: "12px 14px" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#C07A20", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>⟳ Swap Exercise</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                              <button onClick={() => selectSwap(selected, i, null)} style={{ padding: "10px 14px", borderRadius: 9, textAlign: "left", cursor: "pointer", background: !selectedSwap ? "#C07A20" : "#fff", border: `1px solid ${!selectedSwap ? "#C07A20" : "#ddd"}`, color: !selectedSwap ? "#fff" : "#444", fontSize: 12, fontWeight: !selectedSwap ? 700 : 400 }}>
                                {!selectedSwap && "✓ "}{exName} <span style={{ fontSize: 10, opacity: 0.7 }}>(default)</span>
                              </button>
                              {availableSwaps.map((swapName, si) => (
                                <button key={si} onClick={() => selectSwap(selected, i, swapName)} style={{ padding: "10px 14px", borderRadius: 9, textAlign: "left", cursor: "pointer", background: selectedSwap === swapName ? "#C07A20" : "#fff", border: `1px solid ${selectedSwap === swapName ? "#C07A20" : "#ddd"}`, color: selectedSwap === swapName ? "#fff" : "#444", fontSize: 12, fontWeight: selectedSwap === swapName ? 700 : 400 }}>
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

                <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "#FFF8E1", border: "1px solid #FFE082" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#C07A20" }}>🔥 Post-Workout Cardio</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4, lineHeight: 1.5 }}>
                    {selEntry.group === "Legs" ? "Legs day: 5–10 min flat walk at 0 incline, 2.0–2.5 mph. Cool down only." : "15–20 min incline treadmill walk — gradient 8–10%, speed 2.5–3.0 mph. Slow down gradually, don't stop abruptly."}
                  </div>
                </div>
              </div>
            );
          })() : (
            <div style={{ padding: "24px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🛌</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Rest Day</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 8, lineHeight: 1.7 }}>Muscles grow during rest, not during training. This day is just as important as a workout day.</div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {[["💧 Hydration", "Drink 3–4 litres of water today."], ["🥩 Protein", "Still hit your protein target — eggs, chicken, fish, legumes."], ["🚶 Light activity", "A 20–30 min casual walk is fine. No intense exercise."], ["😴 Sleep", "Aim for 7–8 hours. Growth hormone is released during deep sleep."]].map(([title, desc]) => (
                  <div key={title} style={{ background: "#F5F5F5", borderRadius: 10, padding: "10px 14px", textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#444" }}>{title}</div>
                    <div style={{ fontSize: 11, color: "#777", marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: "0 16px 18px" }}>
            <button onClick={() => toggleComplete(selected)} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, background: completed.has(selected) ? "#E8F5E9" : group.color, color: completed.has(selected) ? "#2F7E4A" : "#fff", marginTop: 10, transition: "all 0.2s" }}>
              {completed.has(selected) ? "✅ Completed — Undo?" : `Mark ${selEntry.group === "Rest" ? "Rest Day" : `Day ${selEntry.day}`} Complete`}
            </button>
          </div>
        </div>
      )}

      {/* NUTRITION */}
      <div style={{ margin: "0 16px 32px", padding: "16px", borderRadius: 14, background: "#111", color: "#fff" }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>🥗 Eating to Look Bigger (No Supplements)</div>
        {[["Protein", "110–120 g/day — eggs, chicken, fish, tofu, lentils, Greek yoghurt. A palm-sized portion at every meal."], ["Carbs", "Rice, oats, sweet potato. Don't avoid them — they fuel your lifts and support muscle growth."], ["Fats", "Avocado, eggs, nuts, olive oil — support testosterone and joint health."], ["Timing", "Eat a proper meal 1–2 hrs before training. Protein within 30–60 min post-workout."], ["Rest days", "Eat slightly less on rest days — still hit protein, reduce carbs a little."]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#E8533F", minWidth: 55, paddingTop: 1 }}>{k}</span>
            <span style={{ fontSize: 11, color: "#bbb", lineHeight: 1.6 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

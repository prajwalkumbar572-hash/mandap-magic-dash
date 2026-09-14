# Bappa's Blessing

Build a polished, realistic 3D browser game called:

“BAPPA MANDAP CHALLENGE” 🕉️

This is a Ganesh Chaturthi Game Design Contest entry.

IMPORTANT:
This must feel like a REAL GAME, not a static website or simple 3D showcase.

The core gameplay:
The player has 60 seconds to decorate a beautiful Ganesh Chaturthi mandap and achieve the highest possible score.

==================================================
GAME CONCEPT
==================================================

The player starts with an elegant but undecorated Indian Ganesh Chaturthi mandap.

A beautiful realistic 3D Lord Ganesha idol should be the centerpiece.

The player must decorate the mandap before the 60-second timer ends.

Available decorations:

🌸 Marigold flowers
🪔 Diyas
💡 Decorative lights
🌿 Toran
🏵️ Flower garlands
🍬 Modaks
✨ Rangoli
🌺 Flower petals
🎊 Festival decorations

The player should be able to DRAG decorations from the bottom toolbar and DROP them onto valid locations in the 3D scene.

Make placement feel smooth and satisfying.

==================================================
3D VISUAL STYLE
==================================================

Use a realistic high-quality 3D Indian festival environment.

Use:
- Three.js
- React
- TypeScript
- WebGL
- GLTF/GLB support
- OrbitControls
- physically based materials
- realistic lighting
- shadows
- ambient occlusion where appropriate
- bloom/glow effects
- depth of field where appropriate

The Ganesha idol should look like a beautiful traditional festival murti with:
- detailed crown
- jewelry
- traditional clothing
- flower garlands
- realistic materials
- warm skin/clay appearance
- detailed facial features
- realistic lighting

IMPORTANT:
If a real 3D Ganesha GLB model is not available, create the game architecture so a GLB model can easily be inserted later.

Do NOT use a low-quality cartoon Ganesha.

The visual target should feel like a premium Indian festival game.

==================================================
SCENE
==================================================

Create a beautiful decorated mandap environment.

Scene elements:

- Ganesha idol in the center
- ornate mandap structure
- wooden/golden pillars
- marigold garlands
- traditional Indian patterns
- warm golden lighting
- flower petals
- brass diyas
- decorative lamps
- subtle incense-like atmospheric particles
- beautiful floor/rangoli area
- festive background
- soft cinematic lighting

Use realistic shadows.

Add warm orange/golden lighting around the Ganesha idol.

Add a subtle glowing halo behind Ganesha.

==================================================
GAME CAMERA
==================================================

Use a third-person/isometric-style camera showing the complete mandap.

Allow the player to slightly rotate the camera around the mandap.

Controls:
- Mouse drag = rotate camera
- Mouse wheel = zoom
- Touch drag = rotate on mobile
- Pinch = zoom on mobile

Do not allow the camera to move outside the playable area.

Keep Ganesha visible most of the time.

==================================================
MAIN GAME UI
==================================================

At the top:

🕉️ BAPPA MANDAP CHALLENGE

TIME
00:60

SCORE
0

BAPPA'S BLESSING
██████████░░ 0%

The UI should look premium and festive.

Use glassmorphism combined with Indian festival design.

Do not make the UI cover the 3D scene.

==================================================
DECORATION TOOLBAR
==================================================

At the bottom create a beautiful horizontal toolbar.

Items:

🌸 Flowers
🪔 Diya
💡 Lights
🌿 Toran
🏵️ Garland
🍬 Modak
✨ Rangoli
🌺 Petals

Each item should have:
- icon
- name
- small preview
- hover animation
- click animation

Desktop:
horizontal toolbar.

Mobile:
horizontal scrollable toolbar.

==================================================
DRAG AND DROP
==================================================

When the player selects an item:

Show a ghost/preview version of the decoration.

Allow the player to drag it into the scene.

When hovering over a valid placement area:
- show a subtle green/golden glow
- show placement preview

When dropped:
- smoothly animate the object into position
- play a soft satisfying sound
- increase score

Invalid placement:
- show subtle red/orange feedback
- do not allow placement

==================================================
SCORING SYSTEM
==================================================

Create an actual scoring system.

Base points:

Flower:
+10

Diya:
+15

Garland:
+20

Toran:
+25

Decorative light:
+15

Modak:
+10

Rangoli:
+30

Special decoration:
+40

But score should NOT simply depend on the number of objects.

Add bonuses for good decoration combinations.

Examples:

Flower + Diya nearby:
+10 bonus

Garland + Toran:
+15 bonus

Rangoli placed in the center:
+25 bonus

Balanced decoration:
+30 bonus

Beautiful symmetrical arrangement:
+50 bonus

Too many objects in one area:
-10 penalty

This makes the game require strategy.

==================================================
BAPPA'S BLESSING SYSTEM
==================================================

Create a “Bappa's Blessing” meter.

The meter increases when the player creates a beautiful arrangement.

Good placement:
+ points

Good combinations:
+ points

Balanced arrangement:
+ points

Creative arrangement:
+ points

Messy/crowded arrangement:
- points

At 100%:

✨ BAPPA IS BLESSED! ✨

Give the player a special visual effect:
- golden particles
- brighter lights
- flowers falling
- subtle camera celebration
- Ganesha halo becomes brighter

==================================================
60 SECOND TIMER
==================================================

The game starts at:

60 seconds.

Make the timer visually important.

At:
60–30 seconds:
normal

30–10 seconds:
timer becomes more urgent

10–0 seconds:
add subtle pulse effect and warning

Do not make the game stressful or annoying.

At 0:

STOP ALL PLACEMENT.

Show the final result screen.

==================================================
FINAL SCORE SCREEN
==================================================

Create a beautiful cinematic result screen.

Example:

🕉️ YOUR MANDAP IS READY 🕉️

FINAL SCORE
1,245

BAPPA'S BLESSING
94%

DECORATION
92%

CREATIVITY
88%

BALANCE
96%

⭐⭐⭐⭐⭐

Buttons:

PLAY AGAIN

VIEW MANDAP

SHARE SCORE

The final mandap should remain visible behind the results.

==================================================
REPLAYABILITY
==================================================

This is extremely important.

Every Play Again should reset the game.

Randomize some things:
- starting decoration positions
- bonus combinations
- flower locations
- optional challenges

Add:

🏆 PERSONAL BEST
1,245

If the player beats their previous score:

🔥 NEW PERSONAL BEST!

Make the player want to replay.

==================================================
SPECIAL CHALLENGES
==================================================

Add optional random challenges.

Examples:

“Light at least 3 diyas.”

“Create a flower arrangement.”

“Place 2 garlands.”

“Keep the center area balanced.”

“Place a rangoli.”

Completing challenges gives bonus points.

==================================================
AUDIO
==================================================

Add an audio settings button.

Default audio should NOT autoplay.

Include:

🔊 Sound ON/OFF

Use subtle:
- diya sounds
- soft bell/chime effects
- placement sounds
- celebration sound

Keep the audio respectful and suitable for a festival game.

==================================================
MOBILE SUPPORT
==================================================

The entire game must work on:

Desktop
Laptop
Tablet
Mobile

Touch controls must work.

The toolbar must be usable with one hand.

Do not let the UI cover Ganesha.

==================================================
LOADING SCREEN
==================================================

Create a beautiful loading screen:

🕉️

Preparing Bappa's Mandap...

Loading decorations...

Loading lights...

Then:

🙏 BAPPA IS READY

[ START GAME ]

==================================================
START SCREEN
==================================================

Before the game starts show:

🕉️
BAPPA MANDAP CHALLENGE

“Decorate the mandap.
Create the most beautiful celebration.
Beat your highest score.”

[ START DECORATING ]

[ HOW TO PLAY ]

==================================================
HOW TO PLAY
==================================================

Simple tutorial:

1. Choose a decoration.
2. Drag it into the mandap.
3. Create combinations.
4. Earn Bappa's Blessing.
5. Finish before 60 seconds.
6. Beat your high score.

Add a [GOT IT] button.

==================================================
VISUAL POLISH
==================================================

Use:
- smooth animations
- easing
- particle effects
- subtle camera movement
- realistic shadows
- glowing diyas
- animated flames
- floating flower petals
- golden particles
- subtle bloom
- beautiful transitions
- responsive UI

Avoid excessive effects.

The scene should feel elegant, spiritual, festive and premium.

==================================================
PERFORMANCE
==================================================

Optimize the game.

Do not create thousands of unnecessary objects.

Use:
- instancing where appropriate
- compressed textures where possible
- efficient rendering
- lazy loading
- reasonable shadow resolution

The game should run smoothly on normal student laptops.

==================================================
IMPORTANT CONTEST REQUIREMENT
==================================================

Prioritize:

1. FUN GAMEPLAY
2. REPLAYABILITY
3. POLISHED EXPERIENCE
4. GANESH CHATURTHI THEME
5. VISUAL QUALITY
6. SIMPLE BUT SMART GAME MECHANICS

Do NOT make the project unnecessarily huge.

A small polished game is better than a giant unfinished game.

==================================================
TECH STACK
==================================================

Use:

React
TypeScript
Three.js
React Three Fiber if appropriate
@react-three/drei
GLTF/GLB loader
CSS/Tailwind for UI

Keep the code modular and maintainable.

Create separate components for:

GameScene
Ganesha
Mandap
DecorationSystem
DecorationToolbar
Timer
Score
BlessingMeter
ChallengeSystem
ResultScreen
StartScreen
AudioController
ParticleEffects

==================================================
FINAL REQUIREMENT
==================================================

The final result should feel like a REAL playable Ganesh Chaturthi game that students from different campuses would genuinely enjoy playing.

Do not build merely a website displaying Ganesha.

Build a GAME.

Make the first playable version functional before adding advanced visual effects.

If an asset is unavailable, use a clean placeholder and structure the code so I can replace it with a realistic GLB asset later.

Do not leave buttons non-functional.

Every visible button should perform an action.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mandap-magic-dash.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5164ce86-dc99-423a-9494-086e78e3f11b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

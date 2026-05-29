# Proposal Animation Website Design

## Goal
Build a responsive romantic proposal website with bright painterly scenery, mixed 2D and pseudo-3D particles, continuous motion, and a playful final proposal interaction.

## Approved Direction
- No human character illustrations.
- Use vivid paint-art scenery instead of a strict Van Gogh style.
- Combine painterly 2D backgrounds, Three.js/WebGL depth layers, and canvas particles.
- Every screen should feel alive through continuous motion.
- The site must be responsive for desktop and mobile.
- Memories Gallery uses only two photos: one for the user and one for the other person. They should be placed at different angled positions with depth, not in a straight grid.

## Page Flow
1. Landing
   - Starts with a short dark film-grain outer-space scene with sparse tiny white stars.
   - Scroll progress quickly enters a white cloud atmosphere layer.
   - After passing the cloud layer, the viewer arrives in a pixel-art forest and grassland atmosphere.
   - Thai brush text appears: "ถึงดาวดวงที่สวยที่สุดของฉัน..."
   - Clicking the text or primary button moves to the quiz.
   - Typography should feel cute, rounded, and romantic.

2. Quiz
   - Six questions, each with a seasonal animated scenery backdrop.
   - Seasons: spring, summer, rain, winter, autumn, starry night.
   - Each question has four answer choices and a next button.
   - After question six, a bright flash and falling stars transition to Our Story.

3. Our Story
   - Warm gold and soft violet scenery.
   - Six short story scenes.
   - Each scene has painterly visual depth, short Thai copy, and a Next button.

4. Memories Gallery
   - Two tilted oil-painting frames only.
   - Placeholder photo areas are provided for `assets/photo-me.jpg` and `assets/photo-you.jpg`.
   - Hover or tap lifts the frame, enlarges it, and releases small star particles.

5. Proposal
   - The most dynamic scene: colorful fantasy sky, orbiting stars, bright depth particles.
   - Main Thai text: "จะเป็นดาวคู่ใจฉันตลอดไปไหม?"
   - Main button: "ยอมเป็นแล้ว ♡"
   - Secondary button: "คิดดูก่อน..."
   - Desktop: secondary button moves away when the pointer approaches.
   - Mobile: tapping the secondary button teleports it.
   - If the secondary button is pressed successfully, the scene dims, text changes to "จะไม่เป็นจริงๆ เหรอ... ฉันจะเสียใจนะ", the secondary button disappears, and the accept button grows with stronger glow.
   - Accepting triggers falling stars, gold hearts, confetti, thank-you text, share link, and optional download button.

## Architecture
Use a static site so it can run directly from the workspace and be hosted anywhere. Load Three.js from CDN as progressive enhancement; if CDN or WebGL fails, keep the original canvas painterly fallback. Separate markup, styles, and behavior into focused files:

- `index.html`: semantic page structure and app sections.
- `styles.css`: responsive layout, painterly surfaces, buttons, frames, and motion CSS.
- `script.js`: page flow, quiz/story state, Three.js storybook atmosphere, canvas animation, proposal button behavior, gallery interaction, share/download actions.
- `README.md`: handoff instructions for another AI or developer.

## Testing And Verification
- Use browser preview to click through the full flow.
- Check desktop and mobile widths.
- Verify quiz completion, story navigation, gallery hover/tap, evasive button behavior, accept animation, and share fallback.
- Verify no human illustration assets are included.

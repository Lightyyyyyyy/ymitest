(function () {
  const PHRASE = 'something special?';
  const PHRASE_AFTER = 'Happy birthday'; // Phrase after countdown
  const MATRIX_COLOR = '#DF4B85';
  const FONT_FAMILY = 'Consolas, "Courier New", monospace';
  const COLUMN_SPACING_PX = 44;
  const CHAR_SIZE_PX = 18;
  const SPEED_MIN = 1.8;
  const SPEED_MAX = 3.2;
  const MATRIX_DURATION = 8000;
  const COUNTDOWN_START = 3;
  const COUNTDOWN_INTERVAL = 1000;
  const WORD_DISPLAY_MS = 1500;
  const REDIRECT_TO = 'cake.html';
  const REDIRECT_AFTER_MS = 800;

  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  const countdownEl = document.getElementById('countdown');
  const countNumberEl = document.getElementById('countNumber');
  
  // Updated element references
  const finalWordsEl = document.getElementById('finalWords');
  const part1El = document.getElementById('part1');
  const part2El = document.getElementById('part2');
  const w1 = document.getElementById('w1');
  const w2 = document.getElementById('w2');
  const w3 = document.getElementById('w3');
  const w4 = document.getElementById('w4');
  const moonImgEl = document.querySelector('.moon-bg img');


  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth || window.innerWidth;
    const cssH = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize, { passive: true });

  let charArray = PHRASE.split('');
  let charCount = charArray.length;
  let columns = [];

  function initColumns() {
    columns = [];
    const screenW = window.innerWidth;
    const cols = Math.max(8, Math.floor(screenW / COLUMN_SPACING_PX));
    for (let i = 0; i < cols; i++) {
      const x = (screenW / cols) * (i + 0.5);
      const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      const y = -Math.random() * window.innerHeight * 1.1 - Math.random() * 200;
      columns.push({ x, y, speed, size: CHAR_SIZE_PX + Math.random() * 2 });
    }
  }

  let lastTime = performance.now();
  let running = true;

  function drawFrame(now) {
    const dt = now - lastTime;
    lastTime = now;

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = MATRIX_COLOR;
    ctx.textBaseline = 'top';
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      col.y += col.speed * (dt / 16);

      const lineHeight = col.size * 1.05;
      let startY = col.y;

      while (startY < window.innerHeight + lineHeight * charCount) {
        for (let ci = 0; ci < charCount; ci++) {
          const ch = charArray[ci];
          const drawY = startY + ci * lineHeight;
          if (ch === ' ') {
            ctx.globalAlpha = 0.08;
            ctx.font = `300 ${Math.round(col.size * 0.7)}px ${FONT_FAMILY}`;
            ctx.fillText('.', col.x - ctx.measureText('.').width / 2, drawY);
            ctx.globalAlpha = 1;
          } else {
            ctx.globalAlpha = 0.9;
            ctx.font = `${Math.round(col.size)}px ${FONT_FAMILY}`;
            ctx.fillText(ch, col.x - ctx.measureText(ch).width / 2, drawY);
          }
        }
        startY += charCount * lineHeight + lineHeight * 0.6;
      }

      if (col.y > window.innerHeight + charCount * lineHeight + 80) {
        col.y = -Math.random() * window.innerHeight * 0.6 - Math.random() * 160;
        col.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      }
    }

    if (running) requestAnimationFrame(drawFrame);
  }

  function runSequence() {
    setTimeout(() => {
      countdownEl.classList.remove('hidden');
      countdownEl.classList.add('fade-in');

      let cur = COUNTDOWN_START;
      countNumberEl.textContent = cur;
      popElement(countNumberEl);

      const cd = setInterval(() => {
        cur--;
        if (cur > 0) {
          countNumberEl.textContent = cur;
          popElement(countNumberEl);
        } else {
          clearInterval(cd);
          
          
          charArray = PHRASE_AFTER.split('');
          charCount = charArray.length;
          
          
          countdownEl.classList.remove('fade-in');
          countdownEl.classList.add('fade-out');
          
          setTimeout(() => {
            countdownEl.classList.add('hidden');
            countdownEl.classList.remove('fade-out');

            // Add 1 second delay before showing wishes
            setTimeout(() => {
              showWishes();
            }, 1500); 

          }, 420);
        }
      }, COUNTDOWN_INTERVAL);
    }, MATRIX_DURATION);
  }

  function popElement(el) {
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }

  // --- This function is completely rewritten ---
  async function showWishes() {
    // Update matrix text
    // charArray = PHRASE_AFTER.split('');
    // charCount = charArray.length;
    
    // 1. Show the main overlay
    finalWordsEl.classList.remove('hidden');
    finalWordsEl.classList.add('fade-in');

    // --- PART 1 ---
    await sleep(500); // Give fade-in time
    
    // 2. Show "MANY MANY"
    w1.classList.add('pop');
    await sleep(WORD_DISPLAY_MS - 500); // Wait 1s
    
    // 3. Show "RETURNS OF THE DAY"
    w2.classList.add('pop');
    await sleep(WORD_DISPLAY_MS + 500); // Wait 2s
    
    // 4. Fade out Part 1
    part1El.style.opacity = '0';
    await sleep(420); // Wait for transition
    part1El.classList.add('hidden');
    
    // --- PART 2 ---
    // 5. Show Part 2
    part2El.classList.remove('hidden');
    
    // 6. Show "HAPPY BIRTHDAY"
    await sleep(120);
    w3.classList.add('pop');
    await sleep(WORD_DISPLAY_MS); // Wait 1.5s
    
    // 7. Show "Yumie" AND animate "HAPPY BIRTHDAY"
    w4.classList.add('pop');
    // w3.classList.add('shrink-up'); // Triggers the CSS animation
    
    await sleep(WORD_DISPLAY_MS + 3000); // Hold the final message
    
    // --- FINISH & TRANSITION ---

    // 8. Fade out the main overlay ("HAPPY BIRTHDAY Yumie")
    finalWordsEl.classList.remove('fade-in');
    finalWordsEl.classList.add('fade-out');
    await sleep(500); // Wait for text to fade
    finalWordsEl.classList.add('hidden');

    // 9. Fade out matrix
    canvas.classList.add('fade-out-fast'); // Add class to fade out matrix

    // 10. Make moon fully visible and start zoom
    moonImgEl.classList.add('moon-zoom');  // Add class to zoom/fade in moon IMG

    // 11. Stop the matrix draw loop after fade
    setTimeout(() => {
        running = false;
    }, 1500); // 1.5s fade time

    // 12. Wait for zoom animation to complete
    await sleep(2500); // Wait 2.5 seconds for zoom

    // 13. Redirect to new page
    if (REDIRECT_TO && REDIRECT_TO.length) {
      window.location.href = REDIRECT_TO;
    }
    // --- FINISH ---
    // 8. Fade out the main overlay
  //   finalWordsEl.classList.remove('fade-in');
  //   finalWordsEl.classList.add('fade-out');
    
  //   setTimeout(() => {
  //     finalWordsEl.classList.add('hidden');
  //     finalWordsEl.classList.remove('fade-out');
  //     if (REDIRECT_TO && REDIRECT_TO.length) {
  //       setTimeout(() => window.location.href = REDIRECT_TO, REDIRECT_AFTER_MS);
  //     }
  //   }, 420);
  }

  function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

  function start() {
    resize();
    initColumns();
    lastTime = performance.now();
    running = true;
    requestAnimationFrame(drawFrame);
    runSequence();
  }

  initColumns();
  start();
  window.addEventListener('resize', () => {
    resize();
    initColumns();
  }, { passive: true });

  window._yumi = { initColumns, columns };
})();
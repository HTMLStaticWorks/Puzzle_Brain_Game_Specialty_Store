document.addEventListener('DOMContentLoaded', () => {
  /* ==================================================
     Theme Toggle (Dark/Light)
     ================================================== */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check for saved theme preference, otherwise use OS preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcons('dark');
  } else {
    updateThemeIcons('light');
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });

  function updateThemeIcons(theme) {
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'ph ph-sun';
        } else {
          icon.className = 'ph ph-moon';
        }
      }
    });
  }

  /* ==================================================
     RTL Toggle
     ================================================== */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  const savedDir = localStorage.getItem('dir');
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('dir', newDir);
    });
  });

  /* ==================================================
     Mobile Drawer Navigation
     ================================================== */
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');

  function openDrawer() {
    if(drawer && drawerOverlay) {
      drawer.classList.add('open');
      drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if(drawer && drawerOverlay) {
      drawer.classList.remove('open');
      drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  /* ==================================================
     Form Validation (Contact Page)
     ================================================== */
  const contactForm = document.getElementById('enquiryForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          setInvalid(input);
          isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          setInvalid(input);
          isValid = false;
        } else {
          setValid(input);
        }
      });

      if (isValid) {
        // Show success message
        const successMsg = document.getElementById('formSuccess');
        if (successMsg) {
          successMsg.style.display = 'block';
          contactForm.reset();
          inputs.forEach(input => input.classList.remove('valid'));
          
          // Hide message after a while
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 5000);
        }
      }
    });

    // Remove error states on input
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
      });
    });
  }

  function setInvalid(input) {
    input.classList.add('invalid');
    input.classList.remove('valid');
  }

  function setValid(input) {
    input.classList.remove('invalid');
    input.classList.add('valid');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ==================================================
     Product Filtering (Products Page)
     ================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const emptyState = document.getElementById('emptyState');

  if (filterBtns.length > 0 && productCards.length > 0) {
    let activeCategory = 'all';
    let activeDifficulty = 'all';

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Handle active state on buttons
        const filterGroup = btn.closest('.filter-group');
        filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active filters
        if (btn.dataset.category) {
          activeCategory = btn.dataset.category;
        }
        if (btn.dataset.difficulty) {
          activeDifficulty = btn.dataset.difficulty;
        }

        filterProducts();
      });
    });

    function filterProducts() {
      let visibleCount = 0;

      productCards.forEach(card => {
        const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
        const difficultyMatch = activeDifficulty === 'all' || card.dataset.difficulty === activeDifficulty;

        if (categoryMatch && difficultyMatch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }
  }

  /* ==================================================
     Custom Photo Puzzle Upload Preview
     ================================================== */
  const photoInput = document.getElementById('photoUpload');
  const photoPreview = document.getElementById('photoPreview');
  const placeholderIcon = document.getElementById('uploadPlaceholder');

  if (photoInput && photoPreview && placeholderIcon) {
    photoInput.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          photoPreview.src = e.target.result;
          photoPreview.style.display = 'block';
          placeholderIcon.style.display = 'none';
        }
        
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  /* ==================================================
     Curated Brain-Benders Filter (Home 2)
     ================================================== */
  const challengeFilters = document.querySelectorAll('.challenge-filter-btn');
  const challengeItems = document.querySelectorAll('.challenge-item');

  if (challengeFilters.length > 0 && challengeItems.length > 0) {
    challengeFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        challengeFilters.forEach(b => {
          b.classList.remove('btn-primary');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');

        const filter = btn.dataset.filter;
        challengeItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==================================================
     Sticky Header Elevation
     ================================================== */
  const header = document.querySelector('.header');

  if (header) {
    const setHeaderState = () => {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
  }

  /* ==================================================
     Scroll Reveal
     ================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

      revealEls.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
        observer.observe(el);
      });
    } else {
      revealEls.forEach(el => el.classList.add('visible'));
    }
  }

  /* ==================================================
     Puzzle Match Finder (Home)
     ================================================== */
  const finder = document.getElementById('puzzleFinder');

  if (finder) {
    const answers = { who: 'solo', time: 'short', vibe: 'calm' };

    const recommendations = {
      'solo-short-calm':    { name: 'Coastal Mornings 500pc', type: 'Jigsaw · 500 pieces', match: 96, blurb: 'A soft-palette linen-finish jigsaw with oversized pieces — the perfect one-sitting wind-down after a long day.', tags: ['~2 hrs', 'Low difficulty', 'Matte anti-glare'], price: '$32', href: 'products.html' },
      'solo-short-intense': { name: 'Titanium Sphere Labyrinth', type: 'Kinetic · 3D maze', match: 93, blurb: 'A machined multi-plane labyrinth that punishes impatience. Short sessions, steep learning curve, huge payoff.', tags: ['~1.5 hrs', 'Expert', 'Machined alloy'], price: '$42', href: 'products.html' },
      'solo-long-calm':     { name: 'Nebula Symphony 1000pc', type: 'Jigsaw · 1000 pieces', match: 97, blurb: 'Laser-cut Dutch blueboard with deep celestial inks. Built to live on the table for a whole weekend.', tags: ['~6-8 hrs', 'Medium', 'Recycled board'], price: '$36', href: 'products.html' },
      'solo-long-intense':  { name: 'The DaVinci Codex Box', type: 'Mechanical · Sequential', match: 98, blurb: 'Fourteen hidden steps in solid birch. Sliding dovetails, no instructions, and one very satisfying final click.', tags: ['~3.5 hrs', 'Expert', 'Solid birch'], price: '$68', href: 'products.html' },
      'duo-short-calm':     { name: 'Botanical Press 500pc', type: 'Jigsaw · 500 pieces', match: 94, blurb: 'Pressed-flower artwork on thick chipboard — easy to split into two halves and solve side by side.', tags: ['~2.5 hrs', 'Low difficulty', 'Two-tray box'], price: '$34', href: 'products.html' },
      'duo-short-intense':  { name: 'Tandem Logic Gates', type: 'Brain teaser · 2 player', match: 92, blurb: 'A head-to-head wooden logic duel. Two boards, one shared rule set, and a timer that keeps it merciless.', tags: ['~45 min', 'Hard', 'Beech wood'], price: '$54', href: 'products.html' },
      'duo-long-calm':      { name: 'Grand Canyon 2000pc', type: 'Jigsaw · 2000 pieces', match: 95, blurb: 'A sprawling panoramic build made for two pairs of hands and several pots of coffee.', tags: ['~14 hrs', 'Medium', 'Panoramic'], price: '$49', href: 'products.html' },
      'duo-long-intense':   { name: 'Bamboo Secret Box Duo', type: 'Mechanical · Sequential', match: 91, blurb: 'Two interlocking boxes that only open in the right order — you literally cannot finish this one alone.', tags: ['~4 hrs', 'Expert', 'Bamboo'], price: '$78', href: 'products.html' },
      'family-short-calm':  { name: 'Woodland Friends 100pc', type: 'Kids · 100 pieces', match: 98, blurb: 'Chunky, child-safe pieces and a poster-sized reveal. Made for the twenty minutes before dinner.', tags: ['~30 min', 'Ages 4+', 'Chunky pieces'], price: '$22', href: 'products.html' },
      'family-short-intense': { name: 'Acrylic Maze Cube', type: 'Kinetic · Handheld', match: 90, blurb: 'A pass-it-around gravity cube. Everyone gets a turn, nobody gets it first try.', tags: ['~20 min', 'Ages 8+', 'Cast acrylic'], price: '$28', href: 'products.html' },
      'family-long-calm':   { name: 'World Map Floor Puzzle', type: 'Kids · 300 pieces', match: 96, blurb: 'A metre-wide floor build that doubles as a geography lesson. Wipe-clean coating included.', tags: ['~3 hrs', 'Ages 6+', 'Wipe-clean'], price: '$39', href: 'products.html' },
      'family-long-intense': { name: 'Escape Room In A Box', type: 'Brain teaser · Multi-stage', match: 94, blurb: 'Nine linked puzzles, one story, and a shared ninety-minute countdown across the kitchen table.', tags: ['~90 min', 'Hard', '9 stages'], price: '$62', href: 'products.html' }
    };

    const resultEl = document.getElementById('finderResult');

    function renderFinder() {
      const key = `${answers.who}-${answers.time}-${answers.vibe}`;
      const r = recommendations[key];
      if (!r || !resultEl) return;

      resultEl.innerHTML = `
        <div class="finder-result-inner">
          <div class="finder-match">
            <b>${r.match}%</b>
            <small>Match score</small>
          </div>
          <h3>${r.name}</h3>
          <p>${r.blurb}</p>
          <div class="finder-meta">
            <span>${r.type}</span>
            ${r.tags.map(t => `<span>${t}</span>`).join('')}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap; padding-block-start: var(--space-3); border-block-start: 1px solid rgba(255,255,255,0.14);">
            <strong style="font-family: var(--font-heading); font-size: 1.5rem;">${r.price}</strong>
            <a href="${r.href}" class="btn btn-primary btn-sm">View in store <i class="ph ph-arrow-right"></i></a>
          </div>
        </div>`;
    }

    finder.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const group = chip.dataset.group;
        finder.querySelectorAll(`.chip[data-group="${group}"]`).forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        answers[group] = chip.dataset.value;
        renderFinder();
      });
    });

    renderFinder();
  }

  /* ==================================================
     Slide Puzzle Mini-Game (Home 2)
     ================================================== */
  const board = document.getElementById('slideBoard');

  if (board) {
    const SIZE = 3;
    const TOTAL = SIZE * SIZE;
    const movesEl = document.getElementById('slideMoves');
    const timeEl = document.getElementById('slideTime');
    const winEl = document.getElementById('slideWin');
    const shuffleBtn = document.getElementById('slideShuffle');

    let tiles = [];
    let moves = 0;
    let seconds = 0;
    let timer = null;
    let solved = false;

    function isSolvable(arr) {
      const flat = arr.filter(n => n !== 0);
      let inversions = 0;
      for (let i = 0; i < flat.length; i++) {
        for (let j = i + 1; j < flat.length; j++) {
          if (flat[i] > flat[j]) inversions++;
        }
      }
      return inversions % 2 === 0; // odd grid width: solvable when inversions are even
    }

    function shuffle() {
      do {
        tiles = Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL);
        for (let i = tiles.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
      } while (!isSolvable(tiles) || isSolved());

      moves = 0;
      seconds = 0;
      solved = false;
      if (winEl) winEl.classList.remove('show');
      stopTimer();
      updateStats();
      render();
    }

    function isSolved() {
      return tiles.every((v, i) => v === (i + 1) % TOTAL);
    }

    function startTimer() {
      if (timer) return;
      timer = setInterval(() => {
        seconds++;
        updateStats();
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timer);
      timer = null;
    }

    function updateStats() {
      if (movesEl) movesEl.textContent = moves;
      if (timeEl) {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        timeEl.textContent = `${m}:${s}`;
      }
    }

    function canMove(index) {
      const empty = tiles.indexOf(0);
      const r1 = Math.floor(index / SIZE), c1 = index % SIZE;
      const r2 = Math.floor(empty / SIZE), c2 = empty % SIZE;
      return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
    }

    function move(index) {
      if (solved || !canMove(index)) return;
      const empty = tiles.indexOf(0);
      [tiles[index], tiles[empty]] = [tiles[empty], tiles[index]];
      moves++;
      startTimer();
      updateStats();
      render();

      if (isSolved()) {
        solved = true;
        stopTimer();
        if (winEl) {
          winEl.innerHTML = `<i class="ph-fill ph-confetti"></i> Solved in ${moves} moves &middot; ${timeEl ? timeEl.textContent : ''}`;
          winEl.classList.add('show');
        }
      }
    }

    function render() {
      board.innerHTML = '';
      tiles.forEach((value, index) => {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'slide-tile';
        if (value === 0) {
          tile.classList.add('empty');
          tile.setAttribute('aria-hidden', 'true');
          tile.tabIndex = -1;
        } else {
          tile.textContent = value;
          tile.setAttribute('aria-label', `Tile ${value}`);
          if (canMove(index)) tile.classList.add('movable');
          tile.addEventListener('click', () => move(index));
        }
        board.appendChild(tile);
      });
    }

    if (shuffleBtn) shuffleBtn.addEventListener('click', shuffle);

    document.addEventListener('keydown', (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const rect = board.getBoundingClientRect();
      const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
      if (!onScreen) return;

      const empty = tiles.indexOf(0);
      const r = Math.floor(empty / SIZE), c = empty % SIZE;
      let target = -1;
      if (e.key === 'ArrowUp' && r < SIZE - 1) target = empty + SIZE;
      if (e.key === 'ArrowDown' && r > 0) target = empty - SIZE;
      if (e.key === 'ArrowLeft' && c < SIZE - 1) target = empty + 1;
      if (e.key === 'ArrowRight' && c > 0) target = empty - 1;
      if (target >= 0) {
        e.preventDefault();
        move(target);
      }
    });

    shuffle();
  }
});

/* ==================================================
   Back to Top
   ================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  const SHOW_AFTER = 400;
  let ticking = false;

  const update = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > SHOW_AFTER);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();

  backToTop.addEventListener('click', () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });
});

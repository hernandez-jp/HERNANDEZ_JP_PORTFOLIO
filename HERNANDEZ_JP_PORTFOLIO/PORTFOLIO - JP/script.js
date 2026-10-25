let currentModalCode = '';
let currentZoomScale = 1;
let currentActiveCategory = 'all';

// Progress Bar
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  const progressBar = document.getElementById('progressBar');
  if (progressBar) progressBar.style.width = scrolled + '%';
});

// Mobile Drawer Navigation
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

// Category Filter & Search
window.filterCerts = function(category) {
  currentActiveCategory = category;
  applyFilters();
};

const searchInput = document.getElementById('certSearchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    applyFilters();
  });
}

function applyFilters() {
  const searchInput = document.getElementById('certSearchInput');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const tabs = document.querySelectorAll('.cert-tab-btn');
  const categoryBlocks = document.querySelectorAll('.cert-category-block');
  const cards = document.querySelectorAll('.cert-card');
  const rows = document.querySelectorAll('.cert-row');
  const certificateGallery = document.getElementById('certGridContainer');

if (certificateGallery) {
  certificateGallery.style.display =
    currentActiveCategory === 'all' ? 'none' : '';
}

  tabs.forEach(tab => {
    if (tab.getAttribute('data-filter') === currentActiveCategory) {
      tab.classList.add('bg-rose-600', 'text-white');
      tab.classList.remove('bg-white/5', 'text-neutral-400');
    } else {
      tab.classList.remove('bg-rose-600', 'text-white');
      tab.classList.add('bg-white/5', 'text-neutral-400');
    }
  });

  let visibleCardsCount = 0;

  
cards.forEach(card => {
  const cardCat = card.getAttribute('data-category') || '';
  const cardKeys = (card.getAttribute('data-keywords') || '').toLowerCase();

  const matchesCat =
    currentActiveCategory === 'all' ||
    cardCat === currentActiveCategory;

  const matchesSearch =
    searchVal === '' || cardKeys.includes(searchVal);

  if (matchesCat && matchesSearch) {
    card.style.display = 'flex';
    visibleCardsCount++;
  } else {
    card.style.display = 'none';
  }
});


  categoryBlocks.forEach(block => {
    const blockCat = block.getAttribute('data-category-id');
    const matchesCat = (currentActiveCategory === 'all' || blockCat === currentActiveCategory);
    const hasVisibleChildren = Array.from(block.querySelectorAll('.cert-card')).some(
      card => card.style.display !== 'none'
    );

    if (matchesCat && hasVisibleChildren) {
      block.style.display = 'block';
    } else {
      block.style.display = 'none';
    }
  });

  rows.forEach(row => {
    const rowCat = row.getAttribute('data-category');
    const rowKeys = (row.getAttribute('data-keywords') || '').toLowerCase();
    const matchesCat = (currentActiveCategory === 'all' || rowCat === currentActiveCategory);
    const matchesSearch = searchVal === '' || rowKeys.includes(searchVal);

    if (matchesCat && matchesSearch) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });

  const noResults = document.getElementById('noResults');
  if (noResults) {
    noResults.classList.toggle('hidden', visibleCardsCount > 0);
  }
}

// Dual View Switcher (Cards vs Table)
window.switchCertView = function(viewType) {
  const gridContainer = document.getElementById('certGridContainer');
  const tableContainer = document.getElementById('certTableContainer');
  const gridBtn = document.getElementById('viewGridBtn');
  const tableBtn = document.getElementById('viewTableBtn');

  if (viewType === 'grid') {
    if (gridContainer) gridContainer.classList.remove('hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
    if (gridBtn) {
      gridBtn.classList.add('bg-white/15', 'text-white');
      gridBtn.classList.remove('text-neutral-400');
    }
    if (tableBtn) {
      tableBtn.classList.remove('bg-white/15', 'text-white');
      tableBtn.classList.add('text-neutral-400');
    }
  } else {
    if (gridContainer) gridContainer.classList.add('hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');
    if (tableBtn) {
      tableBtn.classList.add('bg-white/15', 'text-white');
      tableBtn.classList.remove('text-neutral-400');
    }
    if (gridBtn) {
      gridBtn.classList.remove('bg-white/15', 'text-white');
      gridBtn.classList.add('text-neutral-400');
    }
  }
};

// Lightbox Inspector & Zoom Dock
window.openCertModal = function(title, issuer, date, signatories, code, imgSrc, verifyUrl) {
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val || '';
  };

  setText('modalTitle', title);
  setText('modalIssuer', issuer);
  setText('modalDate', date);
  setText('modalSignatory', signatories);
  setText('modalCode', code);

  const modalImg = document.getElementById('modalImg');
  if (modalImg) {
    modalImg.src = imgSrc || '';
    modalImg.alt = title || 'Certificate';
    window.setCertZoom(1);
  }

  const verifyBtn = document.getElementById('modalVerifyBtn');
  if (verifyBtn) {
    if (verifyUrl && verifyUrl !== '') {
      verifyBtn.href = verifyUrl;
      verifyBtn.classList.remove('hidden');
    } else {
      verifyBtn.classList.add('hidden');
    }
  }

  currentModalCode = code || '';

  const certModal = document.getElementById('certModal');
  if (certModal) {
    certModal.classList.remove('hidden');
    certModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCertModal = function() {
  const certModal = document.getElementById('certModal');
  if (certModal) {
    certModal.classList.add('hidden');
    certModal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
};

window.setCertZoom = function(scale) {
  currentZoomScale = scale;
  const modalImg = document.getElementById('modalImg');
  const zoomDisplay = document.getElementById('zoomDisplay');
  if (modalImg) {
    modalImg.style.transform = `scale(${scale})`;
    modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  }
  if (zoomDisplay) {
    zoomDisplay.innerText = `${Math.round(scale * 100)}%`;
  }
};

window.zoomIn = function() {
  if (currentZoomScale < 2.5) {
    window.setCertZoom(parseFloat((currentZoomScale + 0.35).toFixed(2)));
  }
};

window.zoomOut = function() {
  if (currentZoomScale > 0.7) {
    window.setCertZoom(parseFloat((currentZoomScale - 0.35).toFixed(2)));
  }
};

window.toggleCertZoom = function() {
  if (currentZoomScale === 1) {
    window.setCertZoom(1.8);
  } else {
    window.setCertZoom(1);
  }
};

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  const certModal = document.getElementById('certModal');
  if (certModal && !certModal.classList.contains('hidden')) {
    if (e.key === '+' || e.key === '=') window.zoomIn();
    if (e.key === '-' || e.key === '_') window.zoomOut();
    if (e.key === '0') window.setCertZoom(1);
    if (e.key === 'Escape') window.closeCertModal();
  }
});

// Clipboard & Toast Notification
window.copyToClipboard = function(text, message = 'Copied to clipboard!') {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    window.showToast(message);
  }).catch(() => {
    window.showToast('Failed to copy');
  });
};

window.copyModalCode = function() {
  if (currentModalCode) {
    window.copyToClipboard(currentModalCode, 'Credential code copied!');
  }
};

window.showToast = function(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  
  if (toast && toastMsg) {
    toastMsg.innerText = message;
    toast.classList.remove('translate-y-16', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-16', 'opacity-0');
    }, 2800);
  }
};

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedback = document.getElementById('contactFeedback');
    if (feedback) {
      feedback.classList.remove('hidden');
      contactForm.reset();
      setTimeout(() => {
        feedback.classList.add('hidden');
      }, 5000);
    }
  });
}
// Profile Modal & Screen Flash Engine (Guaranteed 100% Execution)
let currentProfileZoom = 1;

function injectProfileModalHtml() {
  if (document.getElementById('profileModal')) return;

  const modalHtml = `
  <div id="profileFlashBurst" style="display:none; position:fixed; inset:0; z-index:1000000; pointer-events:none; background:#fff;"></div>
  <div id="profileModal" style="display:none; position:fixed; inset:0; z-index:999999; background:rgba(0,0,0,0.92); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); align-items:center; justify-content:center; padding:1rem;" onclick="closeProfileModal()">
    <div style="background:#100c14; border:1px solid rgba(255,255,255,0.2); max-width:640px; width:100%; border-radius:1rem; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.9); position:relative; display:flex; flex-direction:column; max-height:94vh;" onclick="event.stopPropagation()">
      
      <!-- Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; padding:1rem; border-bottom:1px solid rgba(255,255,255,0.1); background:#09070c;">
        <div style="display:flex; align-items:center; gap:0.75rem; min-width:0;">
          <div style="width:2rem; height:2rem; border-radius:0.5rem; background:rgba(225,29,72,0.15); border:1px solid rgba(225,29,72,0.3); display:flex; align-items:center; justify-content:center; color:#f43f5e; flex-shrink:0;">
            <i class="fa-solid fa-user" style="font-size:0.8rem;"></i>
          </div>
          <div style="min-width:0;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="color:#fff; font-weight:700; font-size:0.95rem; white-space:nowrap;">Jhon Paul F. Hernandez</span>
              <span style="font-size:0.65rem; font-family:monospace; padding:0.15rem 0.5rem; border-radius:9999px; background:rgba(225,29,72,0.2); color:#fda4af; font-weight:600; border:1px solid rgba(225,29,72,0.3);">Profile</span>
            </div>
            <p style="font-size:0.75rem; color:#a3a3a3; font-family:monospace; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              BS Information Technology · Northeastern College · Santiago City, Isabela
            </p>
          </div>
        </div>
        <button onclick="closeProfileModal()" aria-label="Close" style="width:2rem; height:2rem; border-radius:0.5rem; background:rgba(255,255,255,0.05); color:#a3a3a3; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;">
          <i class="fa-solid fa-xmark" style="font-size:0.9rem;"></i>
        </button>
      </div>

      <!-- Image Stage -->
      <div style="padding:1.5rem; background:#000; display:flex; align-items:center; justify-content:center; overflow:auto; max-height:60vh; border-bottom:1px solid rgba(255,255,255,0.1); position:relative; min-height:300px;">
        <div style="overflow:hidden; display:flex; align-items:center; justify-content:center; cursor:zoom-in;" onclick="toggleProfileZoom()" title="Click to toggle zoom">
          <img id="profileModalImg" src="images/JPPP.jpg" alt="Jhon Paul Hernandez" style="max-height:50vh; width:auto; max-width:100%; border-radius:0.75rem; border:1px solid rgba(255,255,255,0.15); object-fit:contain; box-shadow:0 20px 40px rgba(0,0,0,0.8); transition:transform 0.2s ease-out;">
        </div>

        <!-- Floating Zoom Dock -->
        <div style="position:absolute; bottom:1rem; left:50%; transform:translateX(-50%); padding:0.35rem 0.75rem; border-radius:0.75rem; background:rgba(20,15,26,0.95); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; gap:0.5rem; color:#fff; font-size:0.75rem; font-family:monospace; box-shadow:0 15px 30px rgba(0,0,0,0.6);">
          <button onclick="profileZoomOut()" style="width:1.75rem; height:1.75rem; border-radius:0.5rem; background:rgba(255,255,255,0.1); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Zoom Out (-)">
            <i class="fa-solid fa-minus" style="font-size:0.65rem;"></i>
          </button>
          <span id="profileZoomDisplay" style="min-width:44px; text-align:center; font-weight:700; color:#d4d4d4; font-size:0.75rem;">100%</span>
          <button onclick="profileZoomIn()" style="width:1.75rem; height:1.75rem; border-radius:0.5rem; background:rgba(255,255,255,0.1); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Zoom In (+)">
            <i class="fa-solid fa-plus" style="font-size:0.65rem;"></i>
          </button>
          <span style="color:#525252;">|</span>
          <button onclick="setProfileZoom(1)" style="padding:0.25rem 0.5rem; border-radius:0.5rem; background:rgba(255,255,255,0.1); border:none; color:#d4d4d4; cursor:pointer; font-size:0.7rem;" title="Reset Zoom">
            <i class="fa-solid fa-rotate-left" style="font-size:0.65rem; margin-right:0.2rem;"></i> Reset
          </button>
          <button onclick="setProfileZoom(1.5)" style="padding:0.25rem 0.5rem; border-radius:0.5rem; background:rgba(225,29,72,0.2); border:1px solid rgba(225,29,72,0.3); color:#fda4af; cursor:pointer; font-weight:600; font-size:0.7rem;" title="150% Zoom">
            1.5x
          </button>
        </div>
      </div>

      <!-- Footer Actions -->
      <div style="padding:1rem 1.25rem; background:#0a080d; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.75rem; font-size:0.75rem;">
        <div style="display:flex; align-items:center; gap:0.5rem; color:#d4d4d4;">
          <i class="fa-solid fa-circle-check" style="color:#34d399;"></i>
          <span style="font-weight:600; color:#fff;">Jhon Paul F. Hernandez</span>
          <span style="color:#737373; font-family:monospace;">· Santiago City, Isabela</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button onclick="copyToClipboard(window.location.origin + '/images/JPPP.jpg', 'Portrait link copied!')" style="padding:0.4rem 0.75rem; border-radius:0.5rem; background:rgba(255,255,255,0.05); color:#d4d4d4; font-family:monospace; border:1px solid rgba(255,255,255,0.1); cursor:pointer; display:flex; align-items:center; gap:0.35rem; font-size:0.75rem;">
            <i class="fa-regular fa-copy"></i> Copy Link
          </button>
          <a href="images/JPPP.jpg" download="Jhon_Paul_Hernandez_Portrait.jpg" style="padding:0.4rem 0.85rem; border-radius:0.5rem; background:#e11d48; color:#fff; font-family:monospace; font-weight:600; text-decoration:none; display:flex; align-items:center; gap:0.35rem; font-size:0.75rem; box-shadow:0 4px 12px rgba(225,29,72,0.4);">
            <i class="fa-solid fa-download"></i> Save Portrait
          </a>
        </div>
      </div>

    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

window.openProfileModal = function(imageSrc = 'images/JPPP.jpg', imageTitle = 'Jhon Paul Hernandez') {
    injectProfileModalHtml();

    const modal = document.getElementById('profileModal');
    const img = document.getElementById('profileModalImg');

    if (!modal || !img) return;

    // Profile clicks may call openProfileModal() without arguments.
    // Fall back to the actual portrait instead of assigning an empty/undefined URL.
    const requestedSrc = (typeof imageSrc === 'string' && imageSrc.trim())
      ? imageSrc.trim()
      : 'images/JPPP.jpg';
    const requestedTitle = (typeof imageTitle === 'string' && imageTitle.trim())
      ? imageTitle.trim()
      : 'Jhon Paul Hernandez';

    // Resolve paths relative to this page so the image loads reliably
    // whether the site is opened locally or hosted in a subdirectory.
    img.src = new URL(requestedSrc, document.baseURI).href;
    img.alt = requestedTitle;
    img.onerror = function () {
      // Avoid a broken-image icon if a caller passes an invalid image path.
      if (!img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = 'true';
        img.src = new URL('images/JPPP.jpg', document.baseURI).href;
        img.alt = 'Jhon Paul Hernandez';
      }
    };
    img.onload = function () {
      delete img.dataset.fallbackApplied;
    };

    window.setProfileZoom(1);

    modal.style.setProperty('display', 'flex', 'important');
    modal.classList.add('active', 'show');
    document.body.style.overflow = 'hidden';
};

window.closeProfileModal = function() {
  const profileModal = document.getElementById('profileModal');
  if (profileModal) {
    profileModal.style.setProperty('display', 'none', 'important');
    profileModal.classList.remove('active', 'show');
    document.body.style.overflow = 'auto';
  }
};

window.setProfileZoom = function(scale) {
  currentProfileZoom = scale;
  const img = document.getElementById('profileModalImg');
  const display = document.getElementById('profileZoomDisplay');
  if (img) {
    img.style.transform = `scale(${scale})`;
    img.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  }
  if (display) {
    display.innerText = `${Math.round(scale * 100)}%`;
  }
};

window.profileZoomIn = function() {
  if (currentProfileZoom < 2.5) {
    window.setProfileZoom(parseFloat((currentProfileZoom + 0.25).toFixed(2)));
  }
};

window.profileZoomOut = function() {
  if (currentProfileZoom > 0.75) {
    window.setProfileZoom(parseFloat((currentProfileZoom - 0.25).toFixed(2)));
  }
};

window.toggleProfileZoom = function() {
  if (currentProfileZoom === 1) {
    window.setProfileZoom(1.5);
  } else {
    window.setProfileZoom(1);
  }
};

// Bind Click Listeners on Page Load
document.addEventListener('DOMContentLoaded', () => {
  injectProfileModalHtml();
  const profileElements = document.querySelectorAll('.profile-photo-card, #mainProfilePhoto, img[src*="JPPP"]');
  profileElements.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.openProfileModal();
    });
  });
});

// Keyboard Esc to Close
window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('profileModal');
  if (modal && modal.style.display === 'flex') {
    if (e.key === 'Escape') window.closeProfileModal();
    if (e.key === '+' || e.key === '=') window.profileZoomIn();
    if (e.key === '-' || e.key === '_') window.profileZoomOut();
    if (e.key === '0') window.setProfileZoom(1);
  }
});



const certificateImages = [
  "images/cert-cisco-js.jpg",
  "images/cert-cisco-net.jpg",
  "images/cert-csharp.jpg",
  "images/cert-dict-ai.jpg",
  "images/cert-dict-game1.jpg",
  "images/cert-dict-game2.jpg",
  "images/cert-nc-agentic.jpg",
  "images/cert-nc-iot.jpg",
  "images/cert-nc-prog.jpg",
  "images/cert-nc-video.jpg",
  "images/cert-tesda-install.jpg",
  "images/cert-tesda-intro.jpg",
  "images/cert-tesda-maintain.jpg",
  "images/cert-tesda-net.jpg",
  "images/cert-tesda-servers.jpg"
];

const certificateSlide = document.getElementById("certificateSlide");

let certificateIndex = 0;
let transitionBusy = false;
let slideshowTimer;

const DISPLAY_DURATION = 4000;
const FADE_DURATION = 900;

function preloadCertificate(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Unable to load: ${src}`));
    img.src = src;

    if (img.complete && img.naturalWidth > 0) {
      resolve(img);
    }
  });
}

async function showNextCertificate() {
  if (
    !certificateSlide ||
    transitionBusy ||
    certificateImages.length < 2
  ) {
    return;
  }

  transitionBusy = true;

  const nextIndex =
    (certificateIndex + 1) % certificateImages.length;

  const nextSrc = certificateImages[nextIndex];

  try {
    // Load the next certificate before transitioning.
    const loadedImage = await preloadCertificate(nextSrc);

    certificateSlide.classList.add("fade-out");

    // Wait for the exit animation.
    await new Promise(resolve =>
      setTimeout(resolve, FADE_DURATION)
    );

    certificateSlide.src = loadedImage.src;
    certificateSlide.alt = `Certificate ${nextIndex + 1}`;

    certificateIndex = nextIndex;

    // Fade the new certificate in.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        certificateSlide.classList.remove("fade-out");
        transitionBusy = false;
      });
    });
  } catch (error) {
    console.error(error.message);
    certificateSlide.classList.remove("fade-out");
    transitionBusy = false;
  }
}

function startCertificateSlideshow() {
  clearInterval(slideshowTimer);

  if (certificateImages.length > 1) {
    slideshowTimer = setInterval(
      showNextCertificate,
      DISPLAY_DURATION + FADE_DURATION
    );
  }
}

if (certificateSlide && certificateImages.length > 0) {
  certificateSlide.src = certificateImages[0];
  certificateSlide.alt = "Certificate 1";

  startCertificateSlideshow();
}


/* Certificate slider, dynamic category banner, and gallery filters */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("certTrack");
  const viewport = document.getElementById("certBanner");
  const label = document.getElementById("certCategoryLabel");
  const gallery = document.getElementById("certGallery");
  const count = document.getElementById("certGalleryCount");
  const filterButtons = document.querySelectorAll(".cert-filter");

  const categoryLabels = {
    cisco: "CISCO CERTIFICATES",
    microsoft: "MICROSOFT CERTIFICATE",
    tesda: "TESDA CERTIFICATES",
    nc: "NC CERTIFICATES",
    dict: "DICT CERTIFICATES"
  };

  // Duplicate the slider's original cards only once.
  if (track && viewport && label && track.dataset.initialized !== "true") {
    const originalItems = Array.from(track.children).filter(item =>
      item.classList.contains("cert-item")
    );

    if (originalItems.length) {
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("img").forEach(img => {
          img.alt = "";
        });
        track.appendChild(clone);
      });

      track.dataset.initialized = "true";
    }

    let activeCategory = "";
    let framePending = false;
    let fadeTimer = null;

    function updateCategoryBanner() {
      framePending = false;

      const bounds = viewport.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      let closestItem = null;
      let closestDistance = Infinity;

      track.querySelectorAll(".cert-item").forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.right <= bounds.left || rect.left >= bounds.right) return;

        const distance = Math.abs((rect.left + rect.width / 2) - centerX);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = item;
        }
      });

      if (!closestItem) return;

      const category = closestItem.dataset.category;
      const nextLabel = categoryLabels[category];
      if (!nextLabel || category === activeCategory) return;

      activeCategory = category;
      label.classList.add("is-changing");
      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(() => {
        label.textContent = nextLabel;
        label.classList.remove("is-changing");
      }, 250);
    }

    function scheduleBannerUpdate() {
      if (framePending) return;
      framePending = true;
      window.requestAnimationFrame(updateCategoryBanner);
    }

    window.setInterval(scheduleBannerUpdate, 100);
    window.addEventListener("resize", scheduleBannerUpdate);
    track.addEventListener("animationiteration", scheduleBannerUpdate);
    scheduleBannerUpdate();
  }

  // Clicking any filter reveals the gallery and filters its cards.
  if (gallery) {
    const cards = Array.from(gallery.querySelectorAll(".cert-gallery-card"));

    function applyCertificateFilter(category) {
      let visibleCount = 0;

      cards.forEach(card => {
        const matches = category === "all" || card.dataset.category === category;
        card.hidden = !matches;
        if (matches) visibleCount++;
      });

      gallery.hidden = false;

      if (count) {
        count.textContent =
          `Showing ${visibleCount} certificate${visibleCount === 1 ? "" : "s"}`;
      }

      filterButtons.forEach(button => {
        const active = (button.dataset.filter || "all") === category;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      if (gallery.hidden === false) {
        gallery.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        applyCertificateFilter(button.dataset.filter || "all");
      });
    });

    // Keep the gallery hidden until the visitor selects a filter.
    gallery.hidden = true;

    // Accessible certificate image viewer.
    let viewer = document.getElementById("certImageViewer");
    if (!viewer) {
      viewer = document.createElement("div");
      viewer.id = "certImageViewer";
      viewer.className = "cert-image-viewer";
      viewer.innerHTML = `
        <button type="button" class="cert-viewer-close" aria-label="Close certificate viewer">&times;</button>
        <img alt="Certificate preview">
      `;
      document.body.appendChild(viewer);
    }

    const viewerImage = viewer.querySelector("img");
    const closeButton = viewer.querySelector(".cert-viewer-close");

    function closeViewer() {
      viewer.classList.remove("open");
      document.body.style.overflow = "";
    }

    gallery.querySelectorAll(".cert-gallery-card > img").forEach(img => {
      img.addEventListener("click", () => {
        viewerImage.src = img.src;
        viewerImage.alt = img.alt;
        viewer.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    closeButton.addEventListener("click", closeViewer);
    viewer.addEventListener("click", event => {
      if (event.target === viewer) closeViewer();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeViewer();
    });
  }
});

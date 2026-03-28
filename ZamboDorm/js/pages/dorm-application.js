/* ══════════════════════════════════════════════════════════════════════════════
   ZAMBO DORM - DORM APPLICATION PAGE SCRIPTS
   ══════════════════════════════════════════════════════════════════════════════ */

// Data: All Dorms
const DORMS = [
  {
    id: 1,
    name: "Valendar Dorm",
    bg: "Barangay Talon-Talon",
    type: "Double",
    price: 3500,
    slots: 3,
    slotT: "av",
    verified: true,
    bedType: "Double Decker",
    desc: "A clean, well-maintained dormitory a short walk from WMSU. Quiet corridors, 24/7 security, and a welcoming community of students and working tenants who look out for each other.",
    amenities: ["WiFi", "Study Area", "Laundry", "Common Area", "CCTV", "Water"],
    heroImg: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
    roomImgs: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=75", "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&q=75"]
  },
  {
    id: 2,
    name: "Sunrise Residences",
    bg: "Barangay Canelar",
    type: "Single",
    price: 4500,
    slots: 5,
    slotT: "av",
    verified: true,
    bedType: "Single Bed",
    desc: "Modern single-occupancy rooms with private bathrooms. Ideal for working professionals and graduate students who value privacy, comfort, and a peaceful, distraction-free environment.",
    amenities: ["WiFi", "CCTV", "Private Bath", "Air-con", "Study Desk", "Water"],
    heroImg: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    roomImgs: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=75", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=75"]
  },
  {
    id: 3,
    name: "Blue Horizon Dorm",
    bg: "Barangay Tetuan",
    type: "Shared",
    price: 2500,
    slots: 2,
    slotT: "lim",
    verified: false,
    bedType: "Double Decker",
    desc: "Budget-friendly shared dormitory near the port area. Clean, secure, and perfect for students on a tight budget. Strong community feel with organized common spaces and evening curfew.",
    amenities: ["WiFi", "Laundry", "Common Area", "Water", "Parking"],
    heroImg: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    roomImgs: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=75", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=75"]
  },
  {
    id: 4,
    name: "Magnolia House",
    bg: "Barangay Putik",
    type: "Single",
    price: 6000,
    slots: 4,
    slotT: "av",
    verified: true,
    bedType: "Single Bed",
    desc: "Premium single rooms with air-conditioning, private lockers, and daily housekeeping. Minutes from major universities and hospitals. The best value premium stay in the city.",
    amenities: ["WiFi", "Air-con", "Private Bath", "Housekeeping", "Study Area", "Laundry", "CCTV"],
    heroImg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    roomImgs: ["https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&q=75", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=75"]
  },
  {
    id: 5,
    name: "Seabreeze Dormitel",
    bg: "Barangay Mampang",
    type: "Double",
    price: 3000,
    slots: 6,
    slotT: "av",
    verified: false,
    bedType: "Single Beds",
    desc: "A friendly, affordable dormitel with spacious double rooms and sea glimpses from upper floors. Well-connected by public transport to the city center and universities.",
    amenities: ["WiFi", "Common Area", "Laundry", "Water", "Parking"],
    heroImg: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    roomImgs: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd58?w=500&q=75", "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=75"]
  },
  {
    id: 6,
    name: "Santamar Lodging House",
    bg: "Barangay Sta. Maria",
    type: "Shared",
    price: 2200,
    slots: 1,
    slotT: "lim",
    verified: false,
    bedType: "Double Decker",
    desc: "Traditional Filipino boarding house with home-cooked meals available. Quiet neighborhood close to public markets and schools. Curfew enforced for a safe environment.",
    amenities: ["WiFi", "Meals Included", "CCTV", "Common Area", "Water"],
    heroImg: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
    roomImgs: ["https://images.unsplash.com/photo-1543489822-c49534f3271f?w=500&q=75", "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=500&q=75"]
  },
  {
    id: 7,
    name: "Purple Gate Dormitory",
    bg: "Barangay Guiwan",
    type: "Double",
    price: 4800,
    slots: 4,
    slotT: "av",
    verified: true,
    bedType: "Single Beds",
    desc: "Modern dormitory with air-conditioned double rooms, fast fiber internet, and a rooftop lounge. Popular among tech students and young professionals who need reliable connectivity.",
    amenities: ["Fiber WiFi", "Air-con", "Study Area", "CCTV", "Laundry", "Rooftop Lounge", "Water"],
    heroImg: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    roomImgs: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=75", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500&q=75"]
  }
];

// Amenity Icons Mapping
const AI = {
  "WiFi": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/></svg>`,
  "Fiber WiFi": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/></svg>`,
  "Study Area": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  "Laundry": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  "CCTV": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
  "Common Area": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
  "Air-con": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>`,
  "Private Bath": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/></svg>`,
  "Water": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`,
  "Parking": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg>`,
  "Meals Included": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  "Housekeeping": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>`,
  "Rooftop Lounge": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  "Study Desk": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
};

const DEFAULT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/></svg>`;

/**
 * Render dorm cards to the grid
 */
function render(dorms) {
  const g = document.getElementById('dg');
  g.innerHTML = '';

  // No results state
  if (!dorms.length) {
    g.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem 2rem">
        <div style="width:72px;height:72px;background:#f3f4f6;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.2rem">
          <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" width="32" height="32">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <h3 style="font-size:18px;font-weight:700;color:#1e1240;margin-bottom:.5rem">No Rooms Found</h3>
        <p style="font-size:14px;color:#9ca3af">Try adjusting your filters to see more options.</p>
      </div>
    `;
    document.getElementById('rc').innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="14" height="14">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg> 0 dorms available
    `;
    return;
  }

  // Render each dorm card
  dorms.forEach((d, i) => {
    g.innerHTML += `
      <div class="dc" style="animation-delay:${(i + 1) * 0.05}s">
        <div class="ciw">
          <img src="${d.heroImg}" alt="${d.name}" loading="lazy"/>
          ${d.verified ? `<div class="vb">✓ Verified</div>` : ''}
          <div class="sb ${d.slotT}">
            <div class="dot"></div>${d.slots} slot${d.slots > 1 ? 's' : ''} left
          </div>
        </div>
        <div class="cgallery">
          ${d.roomImgs.map(img => `<img src="${img}" alt="Room" loading="lazy" class="cgimg"/>`).join('')}
        </div>
        <div class="cb">
          <div class="cloc">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${d.bg}, Zamboanga City
          </div>
          <div class="cn">${d.name}</div>
          <div class="cd">${d.desc.substring(0, 115)}...</div>
          <div class="cm">
            <span class="mt">${d.type} Room</span>
            <span class="mt n">${d.bedType}</span>
          </div>
          <div class="ams">
            ${d.amenities.slice(0, 4).map(a => `<span class="am">${AI[a] || DEFAULT_ICON} ${a}</span>`).join('')}
          </div>
        </div>
        <div class="cf">
          <div class="cp">
            <div class="amt">₱${d.price.toLocaleString()}</div>
            <div class="per">/ month</div>
          </div>
          <div class="br">
            <button class="bv" onclick="openV(${d.id})">View</button>
            <button class="ba" onclick="openA('${d.name}','${d.bg}','${d.type} Room','₱${d.price.toLocaleString()}')">Apply Now</button>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById('rc').innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="14" height="14">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg> ${dorms.length} dorm${dorms.length !== 1 ? 's' : ''} available
  `;
}

/**
 * Apply filters to dorms
 */
function filter() {
  const t = document.querySelector('#type-btns .fc.active').dataset.type;
  const p = document.getElementById('pf').value;

  render(DORMS.filter(d =>
    (t === 'all' || d.type === t) &&
    (p === 'all' ||
      (p === 'low' && d.price < 3000) ||
      (p === 'mid' && d.price >= 3000 && d.price <= 5000) ||
      (p === 'high' && d.price > 5000)
    )
  ));
}

// Type filter buttons
document.querySelectorAll('#type-btns .fc').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('#type-btns .fc').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    filter();
  });
});

// Price filter
document.getElementById('pf').addEventListener('change', filter);

/**
 * Open view modal with dorm details
 */
function openV(id) {
  const d = DORMS.find(x => x.id === id);
  if (!d) return;

  document.getElementById('vhi').src = d.heroImg;
  document.getElementById('vmn').textContent = d.name;
  document.getElementById('vmloc').textContent = d.bg + ', Zamboanga City';
  document.getElementById('vmpr').textContent = '₱' + d.price.toLocaleString();
  document.getElementById('vmvb').style.display = d.verified ? '' : 'none';
  document.getElementById('vmdesc').textContent = d.desc;
  document.getElementById('vmslot').innerHTML = `
    <div class="vmsl ${d.slotT}">
      <div class="dot"></div>${d.slots} slot${d.slots > 1 ? 's' : ''} left
    </div>
  `;
  document.getElementById('vmmeta').innerHTML = `
    <span class="vmtag">${d.type} Room</span>
    <span class="vmtag n">${d.bedType}</span>
  `;
  document.getElementById('vmri').innerHTML = d.roomImgs.map(s => `<img src="${s}" alt="Room" loading="lazy"/>`).join('');
  document.getElementById('vmam').innerHTML = d.amenities.map(a => `<div class="vmami">${AI[a] || DEFAULT_ICON} ${a}</div>`).join('');

  document.getElementById('vmapply').onclick = () => {
    closeV();
    openA(d.name, d.bg, d.type + ' Room', '₱' + d.price.toLocaleString());
  };

  document.getElementById('vov').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Close view modal
 */
function closeV() {
  document.getElementById('vov').classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Open apply modal
 */
function openA(name, loc, type, price) {
  document.getElementById('fdn').textContent = name;
  document.getElementById('fds').textContent = loc + ' · ' + type + ' · ' + price + '/mo';
  document.getElementById('fstate').style.display = '';
  document.getElementById('ss').classList.remove('show');
  document.getElementById('aov').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Close apply modal
 */
function closeA() {
  document.getElementById('aov').classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Submit application
 */
function submitApp() {
  // Get all required form fields
  const form = document.querySelector('.am2');
  const inputs = form.querySelectorAll('input[required], select[required]');
  let isValid = true;
  const errorFields = [];

  // Validate each required field
  inputs.forEach(input => {
    const value = input.value.trim();
    if (!value) {
      isValid = false;
      const label = input.closest('.fg2')?.querySelector('.fl2')?.textContent || 'Unknown field';
      errorFields.push(label);
      input.style.borderColor = '#ef4444';
      input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }
  });

  // If validation fails, show alert
  if (!isValid) {
    alert('Please fill in all required fields:\n\n• ' + errorFields.join('\n• ') + '\n\nAll fields except Message are required.');
    return;
  }

  // Form is valid - show success
  document.getElementById('rn').textContent = 'ZD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
  document.getElementById('fstate').style.display = 'none';
  document.getElementById('ss').classList.add('show');
}

// View modal - click outside to close
document.getElementById('vov').addEventListener('click', e => {
  if (e.target === document.getElementById('vov')) closeV();
});

// Apply modal - click outside to close
document.getElementById('aov').addEventListener('click', e => {
  if (e.target === document.getElementById('aov')) closeA();
});

// Navigation
const nb = document.getElementById('navbar');
const hbg = document.getElementById('hbg');
const mob = document.getElementById('mob');

window.addEventListener('scroll', () => nb.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

if (hbg && mob) {
  hbg.addEventListener('click', () => {
    hbg.classList.toggle('open');
    mob.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!hbg.contains(e.target) && !mob.contains(e.target)) {
      hbg.classList.remove('open');
      mob.classList.remove('open');
    }
  });
}

// Initial render
filter();


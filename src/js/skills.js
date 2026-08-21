const I = {
  unity: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  csharp: '<path d="M8 4C5 4 4 6 4 9v6c0 3 1 5 4 5"/><path d="M16 4c3 0 4 2 4 5v6c0 3-1 5-4 5"/><path d="M10.5 10.5a2.5 2.5 0 100 3h2v-3z"/><path d="M17 10v4M19 10v4M16.5 11h3M16.5 13h3"/>',
  meta: '<path d="M3 15c0-4 1.5-7 3.5-7S10 12 12 12s3.5-4 5.5-4S21 11 21 15" /><path d="M3 15c0 2 1 3 2.2 3 2.3 0 4-6 6.8-6s4.5 6 6.8 6c1.2 0 2.2-1 2.2-3"/>',
  toolkit: '<path d="M14.7 6.3a4.5 4.5 0 00-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 006-6L14 13l-3-3 3.7-3.7z"/>',
  fusion: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.8 7.8L10.5 16M16.2 7.8L13.5 16M8.5 6h7"/>',
  pun: '<path d="M17.5 18a4.5 4.5 0 000-9 6 6 0 00-11.6 1.5A4 4 0 006.5 18h11z"/><path d="M9 13l2 2 4-4"/>',
  arf: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M8 10l4-2.2L16 10v4l-4 2.2L8 14v-4z"/><path d="M12 7.8V12m0 0l4-2m-4 2l-4-2"/>',
  openxr: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z"/>',
  vuforia: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  quest: '<rect x="3" y="7" width="18" height="11" rx="4"/><circle cx="8.5" cy="12.5" r="2"/><circle cx="15.5" cy="12.5" r="2"/><path d="M9 7l1.5-3h3L15 7"/>',
  mobile: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/><path d="M12 7l1.2 2.4 2.6.4-1.9 1.8.5 2.6L12 13l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4L12 7z"/>',
  blender: '<path d="M12 3l7 4v10l-7 4-7-4V7l7-4z"/><path d="M12 3v18M5 7l14 10M19 7L5 17"/>',
  git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M6 8.5v7M8.5 6H13a3 3 0 013 3v.8"/>',
  perf: '<path d="M4 18a9 9 0 1116 0"/><path d="M12 15l4-5"/><circle cx="12" cy="16" r="1.6"/><path d="M2.5 20h19"/>',
  qa: '<path d="M12 3l8 3v6c0 4.5-3.2 7.7-8 9-4.8-1.3-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.3 2.3L15.5 9.5"/>',
  agile: '<path d="M20 12a8 8 0 10-2.3 5.6"/><path d="M20 21v-4h-4"/><path d="M12 8v4l2.5 2.5"/>',
  kanban: '<rect x="3.5" y="3.5" width="7" height="10" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="16.5" width="7" height="4" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  medal: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/><path d="M10 9l1.5 1.5L14.5 7.5"/>'
};

const MAP = [
  ['unity', 'unity'], ['c#', 'csharp'], ['meta interaction', 'meta'],
  ['xr interaction', 'toolkit'], ['fusion', 'fusion'], ['pun2', 'pun'],
  ['ar foundation', 'arf'], ['openxr', 'openxr'], ['vuforia', 'vuforia'],
  ['quest', 'quest'], ['arcore', 'mobile'], ['blender', 'blender'],
  ['git', 'git'], ['performance', 'perf'], ['qa', 'qa'],
  ['agile', 'agile'], ['clickup', 'kanban'], ['pmp', 'medal']
];

function iconFor(name) {
  const lower = name.toLowerCase();
  for (const [key, icon] of MAP) {
    if (lower.includes(key)) return I[icon];
  }
  return I.unity;
}

export function initSkills() {
  document.querySelectorAll('#skillsStats .skill-row').forEach(row => {
    const nameEl = row.querySelector('.skill-name');
    if (!nameEl || nameEl.querySelector('.sk-ico')) return;
    nameEl.insertAdjacentHTML('beforebegin',
      `<span class="sk-ico"><svg viewBox="0 0 24 24">${iconFor(nameEl.textContent)}</svg></span>`);
  });

  const rows = document.querySelectorAll('#skillsStats .skill-row');
  if (!rows.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const row = e.target;
      io.unobserve(row);
      row.classList.add('armed');
      requestAnimationFrame(() => {
        row.querySelector('.skill-bar-fill').style.width = row.dataset.level + '%';
      });
    });
  }, { threshold: 0.3 });

  rows.forEach((row, i) => {
    row.style.transitionDelay = (i % 9) * 60 + 'ms';
    io.observe(row);
  });
}

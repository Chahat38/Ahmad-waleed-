export function initPopup() {
  const overlay = document.getElementById('detailOverlay');
  const panel = document.getElementById('detailPanel');
  const tagEl = document.getElementById('detailTag');
  const titleEl = document.getElementById('detailTitle');
  const mediaEl = document.getElementById('detailMedia');
  const credsEl = document.createElement('div');
  credsEl.className = 'detail-creds';
  credsEl.id = 'detailCreds';
  const bodyEl = document.getElementById('detailBody');
  const actionsEl = document.getElementById('detailActions');
  if (!overlay) return;

  function open(d) {
    tagEl.textContent = d.tag || '';
    titleEl.textContent = d.title || '';

    bodyEl.innerHTML = '';
    (d.body || []).forEach(line => {
      const li = document.createElement('li');
      li.textContent = line;
      bodyEl.appendChild(li);
    });

    mediaEl.innerHTML = '';
    mediaEl.hidden = false;
    if (d.img) {
      if (/\.pdf$/i.test(d.img)) {
        const frame = document.createElement('iframe');
        frame.src = d.img;
        frame.title = d.title || '';
        frame.setAttribute('loading', 'lazy');
        mediaEl.appendChild(frame);
      } else {
        const img = document.createElement('img');
        img.src = d.img;
        img.alt = d.title || '';
        img.loading = 'lazy';
        mediaEl.appendChild(img);
      }
    } else {
      mediaEl.hidden = true;
    }

    const isCert = !!d.credId;
    if (isCert) {
      credsEl.innerHTML = `
        <div class="cred-row"><span>CREDENTIAL ID</span><b>${d.credId}</b></div>
        <div class="cred-row"><span>ISSUED</span><b>${d.issued || '—'}</b></div>
        <div class="cred-row"><span>VERIFICATION</span><b>${d.url ? `<a href="${d.url}" target="_blank" rel="noopener">Verify credential ↗</a>` : '<i>placeholder — link add karein</i>'}</b></div>`;
      bodyEl.before(credsEl);
    } else {
      credsEl.remove();
    }

    actionsEl.innerHTML = '';
    if (d.link) {
      const a = document.createElement('a');
      a.href = d.link;
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'btn btn-solid';
      a.innerHTML = '<span>Open Link</span>';
      actionsEl.appendChild(a);
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.addEventListener('open-detail', e => open(e.detail));

  document.querySelectorAll('[data-detail-title]').forEach(el => {
    el.querySelector('.t-cta, .cert-cta')?.addEventListener('click', ev => {
      ev.stopPropagation();
      open({
        title: el.dataset.detailTitle,
        tag: el.dataset.detailTag,
        body: (el.dataset.detailBody || '').split('||'),
        img: el.dataset.detailImg,
        link: el.dataset.detailLink,
        credId: el.dataset.detailCredId,
        issued: el.dataset.detailIssued,
        url: el.dataset.detailUrl
      });
    });
  });

  document.getElementById('detailClose').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

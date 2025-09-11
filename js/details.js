const $ = (sel, el = document) => el.querySelector(sel);

function getIdFromQuery() {
  const p = new URLSearchParams(location.search);
  return p.get('id');
}

async function loadData() {
  // Try fetch first, then fallback to inline seed
  try {
    const res = await fetch('data/destinations.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[labb1] details data via fetch:', data.length);
    return data;
  } catch (err) {
    console.warn('[labb1] details fetch failed, using inline seed', err);
    const seed = document.getElementById('seed-data');
    if (seed?.textContent) return JSON.parse(seed.textContent);
    return [];
  }
}

function renderDetails(d) {
  const el = $('#details');
  el.innerHTML = `
    <article class="card">
      <img class="thumb" src="${d.img}" alt="${d.name}">
      <div class="card-body">
        <div class="pill"><span aria-hidden="true">🗺️</span><span>${d.region}</span></div>
        <h2 class="card-title" style="margin-top:6px">${d.name}</h2>
        <p class="subtitle">${d.country} · Rating ${d.rating.toFixed(1)} / 5</p>
        <p>${d.desc}</p>
        <a class="btn" href="${d.link}" target="_blank" rel="noopener">Learn more</a>
      </div>
    </article>
  `;
}

function showError(msg) {
  $('#details').innerHTML = `<p style="color:tomato">Error: ${msg}</p>`;
}

function validateForm({ name, rating, comment }) {
  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters.');
  if (!rating) errors.push('Please select a rating.');
  if (!comment || comment.trim().length < 10) errors.push('Comment must be at least 10 characters.');
  return errors;
}

function renderResult({ name, rating, comment }, itemName) {
  $('#rating-result').innerHTML = `
    <div class="card" style="padding:12px">
      <div class="card-body">
        <h3>Your submitted rating</h3>
        <p><strong>Destination:</strong> ${itemName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Rating:</strong> ${rating}</p>
        <p><strong>Comment:</strong> ${comment}</p>
        <p class="subtitle">Note: This is a demo — data is not stored.</p>
      </div>
    </div>
  `;
}

window.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const id = getIdFromQuery();
  if (!id) return showError('Missing id parameter (e.g., details.html?id=rome).');

  try {
    const list = await loadData();
    const item = list.find(x => x.id === id);
    if (!item) return showError(`No item found with id "${id}".`);
    renderDetails(item);

    // form handling + JS validation
    const form = document.getElementById('rating-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const errors = validateForm(data);
      if (errors.length) {
        alert(errors.join('\n'));
        return;
      }
      renderResult(data, item.name);
      form.reset();
    });
  } catch (err) {
    console.error(err);
    showError('Failed to load data.');
  }
});

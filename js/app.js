console.log('[labb1] app.js loaded');

// ==========================
// Data (local assets + country field for searching)
// ==========================
const DESTINATIONS = [
    {
        id: 'rome',
        name: 'Rome',
        country: 'Italy',
        region: 'Europe',
        rating: 4.8,
        img: 'assets/rome.jpg',
        desc: 'Ancient history, the Colosseum, and pasta on every corner — perfect for culture lovers.',
        link: 'https://compassroam.com/the-ultimate-rome-travel-guide/'
    },
    {
        id: 'kyoto',
        name: 'Kyoto',
        country: 'Japan',
        region: 'Asia',
        rating: 4.9,
        img: 'assets/kyoto.jpg',
        desc: 'Temples, teahouses, and cherry blossoms — traditional Japanese charm.',
        link: 'https://www.japan-guide.com/e/e3951.html'
    },
    {
        id: 'banff',
        name: 'Banff',
        country: 'Canada',
        region: 'North America',
        rating: 4.7,
        img: 'assets/banff.jpg',
        desc: 'Turquoise lakes and the Canadian Rockies — a dream for hikers.',
        link: 'https://parks.canada.ca/pn-np/ab/banff'
    },
    {
        id: 'cape-town',
        name: 'Cape Town',
        country: 'South Africa',
        region: 'Africa',
        rating: 4.6,
        img: 'assets/capetown.jpg',
        desc: 'Table Mountain, nearby wine regions, and Atlantic breezes — a city close to nature.',
        link: 'https://www.capetowndaytours.co.za'
    },
    {
        id: 'machu',
        name: 'Machu Picchu',
        country: 'Peru',
        region: 'South America',
        rating: 4.9,
        img: 'assets/machupicchu.jpg',
        desc: 'Incan ruins in the cloud forest — one of the world’s most iconic places.',
        link: 'https://www.machupicchureservations.org'
    },
    {
        id: 'queenstown',
        name: 'Queenstown',
        country: 'New Zealand',
        region: 'Oceania',
        rating: 4.5,
        img: 'assets/queenstown.jpg',
        desc: 'New Zealand’s adventure capital — bungy, skiing, and lake views.',
        link: 'https://www.newzealand.com/au/queenstown/'
    }
];

// ==========================
// Helpers
// ==========================
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

function saveFavs(favs) {
    localStorage.setItem('favs', JSON.stringify(favs));
}
function loadFavs() {
    try {
        return JSON.parse(localStorage.getItem('favs')) ?? [];
    } catch {
        return [];
    }
}

function applyFilters(items, { q, region, sort }) {
    let result = [...items];
    if (q) {
        const term = q.trim().toLowerCase();
        result = result.filter((x) =>
            [x.name, x.country, x.region, x.desc].some((v) => v.toLowerCase().includes(term))
        );
    }
    if (region) result = result.filter((x) => x.region === region);

    switch (sort) {
        case 'name-desc':
            result.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'rating-desc':
            result.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating-asc':
            result.sort((a, b) => a.rating - b.rating);
            break;
        case 'name-asc':
        default:
            result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
}

// ==========================
// State & render
// ==========================
let grid, count, form, modal, closeModalBtn;
let favs = loadFavs();

function render(items) {
    grid.innerHTML = '';
    count.textContent = `${items.length} destination(s)`;

    for (const d of items) {
        const card = document.createElement('article');
        card.className = 'card';
        card.setAttribute('role', 'listitem');
        card.innerHTML = `
      <img class="thumb" src="${d.img}" alt="${d.name}" loading="lazy">
      <div class="card-body">
        <div class="pill" aria-label="Region">
          <span aria-hidden="true">🗺️</span><span>${d.region}</span>
        </div>
        <h3 class="card-title">${d.name}</h3>
        <p class="subtitle">${d.country} · Rating ${d.rating.toFixed(1)} / 5</p>
        <div class="actions">
          <button class="btn more" data-id="${d.id}">Details</button>
          <button class="btn fav" data-id="${d.id}" aria-pressed="${favs.includes(d.id)}" aria-label="Save as favorite">★</button>
        </div>
      </div>
    `;
        grid.appendChild(card);
    }

    // Re-bind events on each render
    $$('.more', grid).forEach((btn) => btn.addEventListener('click', openDetails));
    $$('.fav', grid).forEach((btn) => btn.addEventListener('click', toggleFav));
}

function stateFromForm() {
    const data = new FormData(form);
    return {
        q: data.get('q') ?? '',
        region: data.get('region') ?? '',
        sort: data.get('sort') ?? 'name-asc'
    };
}

function update() {
    const state = stateFromForm();
    const list = applyFilters(DESTINATIONS, state);
    render(list);
}

function toggleFav(e) {
    const id = e.currentTarget.dataset.id;
    if (favs.includes(id)) {
        favs = favs.filter((x) => x !== id);
    } else {
        favs.push(id);
    }
    saveFavs(favs);
    e.currentTarget.setAttribute('aria-pressed', String(favs.includes(id)));
}

function openDetails(e) {
    const id = e.currentTarget.dataset.id;
    const d = DESTINATIONS.find((x) => x.id === id);
    if (!d) return;

    $('#modal-title').textContent = d.name;
    $('#modal-img').src = d.img;
    $('#modal-img').alt = d.name;
    $('#modal-name').textContent = d.name;
    $('#modal-meta').textContent = `${d.country} · ${d.region} · Rating ${d.rating.toFixed(1)}`;
    $('#modal-desc').textContent = d.desc;
    $('#modal-link').href = d.link;

    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
}

// ==========================
// Init (query DOM after it exists)
// ==========================
window.addEventListener('DOMContentLoaded', () => {
    grid = $('#grid');
    count = $('#count');
    form = $('#controls');
    modal = $('#modal');
    closeModalBtn = $('#closeModal');

    document.getElementById('year').textContent = new Date().getFullYear();

    // Bind robust listeners
    form.addEventListener('input', update);
    form.addEventListener('change', update);

    const qInput = document.getElementById('q');
    const regionSelect = document.getElementById('region');
    const sortSelect = document.getElementById('sort');

    if (qInput) ['input', 'keyup', 'change'].forEach((ev) => qInput.addEventListener(ev, update));
    if (regionSelect) ['change', 'input'].forEach((ev) => regionSelect.addEventListener(ev, update));
    if (sortSelect) ['change', 'input'].forEach((ev) => sortSelect.addEventListener(ev, update));

    form.addEventListener('reset', () => setTimeout(update, 0));

    // Initial render
    update();

    // Modal close
    closeModalBtn.addEventListener('click', () => {
        if (modal.open) modal.close();
        modal.removeAttribute('open');
    });
});

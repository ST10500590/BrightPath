/* =====================================================
   events.js — Dynamic Events + Search/Filter
===================================================== */

const EVENTS_DATA = [
    {
        id: 1,
        image: 'images/expo.jpg',
        title: 'Career Expo',
        date: '15 June 2026',
        category: 'education',
        location: 'Johannesburg Community Hall',
        time: '09:00 – 15:00',
        description: 'A career guidance and networking event for youth aged 16–30. Meet employers, attend CV workshops and explore bursary opportunities. Free entry — register in advance.',
        spots: 200,
    },
    {
        id: 2,
        image: 'images/fooddrive.jpg',
        title: 'Community Food Drive',
        date: '20 July 2026',
        category: 'community',
        location: 'BrightPath Centre, Soweto',
        time: '08:00 – 13:00',
        description: 'Help us collect and distribute food parcels to families in need across the community. Volunteers and donations welcome. Drop-off points at the centre and local partner sites.',
        spots: 80,
    },
    {
        id: 3,
        image: 'images/youthcamp.jpg',
        title: 'Youth Leadership Camp',
        date: '10 August 2026',
        category: 'leadership',
        location: 'Magaliesburg Retreat, North West',
        time: 'Full weekend (10–12 Aug)',
        description: 'A transformative three-day residential camp focused on leadership skills, team building and personal development for youth aged 14–25. Scholarships available.',
        spots: 50,
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1634155938686-24a26c55d71a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        title: 'Wellness Workshop',
        date: '5 September 2026',
        category: 'wellness',
        location: 'Online (Zoom)',
        time: '10:00 – 12:00',
        description: 'A free interactive workshop covering mental health awareness, stress management and self-care strategies for community members. A counsellor will be available for Q&A.',
        spots: 120,
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1723987135977-ae935608939e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        title: 'Digital Literacy Bootcamp',
        date: '22 September 2026',
        category: 'education',
        location: 'BrightPath Centre, Soweto',
        time: '09:00 – 16:00',
        description: 'A one-day intensive bootcamp covering computer basics, internet safety, Google Workspace, and job-seeking online. Laptops provided. Open to adults 18+.',
        spots: 30,
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1667791275929-5701d83734c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        title: 'Charity Fun Run',
        date: '18 October 2026',
        category: 'community',
        location: 'Orlando Stadium, Soweto',
        time: '07:00 Start',
        description: 'Lace up your shoes and run for a cause! 5 km and 10 km routes available for all fitness levels. All proceeds go directly to BrightPath youth programmes. Family-friendly.',
        spots: 500,
    },
];

function categoryBadge(cat) {
    const map = {
        education: ['cat-education', 'Education'],
        community:  ['cat-community',  'Community'],
        leadership: ['cat-leadership', 'Leadership'],
        wellness:   ['cat-wellness',   'Wellness'],
    };
    const [cls, label] = map[cat] || ['', cat];
    return `<span class="event-category ${cls}">${label}</span>`;
}

function renderEvents(list) {
    const grid = document.getElementById('events-grid');
    if (!list.length) {
        grid.innerHTML = '<p class="no-results">No events match your search. Try a different keyword or filter.</p>';
        return;
    }
    grid.innerHTML = list.map((ev, idx) => `
        <div class="event-card reveal" style="animation-delay:${idx * 0.08}s"
             data-modal="event-modal-${ev.id}">
            ${ev.image ? `<img src="${ev.image}" alt="${ev.title}" loading="lazy" class="event-img">` : ''}
            <span class="event-date">📅 ${ev.date}</span>
            ${categoryBadge(ev.category)}
            <h3>${ev.title}</h3>
            <p>📍 ${ev.location}</p>
            <p>🕐 ${ev.time}</p>
            <p style="color:#888;font-size:14px">🎟 ${ev.spots} spots available</p>
            <span style="color:#8a2be2;font-weight:bold;font-size:14px">Click for details →</span>
        </div>
    `).join('');

    // Re-observe reveal elements
    grid.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
    });

    // Inject modals
    list.forEach(ev => {
        if (!document.getElementById('event-modal-' + ev.id)) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.id = 'event-modal-' + ev.id;
            overlay.innerHTML = `
                <div class="modal-box">
                    <button class="modal-close" aria-label="Close">&times;</button>
                    <span class="modal-badge">${ev.category.charAt(0).toUpperCase() + ev.category.slice(1)}</span>
                    <h2 style="color:#6a0dad;margin-bottom:10px">${ev.title}</h2>
                    <p><strong>📅 Date:</strong> ${ev.date}</p>
                    <p><strong>🕐 Time:</strong> ${ev.time}</p>
                    <p><strong>📍 Location:</strong> ${ev.location}</p>
                    <p><strong>🎟 Spots available:</strong> ${ev.spots}</p>
                    <hr style="border:none;border-top:1px solid #e0d0f0;margin:14px 0">
                    <p>${ev.description}</p>
                    <a href="volunteer.html" class="btn btn-purple" style="margin-top:10px;display:inline-block">Register Interest</a>
                </div>`;
            document.body.appendChild(overlay);
        }
    });
}

function filterEvents() {
    const query  = document.getElementById('event-search').value.toLowerCase().trim();
    const active = document.querySelector('.filter-btn.active');
    const cat    = active ? active.dataset.filter : 'all';

    const results = EVENTS_DATA.filter(ev => {
        const matchesSearch = !query ||
            ev.title.toLowerCase().includes(query) ||
            ev.description.toLowerCase().includes(query) ||
            ev.location.toLowerCase().includes(query);
        const matchesCat = cat === 'all' || ev.category === cat;
        return matchesSearch && matchesCat;
    });

    renderEvents(results);
}

document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('events-grid')) return;

    renderEvents(EVENTS_DATA);

    // Search input
    document.getElementById('event-search').addEventListener('input', filterEvents);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterEvents();
        });
    });
});

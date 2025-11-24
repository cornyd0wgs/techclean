/* -------------------- CATEGORY DATA -------------------- */
const categories = [
  { id:'phone', title:'Phone', desc:'External, internal & water-damage cleaning', img:'📱', services:[
    {id:'p1',name:'Basic External Cleaning',price:'₱150–₱300',desc:'Wipe, ports, speaker grills, camera area'},
    {id:'p2',name:'Deep External + Ports',price:'₱300–₱600',desc:'Full exterior, ports, buttons'},
    {id:'p3',name:'Internal Cleaning (Open Unit)',price:'₱600–₱1200',desc:'Dust removal inside (no repair)'}
  ]},
  { id:'laptop', title:'Laptop', desc:'Keyboard, vents, internal dust & thermal', img:'💻', services:[
    {id:'l1',name:'External Cleaning',price:'₱200–₱400',desc:'Keyboard, screen, exterior wipe'},
    {id:'l2',name:'Deep Internal Cleaning',price:'₱800–₁५०0',desc:'Fans, heatsink, dust removal'},
    {id:'l3',name:'Thermal Paste Service',price:'₱1200–₱2000',desc:'Thermal paste replacement (optional)'}
  ]},
  { id:'desktop', title:'Desktop PC', desc:'Case, fans, CPUs, peripherals', img:'🖥️', services:[
    {id:'d1',name:'External Cleaning',price:'₱200–₱500',desc:'Monitor, CPU case, peripherals'},
    {id:'d2',name:'Internal CPU Cleaning',price:'₱600–₱1200',desc:'Fans + components cleaning'},
    {id:'d3',name:'Thermal Paste (per comp)',price:'₱400–₱800',desc:'CPU/GPU thermal paste replacement'}
  ]},
  { id:'console', title:'Console & Gaming', desc:'Controllers, consoles, peripherals', img:'🎮', services:[
    {id:'g1',name:'External Cleaning',price:'₱200–₱400',desc:'Controllers, exterior consoles'},
    {id:'g2',name:'Deep Internal',price:'₱600–₱1200',desc:'Opening console for dust removal'}
  ]}
];

/* -------------------- RENDER CATEGORY CARDS -------------------- */
const carousel = document.getElementById('categoryCarousel');
categories.forEach(cat => {
  const el = document.createElement('div');
  el.className = 'category-card';
  el.innerHTML = `
    <div>
      <div style="font-size:22px">${cat.img}</div>
      <h4>${cat.title}</h4>
      <p class="muted small">${cat.desc}</p>
    </div>
    <div style="text-align:right;color:var(--muted);font-size:13px">See services ▶</div>`;
  el.onclick = () => openCategory(cat.id);
  carousel.appendChild(el);
});

function scrollCarousel(px){
  carousel.scrollBy({left:px,behavior:'smooth'});
}

/* -------------------- DETAILS DISPLAY -------------------- */
let currentCategory = null;
let detailsSelectedService = null;

function openCategory(id){
  const cat = categories.find(c=>c.id===id);
  if(!cat) return;

  currentCategory = cat;
  detailsSelectedService = null;

  document.getElementById('detailsArea').classList.remove('hidden');
  document.getElementById('detailTitle').textContent = `${cat.img} ${cat.title} SERVICES`;
  document.getElementById('detailDesc').textContent = cat.desc;

  const list = document.getElementById('serviceList');
  list.innerHTML = '';

  cat.services.forEach(s => {
    const row = document.createElement('div');
    row.className = 'service-item';
    row.innerHTML = `
      <div class="service-row">
        <div>
          <div class="bold">${s.name}</div>
          <div class="muted small">${s.desc}</div>
        </div>
        <div style="text-align:right">
          <div class="price">${s.price}</div>
          <div style="margin-top:8px">
            <button class="btn btn-primary" onclick="prepareBooking('${id}','${s.id}')">BOOK (HOME)</button>
            <button class="btn btn-ghost" onclick="prepareBooking('${id}','${s.id}','store')" style="margin-left:6px">IN-STORE</button>
          </div>
        </div>
      </div>`;
    list.appendChild(row);
  });
}

function closeDetails(){
  document.getElementById('detailsArea').classList.add('hidden');
}

/* -------------------- BOOKING LOGIC -------------------- */
function prepareBooking(catId, serviceId, mode='home'){
  const cat = categories.find(c=>c.id===catId);
  const serv = cat.services.find(s=>s.id===serviceId);

  detailsSelectedService = {cat, serv, mode};

  document.getElementById('mode').value = mode;
  document.getElementById('custName').value = '';
  document.getElementById('custPhone').value = '';
  document.getElementById('datePick').value = '';
  document.getElementById('timePick').value = '';

  document.getElementById('bookMsg').textContent = `Booking: ${serv.name} • ${serv.price}`;

  document.getElementById('confirmBook').scrollIntoView({behavior:'smooth'});
}

const confirmBtn = document.getElementById('confirmBook');
confirmBtn.addEventListener('click', () => {
  if(!detailsSelectedService){
    document.getElementById('bookMsg').textContent = 'Please select a service first.';
    return;
  }

  const name = document.getElementById('custName').value.trim() || 'GUEST';
  const phone = document.getElementById('custPhone').value.trim() || '-';
  const date = document.getElementById('datePick').value || 'NO DATE';
  const time = document.getElementById('timePick').value || 'NO TIME';
  const mode = document.getElementById('mode').value;

  const booking = {
    id: Date.now(),
    name, phone, date, time, mode,
    category: detailsSelectedService.cat.title,
    service: detailsSelectedService.serv.name,
    price: detailsSelectedService.serv.price,
    status: 'PENDING',
    created: new Date().toISOString()
  };

  const all = JSON.parse(localStorage.getItem('techclean_bookings')||'[]');
  all.unshift(booking);
  localStorage.setItem('techclean_bookings', JSON.stringify(all));

  document.getElementById('bookMsg').textContent = 'BOOKING CONFIRMED ✔ (Demo only)';
});

/* -------------------- CHAT SYSTEM -------------------- */
const messagesEl = document.getElementById('messages');

function appendMsg(txt, who='bot'){
  const m = document.createElement('div');
  m.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
  m.textContent = txt;
  messagesEl.appendChild(m);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function sendChat(){
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if(!text) return;

  appendMsg(text, 'user');
  input.value = '';

  setTimeout(() => {
    const t = text.toLowerCase();

    if(t.includes('price')) appendMsg('Prices vary per category. Select a service above.');
    else if(t.includes('book')) appendMsg('Select a service then press BOOK.');
    else appendMsg('Thanks! We will respond shortly (demo).');
  }, 700);
}

appendMsg('WELCOME TO TECHCLEAN — HOW CAN WE HELP YOU TODAY?');

/* -------------------- UTILITIES -------------------- */
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:'smooth'});
}

function showBookings(){
  console.log(JSON.parse(localStorage.getItem('techclean_bookings')||'[]'));
}

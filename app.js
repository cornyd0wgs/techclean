/* -------------------- CATEGORY DATA (from TechClean.pptx) -------------------- */
const categories = [
  { id:'phone', title:'Phone', desc:'External, internal & water-damage cleaning.', img:'📱', services:[
    {id:'p1',name:'Basic External Cleaning',price:'₱150–₱300',desc:'Removing dust, smudges, and surface dirt.'},
    {id:'p2',name:'Deep Exterior + Ports',price:'₱300–₱600',desc:'Includes speaker grills, charging port, and camera areas.'},
    {id:'p3',name:'Internal Cleaning (Open Unit)',price:'₱600–₱1200',desc:'Dust removal inside, cleaning motherboard surface (no repair).'},
    {id:'p4',name:'Water Damage Cleaning',price:'₱500–₱1000',desc:'Preventive drying & corrosion treatment for minor liquid exposure.'},
  ]},
  { id:'laptop', title:'Laptop', desc:'Keyboard, vents, internal dust & thermal paste.', img:'💻', services:[
    {id:'l1',name:'Basic External Cleaning',price:'₱200–₱400',desc:'Wiping exterior, keyboard, and screen.'},
    {id:'l2',name:'Deep Cleaning (Vents + Ports)',price:'₱400–₱800',desc:'Keyboard, vents, and port cleaning.'},
    {id:'l3',name:'Internal Cleaning',price:'₱800–₱1500',desc:'Fan, heatsink, and dust removal.'},
    {id:'l4',name:'Thermal Paste Replacement',price:'₱1200–₱2000',desc:'Full deep clean plus professional thermal paste replacement.'},
  ]},
  { id:'desktop', title:'Desktop PC', desc:'Case, fans, CPUs, peripherals maintenance.', img:'🖥️', services:[
    {id:'d1',name:'Basic External Cleaning',price:'₱200–₱500',desc:'Monitor, CPU case exterior, peripherals.'},
    {id:'d2',name:'Internal CPU Cleaning',price:'₱600–₱1200',desc:'Fans, components, and full dust removal.'},
    {id:'d3',name:'Thermal Paste (per component)',price:'₱400–₱800',desc:'CPU or GPU thermal paste replacement.'}
  ]},
  { id:'console', title:'Console & Gaming', desc:'Controllers, consoles, peripherals cleaning.', img:'🎮', services:[
    {id:'g1',name:'External Cleaning',price:'₱200–₱400',desc:'Controllers, exterior surfaces of consoles.'},
    {id:'g2',name:'Deep Internal',price:'₱600–₱1200',desc:'Opening the console for thorough dust and dirt removal.'}
  ]}
];

/* -------------------- INITIALIZATION & UI SETUP -------------------- */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    // These functions now fire correctly after the DOM is ready
    renderCategoryCards(); 
    setupMobileNav();
    setupScrollAnimations();
    loadDemoBookings();
    setupChatWidget();
    
    document.getElementById('confirmBook').addEventListener('click', confirmBooking);
});

// Function to handle the mobile navigation toggle
function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMobile = document.getElementById('navMobile');
    const links = navMobile.querySelectorAll('a');

    navToggle.addEventListener('click', () => {
        const isHidden = navMobile.style.display === 'flex';
        navMobile.style.display = isHidden ? 'none' : 'flex';
        navToggle.textContent = isHidden ? '☰' : '✕';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navMobile.style.display = 'none';
            navToggle.textContent = '☰';
        });
    });
}

// FIX: Function to set up the reveal scroll animations (IntersectionObserver logic corrected)
function setupScrollAnimations() {
    // Select all elements marked for reveal
    const reveals = document.querySelectorAll(".reveal");
    
    // Check if IntersectionObserver is supported (modern browsers)
    if (!('IntersectionObserver' in window)) {
        console.warn("IntersectionObserver not supported. Disabling scroll animations.");
        reveals.forEach(el => el.classList.add("active"));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If element is visible, add the 'active' class to trigger the transition
                entry.target.classList.add("active");
                // Stop observing once it's active
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Triggers when 10% of the element is visible
    });

    // Start observing each reveal element
    reveals.forEach(el => observer.observe(el));
}


/* -------------------- SERVICES RENDERING -------------------- */
const categoriesGrid = document.getElementById('categoriesGrid');

function renderCategoryCards(){
  // FIX: This now correctly targets the element and loops through the categories data
  categories.forEach(cat => {
    const el = document.createElement('div');
    el.className = 'category-card';
    el.innerHTML = `
      <div class="icon">${cat.img}</div>
      <h4>${cat.title}</h4>
      <p class="muted small">${cat.desc}</p>
      <div style="margin-top:10px;font-weight:500;font-size:12px;color:var(--accent)">See services <i class="fas fa-arrow-right"></i></div>`;
    el.onclick = () => openCategory(cat.id);
    categoriesGrid.appendChild(el);
  });
}

function openCategory(id){
  const cat = categories.find(c=>c.id===id);
  if(!cat) return;

  currentCategory = cat;
  detailsSelectedService = null;

  const detailsArea = document.getElementById('detailsArea');
  // Show the details panel by removing the 'hidden' class
  detailsArea.classList.remove('hidden');
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
          <div class="book-btn-group">
            <button class="btn primary" onclick="prepareBooking('${id}','${s.id}','home')">BOOK (HOME)</button>
            <button class="btn secondary" onclick="prepareBooking('${id}','${s.id}','store')">IN-STORE</button>
          </div>
        </div>
      </div>`;
    list.appendChild(row);
  });

  // Scroll to the details area to show the user the result
  detailsArea.scrollIntoView({behavior:'smooth'});
}

function closeDetails(){
  // Hide the details panel by adding the 'hidden' class
  document.getElementById('detailsArea').classList.add('hidden');
}


/* -------------------- BOOKING LOGIC -------------------- */
let currentCategory = null;
let detailsSelectedService = null;

function prepareBooking(catId, serviceId, mode='home'){
  const cat = categories.find(c=>c.id===catId);
  const serv = cat.services.find(s=>s.id===serviceId);

  detailsSelectedService = {cat, serv, mode};

  document.getElementById('mode').value = mode;
  document.getElementById('selService').value = `${cat.title} - ${serv.name} (${serv.price}) - ${mode.toUpperCase()} Service`;

  document.getElementById('bookMsg').textContent = `Ready to book: ${serv.name} (${mode} service). Please fill in your details.`;
  document.getElementById('bookingForm').scrollIntoView({behavior:'smooth'});
}

function confirmBooking(){
  if(!detailsSelectedService){
    showMessage('Please select a service first.', 'error');
    return;
  }

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const date = document.getElementById('datePick').value;
  const time = document.getElementById('timePick').value;

  if (!name || !phone || !date || !time) {
      showMessage('Please fill in all booking details.', 'error');
      return;
  }

  const booking = {
    id: Date.now(),
    name, phone, date, time, 
    mode: detailsSelectedService.mode,
    category: detailsSelectedService.cat.title,
    service: detailsSelectedService.serv.name,
    price: detailsSelectedService.serv.price,
    status: 'PENDING',
    created: new Date().toLocaleTimeString()
  };

  // WARNING: Using localStorage for demo only. Replace with Firestore for persistence.
  const all = JSON.parse(localStorage.getItem('techclean_bookings')||'[]');
  all.unshift(booking);
  localStorage.setItem('techclean_bookings', JSON.stringify(all));

  showMessage(`Booking Confirmed for ${booking.name}! Service: ${booking.service} on ${booking.date}.`, 'success');
  loadDemoBookings(); // Refresh list
  resetBookingForm();
}

function resetBookingForm() {
    detailsSelectedService = null;
    document.getElementById('selService').value = '';
    document.getElementById('custName').value = '';
    document.getElementById('custPhone').value = '';
    document.getElementById('datePick').value = '';
    document.getElementById('timePick').value = '';
    document.getElementById('bookMsg').textContent = '';
}

function loadDemoBookings() {
    const listEl = document.getElementById('bookingsList');
    // WARNING: Using localStorage
    const bookings = JSON.parse(localStorage.getItem('techclean_bookings') || '[]');
    listEl.innerHTML = '';

    if (bookings.length === 0) {
        listEl.innerHTML = '<div style="padding:10px;text-align:center;">No recent bookings yet.</div>';
        return;
    }

    bookings.slice(0, 5).forEach(b => {
        const item = document.createElement('div');
        item.className = 'booking-item';
        item.innerHTML = `
            <div class="bold">${b.service}</div>
            <div class="small">By ${b.name} (${b.mode.toUpperCase()})</div>
            <div class="small muted">${b.date} @ ${b.time}</div>
        `;
        listEl.appendChild(item);
    });
}

// Custom Message/Alert Box (Replaces alert() and window.alert())
function showMessage(msg, type = 'info') {
    const msgEl = document.getElementById('bookMsg');
    msgEl.textContent = msg;
    msgEl.style.color = type === 'error' ? 'red' : type === 'success' ? 'var(--accent)' : 'var(--muted)';
    msgEl.style.fontWeight = 'bold';
}


/* -------------------- CHAT WIDGET LOGIC -------------------- */
const messagesEl = document.getElementById('messages');
const chatHeader = document.getElementById('chatHeader');
const chatBody = document.getElementById('chatBody');
const chatClose = document.getElementById('chatClose');
const msgInput = document.getElementById('msgInput');
const msgSend = document.getElementById('msgSend');
const chatWidget = document.getElementById('chatWidget');

function setupChatWidget() {
    // Show the widget initially
    chatWidget.style.display = 'block';

    // Toggle chat body visibility
    chatHeader.addEventListener('click', (e) => {
        // Only toggle if the click wasn't on the close button
        if (e.target.id !== 'chatClose' && e.target.parentElement.id !== 'chatClose') {
            const isHidden = chatBody.style.display === 'none';
            chatBody.style.display = isHidden ? 'flex' : 'none';
        }
    });

    // Close chat permanently
    chatClose.addEventListener('click', (e) => {
        e.stopPropagation();
        chatWidget.style.display = 'none';
    });

    // Send message on button click
    msgSend.addEventListener('click', sendChat);

    // Send message on Enter key press
    msgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChat();
        }
    });

    appendMsg('WELCOME TO TECHCLEAN — HOW CAN WE HELP YOU TODAY?', 'bot');
}

function appendMsg(txt, who='bot'){
  const m = document.createElement('div');
  m.className = 'msg ' + who;
  m.textContent = txt;
  messagesEl.appendChild(m);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function sendChat(){
  const text = msgInput.value.trim();
  if(!text) return;

  appendMsg(text, 'user');
  msgInput.value = '';

  // Simple demo response logic
  setTimeout(() => {
    const t = text.toLowerCase();

    if(t.includes('price') || t.includes('cost')) {
        appendMsg('Prices vary by service (Phone clean starts at ₱150, Laptops at ₱200). Please check the "Services" section for details.', 'bot');
    }
    else if(t.includes('book') || t.includes('schedule')) {
        appendMsg('To book, select a category in the "Services" section, choose a service, and hit "BOOK" to jump to the form.', 'bot');
    }
    else if(t.includes('location') || t.includes('where')) {
        appendMsg('We are located at Daro, Dumaguete City, Kagawasan Avenue.', 'bot');
    }
    else if(t.includes('eco-friendly') || t.includes('safe')) {
        appendMsg('Yes! We use eco-friendly, anti-static, technician-grade solutions safe for all your components.', 'bot');
    }
    else {
        appendMsg('Thanks for your message! Our technician will respond shortly (this is a demo chat).', 'bot');
    }
  }, 700);
}

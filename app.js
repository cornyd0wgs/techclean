/* -------------------- CATEGORY DATA -------------------- */
const categories = [
  { id:'phone', title:'Phone', desc:'External, internal & water-damage cleaning', img:'📱', services:[
    {id:'p1',name:'Basic External Cleaning',price:'₱150–₱300',desc:'Wipe, ports, speaker grills, camera area'},
    {id:'p2',name:'Deep External + Ports',price:'₱300–₱600',desc:'Full exterior, ports, buttons'},
    {id:'p3',name:'Internal Cleaning (Open Unit)',price:'₱600–₱1200',desc:'Dust removal inside (no repair)'}
  ]},
  { id:'laptop', title:'Laptop', desc:'Keyboard, vents, internal dust & thermal', img:'💻', services:[
    {id:'l1',name:'External Cleaning',price:'₱200–₱400',desc:'Keyboard, screen, exterior wipe'},
    {id:'l2',name:'Deep Internal Cleaning',price:'₱800–₱1500',desc:'Fans, heatsink, dust removal'},
    {id:'l3',name:'Thermal Paste Service',price:'₱1200–₱2000',desc:'Thermal paste replacement (optional)'}
  ]},
  { id:'desktop', title:'Desktop PC', desc:'Case, fans, CPUs, peripherals', img:'🖥️', services:[
    {id:'d1',name:'External Cleaning',price:'₱200–₱500',desc:'Monitor, CPU case, peripherals'},
    {id:'d2',name:'Internal Dust Removal',price:'₱1000–₱2500',desc:'Full case clean, fan blades, cable management assist'},
    {id:'d3',name:'Server/High-End Workstation Clean',price:'₱2500+',desc:'Specialized cleaning for sensitive components'},
  ]},
  { id:'console', title:'Gaming Console', desc:'Vents, case, heat dissipation & performance', img:'🎮', services:[
    {id:'c1',name:'External Console Cleaning',price:'₱300–₱600',desc:'Case, ports, controller cleaning'},
    {id:'c2',name:'Deep Internal Cleaning',price:'₱1200–₱2200',desc:'Fan, heatsink, dust removal from internals'},
    {id:'c3',name:'Performance Restoration Bundle',price:'₱2000–₱3500',desc:'Internal clean + thermal paste replacement'},
  ]}
];

/* -------------------- DOM ELEMENTS & STATE -------------------- */
const categoriesGridEl = document.getElementById('categoriesGrid');
const categoryDetailsEl = document.getElementById('categoryDetails');
const detailsTitleEl = document.getElementById('detailsTitle');
const detailsDescEl = document.getElementById('detailsDesc');
const detailsListEl = document.getElementById('detailsList');
const bookingMsgEl = document.getElementById('bookingMsg');
const selServiceEl = document.getElementById('selService');
const selectedServiceDisplayEl = document.getElementById('selectedServiceDisplay');
const bookingsListEl = document.getElementById('bookingsList');

let currentCategoryId = null; // Track which category is currently displayed
let selectedServiceId = null; // Track the service selected for booking

/* -------------------- UI RENDERING & SERVICES LOGIC -------------------- */

// 1. Renders the four main category cards
function renderCategories() {
  categoriesGridEl.innerHTML = categories.map(cat => `
    <div class="category-card" data-id="${cat.id}" onclick="showDetails('${cat.id}')">
      <!-- Added SELECT instruction to the card title -->
      <h4>${cat.img} ${cat.title} <span class="muted small float-right" style="color:var(--accent); font-weight:600;">SELECT</span></h4>
      <p class="muted small">${cat.desc}</p>
    </div>
  `).join('');
}

// 2. Shows the details panel for the selected category
window.showDetails = function(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return;

  currentCategoryId = categoryId;

  detailsTitleEl.textContent = `${category.img} ${category.title} Cleaning Services`;
  detailsDescEl.textContent = category.desc;
  
  // Render the list of services for this category
  detailsListEl.innerHTML = category.services.map(service => `
    <div class="service-row">
      <div class="service-details-group"> 
        <h4>${service.name}</h4>
        <p class="muted small mt-2">${service.desc}</p>
      </div>
      <div class="price">${service.price}</div>
      <div>
        <button 
            class="btn book-service ${selectedServiceId === service.id ? 'selected' : 'primary'}" 
            data-service-id="${service.id}"
            onclick="selectService('${service.id}', '${service.name}', '${category.title}')"
        >
            ${selectedServiceId === service.id ? 'SELECTED ✔' : 'Select Service'}
        </button>
      </div>
    </div>
  `).join('');

  categoryDetailsEl.classList.remove('hidden');
  // Scroll to details panel after showing it
  categoryDetailsEl.scrollIntoView({ behavior: 'smooth' });
}

// 3. Closes the details panel
window.closeDetails = function() {
  categoryDetailsEl.classList.add('hidden');
  currentCategoryId = null;
}

// 4. Selects a specific service and updates the booking form
window.selectService = function(serviceId, serviceName, categoryTitle) {
    const fullServiceName = `${categoryTitle}: ${serviceName}`;
    selectedServiceId = serviceId; // Update state

    // 1. Update the hidden input value
    selServiceEl.value = serviceId;

    // 2. Update the visual display in the booking form
    selectedServiceDisplayEl.innerHTML = `
        <span style="font-weight: 700; color: #10b981;">${fullServiceName}</span>
    `;
    selectedServiceDisplayEl.style.padding = '10px';
    selectedServiceDisplayEl.style.border = '1px solid #10b981'; // Green border for selected
    
    // 3. Update all selection buttons to reflect the change
    document.querySelectorAll('.book-service').forEach(btn => {
        if (btn.dataset.serviceId === serviceId) {
            btn.textContent = 'SELECTED ✔';
            btn.classList.add('selected');
            btn.classList.remove('primary');
        } else {
            btn.textContent = 'Select Service';
            btn.classList.remove('selected');
            btn.classList.add('primary');
        }
    });

    // 4. Provide feedback and scroll to booking section
    bookingMsgEl.textContent = `✅ Service selected: ${fullServiceName}. Please fill out the booking details below.`;
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}


/* -------------------- BOOKING HANDLER -------------------- */

function resetBookingForm() {
    document.getElementById('bookingForm').reset();
    selectedServiceId = null; // Reset state

    // Reset visual feedback
    bookingMsgEl.textContent = '';
    selectedServiceDisplayEl.innerHTML = '(No service selected)';
    selectedServiceDisplayEl.style.padding = '10px';
    selectedServiceDisplayEl.style.border = '1px solid rgba(255,255,255,0.1)';

    // Reset service buttons in the currently open details panel
    if (currentCategoryId) {
        // Re-render the details to update button states
        showDetails(currentCategoryId); 
    }
}
window.resetBookingForm = resetBookingForm; // Expose globally

function setupBookingForm() {
    document.getElementById('submitBooking').addEventListener('click', () => {
        const selServiceId = selServiceEl.value; // Get the selected service ID
        const selMode = document.getElementById('selMode').value;
        const bkName = document.getElementById('bkName').value.trim();
        const bkPhone = document.getElementById('bkPhone').value.trim();
        const bkDate = document.getElementById('bkDate').value;
        const bkTime = document.getElementById('bkTime').value;

        // Validation check for service selection
        if (!selServiceId) {
            bookingMsgEl.textContent = '❌ Please select a service first in the "Services" section!';
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if (!bkName || !bkPhone || !bkDate || !bkTime) {
            bookingMsgEl.textContent = '❌ Please fill out all required personal/time fields!';
            return;
        }

        // Find the full service name for storage
        let serviceName = "Unknown Service";
        for (const cat of categories) {
            const svc = cat.services.find(s => s.id === selServiceId);
            if (svc) {
                serviceName = `${cat.title}: ${svc.name}`;
                break;
            }
        }

        const booking = {
            service: serviceName, 
            mode: selMode,
            name: bkName,
            phone: bkPhone,
            date: bkDate,
            time: bkTime,
            timestamp: new Date().toISOString()
        };

        // --- DEMO STORAGE using localStorage ---
        const all = JSON.parse(localStorage.getItem('techclean_bookings') || '[]');
        all.unshift(booking);
        localStorage.setItem('techclean_bookings', JSON.stringify(all));

        // Display confirmation message and reset
        bookingMsgEl.textContent = `✅ BOOKING CONFIRMED for ${serviceName} (${selMode}). (Demo only. Data saved locally).`;
        resetBookingForm(); // This also resets selectedServiceId and the visual display
        renderBookings(); // Re-render the recent bookings list
    });
}

// Function to render recent bookings
function renderBookings() {
  const list = document.getElementById('bookingsList');
  if (!list) return;

  const all = JSON.parse(localStorage.getItem('techclean_bookings') || '[]');
  
  if (all.length === 0) {
    list.innerHTML = '<p>No recent bookings yet.</p>';
    return;
  }

  list.innerHTML = all.slice(0, 5).map(b => {
    // Attempt to parse date/time string, assuming local timezone is sufficient for demo
    const date = new Date(b.date + 'T' + b.time); 
    return `
    <p>
      <strong>${b.name}</strong> - ${b.service} (${b.mode})<br>
      <span class="muted small">${date.toLocaleDateString()} @ ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
    </p>
    `;
  }).join('<hr/>');
}


/* -------------------- CHAT SYSTEM -------------------- */
const messagesEl = document.getElementById('messages');
const chatBodyEl = document.getElementById('chatBody');
const chatContainerEl = document.querySelector('.chat-container');

function appendMsg(txt, who = 'bot') {
    const m = document.createElement('div');
    m.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
    m.textContent = txt;
    messagesEl.appendChild(m);
    // Auto-scroll to the latest message
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

window.sendChat = function() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return;

    appendMsg(text, 'user');
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
        const t = text.toLowerCase();

        if (t.includes('price') || t.includes('cost')) {
            appendMsg('Prices vary depending on the device and service selected. Please click on a category in the "Services" section above to see the detailed price list.');
        } else if (t.includes('book') || t.includes('schedule')) {
            appendMsg('To schedule a service, first click a category in the "Services" section, then click "Select Service" next to your desired service. This will open and pre-fill the "Booking" form for you.');
        } else if (t.includes('location')) {
            appendMsg('Our drop-off location is at Daro, Dumaguete City, Kagawasan Avenue. We also offer on-site cleaning service!');
        } else {
            appendMsg('Thanks for your message! Our human assistant will get back to you shortly (This is a demo assistant).');
        }
    }, 700);
}

function setupChatToggle() {
    const chatToggle = document.getElementById('chatToggle');
    const chatHeader = document.getElementById('chatHeader');
    
    // Initial message
    appendMsg('WELCOME TO TECHCLEAN — DUST OUT, POWER UP! How can I assist you with your device cleaning needs?');

    chatHeader.addEventListener('click', () => {
        chatBodyEl.classList.toggle('hidden');
        chatContainerEl.classList.toggle('minimized');
        chatToggle.textContent = chatBodyEl.classList.contains('hidden') ? '+' : '_';
    });
}


/* -------------------- UI & ANIMATION -------------------- */

function setupNavToggle() {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
      }
    });
  });
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1 
  });
  revealElements.forEach(el => observer.observe(el));
}

// Function to update the year in the non-existent footer (but keep the function in case we add one later)
function updateFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* -------------------- INITIALIZATION -------------------- */
function initApp() {
    updateFooterYear();
    renderCategories();
    renderBookings();
    setupNavToggle();
    setupBookingForm();
    setupScrollReveal();
    setupChatToggle(); // Initialize the chat bot
}

// Wait until the entire page is loaded before running the script
document.addEventListener('DOMContentLoaded', initApp);
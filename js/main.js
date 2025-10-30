document.addEventListener('DOMContentLoaded', () => {
  const dataUrl = 'data.json';
  const state = {
    data: null,
    currentStep: 1,
    selectedEvent: null,
    qty: 0,
    participants: []
  };

  function saveProgress() {
    localStorage.setItem('reserv_progress', JSON.stringify({
      selectedEvent: state.selectedEvent,
      qty: state.qty,
      participants: state.participants,
      currentStep: state.currentStep
    }));
  }

  function loadProgress() {
    
    const raw = localStorage.getItem('reserv_progress');
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      state.selectedEvent = obj.selectedEvent || null;
      state.qty = obj.qty || 0;
      state.participants = obj.participants || [];
      state.currentStep = obj.currentStep || 1;
    } catch (e) { console.log("error infunction loadProgress") }
  }

  fetch(dataUrl)
    .then(r => r.json())
    .then(data => {
      state.data = data;
      loadProgress();
      const hero = document.querySelector('.hero');
      if (hero && data.hero) {
        hero.innerHTML = `
          <div class="hero-content">
            <h1>${data.hero.title.title_pr} <span class="title_sec">${data.hero.title.title_sec}</span></h1>
            <p>${data.hero.subtitle}</p>
          </div>
        `;
      }

      const btns = document.querySelector(".btns");
      if (data.progress) {
        data.progress.forEach((label, i) => {
          btns.innerHTML += `<div class="btn-step btn-step-${i+1}" data-step="${i+1}"><button type="button">${i+1} - ${label}</button></div>`;
        });
      }

      const stepSections = Array.from(document.querySelectorAll('.step-section'));
      function showStep(stepNum) {
        state.currentStep = stepNum;
        stepSections.forEach(sec => {
          const n = Number(sec.dataset.step);
          if (n === stepNum) sec.classList.remove('hidden'); else sec.classList.add('hidden');
        });
        document.querySelectorAll('.btn-step').forEach(el => {
          if (Number(el.dataset.step) === stepNum) el.classList.add('active'); else el.classList.remove('active');
        });
        saveProgress();
      }

      document.addEventListener('click', (e) => {
        const b = e.target.closest('.btn-step');
        if (b) {
          const step = Number(b.dataset.step);
          showStep(step);
        }
      });

      function displayCards(cards) {
        const cardsSection = document.querySelector('.cards-container');
        if (!cardsSection || !Array.isArray(cards)) return;
        cardsSection.innerHTML = `
          <div class="cards-grid">
            ${cards.map(card => `
              <article class="card" data-tid="${card.tid}">
                <div class="card-img">
                  <img src="${card.image}" alt="${card.title}" />
                </div>
                <div class="card-body">
                  <h3 class="card-title">${card.title}</h3>
                  <p class="card-meta">${card.date} • ${card.location}</p>
                  <p class="card-type">${card.type}</p>
                  <p class="card-places">Places restantes: ${card.remaining_places}</p>
                </div>
                <div class="card-footer">
                  <div class="card-price">${card.price} ${card.currency}</div>
                  <button class="reserve-btn" type="button">Réserver</button>
                </div>
              </article>
            `).join('')}
          </div>
        `;
      }

      // Filter
      const filter_ele = document.querySelector(".filter");
      filter_ele.innerHTML = `
        <div class="filter-ville">
          <select name="villes" id="ville-select">
            <option value="">--Toutes les villes--</option>
            ${[...new Set(data.cards.map(element => element.location))]
          .map(location => `<option value="${location}">${location}</option>`).join("")}
          </select>
        </div>

        <div class="filter-categories">
          <select name="categories" id="categorie-select">
            <option value="">--Toutes les catégories--</option>
            ${[...new Set(data.cards.map(element => element.type))]
          .map(type => `<option value="${type}">${type}</option>`).join("")}
          </select>
        </div>

        <div>
          <button id="reset-btn">Effacer</button>
        </div>
      `;

      function applyFilters() {
        const selectedVille = document.querySelector("#ville-select").value;
        const selectedCategorie = document.querySelector("#categorie-select").value;

        const filteredCards = data.cards.filter(card => {
          const matchVille = selectedVille === "" || card.location === selectedVille;
          const matchCategorie = selectedCategorie === "" || card.type === selectedCategorie;
          return matchVille && matchCategorie;
        });

        displayCards(filteredCards);
      }

      document.querySelector("#ville-select").addEventListener("change", applyFilters);
      document.querySelector("#categorie-select").addEventListener("change", applyFilters);
      document.querySelector("#reset-btn").addEventListener("click", () => {
        document.querySelector("#ville-select").value = "";
        document.querySelector("#categorie-select").value = "";
        displayCards(data.cards);
      });

      displayCards(data.cards);

    })

});


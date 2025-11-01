document.addEventListener('DOMContentLoaded', () => {
  function error_messages(selector, messages) {
    document.querySelector(selector).innerHTML = messages
  }
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
          btns.innerHTML += `<div class="btn-step btn-step-${i + 1}" data-step="${i + 1}"><button type="button">${i + 1} - ${label}</button></div>`;
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
        if (stepNum === 2) populateStep2();
        if (stepNum === 3) populateStep3();
        saveProgress();
      }

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
                  <p class="card-meta">${card.date} <i class="fa-solid fa-location-dot"></i> ${card.location}</p>
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
      //etape 2
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains("reserve-btn")) {
          const cardElement = e.target.closest(".card");
          const cardId = cardElement.dataset.tid;
          const selectedCard = data.cards.find(item => String(item.tid) === String(cardId));
          if (!selectedCard) return;

          state.selectedEvent = selectedCard;
          state.qty = 1;
          state.participants = [];
          saveProgress();
          populateStep2();
          showStep(2);
        }
      });

      const step2Title = document.getElementById('step2-event-title');
      const step2Meta = document.getElementById('step2-event-meta');
      const qtyInput = document.getElementById('qty-input');
      const price = document.getElementById('price');
      const availablePlaces = document.getElementById('available-places');

      document.getElementById('step2-prev').addEventListener('click', () => showStep(1));
      document.getElementById('step2-next').addEventListener('click', () => {
        const max = state.selectedEvent ? Number(state.selectedEvent.remaining_places) : 0;
        let qty = parseInt(qtyInput.value, 10);
        if (isNaN(qty) || qty < 1) qty = 1;
        if (qty > max) {
          error_messages(".error-qtn", `La quantité choisie (${qty}) dépasse les places disponibles (${max}).`);
          return;
        }
        error_messages(".error-qtn", "");
        state.qty = qty;
        state.participants = [];
        saveProgress();
        populateStep3();
        showStep(3);
      });

      function populateStep2() {
        if (!state.selectedEvent) return;
        price.innerHTML = `${state.selectedEvent.price} <span class="num_price">${state.selectedEvent.currency}</span>`
        step2Title.textContent = state.selectedEvent.title;
        step2Meta.innerHTML = `${state.selectedEvent.date} <i class="fa-solid fa-location-dot"></i>  ${state.selectedEvent.location} `;
        if (!state.qty || Number(state.qty) < 1) state.qty = 1;
        qtyInput.value = state.qty;
        availablePlaces.textContent = `Places disponibles: ${state.selectedEvent.remaining_places}`;

      }

      let plus = document.getElementById("plus");
      let minus = document.getElementById("minus");
      let counter = state.qty || 1;

      function clampCounter(v) {
        const max = state.selectedEvent ? Number(state.selectedEvent.remaining_places) : Infinity;
        if (isNaN(v) || v < 1) return 1;
        if (v > max) return max;
        return v;
      }

      if (plus) {
        plus.addEventListener("click", () => {
          counter = clampCounter(counter + 1);
          qtyInput.value = counter;
        });
      }
      if (minus) {
        minus.addEventListener("click", () => {
          counter = clampCounter(counter - 1);
          qtyInput.value = counter;
        });
      }

      if (qtyInput) {
        qtyInput.addEventListener('input', () => {
          let v = parseInt(qtyInput.value.replace(/\D/g, ''), 10);
          if (isNaN(v)) v = 1;
          v = clampCounter(v);
          counter = v;
          qtyInput.value = v;
        });
      }



      //etapes 3 

      function populateStep3() {
        if (!state.selectedEvent || !state.qty) return;

        const form = document.getElementById("participants-form");
        const counter = document.getElementById("participant-counter");
        const resultsContainer = document.getElementById("participant-list");

        let participants = Array.isArray(state.participants)
          ? state.participants.slice()
          : [];

        for (let i = 0; i < state.qty; i++) {
          if (!participants[i] || typeof participants[i] !== "object") {
            participants[i] = { first: "", last: "", mail: "", phone: "" };
          }
        }

        let currentIndex = 0;

        function getFormValues() {
          return {
            first: form.querySelector("#firstName").value.trim(),
            last: form.querySelector("#lastName").value.trim(),
            mail: form.querySelector("#email").value.trim(),
            phone: form.querySelector("#phone").value.trim(),
          };
        }

        function isComplete({ first, last, mail, phone }) {
          return first && last && mail && phone;
        }

        function updateParticipants() {
          state.participants = participants.slice();
          saveProgress();
          renderParticipantsList();
        }

        function renderParticipantsList() {
          if (!resultsContainer) return;

          const items = participants
            .map((p, i) => {
              if (!isComplete(p)) return "";
              return `
          <div class="participant-item" data-index="${i}">
            <span>${p.first} ${p.last} — ${p.mail} ${p.phone ? "(" + p.phone + ")" : ""}</span>
            <button class="delete-part" data-index="${i}">Supprimer</button>
          </div>`;
            })
            .filter(Boolean)
            .join("");

          resultsContainer.innerHTML = items || `<p>Aucun participant ajouté</p>`;

          resultsContainer.querySelectorAll(".delete-part").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              const idx = Number(e.currentTarget.dataset.index);
              participants[idx] = { first: "", last: "", mail: "", phone: "" };
              updateParticipants();
              renderForm(currentIndex);
            });
          });
        }

        function renderForm(index) {
          const p = participants[index] || { first: "", last: "", mail: "", phone: "" };

          form.innerHTML = `
            <div class="participant-form">
              <label>Participant ${index + 1} / ${state.qty}</label>
              <input type="text" id="firstName" placeholder="Prénom" value="${p.first}" />
              <input type="text" id="lastName" placeholder="Nom" value="${p.last}" />
              <input type="email" id="email" placeholder="Email" value="${p.mail}" />
              <input type="tel" id="phone" placeholder="Téléphone" value="${p.phone}" />
              <div id="error-remplir" style="color:red"></div>
              <input id="ajouter_par" type="button" value="Ajouter Participant" />
            </div>
          `;

          counter.textContent = `Participant ${index + 1} / ${state.qty}`;

          const addBtn = document.getElementById("ajouter_par");

          addBtn.onclick = () => {
            const values = getFormValues();

            if (!isComplete(values)) {
              error_messages("#error-remplir","Veuillez remplir tous les champs avant d'ajouter le participant.");
              return;
            }

            participants[index] = values;
            updateParticipants();

            const nextIndex = participants.findIndex((p) => !isComplete(p));
            currentIndex = nextIndex !== -1 ? nextIndex : index;
            renderForm(currentIndex);
          };
        }

        function saveCurrentParticipant() {
          const values = getFormValues();
          if (!isComplete(values)) {
            error_messages("#error-remplir","Veuillez compléter tous les participants avant de continuer");
            return false;
          }

          participants[currentIndex] = values;
          updateParticipants();
          return true;
        }

        document.getElementById("step3-prev").onclick = () => {
          if (currentIndex > 0) {
            saveCurrentParticipant();
            currentIndex--;
            renderForm(currentIndex);
          } else {
            showStep(2);
          }
        };

        document.getElementById("step3-next").onclick = () => {
          if (!saveCurrentParticipant()) return;

          const incomplete = participants.some((p) => !isComplete(p));
          if (incomplete) {
            error_messages("#error-remplir","Veuillez compléter tous les participants avant de continuer");
            return;
          }

          saveProgress();
          showStep(4);
        };

        renderForm(currentIndex);
        renderParticipantsList();
      }



      showStep(state.currentStep);

    })
});


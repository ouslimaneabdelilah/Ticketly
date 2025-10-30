document.addEventListener('DOMContentLoaded', () => {
  const dataUrl = 'data.json';

  fetch(dataUrl)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const hero = document.querySelector('.hero');
      if (hero && data.hero) {
        hero.innerHTML = `
          <div class="hero-content">
            <h1>${data.hero.title.title_pr} <span class="title_sec">${data.hero.title.title_sec}</span></h1>
            <p>${data.hero.subtitle}</p>
          </div>
        `;
      }

      //Progress 
      const data_progress = data.progress;
      const btns = document.querySelector(".btns");

      if (data_progress) {
        data_progress.map((e, i) => {
          btns.innerHTML += `
      <div class="btn-step btn-step-${i + 1}">
        <button type="button">${i + 1} - ${e}</button>
      </div>`;
        });
      }

      // let currentStep = 0;
      // const allSteps = document.querySelectorAll(".btn-step");
      // allSteps[currentStep].classList.add("active");

      // function updateActiveStep() {
      //   allSteps.forEach((el) => el.classList.remove("active"));
      //   allSteps[currentStep].classList.add("active");
      // }

      // document.getElementById("nextBtn").addEventListener("click", () => {
      //   if (currentStep < allSteps.length - 1) {
      //     currentStep++;
      //     updateActiveStep();
      //   }
      // });

      // document.getElementById("prevBtn").addEventListener("click", () => {
      //   if (currentStep > 0) {
      //     currentStep--;
      //     updateActiveStep();
      //   }
      // });



      // Filter in events
      const filter_ele = document.querySelector(".filter");

      filter_ele.innerHTML = `
        <div class="filter-ville">
          <select name="villes" id="ville-select">
            <option value="">--Toutes les villes--</option>
            ${[...new Set(data.cards.map(element => element.location))]
          .map(location => `<option value="${location}">${location}</option>`)
          .join("")}
          </select>
        </div>

        <div class="filter-categories">
          <select name="categories" id="categorie-select">
            <option value="">--Toutes les catégories--</option>
            ${[...new Set(data.cards.map(element => element.type))]
          .map(type => `<option value="${type}">${type}</option>`)
          .join("")}
          </select>
        </div>

        <div>
          <button id="reset-btn">Effacer</button>
        </div>
      `;

      function displayCards(cards) {
        const cardsSection = document.querySelector('.cards-container');
        if (cardsSection && Array.isArray(cards)) {
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
      }

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
      // const reserve_click = document.querySelector(".reserve-btn");
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains("reserve-btn")) {
          const cardElement = e.target.closest(".card");
          const cardId = cardElement.dataset.tid;
          const selectedCard = data.cards.find(e => e.tid == cardId);
          let selectedCards = JSON.parse(localStorage.getItem("selectedCards")) || "";
          const alreadyExists = selectedCards.some(c => c.tid == selectedCard.tid);
          if (!alreadyExists) {
            selectedCards.push(selectedCard);
            localStorage.setItem("selectedCards", JSON.stringify(selectedCards));
               
               console.log("hhhh");
            
          }
        }
      })

    })
});


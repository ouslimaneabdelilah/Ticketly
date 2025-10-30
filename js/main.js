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

      let currentStep = 0;
      const allSteps = document.querySelectorAll(".btn-step");
      allSteps[currentStep].classList.add("active");

      function updateActiveStep() {
        allSteps.forEach((el) => el.classList.remove("active"));
        allSteps[currentStep].classList.add("active");
      }

      document.getElementById("nextBtn").addEventListener("click", () => {
        if (currentStep < allSteps.length - 1) {
          currentStep++;
          updateActiveStep();
        }
      });

      document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentStep > 0) {
          currentStep--;
          updateActiveStep();
        }
      });



    })
});


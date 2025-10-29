let data = {
  hero: {
    title: {
      title_pr:"RÉSERVATION DE BILLETS POUR UN",
      title_sec : "ÉVÉNEMENT",
    },
    subtitle: "Réservez facilement vos billets pour vos événements préférés en quelques clics — rapide, simple et sécurisé."
  },
  cards: [
    {
      id: 1,
      title: "Salon Tech 2025",
      date: "2025-10-12",
      location: "Rabat",
      type: "Conférence",
      remaining_places: 200,
      price: 45,
      currency: "MAD",
      image: "viva-tech.jpg"
    },
    {
      id: 2,
      title: "Gaming Expo 2025",
      date: "2025-11-02",
      location: "Casablanca",
      type: "Exposition",
      remaining_places: 150,
      price: 60,
      currency: "MAD",
      image: "gaming-expo.jpg"
    },
    {
      id: 3,
      title: "AI Summit Morocco",
      date: "2025-09-18",
      location: "Marrakech",
      type: "Conférence",
      remaining_places: 120,
      price: 80,
      currency: "MAD",
      image: "ai-summit.jpg"
    },
    {
      id: 4,
      title: "Startup Weekend",
      date: "2025-08-05",
      location: "Fès",
      type: "Atelier",
      remaining_places: 90,
      price: 30,
      currency: "MAD",
      image: "startup-weekend.jpg"
    },
    {
      id: 5,
      title: "Design Connect 2025",
      date: "2025-09-01",
      location: "Agadir",
      type: "Conférence",
      remaining_places: 180,
      price: 50,
      currency: "MAD",
      image: "design-connect.jpg"
    },
    {
      id: 6,
      title: "Web Dev Days",
      date: "2025-11-20",
      location: "Tanger",
      type: "Workshop",
      remaining_places: 110,
      price: 40,
      currency: "MAD",
      image: "web-dev-days.jpg"
    },
    {
      id: 7,
      title: "Digital Future Expo",
      date: "2025-12-10",
      location: "Casablanca",
      type: "Exposition",
      remaining_places: 250,
      price: 55,
      currency: "MAD",
      image: "digital-future.jpg"
    },
    {
      id: 8,
      title: "Cloud Conference",
      date: "2025-10-25",
      location: "Rabat",
      type: "Conférence",
      remaining_places: 140,
      price: 65,
      currency: "MAD",
      image: "cloud-conf.jpg"
    },
    {
      id: 9,
      title: "Cyber Security Day",
      date: "2025-11-15",
      location: "Marrakech",
      type: "Séminaire",
      remaining_places: 100,
      price: 70,
      currency: "MAD",
      image: "cyber-day.jpg"
    },
    {
      id: 10,
      title: "Green Tech Forum",
      date: "2025-12-05",
      location: "Fès",
      type: "Conférence",
      remaining_places: 130,
      price: 45,
      currency: "MAD",
      image: "green-tech.jpg"
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  hero.innerHTML = `
    <div class="hero-content">
      <h1>${data.hero.title.title_pr} <span class="title_sec">${data.hero.title.title_sec}</span></h1>
      <p>${data.hero.subtitle}</p>
    </div>
  `;
});
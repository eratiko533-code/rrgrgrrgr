/* CINEMA Booking — интерактивті мүмкіндіктер */
"use strict";

const moviePrices = {
  "Ғарыш әлемі": 2000,
  "Супер қаһарман": 2000,
  "Күлкі кеші": 1800,
  "Жаңа белес": 1900,
  "Жұлдыздар сыры": 2200,
  "Жылдамдық": 2000
};

const takenSeats = [5, 12, 19, 26];
let selectedSeats = [];

const elements = {
  movie: document.getElementById("movie"),
  date: document.getElementById("date"),
  time: document.getElementById("time"),
  customer: document.getElementById("customer"),
  seats: document.getElementById("seats"),
  sumMovie: document.getElementById("sumMovie"),
  sumDate: document.getElementById("sumDate"),
  sumTime: document.getElementById("sumTime"),
  sumSeats: document.getElementById("sumSeats"),
  count: document.getElementById("count"),
  total: document.getElementById("total"),
  result: document.getElementById("result"),
  toast: document.getElementById("toast")
};

function getTicketPrice() {
  return moviePrices[elements.movie.value] || 2000;
}

function createSeats() {
  elements.seats.innerHTML = "";
  selectedSeats = [];

  for (let number = 1; number <= 30; number += 1) {
    const seat = document.createElement("button");
    seat.type = "button";
    seat.className = "seat";
    seat.textContent = number;
    seat.setAttribute("aria-label", `Орын ${number}`);

    if (takenSeats.includes(number)) {
      seat.classList.add("taken");
      seat.disabled = true;
      seat.setAttribute("aria-label", `Орын ${number}, бос емес`);
    } else {
      seat.setAttribute("aria-pressed", "false");
      seat.addEventListener("click", () => toggleSeat(number, seat));
    }

    elements.seats.appendChild(seat);
  }

  updateSummary();
}

function toggleSeat(number, seatElement) {
  if (selectedSeats.includes(number)) {
    selectedSeats = selectedSeats.filter((seat) => seat !== number);
    seatElement.classList.remove("selected");
    seatElement.setAttribute("aria-pressed", "false");
  } else {
    selectedSeats.push(number);
    seatElement.classList.add("selected");
    seatElement.setAttribute("aria-pressed", "true");
  }

  updateSummary();
}

function updateSummary() {
  const chosenDate = elements.date.value;
  elements.sumMovie.textContent = elements.movie.value;
  elements.sumDate.textContent = chosenDate
    ? new Date(`${chosenDate}T12:00:00`).toLocaleDateString("kk-KZ", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Күн таңдалмаған";
  elements.sumTime.textContent = elements.time.value;
  elements.sumSeats.textContent = selectedSeats.length
    ? [...selectedSeats].sort((a, b) => a - b).join(", ")
    : "Таңдалмаған";
  elements.count.textContent = selectedSeats.length;
  elements.total.textContent =
    (selectedSeats.length * getTicketPrice()).toLocaleString("kk-KZ") + " ₸";
}

function clearResult() {
  elements.result.className = "result";
  elements.result.textContent = "";
}

function chooseMovie(movieName) {
  elements.movie.value = movieName;
  clearResult();
  updateSummary();
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
}

function showBookingResult(type, message) {
  elements.result.className = `result ${type}`;
  elements.result.textContent = message;
}

function bookTicket() {
  if (selectedSeats.length === 0) {
    showBookingResult("error", "Алдымен залдан кемінде бір орын таңдаңыз.");
    return;
  }

  if (!elements.date.value) {
    showBookingResult("error", "Кино күнін таңдаңыз.");
    elements.date.focus();
    return;
  }

  const customerName = elements.customer.value.trim();
  const seats = [...selectedSeats].sort((a, b) => a - b).join(", ");
  const total = (selectedSeats.length * getTicketPrice()).toLocaleString("kk-KZ");
  const message =
    `✅ Бронь демо-нұсқада расталды${customerName ? `, ${customerName}` : ""}! ` +
    `${elements.movie.value} · ${elements.date.value} · ${elements.time.value} · ` +
    `Орындар: ${seats} · ${total} ₸. Бұл бронь дерекқорға сақталмайды.`;

  showBookingResult("ok", message);
}

function setupMovieFilters() {
  const filterButtons = document.querySelectorAll(".filter");
  const movieCards = document.querySelectorAll(".movie");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      movieCards.forEach((card) => {
        const showAll = button.dataset.filter === "all";
        const matchesGenre = card.dataset.genre === button.dataset.filter;
        card.hidden = !(showAll || matchesGenre);
      });
    });
  });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 3500);
}

function setupNewsletter() {
  const form = document.getElementById("newsForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Рақмет! Бұл демо-нұсқада email сақталмайды.");
    form.reset();
  });
}

function setupDatePicker() {
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");
  elements.date.min = localToday;
}

function init() {
  setupDatePicker();
  setupMovieFilters();
  setupNewsletter();
  createSeats();

  elements.movie.addEventListener("change", () => {
    clearResult();
    createSeats();
  });
  elements.date.addEventListener("change", updateSummary);
  elements.time.addEventListener("change", updateSummary);
  document.getElementById("confirmBooking").addEventListener("click", bookTicket);

  document.querySelectorAll("[data-movie]").forEach((button) => {
    button.addEventListener("click", () => chooseMovie(button.dataset.movie));
  });
}

init();

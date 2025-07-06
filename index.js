const contentDiv = document.getElementById("content");
const searchForm = document.getElementById("searchForm");
const previousSearchesDiv = document.getElementById("previousSearches");
const dateInput = document.getElementById("date");

// Set max date to today
dateInput.max = new Date().toISOString().split("T")[0];

// NASA APOD API Key (You can replace with your own key)
const API_KEY = "NqV5SzUWmNu1GaMjpjfIYwr9bk2YEuygf7JZskYm";  // Replace with your real key if rate-limited

// Load last searched image on page load
window.onload = () => {
  const savedSearches = JSON.parse(localStorage.getItem("searches")) || [];
  if (savedSearches.length > 0) {
    const lastDate = savedSearches[savedSearches.length - 1].date;
    fetchAPOD(lastDate);
    renderHistory(savedSearches);
  }
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedDate = dateInput.value;
  if (!selectedDate) return;

  fetchAPOD(selectedDate);
  updateHistory(selectedDate);
});

// Fetch image and details from NASA APOD API
function fetchAPOD(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      renderContent(data);
    })
    .catch(error => {
      contentDiv.innerHTML = `<p>Error fetching data. Try again later.</p>`;
      console.error("API Error:", error);
    });
}

// Render image/video content
function renderContent(data) {
  let mediaHTML = "";

  if (data.media_type === "image") {
    mediaHTML = `<img src="${data.url}" alt="${data.title}">`;
  } else if (data.media_type === "video") {
    mediaHTML = `<iframe width="100%" height="400" src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    mediaHTML = `<p>Unsupported media type: ${data.media_type}</p>`;
  }

  contentDiv.innerHTML = `
    <h2>Picture on ${data.date}</h2>
    ${mediaHTML}
    <div class="text-block">
      <h2>${data.title}</h2>
      <p>${data.explanation}</p>
    </div>
  `;
}

// Save search to localStorage
function updateHistory(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];

  if (!searches.find(item => item.date === date)) {
    searches.push({ date });
    localStorage.setItem("searches", JSON.stringify(searches));
    renderHistory(searches);
  }
}

// Render previous search history
function renderHistory(searches) {
  previousSearchesDiv.innerHTML = "";

  searches.forEach(({ date }) => {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = date;
    link.onclick = () => fetchAPOD(date);
    previousSearchesDiv.appendChild(link);
  });
}

// Clear localStorage and UI
function clearHistory() {
  localStorage.removeItem("searches");
  previousSearchesDiv.innerHTML = "";
  contentDiv.innerHTML = "";
}

console.log("Homepage SEA Catering loaded!");

const BASE_URL = window.location.origin;

function showModal(planName) {
  const modal = document.getElementById("meal-modal");
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-description");

  title.textContent = planName;
  let content = "";

  if (planName === "Paket Diet") {
    content = `
      <ul>
        <li>Dada ayam kukus atau tahu/tempe rebus</li>
        <li>Brokoli, wortel, buncis, dan jagung manis (pilih 3)</li>
        <li>Nasi merah atau kentang rebus</li>
        <li>Telur atau tanpa telur rebus</li>
        <li>Apel, semangka, atau pepaya</li>
      </ul>`;
  } else if (planName === "Paket Protein") {
    content = `
      <ul>
        <li>Ayam panggang, ikan tuna, telur rebus, atau tempe crispy</li>
        <li>Pakcoy, paprika, wortel, dan kacang kapri (pilih 3)</li>
        <li>Nasi putih atau pasta</li>
        <li>Minuman pendamping: susu almond atau jus sehat</li>
      </ul>`;
  } else if (planName === "Paket Royal") {
    content = `
      <ul>
        <li>Salmon, ayam organik, atau daging sapi lada hitam</li>
        <li>Asparagus, zucchini, bayam muda, jamur tiram, selada romaine</li>
        <li>Nasi basmati, kentang panggang, atau quinoa</li>
        <li>Sup bening ayam atau miso</li>
        <li>Chia pudding, yogurt low-fat, atau buah potong</li>
        <li>Minuman: infused water jeruk nipis atau teh hijau</li>
      </ul>`;
  } else {
    content = "Detail paket tidak ditemukan.";
  }

  desc.innerHTML = content;
  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("meal-modal").classList.add("hidden");
}

function hitungTotal() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const plan = document.getElementById("plan").value;
  const allergies = document.getElementById("allergies").value.trim();
  const resultDiv = document.getElementById("result");

  const mealTypes = document.querySelectorAll('input[name="mealType"]:checked');
  const deliveryDays = document.querySelectorAll('input[name="day"]:checked');

  if (!name || !phone || !plan) {
    resultDiv.innerHTML = "<p style='color:red;'>Nama, nomor HP, dan paket wajib diisi.</p>";
    resultDiv.classList.add("show");
    return;
  }

  if (mealTypes.length === 0) {
    resultDiv.innerHTML = "<p style='color:red;'>Pilih minimal satu jenis meal.</p>";
    resultDiv.classList.add("show");
    return;
  }

  if (deliveryDays.length === 0) {
    resultDiv.innerHTML = "<p style='color:red;'>Pilih minimal satu hari pengiriman.</p>";
    resultDiv.classList.add("show");
    return;
  }

  let hargaPerMeal = plan === "diet" ? 30000 : plan === "protein" ? 40000 : 60000;
  const multiplier = 4.3;
  const totalMeals = mealTypes.length * deliveryDays.length * multiplier;
  const totalPrice = totalMeals * hargaPerMeal;

  resultDiv.innerHTML = `
    <p>Hai <strong>${name}</strong>, berikut ringkasan pesananmu:</p>
    <ul>
      <li><strong>Paket:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</li>
      <li><strong>Jumlah meal per hari:</strong> ${mealTypes.length} (${[...mealTypes].map(m => m.value).join(", ")})</li>
      <li><strong>Hari pengiriman:</strong> ${[...deliveryDays].map(d => d.value).join(", ")}</li>
      <li><strong>Harga per meal:</strong> Rp ${hargaPerMeal.toLocaleString()}</li>
      <li><strong>Total meal:</strong> ${Math.round(totalMeals)}</li>
      <li><strong>Total harga:</strong> Rp ${Math.round(totalPrice).toLocaleString()}</li>
    </ul>
    ${allergies ? `<p><strong>Alergi:</strong> ${allergies}</p>` : ""}
    <button class="kirim-btn" onclick="kirimPesanan()">Kirim Pesanan</button>
  `;
  resultDiv.classList.add("show");
}

function kirimPesanan() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const plan = document.getElementById("plan").value;
  const allergies = document.getElementById("allergies").value.trim();
  const mealTypes = [...document.querySelectorAll('input[name="mealType"]:checked')].map(m => m.value);
  const deliveryDays = [...document.querySelectorAll('input[name="day"]:checked')].map(d => d.value);

  const hargaPerMeal = plan === "diet" ? 30000 : plan === "protein" ? 40000 : 60000;
  const totalMeals = mealTypes.length * deliveryDays.length * 4.3;
  const totalPrice = Math.round(hargaPerMeal * totalMeals);

  fetch(`${BASE_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, plan, meals: mealTypes, days: deliveryDays, allergies, totalPrice })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Pesanan berhasil dikirim! Silakan login.");
        window.location.href = "login.html";
      } else {
        alert("Gagal membuat pesanan.");
      }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("testimonial-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("t-name").value.trim();
      const message = document.getElementById("t-message").value.trim();
      const rating = parseInt(document.getElementById("t-rating").value);

      if (!name || !message || isNaN(rating)) return alert("Semua kolom wajib diisi.");

      fetch(`${BASE_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, rating })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("Testimoni berhasil dikirim!");
            location.reload();
          } else {
            alert("Gagal mengirim testimoni.");
          }
        });
    });
  }

  fetch(`${BASE_URL}/testimonials`)
    .then(res => res.json())
    .then(data => {
      const wrapper = document.querySelector(".swiper-wrapper");
      if (!wrapper) return;
      wrapper.innerHTML = "";
      data.forEach((item) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `"${item.message}" - ${item.name} ${"⭐".repeat(item.rating)}`;
        wrapper.appendChild(slide);
      });

      new Swiper(".mySwiper", {
        loop: true,
        autoplay: { delay: 3500, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true }
      });
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar ul");
  if (!navbar) return;

  fetch(`${BASE_URL}/me`, {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        navbar.innerHTML = data.user.isAdmin
          ? `
          <li><a href="adminDash.html">Admin Dashboard</a></li>
          <li><a href="#" onclick="logout()">Logout</a></li>
        `
          : `
          <li><a href="index.html">Home</a></li>
          <li><a href="menu.html">Menu</a></li>
          <li><a href="subscription.html">Subscription</a></li>
          <li><a href="testimonials.html">Testimonials</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="userDash.html">Dashboard</a></li>
          <li><a href="#" onclick="logout()">Logout</a></li>
        `;
      } else {
        navbar.innerHTML = `
          <li><a href="index.html">Home</a></li>
          <li><a href="menu.html">Menu</a></li>
          <li><a href="subscription.html">Subscription</a></li>
          <li><a href="testimonials.html">Testimonials</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="login.html">Login</a></li>
          <li><a href="regist.html">Register</a></li>
        `;
      }
    });
});

function logout() {
  fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include"
  }).then(() => {
    alert("Kamu telah logout.");
    window.location.href = "index.html";
  });
}
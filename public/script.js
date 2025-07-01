console.log("Homepage SEA Catering loaded!");

const BASE_URL = window.location.origin;

function showModal(planName) {
  const modal = document.getElementById("meal-modal");
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-description");

  title.textContent = planName;
  let content = "";

  if(planName === "Paket Diet"){
    content = `
      Ini adalah detail makanan untuk Paket Diet. Kamu bisa menyesuaikan makanan sesuai kebutuhan nutrisimu.
      <ul>
        <li>Dada ayam kukus atau tahu/tempe rebus</li>
        <li>Brokoli, wortel, buncis, dan jagung manis (pilih 3)</li>
        <li>Nasi merah atau kentang rebus</li>
        <li>Telur atau tanpa telur rebus</li>
        <li>Apel, semangka, atau pepaya</li>
      </ul>
    `;
  }else if(planName === "Paket Protein"){
    content = `
      Ini adalah detail makanan untuk Paket Protein. Kamu bisa menyesuaikan makanan sesuai kebutuhan nutrisimu.
      <ul>
        <li>Ayam panggang, ikan tuna, telur rebus, atau tempe crispy</li>
        <li>Pakcoy, paprika, wortel, dan kacang kapri (pilih 3)</li>
        <li>Nasi putih atau pasta</li>
        <li>Minuman pendamping: susu almond atau jus sehat</li>
      </ul>
    `;
  }else if(planName === "Paket Royal"){
    content = `
      Ini adalah detail makanan untuk Paket Royal. Kamu bisa menyesuaikan makanan sesuai kebutuhan nutrisimu.
      <ul>
        <li>Salmon, ayam organik, atau daging sapi lada hitam</li>
        <li>Asparagus, zucchini, bayam muda, jamur tiram, dan selada romaine (pilih 3-4)</li>
        <li>Nasi basmati, kentang panggang, atau quinoa</li>
        <li>Sup bening ayam atau miso</li>
        <li>Chia pudding, yogurt low-fat, atau buah potong</li>
        <li>Minuman: infused water jeruk nipis atau teh hijau</li>
      </ul>
    `;
  }else{
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

  if(!name || !phone || !plan){
    resultDiv.innerHTML = "<p style='color:red;'>Nama, nomor HP, dan paket wajib diisi.</p>";
    resultDiv.classList.add("show");
    return;
  }

  if(mealTypes.length === 0){
    resultDiv.innerHTML = "<p style='color:red;'>Pilih minimal satu jenis meal.</p>";
    resultDiv.classList.add("show");
    return;
  }

  if(deliveryDays.length === 0){
    resultDiv.innerHTML = "<p style='color:red;'>Pilih minimal satu hari pengiriman.</p>";
    resultDiv.classList.add("show");
    return;
  }

  let hargaPerMeal = 0;
  if(plan === "diet") hargaPerMeal = 30000;
  else if(plan === "protein") hargaPerMeal = 40000;
  else if(plan === "upgrade") hargaPerMeal = 60000;

  const mealCount = mealTypes.length;
  const dayCount = deliveryDays.length;
  const multiplier = 4.3;
  const totalMeals = mealCount * dayCount * multiplier;
  const totalPrice = totalMeals * hargaPerMeal;

  resultDiv.innerHTML = `
    <p>Hai <strong>${name}</strong>, berikut ringkasan pesananmu:</p>
    <!-- ... -->
    <button class="kirim-btn" onclick="kirimPesanan()">Kirim Pesanan</button>
  `;
  resultDiv.classList.add("show");
}

function kirimPesanan() {
  fetch(`${BASE_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      phone,
      plan,
      meals: mealTypes,
      days: deliveryDays,
      allergies,
      totalPrice
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Pesanan berhasil dikirim! Silakan login untuk melanjutkan.");
        window.location.href = "login.html";
      } else {
        alert("Gagal membuat pesanan.");
      }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const testimonialForm = document.getElementById("testimonial-form");
  if (testimonialForm) {
    testimonialForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("t-name").value.trim();
      const message = document.getElementById("t-message").value.trim();
      const rating = parseInt(document.getElementById("t-rating").value);
      if (!name || !message || isNaN(rating)) {
        alert("Semua kolom wajib diisi.");
        return;
      }

      fetch(`${BASE_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, rating })
      })
        .then((res) => res.json())
        .then((data) => {
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
    .then((res) => res.json())
    .then((data) => {
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
        autoplay: {
          delay: 3500,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      });
    });

  // auth navbar
  const navbar = document.querySelector(".navbar ul");
  if (!navbar) return;

  fetch(`${BASE_URL}/me`, {
    method: "GET",
    credentials: "include"
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.loggedIn) {
        const isAdmin = data.user.isAdmin;
        navbar.innerHTML = isAdmin
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


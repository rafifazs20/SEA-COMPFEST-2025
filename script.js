console.log("Homepage SEA Catering loaded!")

function showModal(planName) {
  const modal = document.getElementById("meal-modal");
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-description");

  title.textContent = planName;

  let content = "";

  if (planName === "Paket Diet") {
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
  } else if (planName === "Paket Protein") {
    content = `
      Ini adalah detail makanan untuk Paket Protein. Kamu bisa menyesuaikan makanan sesuai kebutuhan nutrisimu.
      <ul>
        <li>Ayam panggang, ikan tuna, telur rebus, atau tempe crispy</li>
        <li>Pakcoy, paprika, wortel, dan kacang kapri (pilih 3)</li>
        <li>Nasi putih atau pasta</li>
        <li>Minuman pendamping: susu almond atau jus sehat</li>
      </ul>
    `;
  } else if (planName === "Paket Upgrade (Lengkap)") {
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
  } else {
    content = "Detail paket tidak ditemukan.";
  }

  desc.innerHTML = content;
  modal.classList.remove("hidden");
}

function closeModal(){
    document.getElementById("meal-modal").classList.add("hidden");
}

function hitungTotal(){
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const plan = document.getElementById("plan").value;
  const allergies = document.getElementById("allergies").value.trim();
  const resultDiv = document.getElementById("result");

  const mealTypes = document.querySelectorAll('input[name="mealType"]:checked');
  const deliveryDays = document.querySelectorAll('input[name="day"]:checked');

  if (!name || !phone || !plan){
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
  <ul>
    <li><strong>Paket:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</li>
    <li><strong>Jumlah meal per hari:</strong> ${mealCount} (${[...mealTypes].map(m => m.value).join(", ")})</li>
    <li><strong>Hari pengiriman:</strong> ${[...deliveryDays].map(d => d.value).join(", ")}</li>
    <li><strong>Harga per meal:</strong> Rp ${hargaPerMeal.toLocaleString()}</li>
    <li><strong>Total meal:</strong> ${totalMeals.toFixed(1) / 4.3}x</li>
    <li><strong>Total harga:</strong> Rp ${Math.round(totalPrice).toLocaleString()}</li>
  </ul>
  ${allergies ? `<p><strong>Alergi:</strong> ${allergies}</p>` : ""}
  <button class="kirim-btn" onclick="kirimPesanan()">Kirim Pesanan</button>
`;
  resultDiv.classList.add("show");
}

function kirimPesanan(){
  alert("Pesanan berhasil dikirim! Tim kami akan menghubungimu melalui WhatsApp.");
}

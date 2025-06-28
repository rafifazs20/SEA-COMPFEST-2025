console.log("Homepage SEA Catering loaded!")

function showModal(namaPaket) {
  const modal = document.getElementById("meal-modal");
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-description");

  title.textContent = namaPaket;

  let content = "";

  if (namaPaket === "Paket Diet") {
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
  } else if (namaPaket === "Paket Protein") {
    content = `
      Ini adalah detail makanan untuk Paket Protein. Kamu bisa menyesuaikan makanan sesuai kebutuhan nutrisimu.
      <ul>
        <li>Ayam panggang, ikan tuna, telur rebus, atau tempe crispy</li>
        <li>Pakcoy, paprika, wortel, dan kacang kapri (pilih 3)</li>
        <li>Nasi putih atau pasta</li>
        <li>Minuman pendamping: susu almond atau jus sehat</li>
      </ul>
    `;
  } else if (namaPaket === "Paket Upgrade (Lengkap)") {
    content = `
      Ini adalah detail makanan untuk Paket Upgrade. Kamu bisa menyesuaikan makanan sesuai kebutuhan nutrisimu.
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
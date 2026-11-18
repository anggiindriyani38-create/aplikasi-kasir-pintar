
// =====================================
// 1. DATA PRODUK
// =====================================

const produk = [
    { id: 1, nama: "Air Mineral", harga: 5000, emoji: "💧" },
    { id: 2, nama: "Teh Botol", harga: 6000, emoji: "🧃" },
    { id: 3, nama: "Kopi", harga: 4000, emoji: "☕" },
    { id: 4, nama: "Roti", harga: 8000, emoji: "🍞" },
    { id: 5, nama: "Mie Instan", harga: 3500, emoji: "🍜" },
    { id: 6, nama: "Biskuit", harga: 7000, emoji: "🍪" },
    { id: 7, nama: "Susu", harga: 9000, emoji: "🥛" },
    { id: 8, nama: "Snack", harga: 5000, emoji: "🍟" }
];


// =====================================
// 2. DATA APLIKASI
// =====================================

let keranjang = [];
let riwayat = [];

try {
    riwayat = JSON.parse(
        localStorage.getItem("riwayatKasir")
    ) || [];
} catch (error) {
    riwayat = [];
}


// =====================================
// 3. MENGAMBIL ELEMEN HTML
// =====================================

const daftarProduk = document.getElementById("daftarProduk");
const daftarKeranjang = document.getElementById("daftarKeranjang");

const cariProduk = document.getElementById("cariProduk");
const diskonInput = document.getElementById("diskon");
const uangBayar = document.getElementById("uangBayar");

const subtotalElement = document.getElementById("subtotal");
const totalBayarElement = document.getElementById("totalBayar");
const uangKembaliElement = document.getElementById("uangKembali");

const totalOmzet = document.getElementById("totalOmzet");
const jumlahTransaksi = document.getElementById("jumlahTransaksi");
const jumlahBarang = document.getElementById("jumlahBarang");

const tombolBayar = document.getElementById("tombolBayar");
const tombolKosongkan = document.getElementById("tombolKosongkan");

const riwayatTransaksi = document.getElementById("riwayatTransaksi");

const areaStruk = document.getElementById("areaStruk");
const isiStruk = document.getElementById("isiStruk");
const tombolCetak = document.getElementById("tombolCetak");


// =====================================
// 4. FORMAT RUPIAH
// =====================================

function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}


// =====================================
// 5. MENAMPILKAN PRODUK
// =====================================

function tampilkanProduk() {

    daftarProduk.innerHTML = "";

    const kataKunci = cariProduk.value.toLowerCase();

    const hasil = produk.filter(item =>
        item.nama.toLowerCase().includes(kataKunci)
    );

    if (hasil.length === 0) {
        daftarProduk.textContent = "Produk tidak ditemukan.";
        return;
    }

    hasil.forEach(item => {

        const kartu = document.createElement("div");
        kartu.className = "produk-item";

        const emoji = document.createElement("div");
        emoji.className = "produk-emoji";
        emoji.textContent = item.emoji;

        const nama = document.createElement("h3");
        nama.textContent = item.nama;

        const harga = document.createElement("p");
        harga.textContent = rupiah(item.harga);

        const tombol = document.createElement("button");
        tombol.textContent = "+ Tambah";

        tombol.addEventListener("click", () => {
            tambahKeKeranjang(item.id);
        });

        kartu.append(emoji, nama, harga, tombol);
        daftarProduk.appendChild(kartu);

    });

}


// =====================================
// 6. TAMBAH PRODUK KE KERANJANG
// =====================================

function tambahKeKeranjang(id) {

    const item = produk.find(p => p.id === id);

    if (!item) return;

    const sudahAda = keranjang.find(p => p.id === id);

    if (sudahAda) {
        sudahAda.qty++;
    } else {
        keranjang.push({
            ...item,
            qty: 1
        });
    }

    tampilkanKeranjang();

}


// =====================================
// 7. MENGATUR JUMLAH BARANG
// =====================================

function ubahJumlah(id, perubahan) {

    const item = keranjang.find(p => p.id === id);

    if (!item) return;

    item.qty += perubahan;

    if (item.qty <= 0) {
        keranjang = keranjang.filter(p => p.id !== id);
    }

    tampilkanKeranjang();

}


// =====================================
// 8. MENGHITUNG TOTAL BELANJA
// =====================================

function hitungBelanja() {

    const subtotal = keranjang.reduce(
        (total, item) => total + item.harga * item.qty,
        0
    );

    const diskon = Math.min(
        subtotal,
        Math.max(0, Number(diskonInput.value) || 0)
    );

    const total = subtotal - diskon;

    const bayar = Math.max(
        0,
        Number(uangBayar.value) || 0
    );

    const kembali = Math.max(0, bayar - total);
    const kekurangan = Math.max(0, total - bayar);

    subtotalElement.textContent = rupiah(subtotal);
    totalBayarElement.textContent = rupiah(total);

    if (kekurangan > 0 && bayar > 0) {
        uangKembaliElement.textContent =
            "Kurang " + rupiah(kekurangan);
    } else {
        uangKembaliElement.textContent = rupiah(kembali);
    }

    return {
        subtotal,
        diskon,
        total,
        bayar,
        kembali
    };

}


// =====================================
// 9. MENAMPILKAN KERANJANG
// =====================================

function tampilkanKeranjang() {

    daftarKeranjang.innerHTML = "";

    if (keranjang.length === 0) {

        const baris = document.createElement("tr");
        const kolom = document.createElement("td");

        kolom.colSpan = 4;
        kolom.className = "kosong";
        kolom.textContent = "Keranjang masih kosong";

        baris.appendChild(kolom);
        daftarKeranjang.appendChild(baris);

    }

    keranjang.forEach(item => {

        const baris = document.createElement("tr");

        const nama = document.createElement("td");
        nama.textContent = item.nama;

        const harga = document.createElement("td");
        harga.textContent = rupiah(item.harga);

        const qty = document.createElement("td");
        qty.textContent = item.qty;

        const aksi = document.createElement("td");

        const kurang = document.createElement("button");
        kurang.className = "btn-kurang";
        kurang.textContent = "-";

        kurang.addEventListener("click", () => {
            ubahJumlah(item.id, -1);
        });

        const tambah = document.createElement("button");
        tambah.className = "btn-tambah";
        tambah.textContent = "+";

        tambah.addEventListener("click", () => {
            ubahJumlah(item.id, 1);
        });

        aksi.append(kurang, tambah);

        baris.append(nama, harga, qty, aksi);

        daftarKeranjang.appendChild(baris);

    });

    hitungBelanja();

}


// =====================================
// 10. DASHBOARD
// =====================================

function tampilkanDashboard() {

    const hariIni = new Date().toLocaleDateString("en-CA");

    const transaksiHariIni = riwayat.filter(item =>
        new Date(item.waktu).toLocaleDateString("en-CA") === hariIni
    );

    const omzet = transaksiHariIni.reduce(
        (total, item) => total + item.total,
        0
    );

    const barang = transaksiHariIni.reduce(
        (total, item) =>
            total + item.items.reduce(
                (jumlah, p) => jumlah + p.qty,
                0
            ),
        0
    );

    totalOmzet.textContent = rupiah(omzet);
    jumlahTransaksi.textContent = transaksiHariIni.length;
    jumlahBarang.textContent = barang;

}


// =====================================
// 11. MENYIMPAN RIWAYAT
// =====================================

function simpanRiwayat() {

    try {
        localStorage.setItem(
            "riwayatKasir",
            JSON.stringify(riwayat)
        );

        return true;

    } catch (error) {
        alert("Riwayat transaksi gagal disimpan.");
        return false;
    }

}


// =====================================
// 12. PROSES PEMBAYARAN
// =====================================

function prosesPembayaran() {

    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const hasil = hitungBelanja();

    if (hasil.bayar < hasil.total) {
        alert("Uang pelanggan belum mencukupi!");
        return;
    }

    const transaksiBaru = {

        id: "TRX-" + Date.now(),

        waktu: new Date().toISOString(),

        items: keranjang.map(item => ({
            id: item.id,
            nama: item.nama,
            harga: item.harga,
            qty: item.qty
        })),

        subtotal: hasil.subtotal,
        diskon: hasil.diskon,
        total: hasil.total,
        bayar: hasil.bayar,
        kembali: hasil.kembali

    };

    riwayat.unshift(transaksiBaru);

    if (!simpanRiwayat()) {
        riwayat.shift();
        return;
    }

    buatStruk(transaksiBaru);

    keranjang = [];
    diskonInput.value = 0;
    uangBayar.value = "";

    tampilkanKeranjang();
    tampilkanRiwayat();
    tampilkanDashboard();

    alert("Pembayaran berhasil!");

    areaStruk.hidden = false;

}


// =====================================
// 13. MEMBUAT STRUK
// =====================================

function buatStruk(data) {

    const waktu = new Date(data.waktu).toLocaleString("id-ID");

    const struk = document.createElement("div");
    struk.className = "struk-kertas";

    const judul = document.createElement("h3");
    judul.textContent = "KASIR PINTAR";

    const subjudul = document.createElement("p");
    subjudul.className = "tengah";
    subjudul.textContent = "Bukti Pembayaran";

    const nomor = document.createElement("p");
    nomor.textContent = "No: " + data.id;

    const tanggal = document.createElement("p");
    tanggal.textContent = "Tanggal: " + waktu;

    const garis1 = document.createElement("div");
    garis1.className = "garis";

    struk.append(judul, subjudul, nomor, tanggal, garis1);

    data.items.forEach(item => {

        const baris = document.createElement("p");

        baris.textContent =
            item.nama + " x " + item.qty +
            " = " + rupiah(item.harga * item.qty);

        struk.appendChild(baris);

    });

    const garis2 = document.createElement("div");
    garis2.className = "garis";

    const subtotal = document.createElement("p");
    subtotal.textContent = "Subtotal: " + rupiah(data.subtotal);

    const diskon = document.createElement("p");
    diskon.textContent = "Diskon: " + rupiah(data.diskon);

    const total = document.createElement("h3");
    total.textContent = "TOTAL: " + rupiah(data.total);

    const bayar = document.createElement("p");
    bayar.textContent = "Bayar: " + rupiah(data.bayar);

    const kembali = document.createElement("p");
    kembali.textContent = "Kembalian: " + rupiah(data.kembali);

    const garis3 = document.createElement("div");
    garis3.className = "garis";

    const terimaKasih = document.createElement("p");
    terimaKasih.className = "tengah";
    terimaKasih.textContent = "Terima kasih sudah berbelanja!";

    struk.append(
        garis2,
        subtotal,
        diskon,
        total,
        bayar,
        kembali,
        garis3,
        terimaKasih
    );

    isiStruk.replaceChildren(struk);

}


// =====================================
// 14. RIWAYAT TRANSAKSI
// =====================================

function tampilkanRiwayat() {

    riwayatTransaksi.innerHTML = "";

    if (riwayat.length === 0) {

        const baris = document.createElement("tr");
        const kolom = document.createElement("td");

        kolom.colSpan = 5;
        kolom.className = "kosong";
        kolom.textContent = "Belum ada transaksi";

        baris.appendChild(kolom);
        riwayatTransaksi.appendChild(baris);

    }

    riwayat.slice(0, 20).forEach(item => {

        const baris = document.createElement("tr");

        const data = [
            item.id,
            new Date(item.waktu).toLocaleString("id-ID"),
            rupiah(item.total),
            rupiah(item.bayar),
            rupiah(item.kembali)
        ];

        data.forEach(teks => {

            const kolom = document.createElement("td");
            kolom.textContent = teks;
            baris.appendChild(kolom);

        });

        riwayatTransaksi.appendChild(baris);

    });

}


// =====================================
// 15. KOSONGKAN KERANJANG
// =====================================

tombolKosongkan.addEventListener("click", function() {

    if (keranjang.length === 0) return;

    const yakin = confirm(
        "Kosongkan semua barang dari keranjang?"
    );

    if (!yakin) return;

    keranjang = [];

    tampilkanKeranjang();

});


// =====================================
// 16. EVENT LISTENER
// =====================================

cariProduk.addEventListener("input", tampilkanProduk);

diskonInput.addEventListener("input", hitungBelanja);

uangBayar.addEventListener("input", hitungBelanja);

tombolBayar.addEventListener("click", prosesPembayaran);

tombolCetak.addEventListener("click", function() {
    window.print();
});


// =====================================
// 17. TANGGAL DAN JALANKAN APLIKASI
// =====================================

document.getElementById("tanggalHari").textContent =
    new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

tampilkanProduk();
tampilkanKeranjang();
tampilkanRiwayat();
tampilkanDashboard();

console.log("Aplikasi Kasir Pintar berhasil dijalankan!");


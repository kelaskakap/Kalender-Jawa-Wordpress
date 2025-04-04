document.addEventListener("DOMContentLoaded", function ()
{
    // Pindahkan deklarasi ke sini agar bisa diakses semua fungsi
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    let bulanSekarang = new Date().getMonth();
    let tahunSekarang = new Date().getFullYear();
    let isTahunView = false; // Flag untuk status tampilan

    // Fungsi untuk toggle tampilan
    function toggleView()
    {
        document.getElementById('kalender-bulanan').style.display = isTahunView ? 'none' : 'block';
        document.getElementById('kalender-tahunan').style.display = isTahunView ? 'block' : 'none';
    }

    function tampilkanKalender(bulan, tahun, targetId)
    {
        // 1. Perbaikan: Gunakan parameter targetId untuk mencari kalender-body
        const kalenderBody = document.getElementById(targetId);
        if (!kalenderBody) {
            console.error("Element kalender-body tidak ditemukan!");
            return;
        }

        // 2. Perbaikan: Pindah ke bulan dan tahun yang sesuai di judul
        const judulElement = document.getElementById("judul-bulan");
        if (judulElement) {
            judulElement.innerText = `${namaBulan[bulan]} ${tahun}`;
        }

        const firstDay = new Date(tahun, bulan, 1).getDay(); // Hari pertama bulan (0 = Minggu)
        const daysInMonth = new Date(tahun, bulan + 1, 0).getDate(); // Jumlah hari

        kalenderBody.innerHTML = ""; // Reset kalender
        let row = document.createElement("tr");

        // 3. Perbaikan: Isi sel kosong untuk hari sebelum tanggal 1
        for (let i = 0; i < firstDay; i++) {
            row.appendChild(document.createElement("td"));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const { tanggalJawa, pasaranJawa } = konversiKeJawa(tahun, bulan, day);
            const cell = document.createElement("td");
            cell.innerHTML = `
                <div>${day}</div>
                <div class="jawa">${tanggalJawa} ${pasaranJawa}</div>
            `;
            row.appendChild(cell);

            // 4. Perbaikan: Buat baris baru tiap Sabtu (hari ke-6)
            if ((firstDay + day) % 7 === 0) {
                kalenderBody.appendChild(row);
                row = document.createElement("tr");
            }
        }

        // Tambahkan baris terakhir jika belum selesai
        if (row.children.length > 0) {
            kalenderBody.appendChild(row);
        }
    }

    window.tampilkanTahun = function ()
    {
        isTahunView = true;
        toggleView();

        const container = document.getElementById("tahun-container");
        container.innerHTML = '';

        for (let i = 0; i < 12; i++) {
            const bulanContainer = document.createElement("div");
            bulanContainer.className = "bulan-container";

            // Header bulan
            bulanContainer.innerHTML = `
                <h4>${namaBulan[i]} ${tahunSekarang}</h4>
                <table class="bulan-table">
                    <thead>
                        <tr>
                            <th>Ah</th><th>Sn</th><th>Sl</th>
                            <th>Rb</th><th>Km</th><th>Jm</th><th>Sb</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `;

            const tbody = bulanContainer.querySelector("tbody");

            // Generate calendar
            const firstDay = new Date(tahunSekarang, i, 1).getDay();
            const daysInMonth = new Date(tahunSekarang, i + 1, 0).getDate();

            let row = document.createElement("tr");
            let dayCounter = 0;

            // Isi hari kosong awal
            for (let j = 0; j < firstDay; j++) {
                row.appendChild(document.createElement("td"));
                dayCounter++;
            }

            // Isi tanggal
            for (let day = 1; day <= daysInMonth; day++) {
                const { tanggalJawa, pasaranJawa } = konversiKeJawa(tahunSekarang, i, day);
                const cell = document.createElement("td");
                cell.innerHTML = `
                    <div class="greg">${day}</div>
                    <div class="jawa">${tanggalJawa} ${pasaranJawa}</div>
                `;
                row.appendChild(cell);
                dayCounter++;

                if (dayCounter === 7) {
                    tbody.appendChild(row);
                    row = document.createElement("tr");
                    dayCounter = 0;
                }
            }

            // Tambahkan baris terakhir jika belum lengkap
            if (dayCounter > 0) {
                while (dayCounter < 7) {
                    row.appendChild(document.createElement("td"));
                    dayCounter++;
                }
                tbody.appendChild(row);
            }

            container.appendChild(bulanContainer);
        }
    };

    window.tutupTampilanTahun = function ()
    {
        isTahunView = false;
        toggleView();
    };

    // Modifikasi fungsi ubahBulan
    window.ubahBulan = function (offset)
    {
        if (isTahunView) return; // Ignore jika dalam tampilan tahun

        bulanSekarang += offset;
        // ... logika perubahan bulan
        tampilkanKalender(bulanSekarang, tahunSekarang, 'kalender-body');
    };

    // Inisialisasi pertama
    tampilkanKalender(bulanSekarang, tahunSekarang, 'kalender-body');

    /**
     * DeepSeek
     * Tanggal berdasar UTC
     * @param {*} tahun 
     * @param {*} bulan 
     * @param {*} tanggal 
     * @returns 
     */
    function konversiKeJawa(tahun, bulan, tanggal)
    {
        // Gunakan UTC untuk menghindari masalah zona waktu
        const refDate = new Date(Date.UTC(1633, 6, 8)); // 8 Juli 1633 UTC (Legi, 1 Sura 1555)
        const targetDate = new Date(Date.UTC(tahun, bulan, tanggal));
        const selisihHari = Math.floor((targetDate - refDate) / (1000 * 60 * 60 * 24));

        const siklusPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
        const siklusWuku = ["Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", "Warigalit", "Warigagung",
            "Julungwangi", "Sungsang", "Galungan", "Kuningan", "Langkir", "Mandhasiya", "Julungpujut",
            "Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat",
            "Bala", "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung"];

        // Perbaikan 1: Hitung tanggal Jawa (1-30)
        let tanggalJawa = ((selisihHari % 30) + 30) % 30 + 1;

        // Pasaran tetap benar
        let pasaranJawa = siklusPasaran[((selisihHari % 5) + 5) % 5];

        // Perbaikan 2: Hitung indeks Wuku dengan benar
        let wukuIndex = Math.floor(selisihHari / 7) % 30;
        wukuIndex = (wukuIndex + 30) % 30; // Pastikan indeks positif
        let wukuJawa = siklusWuku[wukuIndex];

        return { tanggalJawa, pasaranJawa, wukuJawa };
    }

    /**
     * DeepSeek
     * Tanggal berdasar waktu local browser (di tempatku utc+7)
     * @param {*} tahun 
     * @param {*} bulan 
     * @param {*} tanggal 
     * @returns 
     */
    function _konversiKeJawa(tahun, bulan, tanggal) {
        // 1. Atur tanggal referensi dalam WIB (UTC+7)
        const refDate = new Date(1633, 6, 8); // 8 Juli 1633 WIB
        refDate.setHours(0, 0, 0, 0); // Pastikan jam 00:00 WIB
        
        // 2. Tanggal target dalam WIB
        const targetDate = new Date(tahun, bulan, tanggal);
        targetDate.setHours(0, 0, 0, 0); // Pastikan jam 00:00 WIB
        
        // 3. Hitung selisih hari dengan penyesuaian zona waktu
        const selisihHari = Math.floor(
            (targetDate.getTime() - refDate.getTime()) / 
            (1000 * 60 * 60 * 24)
        );
        
        // 4. Data kalender Jawa
        const siklusPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
        const siklusWuku = ["Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", 
                           "Warigalit", "Warigagung", "Julungwangi", "Sungsang", 
                           "Galungan", "Kuningan", "Langkir", "Mandhasiya", "Julungpujut", 
                           "Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan", 
                           "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala", "Wugu", 
                           "Wayang", "Kulawu", "Dukut", "Watugunung"];
        
        // 5. Hitung komponen kalender Jawa
        const tanggalJawa = ((selisihHari % 30) + 30) % 30 + 1;
        const pasaranJawa = siklusPasaran[((selisihHari % 5) + 5) % 5];
        const wukuJawa = siklusWuku[Math.floor(selisihHari / 7) % 30];
    
        return { tanggalJawa, pasaranJawa, wukuJawa };
    }
});

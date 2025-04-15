(function ()
{
    document.addEventListener("DOMContentLoaded", function ()
    {
        const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        let bulanSekarang = new Date().getMonth();
        let tahunSekarang = new Date().getFullYear();
        let isTahunView = false;

        const dom = {
            bulanBodyId: 'kalender-body',
            tahunContainerId: 'tahun-container',
            judulId: 'judul-bulan',
            bulananId: 'kalender-bulanan',
            tahunanId: 'kalender-tahunan',
        };

        function toggleView()
        {
            document.getElementById(dom.bulananId).style.display = isTahunView ? 'none' : 'block';
            document.getElementById(dom.tahunanId).style.display = isTahunView ? 'block' : 'none';
        }

        function tampilkanKalender(bulan, tahun, targetId)
        {
            const kalenderBody = document.getElementById(targetId);
            if (!kalenderBody) return;

            const judulElement = document.getElementById(dom.judulId);
            if (judulElement) {
                judulElement.innerText = `${namaBulan[bulan]} ${tahun}`;
            }

            const firstDay = new Date(tahun, bulan, 1).getDay();
            const daysInMonth = new Date(tahun, bulan + 1, 0).getDate();

            kalenderBody.innerHTML = "";
            let row = document.createElement("tr");

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

                if ((firstDay + day) % 7 === 0) {
                    kalenderBody.appendChild(row);
                    row = document.createElement("tr");
                }
            }

            if (row.children.length > 0) {
                kalenderBody.appendChild(row);
            }
        }

        function tampilkanTahun()
        {
            isTahunView = true;
            toggleView();

            const container = document.getElementById(dom.tahunContainerId);
            container.innerHTML = '';

            for (let i = 0; i < 12; i++) {
                const bulanContainer = document.createElement("div");
                bulanContainer.className = "bulan-container";

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
                const firstDay = new Date(tahunSekarang, i, 1).getDay();
                const daysInMonth = new Date(tahunSekarang, i + 1, 0).getDate();

                let row = document.createElement("tr");
                let dayCounter = 0;

                for (let j = 0; j < firstDay; j++) {
                    row.appendChild(document.createElement("td"));
                    dayCounter++;
                }

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

                if (dayCounter > 0) {
                    while (dayCounter < 7) {
                        row.appendChild(document.createElement("td"));
                        dayCounter++;
                    }
                    tbody.appendChild(row);
                }

                container.appendChild(bulanContainer);
            }
        }

        function tutupTampilanTahun()
        {
            isTahunView = false;
            toggleView();
        }

        function ubahBulan(offset)
        {
            if (isTahunView) return;
            bulanSekarang += offset;
            if (bulanSekarang > 11) {
                bulanSekarang = 0;
                tahunSekarang++;
            } else if (bulanSekarang < 0) {
                bulanSekarang = 11;
                tahunSekarang--;
            }
            tampilkanKalender(bulanSekarang, tahunSekarang, dom.bulanBodyId);
        }

        function konversiKeJawa(tahun, bulan, tanggal)
        {
            const refDate = new Date(Date.UTC(1633, 6, 8));
            const targetDate = new Date(Date.UTC(tahun, bulan, tanggal));
            const selisihHari = Math.floor((targetDate - refDate) / (1000 * 60 * 60 * 24));

            const siklusPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
            const siklusWuku = ["Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", "Warigalit", "Warigagung",
                "Julungwangi", "Sungsang", "Galungan", "Kuningan", "Langkir", "Mandhasiya", "Julungpujut",
                "Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat",
                "Bala", "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung"];

            let tanggalJawa = ((selisihHari % 30) + 30) % 30 + 1;
            let pasaranJawa = siklusPasaran[((selisihHari % 5) + 5) % 5];
            let wukuIndex = Math.floor(selisihHari / 7) % 30;
            wukuIndex = (wukuIndex + 30) % 30;
            let wukuJawa = siklusWuku[wukuIndex];

            return { tanggalJawa, pasaranJawa, wukuJawa };
        }

        // Expose public methods in safe namespace
        window.KalenderJawa = {
            tampilkanTahun,
            tutupTampilanTahun,
            ubahBulan
        };

        // Inisialisasi awal
        tampilkanKalender(bulanSekarang, tahunSekarang, dom.bulanBodyId);
    });
})();

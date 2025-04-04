<?php
/*
Plugin Name: Kalender Jawa
Plugin URI:  https://kiosmerdeka.net
Description: Plugin untuk menampilkan Kalender Jawa dengan navigasi bulan dan tahun.
Version:     1.0
Author:      kelaskakap
Author URI:  https://kelaskakap.com
License:     GPL2
*/

// Mencegah akses langsung ke file
if (!defined('ABSPATH'))
{
    exit;
}

// Registrasi shortcode [kalenderjawa]
function kalender_jawa_shortcode()
{
    ob_start();
?>
    <div id="kalender-jawa-container">
        <!-- Tampilan Bulanan -->
        <div id="kalender-bulanan">
            <div class="nav">
                <button onclick="ubahBulan(-1)">« Sebelumnya</button>
                <span id="judul-bulan"></span>
                <button onclick="ubahBulan(1)">Berikutnya »</button>
            </div>
            <table class="kalender-table">
                <thead>
                    <tr>
                        <th>Ahad</th>
                        <th>Senin</th>
                        <th>Selasa</th>
                        <th>Rabu</th>
                        <th>Kamis</th>
                        <th>Jumat</th>
                        <th>Sabtu</th>
                    </tr>
                </thead>
                <tbody id="kalender-body"></tbody>
            </table>
        </div>

        <!-- Tampilan Tahunan -->
        <div id="kalender-tahunan" style="display:none;">
            <button id="kembali-bulanan" onclick="tutupTampilanTahun()">← Kembali ke Tampilan Bulanan</button>
            <div id="tahun-container"></div>
        </div>

        <button id="lihat-setahun" onclick="tampilkanTahun()">📅 Lihat Kalender 1 Tahun</button>
    </div>
<?php
    return ob_get_clean();
}
add_shortcode('kalenderjawa', 'kalender_jawa_shortcode');

// Tambahkan CSS dan JavaScript
function kalender_jawa_scripts()
{
    wp_enqueue_style('kalender-jawa-style', plugin_dir_url(__FILE__) . 'style.css');
    wp_enqueue_script('kalender-jawa-script', plugin_dir_url(__FILE__) . 'script.js', array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'kalender_jawa_scripts');
?>
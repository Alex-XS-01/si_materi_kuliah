<?php
session_start();
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $kode = $_POST['kode'];
    if ($kode == $_SESSION['kode_verifikasi']) {
        // Lanjut ke reset sandi
        echo "Kode benar. Masukkan sandi baru: 
              <form method='POST' action='update_password.php'>
                  <input type='password' name='new_sandi' required>
                  <button type='submit'>Update</button>
              </form>";
    } else {
        echo "Kode salah.";
    }
}
?>
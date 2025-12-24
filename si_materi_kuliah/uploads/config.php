<?php
$servername = "localhost";
$username = "root";  // Default XAMPP
$password = "";      // Default XAMPP

// Koneksi ke biodata_akademik untuk profil
$conn_biodata = new mysqli($servername, $username, $password, "biodata_akademik");
if ($conn_biodata->connect_error) {
    die("Connection failed: " . $conn_biodata->connect_error);
}

// Koneksi ke si_materi_kuliah untuk materi
$conn_materi = new mysqli($servername, $username, $password, "si_materi_kuliah");
if ($conn_materi->connect_error) {
    die("Connection failed: " . $conn_materi->connect_error);
}
?>
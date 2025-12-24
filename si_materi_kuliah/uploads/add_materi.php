<?php
session_start();
include 'config.php';

if ($_SESSION['user_type'] != 'dosen') {
    header("Location: index.php");
    exit();
}

$program_studi = $_POST['program_studi'];
$semester = $_POST['semester'];
$bab = $_POST['bab'];
$sub_bab = $_POST['sub_bab'];

$target_dir = __DIR__ . "/uploads/";  // Pastikan __DIR__ sekarang di root setelah pindah script

// Sanitasi nama file
$file_name = basename($_FILES["file"]["name"]);
$file_name = preg_replace("/[^a-zA-Z0-9\.\-_]/", "_", $file_name);  // Ganti spasi/karakter aneh jadi underscore
$target_file = $target_dir . $file_name;

// Buat direktori jika tidak ada
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

// Debug sementara (komentari setelah tes)
// echo "Target dir: " . $target_dir . "<br>";
// echo "File exists? " . (file_exists($target_dir) ? "Yes" : "No") . "<br>";

if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    // Gunakan $file_name yang sanitized di SQL
    $sql = "INSERT INTO materi (program_studi, semester, bab, sub_bab, file_path) VALUES ('$program_studi', $semester, '$bab', '$sub_bab', '$file_name')";
    $conn_materi->query($sql);
    header("Location: index.php");
    exit();  // Pastikan exit setelah header
} else {
    echo "Gagal upload file. Cek permission atau path.";
}
?>
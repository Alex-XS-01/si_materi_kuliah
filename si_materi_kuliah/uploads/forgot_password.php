<?php
session_start();
include 'config.php';

$type = $_POST['type'] ?? '';  // Tambah pilihan mahasiswa/dosen seperti login
$identifier = $_POST[$type == 'mahasiswa' ? 'npm' : 'nidn'] ?? '';
$nama = $_POST['nama'] ?? '';

if ($_SERVER["REQUEST_METHOD"] == "POST" && $identifier && $nama) {
    // Cek user ada atau tidak
    $table = $type;
    $id_field = $type == 'mahasiswa' ? 'npm' : 'nidn';
    $sql = "SELECT * FROM $table WHERE nama = '$nama' AND $id_field = '$identifier'";
    $result = $conn_biodata->query($sql);
    
    if ($result->num_rows > 0) {
        // Generate kode acak: angka, huruf, simbol
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
        $kode = substr(str_shuffle($characters), 0, 8);  // 8 karakter acak

        // Simpan di session
        $_SESSION['kode_verifikasi'] = $kode;
        $_SESSION['user_type'] = $type;
        $_SESSION['identifier'] = $identifier;
        $_SESSION['nama'] = $nama;

        // Tampilkan kode langsung di website (bukan email)
        echo "<p>Kode verifikasi Anda: <strong>$kode</strong></p>";
        echo "<p>Copy kode ini dan masukkan di form verifikasi di bawah.</p>";
    } else {
        echo "User tidak ditemukan.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Lupa Sandi</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h2>Pilih Role untuk Lupa Sandi</h2>
    <button onclick="document.getElementById('mahasiswa').style.display='block'; document.getElementById('dosen').style.display='none';">Mahasiswa</button>
    <button onclick="document.getElementById('dosen').style.display='block'; document.getElementById('mahasiswa').style.display='none';">Dosen</button>

    <form id="mahasiswa" style="display: none;" method="POST">
        <input type="hidden" name="type" value="mahasiswa">
        <input type="text" name="nama" placeholder="Nama" required>
        <input type="text" name="npm" placeholder="NPM" required>
        <button type="submit">Generate Kode Verifikasi</button>
    </form>

    <form id="dosen" style="display: none;" method="POST">
        <input type="hidden" name="type" value="dosen">
        <input type="text" name="nama" placeholder="Nama" required>
        <input type="text" name="nidn" placeholder="NIDN" required>
        <button type="submit">Generate Kode Verifikasi</button>
    </form>

    <?php if (isset($_SESSION['kode_verifikasi'])) { ?>
        <form method="POST" action="reset_password.php">
            <input type="text" name="kode" placeholder="Masukkan Kode Verifikasi" required>
            <button type="submit">Verifikasi</button>
        </form>
    <?php } ?>
</body>
</html>
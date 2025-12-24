<?php
session_start();
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $type = $_POST['type'];
    $nama = $_POST['nama'];
    $identifier = $_POST[$type == 'mahasiswa' ? 'npm' : 'nidn'];
    $sandi = $_POST['sandi'];

    $table = $type;
    $id_field = $type == 'mahasiswa' ? 'npm' : 'nidn';
    $sql = "SELECT * FROM $table WHERE nama = '$nama' AND $id_field = '$identifier'";
    $result = $conn_biodata->query($sql);
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($sandi, $user['sandi'])) {
            $_SESSION['user_type'] = $type;
            $_SESSION['user_id'] = $user['id'];
            header("Location: index.php");
            exit();
        } else {
            echo "Password salah.";
        }
    } else {
        echo "User tidak ditemukan.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h2>Pilih Role</h2>
    <button onclick="document.getElementById('mahasiswa').style.display='block'; document.getElementById('dosen').style.display='none';">Mahasiswa</button>
    <button onclick="document.getElementById('dosen').style.display='block'; document.getElementById('mahasiswa').style.display='none';">Dosen</button>

    <form id="mahasiswa" style="display: none;" method="POST">
        <input type="hidden" name="type" value="mahasiswa">
        <input type="text" name="nama" placeholder="Nama" required>
        <input type="text" name="npm" placeholder="NPM" required>
        <input type="password" name="sandi" placeholder="Sandi" required>
        <button type="submit">Login</button>
    </form>

    <form id="dosen" style="display: none;" method="POST">
        <input type="hidden" name="type" value="dosen">
        <input type="text" name="nama" placeholder="Nama" required>
        <input type="text" name="nidn" placeholder="NIDN" required>
        <input type="password" name="sandi" placeholder="Sandi" required>
        <button type="submit">Login</button>
    </form>

    <a href="forgot_password.php">Lupa Sandi?</a>
</body>
</html>
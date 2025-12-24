<?php
session_start();
include 'config.php';

$type = $_SESSION['user_type'];
$identifier = $_SESSION['identifier'];
$nama = $_SESSION['nama'];
$new_sandi = password_hash($_POST['new_sandi'], PASSWORD_BCRYPT);  // Eksplisit bcrypt

$table = $type;
$id_field = $type == 'mahasiswa' ? 'npm' : 'nidn';
$sql = "UPDATE $table SET sandi = '$new_sandi' WHERE nama = '$nama' AND $id_field = '$identifier'";
$conn_biodata->query($sql);

unset($_SESSION['kode_verifikasi']);
unset($_SESSION['user_type']);
unset($_SESSION['identifier']);
unset($_SESSION['nama']);

header("Location: login.php");
?>
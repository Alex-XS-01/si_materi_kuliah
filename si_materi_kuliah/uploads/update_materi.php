<?php
session_start();
include 'config.php';

if ($_SESSION['user_type'] != 'dosen') exit();

$id = $_POST['id'];
$program_studi = $_POST['program_studi'];
$semester = $_POST['semester'];
$bab = $_POST['bab'];
$sub_bab = $_POST['sub_bab'];

$sql = "UPDATE materi SET program_studi='$program_studi', semester=$semester, bab='$bab', sub_bab='$sub_bab' WHERE id=$id";
$conn_materi->query($sql);

if ($_FILES["file"]["name"]) {
    $target_file = "uploads/" . basename($_FILES["file"]["name"]);
    move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
    $sql = "UPDATE materi SET file_path='".basename($_FILES["file"]["name"])."' WHERE id=$id";
    $conn_materi->query($sql);
}

header("Location: index.php");
?>
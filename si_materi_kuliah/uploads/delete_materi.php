<?php
session_start();
include 'config.php';

if ($_SESSION['user_type'] != 'dosen') exit();

$id = $_GET['id'];
$sql = "DELETE FROM materi WHERE id = $id";
$conn_materi->query($sql);
header("Location: index.php");
?>
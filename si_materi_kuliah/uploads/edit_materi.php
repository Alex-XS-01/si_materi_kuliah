<?php
session_start();
include 'config.php';

if ($_SESSION['user_type'] != 'dosen') {
    header("Location: index.php");
    exit();
}

$id = $_GET['id'];
$sql = "SELECT * FROM materi WHERE id = $id";
$result = $conn_materi->query($sql);
$materi = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Edit Materi</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <form method="POST" action="update_materi.php" enctype="multipart/form-data">
        <input type="hidden" name="id" value="<?php echo $id; ?>">
        <select name="program_studi" required>
            <option value="<?php echo $materi['program_studi']; ?>"><?php echo $materi['program_studi']; ?></option>
            <!-- Opsi lain seperti add -->
        </select>
        <select name="semester" required>
            <option value="<?php echo $materi['semester']; ?>"><?php echo $materi['semester']; ?></option>
            <!-- Opsi 1-8 -->
        </select>
        <input type="text" name="bab" value="<?php echo $materi['bab']; ?>" required>
        <input type="text" name="sub_bab" value="<?php echo $materi['sub_bab']; ?>" required>
        <input type="file" name="file">  <!-- Opsional, jika ganti file -->
        <button type="submit">Update</button>
    </form>
</body>
</html>
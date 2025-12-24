<?php
include 'config.php';

$program_studi = $_GET['program_studi'] ?? '';
$semester = $_GET['semester'] ?? '';
$bab = $_GET['bab'] ?? '';
$sub_bab = $_GET['sub_bab'] ?? '';

$where = "WHERE 1=1";
if ($program_studi) $where .= " AND program_studi = '$program_studi'";
if ($semester) $where .= " AND semester = $semester";
if ($bab) $where .= " AND bab LIKE '%$bab%'";
if ($sub_bab) $where .= " AND sub_bab LIKE '%$sub_bab%'";

$sql = "SELECT * FROM materi $where";
$result = $conn_materi->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Hasil Pencarian</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h2>Hasil Pencarian</h2>
    <?php while($row = $result->fetch_assoc()) { ?>
        <div>
            <p><?php echo $row['program_studi'] . ' - Semester ' . $row['semester'] . ' - Bab: ' . $row['bab'] . ' - Sub-bab: ' . $row['sub_bab']; ?></p>
            <a href="uploads/<?php echo $row['file_path']; ?>" download>Unduh Materi</a>
            <?php if (isset($_SESSION['user_type']) && $_SESSION['user_type'] == 'dosen') { ?>
                <a href="edit_materi.php?id=<?php echo $row['id']; ?>">Edit</a>
                <a href="delete_materi.php?id=<?php echo $row['id']; ?>">Hapus</a>
            <?php } ?>
        </div>
    <?php } ?>
</body>
</html>
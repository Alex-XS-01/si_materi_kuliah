<?php
session_start();
include 'config.php';

if (!isset($_SESSION['user_type'])) {
    header("Location: login.php");
    exit();
}

$user_type = $_SESSION['user_type'];
$user_id = $_SESSION['user_id'];

// Ambil data profil dari biodata_akademik
if ($user_type == 'mahasiswa') {
    $sql = "SELECT * FROM mahasiswa WHERE id = $user_id";
    $result = $conn_biodata->query($sql);
    $user = $result->fetch_assoc();
} else {
    $sql = "SELECT * FROM dosen WHERE id = $user_id";
    $result = $conn_biodata->query($sql);
    $user = $result->fetch_assoc();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <div class="profile">
            <img src="uploads/<?php echo $user['foto']; ?>" alt="Profile">
            <div>
                <h3><?php echo $user['nama']; ?></h3>
                <p><?php echo $user['institusi']; ?></p>
                <?php if ($user_type == 'mahasiswa') { ?>
                    <p>Sesi Belajar: <?php echo $user['sesi_belajar']; ?></p>
                    <p>Program Studi: <?php echo $user['program_studi']; ?></p>
                    <p>Pembimbing: <?php echo $user['pembimbing_akademik']; ?></p>
                <?php } ?>
            </div>
        </div>
        <nav>
            <a href="logout.php">Logout</a> |
            <a href="#about">About Us</a> |
            <a href="#contact">Contact Us</a>
        </nav>
    </header>

    <div class="search-bar">
        <form method="GET" action="search.php">
            <select name="program_studi">
                <option value="">Pilih Program Studi</option>
                <option value="Informatika">Informatika</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
                <option value="Bisnis Digital">Bisnis Digital</option>
            </select>
            <select name="semester">
                <option value="">Pilih Semester</option>
                <?php for ($i=1; $i<=8; $i++) { echo "<option value='$i'>$i</option>"; } ?>
            </select>
            <input type="text" name="bab" placeholder="Bab">
            <input type="text" name="sub_bab" placeholder="Sub-bab">
            <button type="submit">Cari Materi</button>
        </form>
    </div>

    <?php if ($user_type == 'dosen') { ?>
        <div class="admin-only" style="display: block;">
            <h2>Kelola Materi</h2>
            <form method="POST" action="add_materi.php" enctype="multipart/form-data">
                <select name="program_studi" required>
                    <option value="Informatika">Informatika</option>
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Bisnis Digital">Bisnis Digital</option>
                </select>
                <select name="semester" required>
                    <?php for ($i=1; $i<=8; $i++) { echo "<option value='$i'>$i</option>"; } ?>
                </select>
                <input type="text" name="bab" placeholder="Bab" required>
                <input type="text" name="sub_bab" placeholder="Sub-bab" required>
                <input type="file" name="file" required>
                <button type="submit">Tambah Materi</button>
            </form>
        </div>
    <?php } ?>

    <section id="about">
        <h2>About Us</h2>
        <p>Tujuan pembuatan website ini adalah untuk memfasilitasi mahasiswa dan dosen dalam mengakses, mengelola, dan berbagi materi kuliah secara efisien, sehingga meningkatkan kualitas pembelajaran di institusi pendidikan.</p>
    </section>

    <section id="contact">
        <h2>Contact Us</h2>
        <p>Nomor Telepon: +62 123-456-7890</p>
    </section>
</body>
</html>
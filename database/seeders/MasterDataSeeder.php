<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        // 1. CCOW
        $ccows = [
            'PT Juloi Coal', 'PT Kalteng Coal', 'PT Lahai Coal',
            'PT Maruwai Coal', 'PT Ratah Coal', 'PT Sumber Barito Coal'
        ];
        foreach ($ccows as $item) {
            DB::table('m_ccows')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 2. SHIFT KERJA
        $shifts = ['Siang', 'Malam'];
        foreach ($shifts as $item) {
            DB::table('m_shifts')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 3. INTERVAL WAKTU
        $interval_times = [
            '06.01 - 09.00', '09.01 - 12.00', '12.01 - 15.00',
            '15.01 - 18.00', '18.01 - 21.00', '21.01 - 00.00',
            '00.01 - 03.00', '03.01 - 06.00'
        ];
        foreach ($interval_times as $item) {
            DB::table('m_interval_times')->updateOrInsert(
                ['label' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 4. HARI
        $days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        foreach ($days as $item) {
            DB::table('m_days')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 5. ROSTER KERJA
        $rosters = ['5/2', '8/2', '10/2'];
        foreach ($rosters as $item) {
            DB::table('m_rosters')->updateOrInsert(
                ['pattern' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 6. JENIS KELAMIN
        $genders = ['Pria', 'Wanita', 'N/A'];
        foreach ($genders as $item) {
            DB::table('m_genders')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 7. INTERVAL UMUR
        $interval_ages = [
            '18 s/d < 20', '>= 20 s/d < 25', '>= 25 s/d < 30', '>= 30 s/d < 35',
            '>= 35 s/d < 40', '>= 40 s/d < 45', '>= 45 s/d < 50', '>= 50 s/d < 55', '>= 55'
        ];
        foreach ($interval_ages as $item) {
            DB::table('m_interval_ages')->updateOrInsert(
                ['label' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 8. INTERVAL PENGALAMAN KERJA
        $interval_experiences = [
            '< 1 Tahun', '>1 - 2 Tahun', '> 2 - 5 Tahun', '>5 - 10 Tahun', '> 10 Tahun'
        ];
        foreach ($interval_experiences as $item) {
            DB::table('m_interval_experiences')->updateOrInsert(
                ['label' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 9. KRITERIA INSIDEN
        $kriterias = ['HPRI', 'Non HPRI', 'Minor', 'Mayor', 'Kritikal'];
        foreach ($kriterias as $item) {
            DB::table('m_kriterias')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 10. JENIS LAPORAN
        $report_types = ['LPKS', 'LPKL'];
        foreach ($report_types as $item) {
            DB::table('m_report_types')->updateOrInsert(
                ['code' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 11. STATUS LAPORAN
        $statuses = ['Closed', 'Closed Overdue', 'Open', 'Overdue'];
        foreach ($statuses as $item) {
            DB::table('m_statuses')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 12. JENIS REKOMENDASI
        $recs = ['Eliminasi', 'Substitusi', 'Rekayasa', 'Administrasi', 'Praktek Kerja', 'Alat Pelindung Diri'];
        foreach ($recs as $item) {
            DB::table('m_recommendations')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 13. LOKASI UMUM
        $locations = [
            'PT MARUWAI COAL', 'BABALT CRUSHER', 'BLE PORT TUHUP - 1', 'BLE PORT TUHUP - 2',
            'BYPASS KM 27-35', 'BYPASS KM 38', 'CAMP HAJU', 'CAMP KMDG', 'CAMP LAMA TUHUP',
            'CAMP LNF LAMPUNUT', 'CAMP PPA', 'CAMP PROJECT', 'CAMP SIS TUHUP', 'CAMP TRV TUHUP',
            'CAMP VILLAGE LAMPUNUT', 'CHPP 1', 'CHPP 2', 'CSA HAULING/FO', 'CSA HAJU', 'CSA KMDG',
            'CSA PIT', 'ERT BLC TUHUP', 'ERT B13', 'ERT B14', 'ERT B18', 'ERT STATION B12',
            'EXPLORATION AREA', 'FABRICATION SHOP SIS', 'FRONT OFFICE', 'FUEL TANK LAMPUNUT',
            'FUEL TANK PORT TUHUP', 'JALAN TAMBANG', 'JEMBATAN BABAO', 'JETTY FUEL PORT',
            'KANTOR AMC HAJU', 'KANTOR EKSPLORASI', 'KLINIK HAJU', 'ROM PRODUCT CHPP 1'
        ];
        foreach ($locations as $item) {
            DB::table('m_location_generals')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 14. POSISI / JABATAN (Table: m_jabatan, Column: name)
        $positions = [
            'KTT', 'Chief / Cook', 'Dept. Head/Kepala bagian', 'Driver', 'Engineer',
            'Field Assistant / Crew', 'Group Leader / Foreman / Coordinator', 'Helper', 'Mekanik',
            'N/A', 'Operator', 'Penanggung Jawab Operasional (PJO)', 'Sect. Head/Kepala Seksi',
            'Security', 'Specialist', 'Superintendent', 'Supervisor / Unit Head', 'Teknisi'
        ];
        foreach ($positions as $item) {
            DB::table('m_jabatan')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 15. DEPARTEMEN (Table: m_department, Column: name)
        $departments = [
            'CHPP Operations', 'Community Development', 'CRSD', 'Engineering', 'Environment',
            'Finance & Accounting', 'Fix Plant Maintenance', 'GED/GFD', 'GovRel & ComRel',
            'Health & Safety', 'HRGA', 'IT', 'LMPO', 'Logistics', 'Management Improvement',
            'MCPE', 'Mining Operations', 'MMDD', 'Port Operations & Maintenance',
            'Procurement', 'Project Construction', 'Project Management Office', 'QA/QC', 'Strategic Sourcing'
        ];
        foreach ($departments as $item) {
            DB::table('m_department')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 16. PERUSAHAAN (Table: m_company, Column: name)
        $companies = [
            'CV Akhmad Bagus Mangkurowo', 'CV Mura Mimik', 'PT Abadi Raya Commerce',
            'PT Acasa Logistic', 'PT Adijaya Tekmindo', 'PT Bandang Mining Coal',
            'PT Bina Jaya Sejahtera', 'PT Biomastika Utama', 'PT Bisa Bersama Kawan',
            'PT Borneo Mura Perkasa', 'PT Cansurio', 'PT Cipta Total Solusindo',
            'PT Citanya', 'PT Danmin', 'PT DEPAG', 'PT Duta Borneo Mining',
            'PT Epitec Southern', 'PT Geoconsave', 'PT Gilang Sinar Jaya',
            'PT Global Dharma Sarana Karya', 'PT Harapan Borneo Interkarsa',
            'PT Indonesia Carbon Energy', 'PT Indovickers Furnitama', 'PT Juloi Coal',
            'PT Kalteng Coal', 'PT Kinaya Multi Konstruksi', 'PT Kuarso Hexagon',
            'PT Lahai Coal', 'PT LieBherr Indonesia', 'PT Maruwai Coal',
            'PT Medika Jasa Utama', 'PT Mitra Barito Perkasa', 'PT Mitra Usaha R3',
            'PT Multi Line Borneo', 'PT Pacifica Indonesia', 'PT Pama Persada Nusantara',
            'PT Prima Perkasa Abadi', 'PT Putra Perkasa Abadi', 'PT Ruxi Pratama',
            'PT Septio Info Sejati', 'PT Sinar Alam Duta Perdana', 'PT Solid Universal Indonesia',
            'PT Sumber Barito Coal', 'PT Tata Wisata', 'PT Tower Bersama Group',
            'PT Trakindo', 'PT Transkon Jaya', 'PT Triatra Sinergi Pratama', 'PT United Tractor'
        ];
        foreach ($companies as $item) {
            DB::table('m_company')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 17. TIPE INSIDEN / KECELAKAAN
        $incident_types = [
            'Kecelakaan Tambang - cidera ringan',
            'Kecelakaan Tambang - cidera berat',
            'Kecelakaan Tambang - mati',
            'First Aid Injury',
            'Medical Treatment Injury',
            'Penyakit Akibat Kerja',
            'Kejadian Akibat Penyakit Tenaga Kerja',
            'Pencemaran Lingkungan',
            'Kejadian Berbahaya',
            'Property Damage',
            'Nearmiss',
            'Pelanggaran Prosedur',
            'Fatality',
            'Lost Time Incident'
        ];
        foreach ($incident_types as $item) {
            DB::table('m_incident_types')->updateOrInsert(
                ['category' => $item],
                ['description' => '', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 18. SUMBER KECELAKAAN
        $sources = [
            'SK.1' => 'Animal, insect & biological',
            'SK.2' => 'Walking & working surface',
            'SK.3' => 'Harvesting',
            'SK.4' => 'Working at height',
            'SK.5' => 'Hazardous Material',
            'SK.6' => 'Electrical',
            'SK.7' => 'Light Mobile Equipment',
            'SK.8' => 'Lifting & Rigging',
            'SK.9' => 'Tools & handtools',
            'SK.10' => 'Heavy Mobile Equipment',
            'SK.11' => 'Hot work',
            'SK.12' => 'Machine & conveyor guarding',
            'SK.13' => 'Bulk material handling',
            'SK.14' => 'Confined space entry',
            'SK.15' => 'Barge & Boat Operation',
            'SK.16' => 'Excavation and trench work',
            'SK.17' => 'Pinched Point',
            'SK.18' => 'Contact with sharp edge',
            'SK.19' => 'Fall from same level (slip or trip)',
            'SK.20' => 'Struck by falling object',
            'SK.21' => 'Struck by other',
            'SK.22' => 'Contact with hot material',
            'SK.23' => 'Equipment structure failure',
            'SK.24' => 'Drowning',
            'SK.25' => 'Fall from elevation',
            'SK.26' => 'Others'
        ];
        foreach ($sources as $code => $desc) {
            DB::table('m_sources')->updateOrInsert(
                ['code' => $code],
                ['description' => $desc, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 19. UNSAFE ACTS
        $unsafe_acts = [
            'USA - 1' => 'Menjalankan pekerjaan tanpa otorisasi',
            'USA - 2' => 'Gagal Memperingatkan',
            'USA - 3' => 'Gagal Mengamankan',
            'USA - 4' => 'Mengoperasikan dengan kecepatan tidak layak',
            'USA - 5' => 'Membuat peralatan pengaman tidak berfungsi',
            'USA - 6' => 'Menggunakan peralatan yang rusak',
            'USA - 7' => 'Penggunaan APD yang tidak layak',
            'USA - 8' => 'Proses loading/unloading yang tidak layak',
            'USA - 9' => 'Penempatan yang tidak layak',
            'USA - 10' => 'Proses pengangkatan yang tidak layak',
            'USA - 11' => 'Posisi yang tidak layak untuk bekerja',
            'USA - 12' => 'Perbaikan peralatan yang sedang beroperasi',
            'USA - 13' => 'Bercanda/main-main',
            'USA - 14' => 'Dalam pengaruh alkohol dan/atau obat',
            'USA - 15' => 'Penggunaan peralatan yang tidak layak',
            'USA - 16' => 'Gagal mengikuti prosedur'
        ];
        foreach ($unsafe_acts as $code => $desc) {
            DB::table('m_unsafe_acts')->updateOrInsert(
                ['code' => $code],
                ['description' => $desc, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 20. UNSAFE CONDITIONS
        $unsafe_conditions = [
            'USC - 1' => 'Pelindung/pembatas tidak layak',
            'USC - 2' => 'APD tidak layak',
            'USC - 3' => 'Peralatan/material yang rusak',
            'USC - 4' => 'Keterbatasan gerak/tempat',
            'USC - 5' => 'Sistem peringatan yang kurang',
            'USC - 6' => 'Bahaya kebakaran dan atau peledakan',
            'USC - 7' => 'Tata lingkungan yang buruk/tidak teratur',
            'USC - 8' => 'Paparan/Pajanan Kebisingan',
            'USC - 9' => 'Paparan/Pajanan Radiasi',
            'USC - 10' => 'Suhu yang ekstrim (tinggi/rendah)',
            'USC - 11' => 'Penerangan yang berlebih/kurang',
            'USC - 12' => 'Ventilasi yang kurang',
            'USC - 13' => 'Kondisi lingkungan berbahaya (gas, debu, asap)'
        ];
        foreach ($unsafe_conditions as $code => $desc) {
            DB::table('m_unsafe_conditions')->updateOrInsert(
                ['code' => $code],
                ['description' => $desc, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 21. PERSONAL FACTORS
        $personal_factors = [
            'PF - 1' => 'Keterbatasan/kemampuan fisik kurang',
            'PF - 2' => 'Masalah mental/psikologis',
            'PF - 3' => 'Stress fisik/fisiologis',
            'PF - 4' => 'Stress mental/psikologis',
            'PF - 5' => 'Kurang pengetahuan',
            'PF - 6' => 'Kurang keterampilan',
            'PF - 7' => 'Motivasi tidak layak'
        ];
        foreach ($personal_factors as $code => $desc) {
            DB::table('m_personal_factors')->updateOrInsert(
                ['code' => $code],
                ['description' => $desc, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 22. JOB FACTORS
        $job_factors = [
            'JF - 1' => 'Kurang kepemimpinan atau pengawasan',
            'JF - 2' => 'Engineering/desain tidak layak/tidak tepat',
            'JF - 3' => 'Sistem pengadaan barang (purchasing) tidak layak',
            'JF - 4' => 'Pemeliharaan tidak layak',
            'JF - 5' => 'Peralatan/fasilitas/mesin kurang memadai',
            'JF - 6' => 'Standar kerja yang tidak layak',
            'JF - 7' => 'Pemanfaatan/penggunaan berlebihan',
            'JF - 8' => 'Penyalahgunaan/salah pakai'
        ];
        foreach ($job_factors as $code => $desc) {
            DB::table('m_job_factors')->updateOrInsert(
                ['code' => $code],
                ['description' => $desc, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 23. KONDISI CIDERA SAKIT
        $injuries = [
            'Concussion', 'Hernia', 'Amputasi', 'Barang asing', 'Cidera banyak',
            'Cidera dalam', 'Dislokasi', 'Gangguan kulit', 'Gangguan pernapasan',
            'Gigitan/Sengatan hewan', 'Kehilangan pendengaran', 'Keracunan',
            'Keseleo', 'Luka bakar', 'Reaksi alergi', 'Retak/patah', 'Stres',
            'Tergores', 'Tersayat', 'Tersengat listrik', 'Lain-lain'
        ];
        foreach ($injuries as $item) {
            DB::table('m_injury_conditions')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // 24. BAGIAN TUBUH
        $body_parts = [
            'Bahu', 'Dada', 'Kaki', 'Kaki/tumit', 'Kepala/muka', 'Leher',
            'Lengan', 'Lutut', 'Mata', 'Paha', 'Pergelangan Kaki', 'Perut',
            'Punggung', 'Tangan/jari-jari', 'Telinga', 'Lain-lain'
        ];
        foreach ($body_parts as $item) {
            DB::table('m_body_parts')->updateOrInsert(
                ['name' => $item],
                ['is_active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }
    }
}

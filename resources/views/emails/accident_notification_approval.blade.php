<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Approval Notifikasi Kecelakaan</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f6; }
        .container { width: 100%; max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #2563eb; color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .content { padding: 30px; }
        .footer { background-color: #f8fafc; color: #64748b; padding: 20px; text-align: center; font-size: 12px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table th { text-align: left; background-color: #f8fafc; padding: 10px; border-bottom: 1px solid #e2e8f0; width: 40%; font-size: 13px; color: #64748b; text-transform: uppercase; }
        .info-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 15px; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
        .tag { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; background-color: #fee2e2; color: #dc2626; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Approval Diperlukan</h1>
        </div>
        <div class="content">
            <p>Halo,</p>
            <p>Laporan notifikasi kecelakaan baru telah diajukan dan memerlukan tinjauan/persetujuan Anda.</p>
            
            <table class="info-table">
                <tr>
                    <th>No. Kecelakaan</th>
                    <td><strong>{{ $notification->accident_number }}</strong></td>
                </tr>
                <tr>
                    <th>No. Notifikasi</th>
                    <td>{{ $notification->notification_number }}</td>
                </tr>
                <tr>
                    <th>Tanggal & Waktu</th>
                    <td>{{ \Carbon\Carbon::parse($notification->incident_date)->format('d F Y') }} | {{ $notification->incident_time }}</td>
                </tr>
                <tr>
                    <th>Lokasi</th>
                    <td>{{ $notification->location->name ?? '-' }} ({{ $notification->ccow->name ?? '-' }})</td>
                </tr>
                <tr>
                    <th>Tipe Insiden</th>
                    <td>{{ $notification->incidentType->description ?? '-' }}</td>
                </tr>
                <tr>
                    <th>HPRI Status</th>
                    <td>
                        @if($notification->is_hpri)
                            <span class="tag">HIGH POTENTIAL</span>
                        @else
                            <span>TIDAK</span>
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>Pelapor</th>
                    <td>{{ $notification->reporter_name }}</td>
                </tr>
            </table>

            <p>Silakan klik tombol di bawah ini untuk melihat detail lengkap dan memproses laporan ini di dashboard.</p>
            
            <a href="{{ url('/accident-notification') }}" class="btn">Buka Dashboard</a>
        </div>
        <div class="footer">
            <p>Email ini dikirim secara otomatis oleh Sistem Safety IMS.</p>
            <p>&copy; {{ date('Y') }} Safety Department.</p>
        </div>
    </div>
</body>
</html>

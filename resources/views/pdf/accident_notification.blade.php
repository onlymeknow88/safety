<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <title>Accident Notification - {{ $record->accident_number }}</title>
    <style>
        /* PDF Page Setup */
        @page {
            margin: 0cm 0cm;
        }

        /* Web Preview Styling */
        @media screen {
            body {
                background-color: #cbd5e1;
                display: flex;
                justify-content: center;
                padding: 40px 0;
            }

            .container {
                background-color: #fff;
                width: 29.7cm;
                /* A4 Landscape */
                min-height: 21cm;
                margin: 0 auto;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            }
        }

        /* Global Typography */
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #fff;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #002d5d;
        }

        .header-left {
            padding: 15px 25px;
            color: white;
            vertical-align: middle;
        }

        .header-left h1 {
            margin: 0;
            font-size: 22px;
            font-weight: bold;
            font-style: italic;
            letter-spacing: 0.5px;
        }

        .header-left h1 span {
            text-decoration: underline;
            margin-left: 10px;
        }

        .header-left p {
            margin: 5px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }

        .header-right {
            background-color: #ffffff;
            width: 200px;
            text-align: center;
            vertical-align: middle;
            padding: 0 15px;
        }

        .header-right img {
            height: 45px;
            width: auto;
        }

        .main-title {
            color: #f97316;
            /* Orange */
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            font-style: italic;
            text-transform: uppercase;
        }

        .content-area {
            padding: 0 25px;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .info-table td {
            border: 1px solid #000;
            padding: 6px 10px;
            vertical-align: top;
            width: 50%;
        }

        .label {
            font-weight: bold;
            display: block;
            font-size: 11px;
            color: #1a1a1a;
        }

        .sub-label {
            font-style: italic;
            font-weight: normal;
            font-size: 11px;
            color: #777;
            display: block;
            margin-top: -2px;
        }

        .value {
            font-size: 12px;
            font-weight: bold;
            /* Note: dompdf only supports normal/bold weights easily */
            margin-top: 2px;
            display: block;
        }

        .section-title {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 8px;
            display: block;
            border-bottom: 1px solid #333;
            padding-bottom: 2px;
        }

        .content-box {
            margin-bottom: 15px;
        }

        .list-items {
            margin: 0;
            padding-left: 18px;
        }

        .list-items li {
            margin-bottom: 2px;
            line-height: 1.4;
        }

        .photo-box {
            border: 1px solid #cbd5e1;
            padding: 10px;
            width: 100%;
            text-align: center;
            min-height: 250px;
            box-sizing: border-box;
            background-color: #f8fafc;
        }

        .photo-box img {
            max-width: 100%;
            max-height: 350px;
        }

        .footer {
            margin-top: 10px;
            width: 100%;
            padding-bottom: 20px;
        }

        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .footer-table td {
            padding: 4px 0;
            font-size: 11px;
        }

        .doc-code {
            text-align: right;
            font-size: 9px;
            font-weight: bold;
            margin-top: 10px;
            position: absolute;
            bottom: 20px;
            right: 25px;
        }

        p {
            line-height: 1.5;
            margin-top: 5px;
            margin-bottom: 10px;
        }

        .clear {
            clear: both;
        }
    </style>
</head>

<body>

    <div class="container">
        <!-- Header Section -->
        <table class="header-table">
            <tr>
                <td class="header-left">
                    <h1>{{ $record->accident_number }} <span>{{ $record->incident_title ?? '-' }}</span></h1>
                    <p>No. Notifikasi Insiden : {{ $record->notification_number ?? '-' }}</p>
                </td>
                <td class="header-right">
                    <img src="{{ isset($isHtml) ? asset('images/Alamtri Geo Logo - Full Color.png') : public_path('images/Alamtri Geo Logo - Full Color.png') }}"
                        alt="Logo">
                </td>
            </tr>
        </table>

        <div class="main-title">
            Pemberitahuan Kecelakaan / Accident Notification
        </div>

        <div class="content-area">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <!-- Left Column -->
                    <td style="width: 56%; vertical-align: top; padding-right: 20px;">
                        <table class="info-table">
                            <tr>
                                <td>
                                    <span class="label">Tanggal : <span
                                            class="value">{{ \Carbon\Carbon::parse($record->incident_date)->format('d-m-Y') }}</span></span>
                                    <span class="sub-label">Date (dd-mm-yyyy)</span>
                                </td>
                                <td>
                                    <span class="label">Lokasi : <span
                                            class="value">{{ $record->location->name ?? '-' }}
                                            {{ $record->location_detail ? '(' . $record->location_detail . ')' : '' }}</span></span>
                                    <span class="sub-label">Location</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="label">Waktu : <span
                                            class="value">{{ $record->incident_time ? substr($record->incident_time, 0, 5) : '-' }}
                                            WIB</span></span>
                                    <span class="sub-label">Time (24hours)</span>
                                </td>
                                <td>
                                    <span class="label">Perusahaan : <span
                                            class="value">{{ $record->company->name ?? '-' }}</span></span>
                                    <span class="sub-label">Company</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="label">Departemen : <span
                                            class="value">{{ $record->department->name ?? '-' }}</span></span>
                                    <span class="sub-label">Department</span>
                                </td>
                                <td>
                                    <span class="label">Kontraktor : <span
                                            class="value">{{ $record->companyContractor->name ?? '-' }}</span></span>
                                    <span class="sub-label">Contractor (if any)</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="label">Klasifikasi insiden / Incident classification :</span>
                                    <span class="value">{{ $record->incidentType->description ?? '-' }}</span>
                                </td>
                                <td>
                                    <span class="label">Apakah termasuk HPRI / Related:</span>
                                    <div style="margin-top: 5px;">
                                        <span style="font-size: 13px;">{{ $record->is_hpri ? '[x]' : '[ ]' }} Ya
                                            &nbsp;&nbsp;&nbsp; {{ !$record->is_hpri ? '[x]' : '[ ]' }} Tidak</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <span class="label">Tingkat keparahan/Severity:</span>
                                    <table style="width: 100%; border: none; margin-top: 5px;">
                                        <tr>
                                            <td style="border: none; padding: 0;"><strong>Aktual</strong> : K3 =
                                                {{ $record->actual_k3 ?? '-' }}; KK = {{ $record->actual_kk ?? '-' }};
                                                LH = {{ $record->actual_lh ?? '-' }}
                                            </td>
                                            <td style="border: none; padding: 0;"><strong>Potensial</strong> : K3 =
                                                {{ $record->potential_k3 ?? '-' }}; KK =
                                                {{ $record->potential_kk ?? '-' }}; LH =
                                                {{ $record->potential_lh ?? '-' }}
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <div class="content-box">
                            <span class="section-title">Penjelasan Insiden :</span>
                            <p><strong>Kronologi awal:</strong><br>
                                {{ $record->chronology }}</p>

                            <p><strong>Fakta kejadian:</strong></p>
                            <ol class="list-items">
                                @forelse($record->incident_facts ?? [] as $fact)
                                    <li>{{ $fact }}</li>
                                @empty
                                    <li>-</li>
                                @endforelse
                            </ol>

                            <p style="margin-top: 15px;"><strong>Akibat kecelakaan:</strong><br>
                                <strong>Manusia :</strong> {{ $record->consequence_human ?? '-' }}<br>
                                <strong>Alat :</strong> {{ $record->consequence_tool ?? '-' }}<br>
                                <strong>Lingkungan :</strong> {{ $record->consequence_environment ?? '-' }}<br>
                            </p>
                        </div>
                    </td>

                    <!-- Right Column -->
                    <td style="width: 44%; vertical-align: top;">
                        <div class="content-box">
                            <span class="section-title">Tindakan perbaikan yang dilakukan:</span>
                            <ol class="list-items">
                                @forelse($record->corrective_actions ?? [] as $action)
                                    <li>{{ $action }}</li>
                                @empty
                                    <li>-</li>
                                @endforelse
                            </ol>
                        </div>

                        <div class="content-box" style="margin-top: 20px;">
                            <span class="section-title">Foto</span>
                            <div class="photo-box" style="padding: 0; background-color: transparent; border: none;">
                                @if($record->photos && $record->photos->count() > 0)
                                    @php
                                        $count = $record->photos->count();
                                        $cols = $count > 1 ? 2 : 1;
                                    @endphp
                                    <table style="width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid #cbd5e1;">
                                        @foreach($record->photos->chunk($cols) as $chunk)
                                            <tr>
                                                @foreach($chunk as $photo)
                                                    <td style="padding: 5px; text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; background-color: #f8fafc;">
                                                        <img src="{{ isset($isHtml) ? asset('storage/' . $photo->path) : public_path('storage/' . $photo->path) }}"
                                                            alt="Incident Photo" 
                                                            style="max-width: 100%; max-height: {{ $count > 2 ? '150px' : '300px' }}; display: block; margin: 0 auto;">
                                                    </td>
                                                @endforeach
                                                {{-- Add empty cell if odd number of photos in a 2-column grid --}}
                                                @if($cols == 2 && $chunk->count() == 1)
                                                    <td style="border: 1px solid #cbd5e1; background-color: #f8fafc;"></td>
                                                @endif
                                            </tr>
                                        @endforeach
                                    </table>
                                @else
                                    <div class="photo-box">
                                        <div style="padding-top: 100px; color: #ccc; text-align: center;">No Photo Available</div>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </td>
                </tr>
            </table>

            <div class="footer">
                <table class="footer-table">
                    <tr>
                        <td style="width: 120px; font-weight: bold;">Dilaporkan oleh</td>
                        <td>: {{ $record->reporter_name }} ({{ $record->reporter_position }})</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">Disetujui oleh</td>
                        <td>: {{ $record->approver_name }} ({{ $record->approver_position }})</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="doc-code">
            F-MAC-IMS-14-001<br>
            Rev.: 4.0
        </div>
    </div>

</body>

</html>

<?php

namespace Database\Seeders;

use App\Models\MasterData\Ccow;
use App\Models\MasterData\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. PT Lahai Coal (ID 5 di screenshot kamu)
        // Kita cari berdasarkan nama yang persis di database kamu
        $lahai = Ccow::where('name', 'PT Lahai Coal')->first();

        // Jika tidak ketemu (misal karena case sensitive), kita buatkan
        if (!$lahai) {
            $lahai = Ccow::create(['name' => 'PT Lahai Coal', 'is_active' => true]);
        }

        $lahaiLocations = [
            'AREA REKLAMASI HAJU',
            'KANTOR PPA HAJU',
            'NURSERY HAJU',
            'PIT LAUNG DANUM HAJU',
            'PIT SOUTH HAJU',
            'SPHJ 08',
            'WORKSHOP A2B PPA HAJU',
            'WORKSHOP LV PPA HAJU',
        ];

        foreach ($lahaiLocations as $name) {
            Location::updateOrCreate([
                'ccow_id' => $lahai->id,
                'name' => $name
            ], ['is_active' => true]);
        }

        // 2. PT Maruwai Coal (ID 6 di screenshot kamu)
        $maruwai = Ccow::where('name', 'PT Maruwai Coal')->first();

        if (!$maruwai) {
            // Backup jika yang dicari adalah yang pakai titik (ID 1)
            $maruwai = Ccow::where('name', 'PT. Maruwai Coal')->first();
        }

        if (!$maruwai) {
            $maruwai = Ccow::create(['name' => 'PT Maruwai Coal', 'is_active' => true]);
        }

        $maruwaiLocations = [
            'BASALT CRUSHER',
            'BLC PORT TUHUP - 1',
            'BLC PORT TUHUP - 2',
            'BYPASS KM 27-35',
            'BYPASS KM 39',
            'CAMP HAJU',
            'CAMP KM26',
            'CAMP LAMA TUHUP',
            'CAMP LWF LAMPUNUT',
            'CAMP PPA',
            'CAMP PROJECT',
            'CAMP SIS TUHUP',
            'CAMP TRV TUHUP',
            'CAMP VILLAGE LAMPUNUT',
            'CHPP 1',
            'CHPP 2',
            'CSA HAULING - FO',
            'CSA KM 46',
            'CSA KM 61',
            'CSA KM 27',
            'CSA PIT',
            'ERT 911 TUHUP',
            'ERT 913',
            'ERT 914',
            'ERT 930',
            'ERT STATION 912',
            'EXPLORATION AREA',
            'FABRICATION SHOP SIS LAMPUNUT',
            'FRONT OFFICE',
            'FUEL TANK LAMPUNUT',
            'FUEL TANK PORT TUHUP',
            'FUEL TANK TIA TUHUP',
            'GUDANG HANDAK',
            'JALAN HAULING CHR',
            'JALAN HAULING LNR',
            'JALAN HAULING SHR',
            'JALAN TAMBANG',
            'JALAN TAMBANG BASALT',
            'JEMBATAN BABAO',
            'JEMBATAN BERIWIT',
            'JEMBATAN KM 13',
            'JEMBATAN KM 6',
            'JEMBATAN LAMPUNUT',
            'JEMBATAN RIVER A (MENARA API)',
            'JETTY FUEL PORT TUHUP',
            'JETTY LOGISTIC PORT TUHUP',
            'JETTY PASSENGER TUHUP',
            'KANTOR AMC HAJU',
            'KANTOR EKSPLORASI',
            'KANTOR LMTO',
            'KANTOR MIA LT 1',
            'KANTOR MIA LT 2',
            'KANTOR PORT OPERATIONS',
            'KANTOR PPA',
            'KANTOR SIS HAJU',
            'KANTOR TRC',
            'KANTOR/WHS PT ENEROC LAMPUNUT',
            'KANTOR/WHS PT LIEBHERR LAMPUNUT',
            'KANTOR/WHS PT UT LAMPUNUT',
            'KLINIK HAJU',
            'KLINIK LAMPUNUT',
            'KLINIK TUHUP',
            'LAB. GEOSERVICE',
            'LAMPUNUT MIA',
            'NURSERY LAMPUNUT',
            'OFFICE CHPP',
            'PIT BASALT',
            'PIT CENTRAL',
            'PIT NORTH',
            'PIT SOUTH',
            'PIT STOP',
            'POS SECURITY KM 39',
            'POS SECURITY TANGO 0',
            'POS SECURITY TANGO 1',
            'POWER HOUSE GENSET',
            'ROAD 1',
            'ROAD 2',
            'ROAD 3',
            'ROM PRODUCT CHPP 1',
            'ROM PRODUCT CHPP 2',
            'ROM RAW CHPP',
            'RWI LAMPUNUT',
            'SP BASALT',
            'SP CHPP',
            'SPLM 01',
            'SPLM 02',
            'SPLM 03',
            'SPTH-01',
            'SPTH-03',
            'STP CAMP VILLAGE',
            'TPS LB3 PTHC - TUHUP',
            'TPS LB3 PTMC - TUHUP',
            'TPS LB3 SIS LAMPUNUT',
            'TYRE SHOP SIS LAMPUNUT',
            'TYRE SHOP SKB LAMPUNUT',
            'WAREHOUSE - TUHUP',
            'WAREHOUSE LAMPUNUT',
            'WAREHOUSE SIS LAMPUNUT',
            'WASTE MGMT LAMPUNUT',
            'WEIGHT BRIDGE 1',
            'WEIGHT BRIDGE 2',
            'WEIGHT BRIDGE 3',
            'WORKSHOP INFRA FPM TUHUP',
            'WORKSHOP INFRA HRDA TUHUP',
            'WORKSHOP LV TRANSKON TUHUP',
            'WORKSHOP SIS TUHUP',
            'WORKSHOP A2B SIS LAMPUNUT',
            'WORKSHOP FPM CHPP',
            'WORKSHOP HAJU LAMA',
            'WORKSHOP MIA HAJU',
            'WORKSHOP INFRA FPM LAMPUNUT',
            'WORKSHOP INFRA HRDA LAMPUNUT',
            'WORKSHOP LV SIS LAMPUNUT',
            'WORKSHOP LV TRANSKON',
            'WORKSHOP MTC BLC',
            'WORKSHOP PPA',
        ];

        foreach ($maruwaiLocations as $name) {
            Location::updateOrCreate([
                'ccow_id' => $maruwai->id,
                'name' => $name
            ], ['is_active' => true]);
        }
    }
}

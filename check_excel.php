<?php
require __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

$file = __DIR__ . '/public/New folder/Template Database Insiden.xlsx';
$spreadsheet = IOFactory::load($file);
$sheet = $spreadsheet->getSheetByName('Safety Performance');

foreach ([7, 8] as $row) {
    echo "=== Row $row ===\n";
    for ($colIdx = 1; $colIdx <= 40; $colIdx++) {
        $col = Coordinate::stringFromColumnIndex($colIdx);
        $cell = $sheet->getCell($col . $row);
        $val = $cell->getValue();
        $f = $cell->isFormula() ? $cell->getValue() : null;
        $fmt = $cell->getFormattedValue();
        if ($val !== null && $val !== '') {
            echo "$col: " . ($f ? "formula [$f]" : "val [$val]") . " (formatted: $fmt)\n";
        }
    }
}

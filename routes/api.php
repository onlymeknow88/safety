<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AccidentNotificationController;
use App\Http\Controllers\MasterData\Api\CcowController;
use App\Http\Controllers\MasterData\Api\CompanyController;
use App\Http\Controllers\MasterData\Api\DepartmentController;
use App\Http\Controllers\MasterData\Api\JabatanController;
use App\Http\Controllers\MasterData\Api\ShiftController;
use App\Http\Controllers\MasterData\Api\IntervalTimeController;
use App\Http\Controllers\MasterData\Api\DayController;
use App\Http\Controllers\MasterData\Api\RosterController;
use App\Http\Controllers\MasterData\Api\GenderController;
use App\Http\Controllers\MasterData\Api\IntervalAgeController;
use App\Http\Controllers\MasterData\Api\IntervalExperienceController;
use App\Http\Controllers\MasterData\Api\IncidentTypeController;
use App\Http\Controllers\MasterData\Api\KriteriaController;
use App\Http\Controllers\MasterData\Api\ReportTypeController;
use App\Http\Controllers\MasterData\Api\StatusController;
use App\Http\Controllers\MasterData\Api\InjuryConditionController;
use App\Http\Controllers\MasterData\Api\BodyPartController;
use App\Http\Controllers\MasterData\Api\RecommendationController;
use App\Http\Controllers\MasterData\Api\SourceController;
use App\Http\Controllers\MasterData\Api\UnsafeActController;
use App\Http\Controllers\MasterData\Api\UnsafeConditionController;
use App\Http\Controllers\MasterData\Api\PersonalFactorController;
use App\Http\Controllers\MasterData\Api\JobFactorController;
use App\Http\Controllers\MasterData\Api\LocationController;

// Public Endpoint to get token
Route::post('login', [AuthController::class, 'login']);

// Protected Endpoints using JWT
Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::apiResource('users', UserController::class);

    // Roles & Permissions API
    Route::get('permissions', [\App\Http\Controllers\Api\RoleController::class, 'permissions']);
    Route::apiResource('roles', \App\Http\Controllers\Api\RoleController::class);

    // Menu
    Route::post('menu/reorder', [\App\Http\Controllers\Api\MenuController::class, 'reorder']);
    Route::apiResource('menu', \App\Http\Controllers\Api\MenuController::class);

    // Master Data
    Route::apiResource('ccow', CcowController::class);
    Route::apiResource('company', CompanyController::class);
    Route::apiResource('department', DepartmentController::class);
    Route::apiResource('jabatan', JabatanController::class);
    Route::apiResource('shift', ShiftController::class);
    Route::apiResource('interval-time', IntervalTimeController::class);
    Route::apiResource('day', DayController::class);
    Route::apiResource('roster', RosterController::class);
    Route::apiResource('gender', GenderController::class);
    Route::apiResource('interval-age', IntervalAgeController::class);
    Route::apiResource('interval-experience', IntervalExperienceController::class);
    Route::apiResource('incident-type', IncidentTypeController::class);
    Route::apiResource('kriteria', KriteriaController::class);
    Route::apiResource('report-type', ReportTypeController::class);
    Route::apiResource('status', StatusController::class);
    Route::apiResource('injury-condition', InjuryConditionController::class);
    Route::apiResource('body-part', BodyPartController::class);
    Route::apiResource('recommendation', RecommendationController::class);
    Route::apiResource('source', SourceController::class);
    Route::apiResource('unsafe-act', UnsafeActController::class);
    Route::apiResource('unsafe-condition', UnsafeConditionController::class);
    Route::apiResource('personal-factor', PersonalFactorController::class);
    Route::apiResource('job-factor', JobFactorController::class);
    Route::apiResource('location', LocationController::class);
    Route::apiResource('employee', \App\Http\Controllers\MasterData\Api\EmployeeController::class);


    // Accident Notification
    Route::delete('accident-notification/{id}/photos/{photoId}', [AccidentNotificationController::class, 'destroyPhoto']);
    Route::apiResource('accident-notification', AccidentNotificationController::class);
});

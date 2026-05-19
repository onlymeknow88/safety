<?php

use App\Http\Controllers\Api\AccidentNotificationController;
use App\Http\Controllers\Api\InvestigationReportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\MasterData\Api\BodyPartController;
use App\Http\Controllers\MasterData\Api\CcowController;
use App\Http\Controllers\MasterData\Api\CompanyController;
use App\Http\Controllers\MasterData\Api\DayController;
use App\Http\Controllers\MasterData\Api\DepartmentController;
use App\Http\Controllers\MasterData\Api\EmployeeController;
use App\Http\Controllers\MasterData\Api\GenderController;
use App\Http\Controllers\MasterData\Api\IncidentTypeController;
use App\Http\Controllers\MasterData\Api\InjuryConditionController;
use App\Http\Controllers\MasterData\Api\IntervalAgeController;
use App\Http\Controllers\MasterData\Api\IntervalExperienceController;
use App\Http\Controllers\MasterData\Api\IntervalTimeController;
use App\Http\Controllers\MasterData\Api\JabatanController;
use App\Http\Controllers\MasterData\Api\JobFactorController;
use App\Http\Controllers\MasterData\Api\KriteriaController;
use App\Http\Controllers\MasterData\Api\LocationController;
use App\Http\Controllers\MasterData\Api\PersonalFactorController;
use App\Http\Controllers\MasterData\Api\RecommendationController;
use App\Http\Controllers\MasterData\Api\ReportTypeController;
use App\Http\Controllers\MasterData\Api\RosterController;
use App\Http\Controllers\MasterData\Api\ShiftController;
use App\Http\Controllers\MasterData\Api\SourceController;
use App\Http\Controllers\MasterData\Api\StatusController;
use App\Http\Controllers\MasterData\Api\UnsafeActController;
use App\Http\Controllers\MasterData\Api\UnsafeConditionController;
use Illuminate\Support\Facades\Route;

// Public Endpoint to get token
Route::post('login', [AuthController::class, 'login']);

// Protected Endpoints using JWT
Route::middleware('auth:api')->name('api.')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('update-profile', [UserController::class, 'updateProfile']);
    Route::post('update-password', [UserController::class, 'updatePassword']);
    Route::apiResource('users', UserController::class);

    // Roles & Permissions API
    Route::get('permissions', [RoleController::class, 'permissions']);
    Route::apiResource('roles', RoleController::class);

    // Menu
    Route::post('menu/reorder', [MenuController::class, 'reorder']);
    Route::apiResource('menu', MenuController::class);

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
    Route::apiResource('employee', EmployeeController::class);

    // Accident Notification
    Route::post('accident-notification/{id}/approve', [AccidentNotificationController::class, 'approve']);
    Route::post('accident-notification/{id}/return', [AccidentNotificationController::class, 'return']);
    Route::post('accident-notification/send-email', [AccidentNotificationController::class, 'sendEmail']);
    Route::get('accident-notification/{id}/export-pdf', [AccidentNotificationController::class, 'exportPdf']);
    Route::delete('accident-notification/{id}/photos/{photoId}', [AccidentNotificationController::class, 'destroyPhoto']);
    Route::apiResource('email-groups', \App\Http\Controllers\Admin\Api\EmailGroupController::class);
    Route::apiResource('accident-notification', AccidentNotificationController::class);

    // Investigation Report (LPKS/LPKL)
    Route::post('investigation-report/{id}/approve', [InvestigationReportController::class, 'approve']);
    Route::post('investigation-report/{id}/return', [InvestigationReportController::class, 'return']);
    Route::apiResource('investigation-report', InvestigationReportController::class);
});

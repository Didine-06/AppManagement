<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentsController;

Route::post('/students/import', [StudentsController::class, 'import']);
Route::get('/students', [StudentsController::class, 'index']);
Route::delete('/students/{id}', [StudentsController::class, 'destroy']);

Route::put('/students/{id}', [StudentsController::class, 'update']);


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


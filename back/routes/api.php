<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReceptController;








Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');




Route::middleware('auth:sanctum')->group(function () {

   
    
    Route::get('/recepti/svi', [ReceptController::class, 'getAll']);
    Route::get('/recepti', [ReceptController::class, 'index']);
    Route::get('/recepti/{id}', [ReceptController::class, 'show']);
    Route::post('/recepti', [ReceptController::class, 'store']);
    Route::put('/recepti/{id}', [ReceptController::class, 'update']);
    Route::delete('/recepti/{id}', [ReceptController::class, 'destroy']);


});
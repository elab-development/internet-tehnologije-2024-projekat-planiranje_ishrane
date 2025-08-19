<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReceptController;
use App\Http\Controllers\SastojakController;
use App\Http\Controllers\PlanObrokaController;






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
    Route::post('/recepti/{id}/omiljeni', [ReceptController::class, 'toggleOmiljeni']);
    Route::get('/moji-omiljeni-recepti', [ReceptController::class, 'mojiOmiljeni']);


    
    Route::get('/sastojci/svi', [SastojakController::class, 'getAll']);
    Route::get('/sastojci', [SastojakController::class, 'index']);
    Route::get('/sastojci/{id}', [SastojakController::class, 'show']);
    Route::post('/sastojci', [SastojakController::class, 'store']);
    Route::put('/sastojci/{id}', [SastojakController::class, 'update']);
    Route::delete('/sastojci/{id}', [SastojakController::class, 'destroy']);


    
    Route::get('/planovi-obroka', [PlanObrokaController::class, 'index']);
    Route::get('/planovi-obroka/{id}', [PlanObrokaController::class, 'show']);
    Route::post('/planovi-obroka', [PlanObrokaController::class, 'store']);
    Route::delete('/planovi-obroka/{id}', [PlanObrokaController::class, 'destroy']);
    Route::post('/planovi-obroka/{id}/dodaj-recept', [PlanObrokaController::class, 'dodajRecept']);
});
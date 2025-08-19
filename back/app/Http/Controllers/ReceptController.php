<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Resources\ReceptResource;
use Illuminate\Support\Facades\Auth;
use App\Models\Recept;
class ReceptController extends Controller
{


public function getAll(){
    return ReceptResource::collection(Recept::all());
}




}

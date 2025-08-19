<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\SastojakResource;
use Illuminate\Support\Facades\Auth;
use App\Models\Sastojak;
class SastojakController extends Controller
{
   
public function index(Request $request)
{

    $user = Auth::user();
    if(!$user){
 return response()->json(['error' => 'Ne mozete imati pregled u sastojke ako niste prijavljeni.'], 403);
    }
    $query = Sastojak::query();

    if ($request->has('naziv')) {
        $query->where('naziv', 'like', '%' . $request->naziv . '%');
    }

    if ($request->has('kategorija')) {
        $query->where('kategorija', 'like', '%' . $request->kategorija . '%');
    }

    if ($request->has('tip')) {
        $query->where('tip', 'like', '%' . $request->tip . '%');
    }

    if ($request->has('masti')) {
        $query->where('masti', '<=', $request->masti);
    }

    if ($request->has('proteini')) {
        $query->where('proteini', '<=', $request->proteini);
    }

    if ($request->has('ugljeni_hidrati')) {
        $query->where('ugljeni_hidrati', '<=', $request->ugljeni_hidrati);
    }

    if ($request->has('kalorije')) {
        $query->where('kalorije', '<=', $request->kalorije);
    }

    $sastojci = $query->paginate(10); 

    return SastojakResource::collection($sastojci);
}

public function getAll(){
    return SastojakResource::collection(Sastojak::all());
}

}

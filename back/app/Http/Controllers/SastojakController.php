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

   public function show($id)
{

    $user = Auth::user();
    if(!$user){
         return response()->json(['error' => 'Niste autorizovani.'], 403);
    }
    $sastojak = Sastojak::find($id);

    if (!$sastojak) {
        return response()->json([
            'message' => 'Sastojak nije pronađen.'
        ], 404);
    }

    return new SastojakResource($sastojak);
}


public function store(Request $request)
{
    $user = Auth::user();
    if(!$user || $user->uloga!=='administrator'){
         return response()->json(['error' => 'Ne mozete dodavati sastojke ako niste prijavljeni kao administrator.'], 403);
    }
    $validatedData = $request->validate([
        'naziv' => 'required|string|max:255',
        'kategorija' => 'required|string|max:255',
        'masti' => 'required|numeric|min:0',
        'proteini' => 'required|numeric|min:0',
        'ugljeni_hidrati' => 'required|numeric|min:0',
        'kalorije' => 'required|numeric|min:0',
        'tip' => 'required|in:organski,neorganski',
        'jedinica'=>'required|in:g,ml,kom,kasika'
    ]);

  
   
    $sastojak = Sastojak::create([
        'naziv' => $validatedData['naziv'],
        'kategorija' => $validatedData['kategorija'],
        'masti' => $validatedData['masti'],
        'proteini' => $validatedData['proteini'],
        'ugljeni_hidrati' => $validatedData['ugljeni_hidrati'],
        'kalorije' => $validatedData['kalorije'],
        'tip' => $validatedData['tip'],
        'jedinica'=>$validatedData['jedinica']
        
    ]);

    return response()->json([
        'message' => 'Sastojak uspešno kreiran.',
        'data' => new SastojakResource($sastojak)
    ], 201);
}

}

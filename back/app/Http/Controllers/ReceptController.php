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

 public function index(Request $request)
{
    try {
        $korisnik = Auth::user();

        if (!$korisnik) {
            return response()->json(['error' => 'Niste autorizovani.'], 403);
        }

        $request->validate([
            'tip_jela' => 'nullable|in:doručak,ručak,večera,užina,desert',
            'vreme_pripreme_min' => 'nullable|integer|min:0',
            'vreme_pripreme_max' => 'nullable|integer|min:0',
            'sastojak.naziv' => 'nullable|string',
            'sastojak.kategorija' => 'nullable|string',
            'sastojak.tip' => 'nullable|string|in:organski,neorganski',
            'min_kalorije' => 'nullable|numeric|min:0',
            'max_kalorije' => 'nullable|numeric|min:0',
            'naziv' => 'nullable|string',
        ]);

        $recepti = Recept::with('sastojci')
            ->when($request->tip_jela, fn($q, $tip) => $q->where('tip_jela', $tip))
            ->when($request->naziv, fn($q, $naziv) => $q->where('naziv', 'like', "%$naziv%"))
            ->when($request->vreme_pripreme_min || $request->vreme_pripreme_max, function ($q) use ($request) {
                if ($request->vreme_pripreme_min) $q->where('vreme_pripreme', '>=', $request->vreme_pripreme_min);
                if ($request->vreme_pripreme_max) $q->where('vreme_pripreme', '<=', $request->vreme_pripreme_max);
            })
            ->when($request->has('sastojak'), function ($q) use ($request) {
                $q->whereHas('sastojci', function ($q2) use ($request) {
                    $sastojak = $request->sastojak;
                    if (isset($sastojak['naziv'])) $q2->where('naziv', 'like', '%' . $sastojak['naziv'] . '%');
                    if (isset($sastojak['kategorija'])) $q2->where('kategorija', 'like', '%' . $sastojak['kategorija'] . '%');
                });
            })
            ->when($request->input('sastojak.tip'), function ($q, $tip) {
                $q->whereDoesntHave('sastojci', fn($s) => $s->where('tip', '!=', $tip));
            });

        if($request->has('min_kalorije') && $request->has('max_kalorije')){
            $recepti->leftJoin('recept_sastojak as rs', 'recepti.id', '=', 'rs.id_recepta')
                 ->leftJoin('sastojci', 'rs.id_sastojka', '=', 'sastojci.id')
                 ->select('recepti.*')
                 ->selectRaw("
                    SUM(
                        CASE 
                            WHEN sastojci.jedinica IN ('g','ml') THEN sastojci.kalorije * rs.kolicina / 100
                            ELSE sastojci.kalorije * rs.kolicina
                        END
                    ) as total_kalorije,
                    SUM(
                        CASE 
                            WHEN sastojci.jedinica IN ('g','ml') THEN sastojci.masti * rs.kolicina / 100
                            ELSE sastojci.masti * rs.kolicina
                        END
                    ) as total_masti,
                    SUM(
                        CASE 
                            WHEN sastojci.jedinica IN ('g','ml') THEN sastojci.proteini * rs.kolicina / 100
                            ELSE sastojci.proteini * rs.kolicina
                        END
                    ) as total_proteini,
                    SUM(
                        CASE 
                            WHEN sastojci.jedinica IN ('g','ml') THEN sastojci.ugljeni_hidrati * rs.kolicina / 100
                            ELSE sastojci.ugljeni_hidrati * rs.kolicina
                        END
                    ) as total_ugljeni
                 ")
                 ->groupBy('recepti.id');

      
        if ($request->min_kalorije) $recepti->having('total_kalorije', '>=', $request->min_kalorije);
        if ($request->max_kalorije) $recepti->having('total_kalorije', '<=', $request->max_kalorije);
        }
        

        $receptiPaginate = $recepti->paginate(10);

        return ReceptResource::collection($receptiPaginate);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri učitavanju recepata.',
            'message' => $e->getMessage()
        ], 500);
    }
}



public function store(Request $request)
{
    try {
        $user = Auth::user();

       
        if (!$user || $user->uloga !== 'administrator') {
            return response()->json([
                'error' => 'Zabranjen pristup.',
                'message' => 'Samo administrator može da dodaje recepte.'
            ], 403);
        }

       
        $validated = $request->validate([
            'naziv' => 'required|string|max:255',
            'tip_jela' => 'required|string|in:doručak,ručak,večera,užina',
            'vreme_pripreme' => 'required|integer|min:0',
            'opis_pripreme'=>'required|string',
            'sastojci' => 'array',
            'sastojci.*.sastojak_id' => 'required|exists:sastojci,id',
            'sastojci.*.kolicina' => 'required|numeric|min:0.01'
        ]);

      
        $recept = Recept::create([
            'naziv' => $validated['naziv'],
            'tip_jela' => $validated['tip_jela'],
            'vreme_pripreme' => $validated['vreme_pripreme'],
            'opis_pripreme' => $validated['opis_pripreme'],
        ]);

     
        foreach ($validated['sastojci'] ?? [] as $s) {
            $recept->sastojci()->attach($s['sastojak_id'], [
                'kolicina' => $s['kolicina']
            ]);
        }

        return response()->json([
            'message' => 'Recept uspešno sačuvan.',
            'data' => new ReceptResource($recept->fresh('sastojci'))
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri čuvanju recepta.',
            'message' => $e->getMessage()
        ], 500);
    }
}



public function show($id)
{
    try {

        $user = Auth::user();
        if(!$user){
             return response()->json(['error' => 'Niste autorizovani.'], 403);
        }
        $recept = Recept::findOrFail($id);
        return new ReceptResource($recept);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri prikazu recepta.',
            'message' => $e->getMessage()
        ], 500);
    }
}

public function destroy($id)
{
    $user = Auth::user();

    if (!$user || $user->uloga !== 'administrator') {
        return response()->json([
            'error' => 'Nemate dozvolu za brisanje recepta.'
        ], 403);
    }

    try {
        $recept = Recept::findOrFail($id);
        $recept->delete();

        return response()->json([
            'message' => 'Recept je uspešno obrisan.'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri brisanju recepta.',
            'message' => $e->getMessage()
        ], 500);
    }
}


public function update(Request $request, $id)
{
    try {
        $user = Auth::user();

      
        if (!$user || $user->uloga !== 'administrator') {
            return response()->json([
                'error' => 'Zabranjen pristup.',
                'message' => 'Samo administrator može da ažurira recepte.'
            ], 403);
        }

      
        $validated = $request->validate([
            'naziv' => 'required|string|max:255',
            'tip_jela' => 'required|string|in:doručak,ručak,večera,užina',
            'vreme_pripreme' => 'required|integer|min:0',
            'opis_pripreme' => 'required|string',
            'sastojci' => 'array',
            'sastojci.*.sastojak_id' => 'required|exists:sastojci,id',
            'sastojci.*.kolicina' => 'required|numeric|min:0.01'
        ]);

     
        $recept = Recept::findOrFail($id);

       
        $recept->update([
            'naziv' => $validated['naziv'],
            'tip_jela' => $validated['tip_jela'],
            'vreme_pripreme' => $validated['vreme_pripreme'],
            'opis_pripreme' => $validated['opis_pripreme'],
        ]);

      
        $pivotData = [];
        foreach ($validated['sastojci'] ?? [] as $s) {
            $pivotData[$s['sastojak_id']] = ['kolicina' => $s['kolicina']];
        }

        $recept->sastojci()->sync($pivotData);

        return response()->json([
            'message' => 'Recept uspešno ažuriran.',
            'data' => new ReceptResource($recept->fresh('sastojci'))
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri ažuriranju recepta.',
            'message' => $e->getMessage()
        ], 500);
    }
}


}

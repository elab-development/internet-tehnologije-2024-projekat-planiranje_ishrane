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




}

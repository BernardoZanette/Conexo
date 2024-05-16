<?php

namespace App\Http\Controllers\Api;

use App\Models\GruposJogos;
use App\Models\GruposPalavras;
use App\Models\Jogos;
use App\Models\Palavras;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\PalavrasResource;
use App\Http\Requests\StoreUpdatePalavrasRequest;

class PalavrasController extends Controller
{

    public function __construct(
        protected Palavras $palavrasRepository, 
        protected GruposPalavras $gruposPalavrasRepository,
        protected GruposJogos $gruposJogosRepository,
        protected Jogos $jogosRepository
    )
    {}

    public function index()
    {

        $palavras = $this->gruposPalavrasRepository->select([
                'palavras.id AS id', 'palavras.nome AS nome', 'grupos.id AS grupos_id', 'grupos.nome AS grupos_nome'
            ])
            ->join('grupos', 'grupos.id', '=', 'grupos_id')
            ->join('palavras', 'palavras.id', '=', 'palavras_id')
            ->get();
        return PalavrasResource::collection($palavras);
    }

    public function store(StoreUpdatePalavrasRequest $request)
    {

        $data = $request->validated();

        $palavra = $this->palavrasRepository->create($data);
        $data['palavras_id'] = $palavra->id;

        $grupoPalavra = $this->gruposPalavrasRepository->create($data);

        return new PalavrasResource($palavra);
    }

    public function show(string $id)
    {

        $palavra = $this->palavrasRepository->findOrFail($id);

        return new PalavrasResource($palavra);
    }

    public function showByGroup(string $id)
    {

        $palavrasIds = $this->gruposPalavrasRepository::where('grupos_id', $id)->get('palavras_id');
        $palavras = $this->palavrasRepository::wherein('id', $palavrasIds)->get();
    
        return $palavras;
    }

    public function update(StoreUpdatePalavrasRequest $request, string $id)
    {

        $palavra = $this->palavrasRepository->findOrFail($id);

        $data = $request->validated();

        $palavra->update($data);

        return new PalavrasResource($palavra);
    }

    public function destroy(string $id)
    {

        $jogosIds = $this->gruposJogosRepository->where('palavras_id', $id)->pluck('jogos_id')->toArray();

        $this->gruposJogosRepository->where('palavras_id', $id)->delete();
        $this->gruposPalavrasRepository->where('palavras_id', $id)->delete();
        $this->jogosRepository->where('jogos_id', $jogosIds);
        $this->palavrasRepository->findOrFail($id)->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

}
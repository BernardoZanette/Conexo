<?php

namespace App\Http\Controllers\Api;

use App\Models\DisciplinasGrupos;
use App\Models\Grupos;
use App\Models\GruposJogos;
use App\Models\GruposPalavras;
use App\Models\Jogos;
use App\Models\Palavras;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\GruposResource;
use App\Http\Requests\StoreUpdateGruposRequest;

class GruposController extends Controller
{

    public function __construct(
        protected Grupos $gruposRepository,
        protected DisciplinasGrupos $disciplinasGruposRepository,
        protected Palavras $palavrasRepository,
        protected GruposPalavras $gruposPalavrasRepository,
        protected Jogos $jogosRepository,
        protected GruposJogos $gruposJogosRepository,
    ) {}

    public function index() {

        $grupos = $this->disciplinasGruposRepository->select([
            'grupos.id AS id', 'grupos.nome AS nome', 'disciplinas.id AS disciplinas_id', 'disciplinas.nome AS disciplinas_nome'
        ])
        ->join('disciplinas', 'disciplinas.id', '=', 'disciplinas_id')
        ->join('grupos', 'grupos.id', '=', 'grupos_id')
        ->get();
        
        return GruposResource::collection($grupos);
    }

    public function store(StoreUpdateGruposRequest $request) {

        $data = $request->validated();

        $grupo = $this->gruposRepository->create($data);
        $data["grupos_id"] = $grupo->id;

        $disciplinasGrupo = $this->disciplinasGruposRepository->create($data);
    
        return new GruposResource($grupo);
    }

    public function show(string $id) {
        
        $grupo = $this->gruposRepository->findOrFail($id);

        $grupoModel = new GruposResource($grupo);
        $disciplinaId = $this->disciplinasGruposRepository->where('grupos_id', $id)->pluck('disciplinas_id');
        $grupoModel->disciplinas_id = $disciplinaId;    

        return $grupoModel;
    }

    public function update(StoreUpdateGruposRequest $request, string $id) {
        
        $grupo = $this->gruposRepository->findOrFail($id);

        $data = $request->validated();
       
        $grupo->update($data);

        return new GruposResource($grupo);
    }

    public function destroy(string $id) {
        
        $palavrasIds = $this->gruposPalavrasRepository->where('grupos_id', $id)->pluck('palavras_id')->toArray();
        $jogosIds = array_unique($this->gruposJogosRepository->where('grupos_id', $id)->pluck('jogos_id')->toArray());

        $this->disciplinasGruposRepository->where('grupos_id', $id)->delete();
        $this->gruposJogosRepository->wherein('jogos_id', $jogosIds)->delete();
        $this->gruposPalavrasRepository->where('grupos_id', $id)->delete();

        $this->gruposRepository->findOrFail($id)->delete();
        $this->palavrasRepository->wherein('id', $palavrasIds)->delete();
        $this->jogosRepository->wherein('id', $jogosIds)->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

}

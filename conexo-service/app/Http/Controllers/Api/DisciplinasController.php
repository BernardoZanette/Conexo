<?php

namespace App\Http\Controllers\Api;

use App\Models\Disciplinas;
use App\Models\DisciplinasGrupos;
use App\Models\Grupos;
use App\Models\GruposJogos;
use App\Models\GruposPalavras;
use App\Models\Jogos;
use App\Models\Palavras;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\DisciplinasResource;
use App\Http\Requests\StoreUpdatedisciplinasRequest;
    
class DisciplinasController extends Controller
{

    public function __construct(        
        protected Disciplinas $disciplinasRepository,
        protected Grupos $gruposRepository,
        protected DisciplinasGrupos $disciplinasGruposRepository,
        protected Palavras $palavrasRepository,
        protected GruposPalavras $gruposPalavrasRepository,
        protected Jogos $jogosRepository,
        protected GruposJogos $gruposJogosRepository,
     ) {}

    public function index() {

        $disciplinas = $this->disciplinasRepository->paginate();

        return DisciplinasResource::collection($disciplinas);
    }

    public function store(StoreUpdateDisciplinasRequest $request) {

        $data = $request->validated();

        $disciplinas = $this->disciplinasRepository->create($data);
    
        return new DisciplinasResource($disciplinas);
    }

    public function show(string $id) {

        $disciplinas = $this->disciplinasRepository->findOrFail($id);
        
        return new DisciplinasResource($disciplinas);
    }

    public function update(StoreUpdateDisciplinasRequest $request, string $id) {

        $disciplinas = $this->disciplinasRepository->findOrFail($id);

        $data = $request->validated();
    
        $disciplinas->update($data);

        return new DisciplinasResource($disciplinas);
    }

    public function destroy(string $id) {
        
        $gruposIds = $this->disciplinasGruposRepository->where('disciplinas_id', $id)->pluck('grupos_id')->toArray();
        $palavrasIds = $this->gruposPalavrasRepository->wherein('grupos_id', $gruposIds)->pluck('palavras_id')->toArray();
        $jogosIds = $this->gruposJogosRepository->wherein('grupos_id', $gruposIds)->pluck('jogos_id')->toArray();

        $this->gruposJogosRepository->wherein('jogos_id', $jogosIds)->delete();
        $this->gruposPalavrasRepository->wherein('grupos_id', $gruposIds)->delete();
        $this->jogosRepository->wherein('id', $jogosIds)->delete();
        $this->gruposRepository->wherein('id', $gruposIds)->delete();
        $this->palavrasRepository->wherein('id', $palavrasIds)->delete();
        $this->disciplinasRepository->where('id', $id)->delete();
    
        return response()->json([], Response::HTTP_NO_CONTENT);
    }

}

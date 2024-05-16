<?php

namespace App\Http\Controllers\Api;

use App\Models\Disciplinas;
use App\Models\DisciplinasGrupos;
use App\Models\Grupos;
use App\Models\GruposJogos;
use App\Models\GruposPalavras;
use App\Models\Jogos;
use App\Models\Palavras;
use App\Models\Professores;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProfessoresResource;
use App\Http\Requests\StoreUpdateProfessoresRequest;

class ProfessoresController extends Controller
{

    public function __construct(
        protected Professores $professoresRepository,
        protected Disciplinas $disciplinasRepository,
        protected Grupos $gruposRepository,
        protected DisciplinasGrupos $disciplinasGruposRepository,
        protected Palavras $palavrasRepository,
        protected GruposPalavras $gruposPalavrasRepository,
        protected Jogos $jogosRepository,
        protected GruposJogos $gruposJogosRepository,
    ) {}

    public function index() {

        $professores = $this->professoresRepository->paginate();

        return ProfessoresResource::collection($professores);
    }

    public function store(StoreUpdateProfessoresRequest $request) {

        $data = $request->validated();

        $data['senha'] = password_hash($request->senha, PASSWORD_BCRYPT);

        $professor = $this->professoresRepository->create($data);
    
        return new ProfessoresResource($professor);
    }

    public function show(string $id) {
        
        $professor = $this->professoresRepository->findOrFail($id);

        return new ProfessoresResource($professor);

    }

    public function update(StoreUpdateProfessoresRequest $request, string $id) {
        
        $professor = $this->professoresRepository->findOrFail($id);

        $data = $request->validated();
       
        $professor->update($data);

        return new ProfessoresResource($professor);
        
    }

    public function destroy(string $id) {

        $disciplinasIds = $this->disciplinasRepository->where('professores_id', $id)->pluck('id')->toArray();
        $gruposIds = $this->disciplinasGruposRepository->wherein('disciplinas_id', $disciplinasIds)->pluck('grupos_id')->toArray();
        $palavrasIds = $this->gruposPalavrasRepository->wherein('grupos_id', $gruposIds)->pluck('palavras_id')->toArray();
        $jogosIds = $this->gruposJogosRepository->wherein('grupos_id', $gruposIds)->pluck('jogos_id')->toArray();

        $this->gruposJogosRepository->wherein('jogos_id', $jogosIds)->delete();
        $this->gruposPalavrasRepository->wherein('grupos_id', $gruposIds)->delete();
        $this->disciplinasGruposRepository->wherein('grupos_id', $gruposIds)->delete();
        $this->jogosRepository->wherein('id', $jogosIds)->delete();
        $this->disciplinasRepository->wherein('id', $disciplinasIds)->delete();
        $this->gruposRepository->wherein('id', $gruposIds)->delete();
        $this->palavrasRepository->wherein('id', $palavrasIds)->delete();
        $this->professoresRepository->where('id', $id)->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

}

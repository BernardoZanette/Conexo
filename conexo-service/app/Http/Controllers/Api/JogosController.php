<?php

namespace App\Http\Controllers\Api;

use App\Models\Grupos;
use App\Models\Jogos;
use App\Models\Palavras;
use App\Models\GruposJogos;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\GruposPalavras;
use App\Models\DisciplinasGrupos;
use App\Http\Controllers\Controller;
use App\Http\Resources\JogosResource;
use App\Http\Requests\StoreUpdateJogosRequest;

class JogosController extends Controller
{

    public function __construct(
        protected Jogos $jogosRepository, 
        protected GruposJogos $gruposJogosRepository,
        protected DisciplinasGrupos $disciplinasGruposRepository,
        protected GruposPalavras $gruposPalavrasRepository,
        protected Palavras $palavrasRepository,
        protected Grupos $gruposRepository
    ) {}

    public function index()
    {
        $jogos = $this->jogosRepository->paginate();

        return JogosResource::collection($jogos);
    }

    public function store(StoreUpdateJogosRequest $request)
    {
        $dataJogo = $request->input('formJogo');
        $dataGruposJogos = $request->input('formGruposJogos');

        $jogo = $this->jogosRepository->create($dataJogo);
        foreach ($dataGruposJogos as $grupoJogo) {
            $grupoJogo['jogos_id'] = $jogo->id;
            $tabelaGruposJogos = $this->gruposJogosRepository->create($grupoJogo);
        }

        return new JogosResource($jogo);
    }

    public function show(string $id)
    {
        $jogo = $this->jogosRepository->findOrFail($id);

        return new JogosResource($jogo);

    }

    public function update(StoreUpdateJogosRequest $request, string $id)
    {
        $jogo = $this->jogosRepository->findOrFail($id);

        $form = $request->input('formJogo');

        $jogo->update($form);

        return response()->json([$form]);
    }

    public function destroy(string $id)
    {
        $this->gruposJogosRepository->where('jogos_id', $id)->delete();
        $this->jogosRepository->findOrFail($id)->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function criarJogoDeDisciplina(string $idDisciplina) {
        $jogo = [];

        $gruposIds = $this->disciplinasGruposRepository
            ->where('disciplinas_id', $idDisciplina)
            ->pluck('grupos_id')
            ->toArray();

        $palavrasIds = $this->palavrasRepository
            ->join('grupos_palavras', 'palavras.id','=','palavras_id')
            ->whereIn('grupos_id', $gruposIds)
            ->pluck('palavras_id')
            ->toArray();
        $repeticoes = array_count_values($palavrasIds);
        uksort($repeticoes, function() { return rand() > rand(); });

        $idsGruposInseridos = [];
        $palavrasInseridasIds = [];

        foreach ($repeticoes as $id => $vezesRepeticoes) {
            $grupos = $this->gruposPalavrasRepository
                ->where('palavras_id', $id)
                ->get()
                ->toArray();
            shuffle($grupos);

            foreach ($grupos as $grupo) {
                if (in_array($grupo['grupos_id'], $idsGruposInseridos)) continue;
                $idsGruposInseridos[] = $grupo['grupos_id'];
                $palavrasDoGrupo = $this->gruposPalavrasRepository
                    ->join('palavras', 'palavras_id', '=', 'palavras.id')
                    ->where('grupos_id', $grupo['grupos_id'])
                    ->get(['palavras.id', 'palavras.nome', 'grupos_id'])
                    ->toArray();

                // embaralhar vetor para palavras não repetirem quando inseridas em jogo:
                shuffle($palavrasDoGrupo);

                for ($j = 0; $j < count($palavrasDoGrupo); $j++) {
                    if (in_array($palavrasDoGrupo[$j]['id'], $palavrasInseridasIds)) {
                        continue;   
                    }

                    $palavrasInseridasIds[] = $palavrasDoGrupo[$j]['id'];
                    // add índice de nome do grupo
                    $grupoNome = $this->gruposRepository->where('id', $grupo['grupos_id'])->pluck('nome')[0];
                    $palavrasDoGrupo[$j]['grupos_nome'] = $grupoNome;
                    $jogo[] = $palavrasDoGrupo[$j];
                    if (count($jogo) % 4 == 0) break;
                }

                if (count($jogo) >= 16) {
                    shuffle($jogo);
                    $jogo = [
                        'data' => $jogo
                    ];
                    return response()->json($jogo);
                }
            }
        }
    }

    public function getJogoSalvo (string $id) {
        $data = $this->gruposJogosRepository->where('jogos_id', $id)
        ->join('grupos','grupos.id','=','grupos_id')
        ->join('palavras','palavras.id','=','palavras_id')
        ->get([
                'palavras.id as id', 'palavras.nome as nome',
                'grupos.nome as grupos_nome', 'grupos.id as grupos_id'
            ])->toArray();
        shuffle($data);
        $jogo = [
            'data' => $data
        ];
        return response()->json($jogo);
    }
}
 <?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PalavrasController;
use App\Http\Controllers\Api\ProfessoresController;
use App\Http\Controllers\Api\DisciplinasController;
use App\Http\Controllers\Api\GruposController;
use App\Http\Controllers\Api\JogosController;

Route::apiResource('/palavras', PalavrasController::class);
Route::get('/palavras/grupo/{id}', [PalavrasController::class, 'showByGroup']);
Route::apiResource('/professores', ProfessoresController::class);
Route::apiResource('/disciplinas', DisciplinasController::class);
Route::apiResource('/grupos', GruposController::class);
Route::apiResource('/jogos', JogosController::class);
Route::get('/jogos/criar/{idDisciplina}', [JogosController::class, 'criarJogoDeDisciplina']);
Route::get('/jogos/salvos/{idJogo}', [JogosController::class, 'getJogoSalvo']);
Route::post('/jogos/guardar', [JogosController::class, 'guardarJogo']);

Route::get('/', function() {
    return response()->json([
        'success' => true
    ]);
});
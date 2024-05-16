<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GruposJogos extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'grupos_id',
        'jogos_id',
        'palavras_id',
    ];
}
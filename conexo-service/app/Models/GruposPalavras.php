<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GruposPalavras extends Model
{
    use HasFactory;
    
    public $timestamps = false;

    protected $fillable = [
        'palavras_id',
        'grupos_id'
    ];
}
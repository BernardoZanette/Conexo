<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisciplinasGrupos extends Model
{
    use HasFactory;
    
    public $timestamps = false;

    protected $fillable = [
        'disciplinas_id',
        'grupos_id'
    ];
}
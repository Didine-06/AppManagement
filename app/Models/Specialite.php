<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialite extends Model
{
    protected $fillable = ['nom'];

    public function niveaux()
    {
        return $this->hasMany(Niveau::class);
    }
}

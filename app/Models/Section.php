<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = ['nom', 'niveau_id'];

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class);
    }
}

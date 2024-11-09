<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    protected $fillable = ['nom', 'section_id'];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function etudiants()
    {
        return $this->hasMany(Student::class);
    }
}


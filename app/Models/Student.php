<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'matricule',
        'niveau',
        'specialite',
        'groupe_id',
    ];

    public function groupe()
{
    return $this->belongsTo(Groupe::class);
}

public function section()
{
    return $this->groupe->section ?? null;
}

public function niveau()
{
    return $this->section?->niveau;
}

public function specialite()
{
    return $this->niveau?->specialite;
}

}


    



// 'inscription',
// 'matricule',
// 'nin',
// 'nom',
// 'prenom',
// 'dateNaissance',
// 'lieuNaissance',
// 'domaine',
// 'filiere',
// 'niveau',
// 'cycle',
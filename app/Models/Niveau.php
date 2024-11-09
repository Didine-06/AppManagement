<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    protected $fillable = ['nom', 'specialite_id'];

    public function specialite()
    {
        return $this->belongsTo(Specialite::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}

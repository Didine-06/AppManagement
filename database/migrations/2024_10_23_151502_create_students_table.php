<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('matricule')->nullable();
            $table->foreignId('groupe_id')->constrained('groupes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};



// $table->string('inscription')->unique(); // Ajout d'unicité
//             $table->string('matricule')->nullable()->unique(); // Matricule unique et nullable
//             $table->string('nin')->unique(); // NIN unique
//             $table->string('nom');
//             $table->string('prenom');
//             $table->date('dateNaissance'); // Utilisation de 'date'
//             $table->string('lieuNaissance');
//             $table->string('domaine');
//             $table->string('filiere');
//             $table->string('niveau');
//             $table->string('cycle');
<?php

namespace App\Imports;

use App\Models\Student;
use App\Models\Specialite;
use App\Models\Niveau;
use App\Models\Section;
use App\Models\Groupe;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Log;

class StudentsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Vérifier si l'étudiant existe déjà par le matricule
        if (Student::where('matricule', $row['matricule'])->exists()) {
            return null; // Ignorer l'étudiant s'il existe déjà
        }

        try {
            // Vérifier ou créer la spécialité
            $specialite = Specialite::firstOrCreate(['nom' => $row['specialite']]);

            // Vérifier ou créer le niveau pour cette spécialité
            $niveau = Niveau::firstOrCreate(
                ['nom' => $row['niveau'], 'specialite_id' => $specialite->id]
            );

            // Vérifier ou créer la section pour ce niveau
            $section = Section::firstOrCreate(
                ['nom' => $row['section'], 'niveau_id' => $niveau->id]
            );

            // Vérifier ou créer le groupe pour cette section
            $groupe = Groupe::firstOrCreate(
                ['nom' => $row['groupe'], 'section_id' => $section->id]
            );

            // Créer l'étudiant en le reliant au groupe approprié
            return new Student([
                'nom' => $row['nom'],
                'prenom' => $row['prenom' ],
                'matricule' => $row['matricule'],
                'groupe_id' => $groupe->id, // Associe l'étudiant au groupe créé ou existant
            ]);
        } catch (\Exception $e) {
            // Log en cas d'erreur avec les informations du fichier et l'erreur
            Log::error('Erreur lors de l\'importation de la ligne CSV : ' . json_encode($row) . ' - ' . $e->getMessage());
            return null; // Ignorer la ligne si une erreur survient
        }
    }
}




















// namespace App\Imports;

// use App\Models\Student; // Utilisation du modèle au singulier
// use Maatwebsite\Excel\Concerns\ToModel;
// use Maatwebsite\Excel\Concerns\WithHeadingRow;
// use Illuminate\Support\Facades\Log;


// class StudentsImport implements ToModel, WithHeadingRow
// {
//     public function model(array $row)
//     {

//         if (Student::where('matricule', $row['matricule'])->exists()) {
//             return null; // Ignorer la ligne si le matricule ou l'email existe déjà
//         }
        
//         try {
//             return new Student([
//                 'nom' => $row['nom'],
//                 'prenom' => $row['prenom' ],
//                 'matricule' => $row['matricule'],
//                 'niveau' => $row['niveau'],
//                 'specialite' => $row['specialite'],
//             ]);
//         } catch (\Exception $e) {
//             Log::error('Erreur lors de l\'importation de la ligne CSV : ' . json_encode($row) . ' - ' . $e->getMessage());
//             return null; // Ignorer les lignes invalides
//         }
//     }
// }





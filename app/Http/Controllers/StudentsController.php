<?php

namespace App\Http\Controllers;

use App\Imports\StudentsImport;
use App\Models\Student;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentsController extends Controller
{
    // Dans app/Http/Controllers/StudentController.php

    public function index(Request $request)
    {
        $search = $request->input('search');

        $students = Student::with(['groupe.section.niveau.specialite']) // Charge les relations
            ->where('nom', 'like', "%$search%")
            ->orWhere('prenom', 'like', "%$search%")
            ->orWhere('matricule', 'like', "%$search%")
            ->get();

        return response()->json($students);
    }


   





    // Dans app/Http/Controllers/StudentController.php

    public function destroy($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json(['message' => 'Étudiant non trouvé'], 404);
        }

        $student->delete();

        return response()->json(['message' => 'Étudiant supprimé avec succès'], 200);
    }




    public function import(Request $request)
    {
        // Validation du fichier CSV uniquement
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:2048', // Fichier doit être CSV ou TXT
        ]);

        try {
            Excel::import(new StudentsImport, $request->file('file'));
            return response()->json(['message' => 'Importation réussie !']);
        } catch (\Exception $e) {
            // Log l'exception
            Log::error('Erreur lors de l\'importation du fichier CSV : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'importation.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
{
    $request->validate([
        'nom' => 'required|string',
        'prenom' => 'required|string',
        'matricule' => 'required|string|unique:students,matricule,'.$id,
        'groupe_id' => 'required|exists:groupes,id',
    ]);

    $student = Student::find($id);
    if (!$student) {
        return response()->json(['message' => 'Étudiant non trouvé'], 404);
    }

    $student->update($request->all());

    return response()->json(['message' => 'Étudiant mis à jour avec succès', 'student' => $student], 200);
}



}


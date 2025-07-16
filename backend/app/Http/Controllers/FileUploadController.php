<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:2048',
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('uploads', 'public');
            return response()->json(['message' => 'Fichier envoyé avec succès !', 'path' => $path], 200);
        }

        return response()->json(['error' => 'Échec de l’upload'], 400);
    }
}

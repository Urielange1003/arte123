<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function index()
    {
        $profiles = Profile::with('user')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $profiles,
            'message' => 'Profiles retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $profile = Profile::with('user')->find($id);

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $profile,
            'message' => 'Profile retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'date_of_birth' => 'required|date',
            'address' => 'required|string',
            'phone' => 'required|string',
            'education_level' => 'required|string',
            'formation_type' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $profile = Profile::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $profile,
            'message' => 'Profile created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $profile = Profile::find($id);

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'date_of_birth' => 'date',
            'address' => 'string',
            'phone' => 'string',
            'education_level' => 'string',
            'formation_type' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $profile->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $profile,
            'message' => 'Profile updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $profile = Profile::find($id);

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found'
            ], 404);
        }

        $profile->delete();

        return response()->json([
            'success' => true,
            'message' => 'Profile deleted successfully'
        ]);
    }
}
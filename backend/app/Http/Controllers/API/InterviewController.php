<?php
namespace app\Http\Controllers\API;

use app\Http\Controllers\Controller;
use app\Models\Interview;
use app\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InterviewController extends Controller
{
    public function index()
    {
        $interviews = Interview::with('application')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $interviews,
            'message' => 'Interviews retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $interview = Interview::with('application')->find($id);

        if (!$interview) {
            return response()->json([
                'success' => false,
                'message' => 'Interview not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $interview,
            'message' => 'Interview retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'application_id' => 'required|exists:applications,id',
            'interview_date' => 'required|date|after:now',
            'status' => 'required|in:pending,done,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $interview = Interview::create($request->all());

        // Notify the applicant
        Notification::create([
            'user_id' => $interview->application->user_id,
            'title' => 'Entretien programmé',
            'content' => "Votre entretien a été programmé pour le " . 
                        date('d/m/Y à H:i', strtotime($interview->interview_date)),
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'data' => $interview,
            'message' => 'Interview scheduled successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $interview = Interview::find($id);

        if (!$interview) {
            return response()->json([
                'success' => false,
                'message' => 'Interview not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'interview_date' => 'date|after:now',
            'status' => 'in:pending,done,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldStatus = $interview->status;
        $interview->update($request->all());

        // If status changed, notify the applicant
        if ($oldStatus !== $interview->status) {
            $message = match($interview->status) {
                'done' => "Votre entretien a été marqué comme terminé",
                'rejected' => "Votre candidature n'a pas été retenue suite à l'entretien",
                default => "Le statut de votre entretien a été mis à jour"
            };

            Notification::create([
                'user_id' => $interview->application->user_id,
                'title' => 'Mise à jour de l\'entretien',
                'content' => $message,
                'is_read' => false
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $interview,
            'message' => 'Interview updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $interview = Interview::find($id);

        if (!$interview) {
            return response()->json([
                'success' => false,
                'message' => 'Interview not found'
            ], 404);
        }

        // Notify the applicant
        Notification::create([
            'user_id' => $interview->application->user_id,
            'title' => 'Entretien annulé',
            'content' => "Votre entretien a été annulé. Un nouveau créneau vous sera proposé.",
            'is_read' => false
        ]);

        $interview->delete();

        return response()->json([
            'success' => true,
            'message' => 'Interview deleted successfully'
        ]);
    }
}
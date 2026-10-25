<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_number' => ['required', 'string', 'max:255', 'unique:students,student_number'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:students,email'],
            'course' => ['required', 'string', 'max:255'],
            'year_level' => ['required', 'integer', 'between:1,6'],
        ]);

        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    public function show(string $id)
    {
        $student = Student::findOrFail($id);

        return response()->json($student);
    }

    public function update(Request $request, string $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'student_number' => [
                'required', 'string', 'max:255',
                Rule::unique('students', 'student_number')->ignore($student->id),
            ],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'email',
                Rule::unique('students', 'email')->ignore($student->id),
            ],
            'course' => ['required', 'string', 'max:255'],
            'year_level' => ['required', 'integer', 'between:1,6'],
        ]);

        $student->update($validated);

        return response()->json($student);
    }

    public function destroy(string $id)
    {
        $student = Student::findOrFail($id);

        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully.'
        ]);
    }
}

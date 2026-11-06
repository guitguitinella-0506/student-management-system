<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAuth } from './composables/useAuth';
import { useStudents } from './composables/useStudents';
import { useFeedback } from './composables/useFeedback';
import LoginForm from './components/LoginForm.vue';
import StudentForm from './components/StudentForm.vue';
import StudentTable from './components/StudentTable.vue';

const { role, userName, isLoggedIn, isAdmin, logout } = useAuth();
const {
    students, loading, saving, deletingId, formErrors,
    loadStudents, saveStudent, deleteStudent,
    clearFieldError, clearErrors, resetStudents,
} = useStudents();
const { feedback, notify } = useFeedback();

// Local UI state
const editingStudent = ref(null);
const showForm = ref(false);

function openAdd() {
    editingStudent.value = null;
    clearErrors();
    showForm.value = true;
}

function openEdit(student) {
    editingStudent.value = student;
    clearErrors();
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editingStudent.value = null;
    clearErrors();
}

async function handleSave(payload) {
    const saved = await saveStudent(payload, editingStudent.value?.id);
    if (saved) closeForm();
}

async function handleDelete(student) {
    if (!confirm(`Delete ${student.first_name} ${student.last_name}?`)) return;
    await deleteStudent(student);
}

async function handleLoggedIn() {
    notify('Logged in successfully.');
    await loadStudents();
}

async function handleLogout() {
    await logout();
    notify('Logged out successfully.');
}

// React to state changes: when the session ends, clear everything
watch(isLoggedIn, (loggedIn) => {
    if (!loggedIn) {
        resetStudents();
        closeForm();
    }
});

onMounted(() => {
    if (isLoggedIn.value) loadStudents();
});
</script>

<template>
    <div class="container">
        <h1>Student Management</h1>

        <div v-if="feedback.message" :class="['alert', feedback.type]">{{ feedback.message }}</div>

        <LoginForm v-if="!isLoggedIn" @logged-in="handleLoggedIn" />

        <template v-else>
            <div class="header">
                <span>
                    {{ userName }}
                    <strong class="badge">{{ role }}</strong>
                </span>
                <div>
                    <button v-if="isAdmin" class="btn btn-primary" @click="openAdd">+ Add Student</button>
                    <button class="btn btn-secondary" @click="handleLogout">Logout</button>
                </div>
            </div>

            <StudentForm
                v-if="showForm"
                :student="editingStudent"
                :errors="formErrors"
                :saving="saving"
                @save="handleSave"
                @cancel="closeForm"
                @clear-error="clearFieldError"
            />

            <StudentTable
                :students="students"
                :is-admin="isAdmin"
                :loading="loading"
                :deleting-id="deletingId"
                @edit="openEdit"
                @delete="handleDelete"
            />

            <div class="card state-panel">
                <h2>Vue State (live)</h2>
                <ul>
                    <li>isLoggedIn: <strong>{{ isLoggedIn }}</strong></li>
                    <li>role: <strong>{{ role }}</strong></li>
                    <li>isAdmin: <strong>{{ isAdmin }}</strong></li>
                    <li>students loaded: <strong>{{ students.length }}</strong></li>
                    <li>loading: <strong>{{ loading }}</strong></li>
                    <li>saving: <strong>{{ saving }}</strong></li>
                    <li>form open: <strong>{{ showForm }}</strong></li>
                    <li>editing id: <strong>{{ editingStudent?.id ?? 'none' }}</strong></li>
                </ul>
            </div>
        </template>
    </div>
</template>

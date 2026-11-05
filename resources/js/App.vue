<script setup>
import { ref, computed, onMounted } from 'vue';
import api from './api';
import LoginForm from './components/LoginForm.vue';
import StudentForm from './components/StudentForm.vue';
import StudentTable from './components/StudentTable.vue';

const token = ref(localStorage.getItem('token'));
const role = ref(localStorage.getItem('role'));
const students = ref([]);
const editingStudent = ref(null);
const showForm = ref(false);
const loading = ref(false);
const saving = ref(false);
const formErrors = ref({});
const message = ref('');
const messageType = ref('success');

const isLoggedIn = computed(() => !!token.value);
const isAdmin = computed(() => role.value === 'admin');

function notify(text, type = 'success') {
    message.value = text;
    messageType.value = type;
    setTimeout(() => (message.value = ''), 4000);
}

function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    token.value = null;
    role.value = null;
    students.value = [];
    closeForm();
}

function handleError(e, fallback) {
    const status = e.response?.status;
    if (status === 422) {
        formErrors.value = e.response.data.errors || {};
        notify('Please fix the validation errors below.', 'error');
    } else if (status === 401) {
        clearSession();
        notify('Session expired. Please log in again.', 'error');
    } else if (status === 403) {
        notify('You do not have permission to do that.', 'error');
    } else if (status === 404) {
        notify('Student not found.', 'error');
    } else {
        notify(fallback, 'error');
    }
}

async function loadStudents() {
    loading.value = true;
    try {
        const { data } = await api.get('/students');
        students.value = data;
    } catch (e) {
        handleError(e, 'Failed to load students.');
    } finally {
        loading.value = false;
    }
}

function onLoggedIn({ token: newToken, role: newRole }) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    token.value = newToken;
    role.value = newRole;
    notify('Logged in successfully.');
    loadStudents();
}

async function logout() {
    try {
        await api.post('/logout');
    } catch (e) {
        // token may already be invalid, just clear it locally
    }
    clearSession();
    notify('Logged out successfully.');
}

function openAdd() {
    editingStudent.value = null;
    formErrors.value = {};
    showForm.value = true;
}

function openEdit(student) {
    editingStudent.value = student;
    formErrors.value = {};
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editingStudent.value = null;
    formErrors.value = {};
}

async function saveStudent(payload) {
    saving.value = true;
    formErrors.value = {};
    try {
        if (editingStudent.value) {
            await api.put(`/students/${editingStudent.value.id}`, payload);
            notify('Student updated successfully.');
        } else {
            await api.post('/students', payload);
            notify('Student added successfully.');
        }
        closeForm();
        await loadStudents();
    } catch (e) {
        handleError(e, 'Could not save the student.');
    } finally {
        saving.value = false;
    }
}

async function deleteStudent(student) {
    if (!confirm(`Delete ${student.first_name} ${student.last_name}?`)) return;
    try {
        await api.delete(`/students/${student.id}`);
        notify('Student deleted successfully.');
        await loadStudents();
    } catch (e) {
        handleError(e, 'Could not delete the student.');
    }
}

onMounted(() => {
    if (isLoggedIn.value) loadStudents();
});
</script>

<template>
    <div class="container">
        <h1>Student Management</h1>

        <div v-if="message" :class="['alert', messageType]">{{ message }}</div>

        <LoginForm v-if="!isLoggedIn" @logged-in="onLoggedIn" />

        <template v-else>
            <div class="header">
                <span>Logged in as <strong class="badge">{{ role }}</strong></span>
                <div>
                    <button v-if="isAdmin" class="btn btn-primary" @click="openAdd">+ Add Student</button>
                    <button class="btn btn-secondary" @click="logout">Logout</button>
                </div>
            </div>

            <StudentForm
                v-if="showForm"
                :student="editingStudent"
                :errors="formErrors"
                :saving="saving"
                @save="saveStudent"
                @cancel="closeForm"
            />

            <StudentTable
                :students="students"
                :is-admin="isAdmin"
                :loading="loading"
                @edit="openEdit"
                @delete="deleteStudent"
            />
        </template>
    </div>
</template>
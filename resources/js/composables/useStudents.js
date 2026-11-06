import { ref } from 'vue';
import api from '../api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';


const students = ref([]);
const loading = ref(false);
const saving = ref(false);
const deletingId = ref(null);
const formErrors = ref({});

export function useStudents() {
    const { clearSession } = useAuth();
    const { notify } = useFeedback();

    function handleError(e, fallback) {
        const status = e.response?.status;
        if (status === 422) {
            formErrors.value = e.response.data.errors || {};
            notify('Please fix the validation errors below.', 'error');
        } else if (status === 401) {
            clearSession();
            notify('Session expired. Please log in again.', 'error');
        } else if (status === 403) {
            notify('Forbidden: your role is not allowed to do that.', 'error');
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

    // Returns true when saved, so the caller can close the form
    async function saveStudent(payload, id = null) {
        saving.value = true;
        formErrors.value = {};
        try {
            if (id) {
                await api.put(`/students/${id}`, payload);
                notify('Student updated successfully.');
            } else {
                await api.post('/students', payload);
                notify('Student added successfully.');
            }
            await loadStudents();
            return true;
        } catch (e) {
            handleError(e, 'Could not save the student.');
            return false;
        } finally {
            saving.value = false;
        }
    }

    async function deleteStudent(student) {
        deletingId.value = student.id;
        try {
            await api.delete(`/students/${student.id}`);
            notify('Student deleted successfully.');
            await loadStudents();
        } catch (e) {
            handleError(e, 'Could not delete the student.');
        } finally {
            deletingId.value = null;
        }
    }

    function clearFieldError(key) {
        delete formErrors.value[key];
    }

    function clearErrors() {
        formErrors.value = {};
    }

    function resetStudents() {
        students.value = [];
        formErrors.value = {};
    }

    return {
        students, loading, saving, deletingId, formErrors,
        loadStudents, saveStudent, deleteStudent,
        clearFieldError, clearErrors, resetStudents,
    };
}

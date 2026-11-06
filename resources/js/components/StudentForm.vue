<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
    student: { type: Object, default: null },
    errors: { type: Object, default: () => ({}) },
    saving: { type: Boolean, default: false },
});

const emit = defineEmits(['save', 'cancel', 'clear-error']);

const fields = [
    { key: 'student_number', label: 'Student Number', type: 'text' },
    { key: 'first_name', label: 'First Name', type: 'text' },
    { key: 'last_name', label: 'Last Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'year_level', label: 'Year Level (1-6)', type: 'number' },
];

const emptyForm = () => ({
    student_number: '',
    first_name: '',
    last_name: '',
    email: '',
    course: '',
    year_level: '',
});


const form = reactive(emptyForm());
const isEditing = computed(() => !!props.student);


watch(
    () => props.student,
    (student) => {
        Object.assign(form, student
            ? {
                student_number: student.student_number,
                first_name: student.first_name,
                last_name: student.last_name,
                email: student.email,
                course: student.course,
                year_level: student.year_level,
            }
            : emptyForm());
    },
    { immediate: true }
);

function submit() {
    emit('save', { ...form });
}
</script>

<template>
    <form class="card" @submit.prevent="submit">
        <h2>{{ isEditing ? 'Edit Student' : 'Add Student' }}</h2>

        <div v-for="field in fields" :key="field.key" class="field">
            <label :for="field.key">{{ field.label }}</label>
            <input
                :id="field.key"
                v-model="form[field.key]"
                :type="field.type"
                :class="{ invalid: errors[field.key] }"
                @input="emit('clear-error', field.key)"
            />
            <small v-if="errors[field.key]" class="error">{{ errors[field.key][0] }}</small>
        </div>

        <button class="btn btn-primary" type="submit" :disabled="saving">
            {{ saving ? 'Saving...' : isEditing ? 'Update Student' : 'Save Student' }}
        </button>
        <button class="btn btn-secondary" type="button" @click="emit('cancel')">Cancel</button>
    </form>
</template>
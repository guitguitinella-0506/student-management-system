<script setup>
import { ref } from 'vue';
import api from '../api';

const emit = defineEmits(['logged-in']);

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const fieldErrors = ref({});

async function submit() {
    loading.value = true;
    error.value = '';
    fieldErrors.value = {};
    try {
        const { data } = await api.post('/login', {
            email: email.value,
            password: password.value,
        });
        emit('logged-in', { token: data.token, role: data.role ?? data.user?.role });
    } catch (e) {
        if (e.response?.status === 422) {
            fieldErrors.value = e.response.data.errors || {};
        } else if (e.response?.status === 401) {
            error.value = e.response.data.message;
        } else {
            error.value = 'Unable to reach the server.';
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <form class="card" @submit.prevent="submit">
        <h2>Login</h2>

        <div v-if="error" class="alert error">{{ error }}</div>

        <div class="field">
            <label for="email">Email</label>
            <input id="email" v-model="email" type="text" placeholder="admin@example.com"
                   :class="{ invalid: fieldErrors.email }" />
            <small v-if="fieldErrors.email" class="error">{{ fieldErrors.email[0] }}</small>
        </div>

        <div class="field">
            <label for="password">Password</label>
            <input id="password" v-model="password" type="password" placeholder="password"
                   :class="{ invalid: fieldErrors.password }" />
            <small v-if="fieldErrors.password" class="error">{{ fieldErrors.password[0] }}</small>
        </div>

        <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
        </button>
    </form>
</template>
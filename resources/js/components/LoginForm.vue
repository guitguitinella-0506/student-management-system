<script setup>
import { reactive, ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const emit = defineEmits(['logged-in']);
const { login } = useAuth();


const form = reactive({ email: '', password: '' });
const loading = ref(false);
const error = ref('');
const fieldErrors = ref({});

function clearFieldError(key) {
    delete fieldErrors.value[key];
}

async function submit() {
    loading.value = true;
    error.value = '';
    fieldErrors.value = {};
    try {
        await login(form.email, form.password);
        form.password = '';
        emit('logged-in');
    } catch (e) {
        const status = e.response?.status;
        if (status === 422) {
            fieldErrors.value = e.response.data.errors || {};
        } else if (status === 401) {
            error.value = e.response.data.message || 'Invalid email or password';
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
            <input id="email" v-model="form.email" type="text" placeholder="Email"
                   :class="{ invalid: fieldErrors.email }" @input="clearFieldError('email')" />
            <small v-if="fieldErrors.email" class="error">{{ fieldErrors.email[0] }}</small>
        </div>

        <div class="field">
            <label for="password">Password</label>
            <input id="password" v-model="form.password" type="password" placeholder="Password"
                   :class="{ invalid: fieldErrors.password }" @input="clearFieldError('password')" />
            <small v-if="fieldErrors.password" class="error">{{ fieldErrors.password[0] }}</small>
        </div>

        <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
        </button>
    </form>
</template>
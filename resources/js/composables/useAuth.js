import { ref, computed } from 'vue';
import api from '../api';


const token = ref(localStorage.getItem('token'));
const role = ref(localStorage.getItem('role'));
const userName = ref(localStorage.getItem('name'));

export function useAuth() {
    const isLoggedIn = computed(() => !!token.value);
    const isAdmin = computed(() => role.value === 'admin');

    async function login(email, password) {
        const { data } = await api.post('/login', { email, password });

        token.value = data.token;
        role.value = data.role ?? data.user?.role;
        userName.value = data.user?.name ?? '';

        localStorage.setItem('token', token.value);
        localStorage.setItem('role', role.value);
        localStorage.setItem('name', userName.value);
    }

    function clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        token.value = null;
        role.value = null;
        userName.value = null;
    }

    async function logout() {
        try {
            await api.post('/logout'); // Laravel revokes the token
        } catch (e) {

        }
        clearSession();
    }

    return { role, userName, isLoggedIn, isAdmin, login, logout, clearSession };
}

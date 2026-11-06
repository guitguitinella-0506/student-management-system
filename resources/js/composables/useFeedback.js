import { reactive } from 'vue';


const feedback = reactive({ message: '', type: 'success' });
let timer = null;

export function useFeedback() {
    function notify(message, type = 'success') {
        feedback.message = message;
        feedback.type = type;
        clearTimeout(timer);
        timer = setTimeout(() => (feedback.message = ''), 4000);
    }

    return { feedback, notify };
}


// Supabase Configuration
const SUPABASE_URL = 'https://sraldtxwrwifngnjpiex.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kyeGO7vFN0-3L1BuqvqLnA_VLWkXPaS';

// Usamos un nombre diferente para la instancia del cliente para evitar conflictos con la librería global
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const registrationForm = document.getElementById('registrationForm');
const statusMessage = document.getElementById('statusMessage');
const submitBtn = document.getElementById('submitBtn');

registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerText = 'Enviando...';
    hideStatus();

    const formData = new FormData(registrationForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        created_at: new Date().toISOString()
    };

    try {
        // IMPORTANTE: Asegúrate de tener una tabla llamada 'submissions' en tu base de datos Supabase
        // con las columnas: id (int8, auto-increment), name (text), email (text), message (text), created_at (timestamptz)
        const { error } = await db
            .from('submissions')
            .insert([data]);

        if (error) throw error;

        showStatus('¡Registro completado con éxito!', 'success');
        registrationForm.reset();
    } catch (error) {
        console.error('Error:', error);
        showStatus('Error al enviar: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Enviar Registro';
    }
});

function showStatus(message, type) {
    statusMessage.innerText = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
}

function hideStatus() {
    statusMessage.style.display = 'none';
}

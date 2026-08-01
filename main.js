const clockElement = document.getElementById('clock');
let timeOffset = 0; // Diferencia entre hora local y de servidor

// Función para sincronizar con la hora del servidor (referencia Google/NTP)
async function syncTime() {
    try {
        console.log("Intentando sincronizar con servidor de tiempo...");
        // Hacemos la petición a la API de tiempo (CDMX)
        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Mexico_City');
        
        if (!response.ok) {
            throw new Error('No se pudo conectar con la API de tiempo.');
        }

        const data = await response.json();
        
        const serverTime = new Date(data.utc_datetime).getTime();
        const localTime = Date.now();
        
        // Calculamos la diferencia
        timeOffset = serverTime - localTime;
        console.log("¡Sincronizado con éxito! Usando referencia de servidor.");
    } catch (error) {
        // --- FALLBACK ACTIVO ---
        // Si hay algún error, usamos la hora local y mostramos un aviso en la consola.
        console.warn('Fallo en sincronización. Usando FALLBACK de hora local.', error);
        timeOffset = 0; // No aplicamos diferencia, usamos local.
    }
}

// Función que actualiza los números del reloj
function updateClock() {
    // Calculamos la hora exacta aplicando la diferencia
    const now = new Date(Date.now() + timeOffset);
    
    // Formato HH:MM descartando los segundos
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // Actualizamos el elemento con la hora actual
    clockElement.textContent = `${hours}:${minutes}`;
}

// Función principal de inicialización
async function initClockApp() {
    // Primero, intentamos sincronizar
    await syncTime();
    
    // Ejecutamos la primera actualización inmediatamente para no esperar un segundo
    updateClock();
    
    // Programamos la actualización para cada segundo
    setInterval(updateClock, 1000); 
}

// Arrancamos la aplicación
initClockApp();

const clockElement = document.getElementById('clock');
let timeOffset = 0;

// Función para sincronizar con un servidor de tiempo global
async function syncTime() {
    try {
        // Obtenemos la hora real de un servidor NTP público (Zona horaria de México)
        const response = await fetch('http://worldtimeapi.org/api/timezone/America/Mexico_City');
        const data = await response.json();
        
        const serverTime = new Date(data.utc_datetime).getTime();
        const localTime = Date.now();
        
        // Calculamos la diferencia entre el tiempo real y el de la PC local
        timeOffset = serverTime - localTime;
    } catch (error) {
        console.warn('No se pudo sincronizar con el servidor, usando la hora local.', error);
    }
}

function updateClock() {
    // Calculamos la hora exacta aplicando la diferencia obtenida
    const now = new Date(Date.now() + timeOffset);
    
    // Formato HH:MM descartando los segundos
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    clockElement.textContent = `${hours}:${minutes}`;
}

// Inicializar
syncTime().then(() => {
    updateClock();
    // Actualizamos cada segundo para que el salto de minuto sea exacto
    setInterval(updateClock, 1000); 
});
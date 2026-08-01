const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const periodElement = document.getElementById('period');
let timeOffset = 0;

async function syncTime() {
    try {
        console.log("Intentando sincronizar con servidor de tiempo...");
        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Mexico_City');
        
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        const serverTime = new Date(data.utc_datetime).getTime();
        const localTime = Date.now();
        
        timeOffset = serverTime - localTime;
    } catch (error) {
        console.warn('Usando FALLBACK de hora local.', error);
        timeOffset = 0; 
    }
}

function updateClock() {
    const now = new Date(Date.now() + timeOffset);
    
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // Determinar si es AM o PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convertir a formato 12 horas
    hours = hours % 12;
    hours = hours ? hours : 12; // Si es 0, que muestre 12
    
    // Los minutos siempre deben tener dos dígitos (ej. 05 en vez de 5)
    const minutesStr = String(minutes).padStart(2, '0');
    
    // Actualizar el HTML
    // NOTA: La imagen original no tiene un "0" inicial en las horas (ej. muestra 3 en vez de 03)
    hoursElement.textContent = hours; 
    minutesElement.textContent = minutesStr;
    periodElement.textContent = ampm;
}

async function initClockApp() {
    await syncTime();
    updateClock();
    setInterval(updateClock, 1000); 
}

initClockApp();

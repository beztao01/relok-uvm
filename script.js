const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const periodElement = document.getElementById('period');

let timeOffset = 0;
let currentMinute = -1; // Variable nueva para rastrear si el minuto cambió

async function syncTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Mexico_City');
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        const serverTime = new Date(data.utc_datetime).getTime();
        const localTime = Date.now();
        timeOffset = serverTime - localTime;
    } catch (error) {
        timeOffset = 0; 
    }
}

function updateClock() {
    const now = new Date(Date.now() + timeOffset);
    
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    const minutesStr = String(minutes).padStart(2, '0');
    
    // Actualizamos las horas y AM/PM de forma normal
    hoursElement.textContent = hours; 
    periodElement.textContent = ampm;

    // LÓGICA DE ANIMACIÓN DEL MINUTO
    if (currentMinute !== minutes) {
        if (currentMinute !== -1) {
            const minuteCard = minutesElement.parentElement;
            
            // 1. Agregamos la clase que inicia el giro en CSS
            minuteCard.classList.add('flip-anim');
            
            // 2. Cambiamos el texto justo a la mitad del giro (a los 300 milisegundos)
            setTimeout(() => {
                minutesElement.textContent = minutesStr;
            }, 300);

            // 3. Removemos la clase cuando el giro termina (a los 600 milisegundos)
            setTimeout(() => {
                minuteCard.classList.remove('flip-anim');
            }, 600);
        } else {
            // Si es la primera vez que carga la página, ponemos el número sin animar
            minutesElement.textContent = minutesStr;
        }
        // Actualizamos el registro del minuto actual
        currentMinute = minutes; 
    }
}

async function initClockApp() {
    await syncTime();
    updateClock();
    setInterval(updateClock, 1000); 
}

initClockApp();

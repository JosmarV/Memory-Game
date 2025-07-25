## Memory Game

To Do
Lista de Tareas del Proyecto
✅ Tareas Completadas  
1. Mostrar/ocultar contenido de las cartas ✓
2. Lógica de detección de pares abiertos ✓
3. Detección de victoria (todas las cartas emparejadas) ✓
4. Panel de estadísticas (intentos, puntos, tiempo básico) ✓
5. Botones de control (reinicio y pausa) ✓
6. Pantalla de victoria (básica) ✓
7. Corregir bug al reanudar el juego ✓

📝 Tareas Pendientes
🎨 Interfaz y Experiencia de Usuario
8. Mejorar interactividad

    * Feedback visual al encontrar pares (ej: animación de "match").
    * boton de inicio

9. Optimizar gráficos

    * Redimensionar imágenes para evitar pixelación (usar image-rendering: crisp-edges en CSS). ✓
    * Animación de título y botón de inicio
    * Título centrado al inicio + botón "Play" grande (ej: transform: scale(1.2)).
    * Transición suave al mover título arriba y reducir tamaño (transition en CSS).
    * En movil mejorar la disposicion de las cartas 
    * Asegurarse que la pantalla de carga cargue la pantalla completa si el jugador ha hecho scroll que devulva hacia 
    arriba primero y luego mostrar pantalla de carga y bloque el scroll

⚙️ Funcionalidades
10. Sistema de audio 

    * Música de fondo (usar Howler.js o <audio> loop). ✓
    * Efectos de sonido (voltear carta, match, victoria).

11. Selector de temas

    * Menú desplegable para elegir imágenes (ej: animales, frutas, etc.).
    * Cargar dinámicamente archivos JSON con rutas de imágenes.

📱 Responsive y Escalabilidad
12. Formato de tiempo (HH:MM:SS)
    * Usar new Date(tiempoEnMilisegundos).toISOString().substr(11, 8) para conversión.

🔧 Mejoras Técnicas
13. Optimizar código
    * Modularizar funciones (ej: gameLogic.js, uiControls.js).
    * Usar clases o componentes reutilizables para cartas.

🧪 Testing y Validación (Nueva Sección)
14. Pruebas de compatibilidad
    * Verificar funcionamiento en Chrome, Firefox, Safari y móviles (iOS/Android).

15. Pruebas de rendimiento

    * Medir carga de imágenes (Lighthouse en DevTools).
    * Optimizar memoria (evitar setInterval sin limpiar).


Nota
Pregunta de diseño: Para proyectos más grandes, ¿qué alternativas existen para manejar el estado (isProcessing, allElements, etc.) sin que sean globales? Esto es algo para pensar a futuro, cuando quieres escalar tu aplicación o tener un control más estricto del flujo de datos. 
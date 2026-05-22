# Base de datos en la nube

La pagina usa Firebase Realtime Database para sincronizar las sesiones, respuestas, eventos, fases desbloqueadas, puntaje, estrellas, ranking y estado actual de la partida. Mientras `enabled` este en `false`, la pagina conserva el almacenamiento local del navegador.

## Activar Realtime Database

1. Crea un proyecto en Firebase.
2. Activa **Realtime Database**.
3. Copia la URL de la base de datos.
4. Edita `js/cloud-config.js`:

```js
window.MATEDRAG_CLOUD = {
  enabled: true,
  provider: "realtime",
  firebaseDatabaseURL: "https://TU-PROYECTO-default-rtdb.firebaseio.com",
  rootPath: "ruta-numerica",
};
```

En Firebase, las reglas van en formato JSON. Para pruebas rapidas puedes usar:

```json
{
  "rules": {
    "ruta-numerica": {
      ".read": true,
      ".write": true
    }
  }
}
```

Con eso, los estudiantes y el profesor veran la misma informacion desde cualquier equipo que abra esta misma pagina con internet.

## Nota importante

La pagina guarda primero en el navegador y sube enseguida a Realtime Database. Si Firebase tarda o no responde, deja el cambio en una cola local y lo reintenta automaticamente para no perder el avance.

Estas reglas abiertas sirven para pruebas escolares rapidas, pero para uso real conviene proteger la base con autenticacion o un backend propio.

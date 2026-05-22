# Base de datos en la nube

La pagina usa Cloud Firestore para sincronizar las sesiones, respuestas, eventos, fases desbloqueadas, puntaje, estrellas, ranking y estado actual de la partida. Mientras `enabled` este en `false`, la pagina conserva el almacenamiento local del navegador.

## Activar Firestore

1. Crea un proyecto en Firebase.
2. Activa **Firestore Database** y tambien la API **Cloud Firestore API** para ese proyecto.
3. Copia el ID del proyecto y, si tus reglas lo requieren, la API key web.
4. Edita `js/cloud-config.js`:

```js
window.MATEDRAG_CLOUD = {
  enabled: true,
  provider: "firestore",
  firebaseProjectId: "TU-PROYECTO",
  firestoreDatabaseId: "(default)",
  firestoreCollection: "ruta-numerica-sessions",
  firebaseApiKey: "TU-API-KEY-WEB",
  rootPath: "ruta-numerica",
};
```

Con eso, los estudiantes y el profesor veran la misma informacion desde cualquier equipo que abra esta misma pagina con internet.

## Nota importante

La pagina guarda primero en el navegador y sube enseguida a Firestore. Si Firestore tarda o no responde, deja el cambio en una cola local y lo reintenta automaticamente para no perder el avance.

Para pruebas escolares rapidas puedes permitir lectura/escritura de la coleccion `ruta-numerica-sessions`, pero para uso real conviene proteger Firestore con autenticacion o un backend propio.

Si Firestore responde `SERVICE_DISABLED`, activa la API en:

`https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=TU-PROYECTO`

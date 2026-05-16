# Base de datos en la nube

La pagina ya tiene una capa de sincronizacion para Firebase Realtime Database. Mientras `enabled` este en `false`, la pagina sigue usando el almacenamiento local del navegador.

## Activar Firebase

1. Crea un proyecto en Firebase.
2. Activa **Realtime Database**.
3. Copia la URL de la base de datos.
4. Edita `js/cloud-config.js`:

```js
window.MATEDRAG_CLOUD = {
  enabled: true,
  firebaseDatabaseURL: "https://TU-PROYECTO-default-rtdb.firebaseio.com",
  rootPath: "ruta-numerica",
};
```

Con eso, los estudiantes y el profesor veran la misma informacion desde cualquier equipo que abra esta misma pagina con internet.

## Nota de seguridad

Para pruebas escolares rapidas se puede permitir lectura/escritura en la ruta `ruta-numerica`, pero para uso real conviene proteger la base con autenticacion o un backend propio.

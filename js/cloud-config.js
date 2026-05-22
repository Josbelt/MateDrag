// Configura Firebase Realtime Database para sincronizar datos entre equipos.
// 1. Crea un proyecto en Firebase y activa Realtime Database.
// 2. Copia aqui la URL de la base de datos.
// 3. Asegurate de que las reglas permitan leer/escribir en rootPath.
window.MATEDRAG_CLOUD = {
  enabled: true,
  provider: "realtime",
  firebaseDatabaseURL: "https://ruta-numerica-default-rtdb.firebaseio.com",
  rootPath: "ruta-numerica",
};

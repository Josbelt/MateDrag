// Configura Cloud Firestore para sincronizar datos entre equipos.
// 1. Crea un proyecto en Firebase y activa Firestore Database + Cloud Firestore API.
// 2. Copia aqui el ID del proyecto.
// 3. Si tus reglas lo requieren, agrega tambien firebaseApiKey.
window.MATEDRAG_CLOUD = {
  enabled: true,
  provider: "firestore",
  firebaseProjectId: "ruta-numerica",
  firestoreDatabaseId: "(default)",
  firestoreCollection: "ruta-numerica-sessions",
  firebaseApiKey: "",
  rootPath: "ruta-numerica",
};

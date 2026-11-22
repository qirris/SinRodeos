// Solo para revisión visual. No usa claves ni consulta una IA.
import { crearServidor } from "../servidor.js";
const servidor = crearServidor({
  obtenerEntorno: () => ({ GEMINI_API_KEY: "ficticia" }),
  generar: async () => {
    await new Promise(resolver => setTimeout(resolver, 1500));
    return "## Objetivo\nCorrige el inicio de sesión del proyecto en **React**.\n\n## Restricciones\n- No añadas bibliotecas.\n- No modifiques el registro.\n\n## Entrega\nDevuelve los archivos modificados completos.\n\nEjemplo simulado para comprobar la interfaz.";
  }
});
servidor.listen(8018, "127.0.0.1", () => console.log("Vista simulada de revisión en el puerto 8018."));

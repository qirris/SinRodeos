// Una sola generación vigente. Cancelar invalida incluso respuestas que ignoren la señal.
export function crearControlSolicitudes() {
  let actual = null;
  return {
    get activa() { return actual !== null; },
    cancelar() {
      actual?.abort();
      actual = null;
    },
    async ejecutar(trabajo) {
      if (actual) return { vigente: false };
      const controlador = new AbortController();
      actual = controlador;
      try {
        const valor = await trabajo(controlador.signal);
        return { vigente: actual === controlador, valor };
      } catch (error) {
        if (actual === controlador) throw error;
        return { vigente: false };
      } finally {
        if (actual === controlador) actual = null;
      }
    }
  };
}

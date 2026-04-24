import type { HarborLocale } from "../types";

export const es: HarborLocale = {
  code: "es",
  label: "Español",
  direction: "ltr",
  messages: {
    "harbor.field.optional": "(opcional)",
    "harbor.field.requiredMark": "*",
    "harbor.action.close": "Cerrar",
    "harbor.action.cancel": "Cancelar",
    "harbor.action.save": "Guardar",
    "harbor.action.back": "Atrás",
    "harbor.action.next": "Siguiente",
    "harbor.action.finish": "Finalizar",
    "harbor.action.clear": "Limpiar",
    "harbor.action.submit": "Enviar",

    "harbor.wizard.stepOfN":
      "Paso {current, plural, other {#}} de {total, plural, other {#}}",
    "harbor.wizard.defaultError": "Faltan campos obligatorios",

    "harbor.commandPalette.placeholder": "Escribe un comando…",
    "harbor.commandPalette.escKey": "ESC",
    "harbor.commandPalette.title": "Paleta de comandos",
    "harbor.commandPalette.noResults": "Sin comandos que coincidan",

    "harbor.select.placeholder": "Elegir…",

    "harbor.search.placeholder": "Buscar…",

    "harbor.datatable.empty": "Sin datos",
    "harbor.datatable.selectAll": "Seleccionar todas las filas de esta página",
    "harbor.datatable.selectRow": "Seleccionar fila",
    "harbor.datatable.rowsPerPage": "Filas por página",
    "harbor.datatable.showingRange":
      "Mostrando {start}–{end} de {total, plural, one {# fila} other {# filas}}",
    "harbor.datatable.firstPage": "Primera página",
    "harbor.datatable.prevPage": "Página anterior",
    "harbor.datatable.nextPage": "Página siguiente",
    "harbor.datatable.lastPage": "Última página",

    "harbor.validation.required": "Este campo es obligatorio",
    "harbor.validation.email": "Ingresá un correo válido",
    "harbor.validation.min": "Debe ser al menos {min}",
    "harbor.validation.max": "Debe ser como máximo {max}",
    "harbor.validation.minLength":
      "{min, plural, one {Mínimo # carácter} other {Mínimo # caracteres}}",
    "harbor.validation.maxLength":
      "{max, plural, one {Máximo # carácter} other {Máximo # caracteres}}",
  },
};

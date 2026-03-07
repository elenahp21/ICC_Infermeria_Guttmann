export const DEFAULT_ICC_CONFIG = {
  domains: [
    {
      id: "dependencia",
      name: "Dependencia funcional",
      description: "Autonomía en actividades básicas (Barthel).",
      options: [
        { label: "≥90 (Independiente/Leve)", value: 0 },
        { label: "60-89 (Moderada)", value: 10 },
        { label: "30-59 (Severa)", value: 20 },
        { label: "<30 (Total)", value: 30 }
      ]
    },
    {
      id: "respiratorio",
      name: "Soporte respiratorio",
      description: "Nivel de soporte respiratorio requerido.",
      options: [
        { label: "Sin soporte", value: 0 },
        { label: "Cough assist", value: 4 },
        { label: "Traqueostomía", value: 8 },
        { label: "VMNI", value: 12 },
        { label: "VMI", value: 15 }
      ]
    },
    {
      id: "dispositivos",
      name: "Otros dispositivos",
      description: "Accesos venosos y reservorios.",
      options: [
        { label: "Ninguno", value: 0 },
        { label: "Vía periférica/reservorio", value: 2 },
        { label: "Vía central/línea media", value: 5 }
      ]
    },
    {
      id: "urinaria",
      name: "Eliminación urinaria",
      description: "Método de eliminación urinaria y su complejidad.",
      options: [
        { label: "Voluntaria", value: 0 },
        { label: "Autocateterismo", value: 2 },
        { label: "Pañal/Colector", value: 4 },
        { label: "SVP/SSP", value: 6 },
        { label: "Cateterismo intermitente", value: 8 }
      ]
    },
    {
      id: "fecal",
      name: "Eliminación fecal",
      description: "Método de eliminación fecal y necesidad de asistencia.",
      options: [
        { label: "Voluntaria", value: 0 },
        { label: "Pañal/Colostomía", value: 4 },
        { label: "Asistida en silla", value: 6 },
        { label: "Asistida en cama", value: 8 }
      ]
    },
    {
      id: "cutanea",
      name: "Integridad cutánea",
      description: "Estado de la piel y riesgo de lesiones.",
      options: [
        { label: "No lesiones", value: 0 },
        { label: "LPP I-II", value: 5 },
        { label: "LPP III-IV / Heridas complejas", value: 10 }
      ]
    },
    {
      id: "alimentacion",
      name: "Alimentación / deglución",
      description: "Vía de alimentación y riesgo de aspiración.",
      options: [
        { label: "Oral normal", value: 0 },
        { label: "Oral disfagia", value: 3 },
        { label: "PEG/SNG", value: 5 },
        { label: "Vía parenteral", value: 8 }
      ]
    },
    {
      id: "diabetes",
      name: "Diabetes",
      description: "Necesidades de control glucémico.",
      options: [
        { label: "No", value: 0 },
        { label: "Sí (requiere control)", value: 1 },
        { label: "Sí (insulinodependiente)", value: 2 }
      ]
    },
    {
      id: "aislamiento",
      name: "Aislamiento",
      description: "Medidas de aislamiento por infecciones.",
      options: [
        { label: "Sin aislamiento", value: 0 },
        { label: "Contacto/Gotas", value: 2 },
        { label: "Estricto", value: 4 }
      ]
    },
    {
      id: "conducta",
      name: "Conducta / cognición",
      description: "Alteraciones conductuales que requieren vigilancia.",
      options: [
        { label: "Sin alteraciones", value: 0 },
        { label: "Desorientación", value: 2 },
        { label: "Contención mecánica", value: 3 },
        { label: "Riesgo fuga (errante)/agitación", value: 5 },
        { label: "Agresividad", value: 8 }
      ]
    },
    {
      id: "familia",
      name: "Acompañamiento familiar",
      description: "Presencia y grado de acompañamiento familiar.",
      options: [
        { label: "Sí", value: 0 },
        { label: "Parcial", value: 1 },
        { label: "No", value: 2 }
      ]
    }
  ],
  thresholds: [
    { label: "Baja", min: 0, max: 20, color: "#22c55e" },
    { label: "Media", min: 21, max: 40, color: "#eab308" },
    { label: "Alta", min: 41, max: 60, color: "#f97316" },
    { label: "Muy Alta", min: 61, max: 100, color: "#ef4444" }
  ]
};

export const UNITS = ["UH1", "UH2", "UH4", "UH5"];

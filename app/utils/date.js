// Obtiene la fecha actual en formato 'YYYY-MM-DD' ajustada al huso horario local.
export const getTodayString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

// Convierte una fecha en formato 'YYYY-MM-DD' a formato 'DD/MM/YYYY'.
export const formatDateLocal = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

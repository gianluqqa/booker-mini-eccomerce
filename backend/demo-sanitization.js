// Demostración del sistema de sanitización
console.log("=== DEMOSTRACIÓN DE SANITIZACIÓN ===\n");

// Simulación de las funciones de sanitización
const sanitizeEmail = (email) => {
  if (!email) return email;
  return email.toLowerCase().trim();
};

const sanitizeName = (name) => {
  if (!name) return name;
  return name.trim().replace(/\s+/g, ' ');
};

const capitalizeName = (name) => {
  if (!name) return name;
  return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

const sanitizeUserName = (name) => {
  if (!name) return name;
  return capitalizeName(sanitizeName(name));
};

// Ejemplos de entrada y salida
const testCases = [
  {
    input: { name: "             JUAN             ", surname: "    perez    ", email: "TEST@GMAIL.COM" },
    description: "Espacios extra y mayúsculas"
  },
  {
    input: { name: "  maría  josé  ", surname: "  garcía  lópez  ", email: "María.José@DOMAIN.COM" },
    description: "Nombres compuestos y espacios múltiples"
  },
  {
    input: { name: "ANA", surname: "MARTÍNEZ", email: "ana.martinez@HOTMAIL.COM" },
    description: "Todo en mayúsculas"
  },
  {
    input: { name: "  pedro  ", surname: "  ", email: "  pedro@TEST.COM  " },
    description: "Campos con espacios vacíos"
  }
];

console.log("CASOS DE PRUEBA:\n");

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.description}`);
  console.log("   INPUT:", testCase.input);
  
  const sanitized = {
    email: sanitizeEmail(testCase.input.email),
    name: sanitizeUserName(testCase.input.name),
    surname: sanitizeUserName(testCase.input.surname)
  };
  
  console.log("   OUTPUT:", sanitized);
  console.log("");
});

console.log("=== BENEFICIOS DE LA SANITIZACIÓN ===\n");
console.log("✅ Consistencia: Todos los emails se guardan en minúsculas");
console.log("✅ Presentación: Nombres y apellidos capitalizados correctamente");
console.log("✅ Limpieza: Espacios extra eliminados");
console.log("✅ Prevención duplicados: 'TEST@GMAIL.COM' = 'test@gmail.com'");
console.log("✅ Experiencia usuario: Datos siempre con formato estándar");

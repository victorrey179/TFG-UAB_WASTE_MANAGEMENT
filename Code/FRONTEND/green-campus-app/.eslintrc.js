module.exports = {
  parser: '@typescript-eslint/parser', // Especifica el parser de TypeScript
  extends: [
    'standard', // Extiende la configuración estándar
    'plugin:@typescript-eslint/recommended' // Usa las reglas recomendadas para TypeScript
  ],
  plugins: [
    '@typescript-eslint' // Añade el plugin de TypeScript
  ],
  rules: {
    // Aquí puedes añadir o sobrescribir reglas específicas
  }
}

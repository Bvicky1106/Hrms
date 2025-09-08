import { defineMock } from 'vite-plugin-mock-dev-server';

console.log("✅ Mock API Loaded: /api-dev/test");

export default defineMock({
  url: '/api-dev/test',
  method: 'GET',  // ✅ Ensure the method matches your API call
  delay: 0,
  status: 200,    // ✅ Ensure response is successful
  body: { message: 'Ascentware HR Management App' }
});

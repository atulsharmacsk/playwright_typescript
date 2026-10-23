export function getCredentials() {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  if (!email || !password) {
    throw new Error('Set TEST_EMAIL and TEST_PASSWORD for a registered demo-shop account in .env or the shell.');
  }
  return { email, password };
}
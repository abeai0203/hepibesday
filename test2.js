const loginAndFetch = async () => {
  console.log('Sending login...');
  const loginRes = await fetch('http://localhost:8788/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passphrase: 'hepi123' })
  });
  console.log('Login status:', loginRes.status);
  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.log('No token returned', loginData);
    return;
  }
  const token = loginData.token;
  console.log('Got token:', token);
  
  console.log('Sending stats request...');
  const getRes = await fetch('http://localhost:8788/api/admin/stats', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('GET status:', getRes.status);
  const getData = await getRes.text();
  console.log('GET data:', getData);
}
loginAndFetch();

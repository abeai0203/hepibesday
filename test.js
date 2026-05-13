const loginAndFetch = async () => {
  const loginRes = await fetch('https://hepibesday-api.abeai0203.workers.dev/api/admin/login', {
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
  console.log('Got token');
  
  const getRes = await fetch('https://hepibesday-api.abeai0203.workers.dev/api/admin/products', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('GET status:', getRes.status);
  const getData = await getRes.text();
  console.log('GET data:', getData.slice(0, 100));
}
loginAndFetch();

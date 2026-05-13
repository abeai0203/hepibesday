const testGenerateTraits = async () => {
  const res = await fetch('https://hepibesday-api.abeai0203.workers.dev/api/generate-traits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birthDate: '2000-01-01', gender: 'M', targetName: 'Asyraq', turnstileToken: null })
  });
  console.log('Status:', res.status);
  const data = await res.text();
  console.log('Data:', data);
}
testGenerateTraits();

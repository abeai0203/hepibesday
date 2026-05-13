const testGenerateTraits = async () => {
  const res = await fetch('https://hepibesday-api.abeai0203.workers.dev/api/generate-traits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birthDate: '1990-01-01', gender: 'M', targetName: 'Ahmad' })
  });
  console.log('Status:', res.status);
  const data = await res.text();
  console.log('Data:', data);
}
testGenerateTraits();

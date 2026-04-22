async function test() {
  const API_URL = 'http://localhost:3001/api';
  const resAdmin = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'labcontrol.admin@gmail.com', password: '1234' })
  });
  const adminCookie = resAdmin.headers.get('set-cookie')?.split(';')[0];
  
  const resCategories = await fetch(`${API_URL}/categories`, { headers: { 'Cookie': adminCookie } });
  const catData = await resCategories.json();
  const validCategoryId = catData.data[0].id;
  console.log('Category ID:', validCategoryId);

  const resAdminAuth = await fetch(`${API_URL}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
    body: JSON.stringify({ name: "Fixed Test Item", quantity: 5, categoryId: validCategoryId })
  });
  console.log(resAdminAuth.status, await resAdminAuth.json());
}
test();

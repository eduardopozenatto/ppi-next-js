import fs from 'fs';

const API_URL = 'http://localhost:3001/api';
let adminCookie = '';
let userCookie = '';

async function runTests() {
  console.log('--- STARTING PHASE 8 TESTS ---\n');

  try {
    // LOGIN
    const resAdmin = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'labcontrol.admin@gmail.com', password: '1234' })
    });
    adminCookie = resAdmin.headers.get('set-cookie')?.split(';')[0];
    
    const resUser = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'carlos.aluno.lab@gmail.com', password: '1234' })
    });
    userCookie = resUser.headers.get('set-cookie')?.split(';')[0];
    const userObj = await resUser.json();
    const userId = userObj.data.id;

    // --- TEST 2: Soft Delete ---
    console.log('TEST 2: Users Management - Soft Delete');
    const resDel = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Cookie': adminCookie }
    });
    console.log('DELETE /users/:id:', resDel.status, await resDel.json());
    
    const resGetUsers = await fetch(`${API_URL}/users`, { headers: { 'Cookie': adminCookie } });
    const usersData = await resGetUsers.json();
    const checkedUser = usersData.data.find(u => u.id === userId);
    console.log(`User isActive after delete: ${checkedUser?.isActive}`);

    // Re-activate user for further tests
    await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ isActive: true })
    });

    // --- TEST 3: Permission Overrides ---
    console.log('\nTEST 3: Users Management - Permission Overrides');
    const resUserOverride = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': userCookie },
      body: JSON.stringify({ role: 'ADMIN' })
    });
    console.log('PUT /users/:id (as user):', resUserOverride.status, await resUserOverride.json());

    const resAdminOverride = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ customPermissions: { gerenciar_usuarios: true } })
    });
    const updatedUser = await resAdminOverride.json();
    console.log('PUT /users/:id (as admin, overriding permissions):', resAdminOverride.status, updatedUser);
    
    // --- TEST 4: Tags CRUD and Validation ---
    console.log('\nTEST 4: Tags CRUD and Validation');
    const resTagInvalid = await fetch(`${API_URL}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ name: 'Test', color: 'invalid-color', description: 'Test description', permissions: {} })
    });
    console.log('POST /tags (invalid color):', resTagInvalid.status, await resTagInvalid.json());

    const resTagValid = await fetch(`${API_URL}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ 
        name: 'Test Tag', 
        color: '#ff0000',
        description: 'Testing valid tag creation',
        permissions: {
          ver_itens: true, pedir_emprestimos: true, ver_notificacoes: true,
          manipular_estoque: false, gerar_relatorios: false, aprovar_emprestimos: false,
          gerenciar_itens: false, gerenciar_usuarios: false, gerenciar_roles: false,
          gerenciar_categorias: false, gerenciar_permissoes: false
        }
      })
    });
    console.log('POST /tags (valid):', resTagValid.status, await resTagValid.json());

    // Get an assigned tag
    const assignedTagId = checkedUser.tagId;
    const resDeleteTag = await fetch(`${API_URL}/tags/${assignedTagId}`, {
      method: 'DELETE',
      headers: { 'Cookie': adminCookie }
    });
    console.log('DELETE /tags/:id (assigned):', resDeleteTag.status, await resDeleteTag.json());

    // --- TEST 5: Categories CRUD and Counts ---
    console.log('\nTEST 5: Categories CRUD and Counts');
    const resCategories = await fetch(`${API_URL}/categories`, { headers: { 'Cookie': adminCookie } });
    const catData = await resCategories.json();
    console.log('GET /categories (check linkedItemsCount):', catData.data[0]?.linkedItemsCount !== undefined ? 'OK' : 'MISSING');
    
    const catWithItems = catData.data.find(c => c.linkedItemsCount > 0);
    const resDeleteCat = await fetch(`${API_URL}/categories/${catWithItems.id}`, {
      method: 'DELETE',
      headers: { 'Cookie': adminCookie }
    });
    console.log('DELETE /categories/:id (with items):', resDeleteCat.status, await resDeleteCat.json());

    // --- TEST 6 & 7: Notifications ---
    console.log('\nTEST 6 & 7: Automated Notifications Trigger & Read Status');
    // We need a loan first
    const invRes = await fetch(`${API_URL}/inventory`);
    const invData = await invRes.json();
    const itemId = invData.data[0].id;
    
    const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 7);
    const resLoan = await fetch(`${API_URL}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': userCookie },
      body: JSON.stringify({ items: [{ inventoryItemId: itemId, quantity: 1 }], dueDate: dueDate.toISOString() })
    });
    const loan = await resLoan.json();
    const loanId = loan.data.id;

    // Approve loan
    await fetch(`${API_URL}/loans/${loanId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ status: 'active', labObservation: 'Approved!' })
    });

    // Check notifications as user
    const resNotif = await fetch(`${API_URL}/notifications`, { headers: { 'Cookie': userCookie } });
    const notifs = await resNotif.json();
    console.log('GET /notifications:', notifs.data.length > 0 ? 'Found notifications' : 'Empty');
    
    if (notifs.data.length > 0) {
      const notifId = notifs.data[0].id;
      const resRead = await fetch(`${API_URL}/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Cookie': userCookie },
        body: JSON.stringify({ read: true })
      });
      console.log('PUT /notifications/:id/read:', resRead.status, await resRead.json());
    }

    // --- TEST 8: Inventory Reports KPI ---
    console.log('\nTEST 8: Inventory Reports KPI');
    const resRepInv = await fetch(`${API_URL}/reports/inventory`, { headers: { 'Cookie': adminCookie } });
    console.log('GET /reports/inventory:', resRepInv.status, Object.keys((await resRepInv.json()).data || {}));

    // --- TEST 9: Loans Reports Filtering ---
    console.log('\nTEST 9: Loans Reports Filtering');
    const resRepLoans = await fetch(`${API_URL}/reports/loans?period=30`, { headers: { 'Cookie': adminCookie } });
    console.log('GET /reports/loans?period=30:', resRepLoans.status, Object.keys((await resRepLoans.json()).data || {}));

  } catch (e) {
    console.error(e);
  }
}
runTests();

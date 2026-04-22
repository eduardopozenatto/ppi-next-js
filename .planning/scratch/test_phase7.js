import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:3001/api';
let adminCookie = '';
let userCookie = '';

async function runTests() {
  console.log('--- STARTING PHASE 7 TESTS ---\n');

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

    // Fetch valid category ID
    const resCategories = await fetch(`${API_URL}/categories`, {
      headers: { 'Cookie': adminCookie }
    });
    const categoriesData = await resCategories.json();
    const validCategoryId = categoriesData.data[0].id;

    // TEST 3 & 8: Inventory Create (Auth Guard)
    console.log('TEST 3 & 8: Inventory Create (Auth Guard)');
    const resNoAuth = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "Test Item", quantity: 5, categoryId: validCategoryId })
    });
    console.log('POST /inventory (no auth):', resNoAuth.status, '=>', await resNoAuth.json());

    const resUserAuth = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': userCookie },
      body: JSON.stringify({ name: "Test Item", quantity: 5, categoryId: validCategoryId })
    });
    console.log('POST /inventory (user auth - no perm):', resUserAuth.status, '=>', await resUserAuth.json());

    const resAdminAuth = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ name: "Test Item", quantity: 5, categoryId: validCategoryId })
    });
    const createdItem = await resAdminAuth.json();
    console.log('POST /inventory (admin auth - with perm):', resAdminAuth.status, '=>', createdItem);

    const itemId = 'inv-1';

    // TEST 4: Inventory Image Upload
    console.log('\nTEST 4: Inventory Image Upload');
    const formData = new FormData();
    const blob = new Blob(['fake image data'], { type: 'image/png' });
    formData.append('image', blob, 'test.png');
    
    const resImage = await fetch(`${API_URL}/inventory/${itemId}/image`, {
      method: 'POST',
      headers: { 'Cookie': adminCookie },
      body: formData
    });
    console.log('POST /inventory/:id/image:', resImage.status, '=>', await resImage.json());

    // TEST 5: Loan Creation with Stock Deduction
    console.log('\nTEST 5: Loan Creation with Stock Deduction');
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    
    const resLoan = await fetch(`${API_URL}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': userCookie },
      body: JSON.stringify({ 
        items: [{ inventoryItemId: itemId, quantity: 2 }],
        dueDate: dueDate.toISOString()
      })
    });
    const createdLoan = await resLoan.json();
    console.log('POST /loans:', resLoan.status, '=>', createdLoan);
    const loanId = createdLoan?.data?.id;

    const resItemAfterLoan = await fetch(`${API_URL}/inventory`);
    const invDataAfterLoan = await resItemAfterLoan.json();
    const checkedItem1 = invDataAfterLoan.data.find(i => i.id === itemId);
    console.log(`Available Qty after loan: ${checkedItem1?.availableQuantity} (Expected: 3)`);

    // TEST 6: Loan Approval Updates Quantities
    console.log('\nTEST 6: Loan Approval Updates Quantities');
    const resApprove = await fetch(`${API_URL}/loans/${loanId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ status: 'active', labObservation: 'Approved test' })
    });
    console.log('PUT /loans/:id/status (active):', resApprove.status, '=>', await resApprove.json());

    const resItemAfterApprove = await fetch(`${API_URL}/inventory`);
    const invDataAfterApprove = await resItemAfterApprove.json();
    const checkedItem2 = invDataAfterApprove.data.find(i => i.id === itemId);
    console.log(`Loaned Qty after approval: ${checkedItem2?.loanedQuantity} (Expected: 2)`);

    // TEST 7: Loan Return Restores Quantities
    console.log('\nTEST 7: Loan Return Restores Quantities');
    const resReturn = await fetch(`${API_URL}/loans/${loanId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ status: 'returned', labObservation: 'Returned test' })
    });
    console.log('PUT /loans/:id/status (returned):', resReturn.status, '=>', await resReturn.json());

    const resItemAfterReturn = await fetch(`${API_URL}/inventory`);
    const invDataAfterReturn = await resItemAfterReturn.json();
    const checkedItem3 = invDataAfterReturn.data.find(i => i.id === itemId);
    console.log(`Available Qty after return: ${checkedItem3?.availableQuantity} (Expected: 5)`);
    console.log(`Loaned Qty after return: ${checkedItem3?.loanedQuantity} (Expected: 0)`);

    console.log('\n--- TESTS COMPLETED ---');
  } catch (err) {
    console.error(err);
  }
}

runTests();

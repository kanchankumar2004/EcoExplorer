const baseUrl = 'http://localhost:5000/api/auth';

const runTests = async () => {
  console.log('=== EcoExplorer Auth API Tests (MongoDB) ===');
  
  // Use a dynamic email so the test is repeatable on MongoDB Atlas
  const testEmail = `john.doe.${Date.now()}@example.com`;
  console.log(`Generated test email for this run: ${testEmail}\n`);

  try {
    const ping = await fetch('http://localhost:5000/');
    const pingText = await ping.text();
    console.log('Ping check:', pingText);
  } catch (e) {
    console.error('Server not reachable. Make sure it is running on port 5000.', e);
    process.exit(1);
  }

  // Helper to log responses
  const checkResponse = async (name, res) => {
    const data = await res.json();
    console.log(`\n[${name}] Status: ${res.status}`);
    console.log(JSON.stringify(data, null, 2));
    return { status: res.status, data };
  };

  // Test Case 1: Register - Missing fields
  await checkResponse('TC1: Register with missing fields', await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  }));

  // Test Case 2: Register - Short name
  await checkResponse('TC2: Register with short name', await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Jo', email: testEmail, password: 'password123' })
  }));

  // Test Case 3: Register - Invalid email
  await checkResponse('TC3: Register with invalid email', await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John Doe', email: 'invalidemail', password: 'password123' })
  }));

  // Test Case 4: Register - Short password
  await checkResponse('TC4: Register with short password', await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John Doe', email: testEmail, password: '123' })
  }));

  // Test Case 5: Register - Password without numbers
  await checkResponse('TC5: Register with password lacking numbers', await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John Doe', email: testEmail, password: 'password' })
  }));

  // Test Case 6: Successful Registration
  const regResult = await checkResponse('TC6: Successful Register', await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John Doe', email: testEmail, password: 'password123', userType: 'traveler' })
  }));

  // Test Case 7: Duplicate Register
  await checkResponse('TC7: Duplicate Register', await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John Doe', email: testEmail, password: 'password123', userType: 'traveler' })
  }));

  // Test Case 8: Login - Invalid credentials
  await checkResponse('TC8: Login with wrong password', await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'wrongpassword' })
  }));

  // Test Case 9: Login - Success
  const loginResult = await checkResponse('TC9: Login Success', await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'password123' })
  }));

  const token = loginResult.data.token;

  // Test Case 10: Get current user
  await checkResponse('TC10: Get Me', await fetch(`${baseUrl}/me`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }));

  // Test Case 11: Update Profile - Success
  await checkResponse('TC11: Update Profile', await fetch(`${baseUrl}/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Johnathan Doe',
      phone: '+1 555-0199',
      bio: 'Eco Traveler & Photographer',
      country: 'Canada',
      city: 'Vancouver'
    })
  }));

  // Test Case 12: Get current user after update
  await checkResponse('TC12: Get Me after update', await fetch(`${baseUrl}/me`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }));

  console.log('\n=== API Tests Completed ===');
};

runTests();

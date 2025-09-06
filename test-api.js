// Simple test script to check if the API is working
const testProjectCreation = async () => {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Project',
        description: 'Test description',
        color: '#3B82F6'
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('Response body:', data);
    
    if (!response.ok) {
      console.error('API Error:', data);
    } else {
      console.log('Success:', JSON.parse(data));
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};

// Run the test
testProjectCreation();

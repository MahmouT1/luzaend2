// Simple login function that bypasses RTK Query
export const simpleLogin = async (email, password) => {
  try {
    console.log("🔐 Attempting simple login with:", { email, password });
    
    const response = await fetch("http://localhost:8000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    console.log("📊 Response status:", response.status);
    console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Login failed:", response.status, errorText);
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Login successful:", data);
    
    return {
      success: true,
      user: data.user,
      token: data.token
    };
    
  } catch (error) {
    console.error("❌ Simple login error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

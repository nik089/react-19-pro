import users from '../data/users.json';
import axios from "axios";

export const login = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      resolve(user || null);
    }, 500); // Simulate network delay
  });
};

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 8000
});

export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Initialize users from userList.json into localStorage (call this on app startup)
export const initializeUsersFromJSON = async () => {
  try {
    const existingUsers = localStorage.getItem("usersList");
    
    // If data already in localStorage, don't override
    if (existingUsers) {
      console.log("✅ Users already loaded in localStorage");
      return JSON.parse(existingUsers);
    }

    // Load from userList.json
    const response = await fetch("./data/userList.json");
    if (!response.ok) throw new Error("Failed to load userList.json");
    
    const users = await response.json();
    
    // Save to localStorage
    localStorage.setItem("usersList", JSON.stringify(users));
    console.log("✅ Loaded " + users.length + " users from userList.json into localStorage");
    
    return users;
  } catch (error) {
    console.error("Error initializing users:", error);
    return [];
  }
};

export const addNewUser = async (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Simulate API delay (1-1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Get existing users from localStorage
      let users = [];
      const storedUsers = localStorage.getItem("usersList");
      
      if (storedUsers) {
        users = JSON.parse(storedUsers);
      } else {
        // If somehow localStorage is empty, initialize from JSON
        await initializeUsersFromJSON();
        users = JSON.parse(localStorage.getItem("usersList")) || [];
      }

      // Create new user with auto-incremented ID
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id), 0) + 1 : 1,
        name: userData.name.trim(),
        email: userData.email.trim(),
        mobile: userData.mobile.trim(),
        role: userData.role,
        password: "TempPass@123",
        createdAt: new Date().toISOString()
      };

      // Add to array
      users.push(newUser);

      // Save to localStorage
      localStorage.setItem("usersList", JSON.stringify(users));
      
      console.log("✅ USER SAVED SUCCESSFULLY");
      console.log("📋 New User ID: " + newUser.id + ", Name: " + newUser.name);
      console.log("📊 Total Users: " + users.length);
      
      resolve(newUser);
    } catch (error) {
      console.error("❌ Error creating user:", error);
      reject(new Error("Failed to create user: " + error.message));
    }
  });
};

// Debug function to see all saved users
export const displayAllUsers = () => {
  const users = localStorage.getItem("usersList");
  if (users) {
    const usersList = JSON.parse(users);
    console.log("📋 ALL SAVED USERS (" + usersList.length + " total):", usersList);
    return usersList;
  } else {
    console.log("No users saved yet");
    return [];
  }
};

// Export users as JSON (download)
export const exportUsersAsJSON = () => {
  const users = localStorage.getItem("usersList");
  if (!users) {
    console.log("No users to export");
    return;
  }
  
  const usersList = JSON.parse(users);
  const dataStr = JSON.stringify(usersList, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "userList.json";
  link.click();
  console.log("✅ Downloaded userList.json with " + usersList.length + " users");
};
export const getAllUsers = async () => {
  try {
    // First check localStorage
    const storedUsers = localStorage.getItem("usersList");
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    
    // If no localStorage, try to load from JSON file
    try {
      const response = await fetch("./data/userList.json");
      const users = await response.json();
      // Save to localStorage for future use
      localStorage.setItem("usersList", JSON.stringify(users));
      return users;
    } catch (err) {
      console.log("No users found");
      return [];
    }
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw new Error("Failed to fetch users: " + error.message);
  }
};

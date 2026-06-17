import { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "../data/mockData";
import axios from "axios";

const AuthContext = createContext(null);

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const normalized = { ...rawUser };
  
  const idVal = rawUser._id || rawUser.userId || rawUser.UserId || rawUser.id;
  normalized._id = idVal;
  normalized.id = idVal;
  normalized.userId = idVal;

  normalized.name = rawUser.name || rawUser.Name || "";
  normalized.Name = normalized.name;

  normalized.email = rawUser.email || rawUser.Email || "";
  normalized.Email = normalized.email;

  // Handle both MySQL lowercase 'mobile' and PascalCase 'Mobile'
  normalized.phone = rawUser.phone || rawUser.Mobile || rawUser.mobile || "";
  normalized.Mobile = normalized.phone;
  normalized.mobile = normalized.phone;

  // Handle both MySQL lowercase 'address' and PascalCase 'Address'
  normalized.location = rawUser.location || rawUser.Address || rawUser.address || "";
  normalized.Address = normalized.location;
  normalized.address = normalized.location;

  normalized.role = rawUser.role || rawUser.Role || "user";
  normalized.Role = normalized.role;

  normalized.rating = typeof rawUser.rating !== 'undefined' ? rawUser.rating : (typeof rawUser.Rating !== 'undefined' ? rawUser.Rating : 5.0);
  normalized.Rating = normalized.rating;

  normalized.reviewCount = typeof rawUser.reviewCount !== 'undefined' ? rawUser.reviewCount : (typeof rawUser.ReviewCount !== 'undefined' ? rawUser.ReviewCount : 0);
  normalized.ReviewCount = normalized.reviewCount;

  // Handle both MySQL lowercase 'bio' and PascalCase 'Bio'
  normalized.bio = rawUser.bio || rawUser.Bio || "";
  normalized.Bio = normalized.bio;

  normalized.profileImage = rawUser.profileImage || rawUser.ProfileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(normalized.name)}&background=0d9488&color=fff&size=128`;
  normalized.ProfileImage = normalized.profileImage;

  return normalized;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // client session
  const [admin, setAdmin] = useState(null);    // admin session (independent)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("ss_user");
      if (storedUser && storedUser !== "undefined") {
        setUser(normalizeUser(JSON.parse(storedUser)));
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      localStorage.removeItem("ss_user");
    }
    try {
      const storedAdmin = localStorage.getItem("ss_admin");
      if (storedAdmin && storedAdmin !== "undefined") {
        setAdmin(normalizeUser(JSON.parse(storedAdmin)));
      }
    } catch (err) {
      console.error("Failed to parse admin from localStorage:", err);
      localStorage.removeItem("ss_admin");
    }
    setLoading(false);
  }, []);

  const login = (emailOrUser, password) => {
    // Handle user object from backend
    if (typeof emailOrUser === "object" && emailOrUser !== null) {
      const userData = normalizeUser(emailOrUser);
      setUser(userData);
      localStorage.setItem("ss_user", JSON.stringify(userData));
      return userData;
    }

    // Handle email/password for mock auth (for demo/testing)
    const email = emailOrUser;
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.role === "user"
    );

    if (!found) throw new Error("Invalid email or password.");

    const normalizedFound = normalizeUser(found);
    setUser(normalizedFound);
    localStorage.setItem("ss_user", JSON.stringify(normalizedFound));
    return normalizedFound;
  };

  const adminLogin = (email, password) => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && password === "admin123" && u.role === "admin",
    );

    if (!found) throw new Error("Invalid email or password.");

    const normalizedFound = normalizeUser(found);
    setAdmin(normalizedFound);                                    // sets admin only
    localStorage.setItem("ss_admin", JSON.stringify(normalizedFound)); // separate key
    return normalizedFound;
  };

  const register = (data) => {
    if (!data){
      return null;
    }

    const newUser = {
      _id: `u_${Date.now()}`,
      ...data,
      role: "user",
      rating: 0,
      reviewCount: 0,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0d9488&color=fff&size=128`,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };
    const normalizedNew = normalizeUser(newUser);
    setUser(normalizedNew);
    localStorage.setItem("ss_user", JSON.stringify(normalizedNew));
    return normalizedNew;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ss_user");
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem("ss_admin");
  };

  const updateProfile = async (updates) => {
    if (!user) return false;
    try {
      await axios.put(`http://localhost:3000/users/${user.userId}`, {
        Name: updates.name || user.name,
        Email: updates.email || user.email,
        Mobile: updates.phone || user.phone || "",
        Address: updates.location || user.location || "",
        Bio: updates.bio || user.bio || "",
      });
      const updated = normalizeUser({ ...user, ...updates });
      setUser(updated);
      localStorage.setItem("ss_user", JSON.stringify(updated));
      return true;
    } catch (err) {
      console.error("Profile update failed:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, admin, loading, login, adminLogin, logout, adminLogout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

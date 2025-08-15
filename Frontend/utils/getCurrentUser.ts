// utils/getCurrentUser.ts
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // add other fields as per your token structure
  exp: number;
}

export function getCurrentUser(): DecodedToken | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Optionally, check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
}

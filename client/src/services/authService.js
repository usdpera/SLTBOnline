// export const checkAuth = () => {
//     const token = localStorage.getItem('token');
//     if (!token) return null;
  
//     try {
//       // Decode the token (the payload is in the second part of the JWT)
//       const base64Url = token.split('.')[1];
//       const decoded = JSON.parse(atob(base64Url));
  
//       // Check if the token is expired (JWT 'exp' field is in seconds since UNIX epoch)
//       if (decoded.exp && decoded.exp < Date.now() / 1000) {
//         // Token has expired
//         return null;
//       }
  
//       // Return the decoded user data if valid
//       return decoded || null;
//     } catch (error) {
//       // Handle any errors that occur during decoding
//       console.error("Error decoding token:", error);
//       return null;
//     }
//   };
  
export const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload (basic example)
      return user || null;
    } catch (e) {
      return null; // In case JWT decoding fails
    }
  };
  
// import React, { createContext, useState } from 'react'

// // Create context with a default value
// export const UserDataContext = createContext(null);

// // Create the provider component
// export const UserDataProvider = ({ children }) => {
//   const [user, setUser] = useState({
//     email: '',
//     fullName: {
//       firstName: '',
//       lastName: ''
//     },
//     isAuthenticated: false
//   });

//   return (
//     <UserDataContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserDataContext.Provider>
//   );
// };

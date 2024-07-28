// src/pages/Login/Login.tsx
import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../component/Login/LoginForm';
import { backendApiUrl, clientId } from '../../services/LoginApi';
import { useUserContext } from '../../context/UserContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [error, setError] = useState<string>("");

  const onSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      const decodedToken: any = jwtDecode(idToken);
      const userId = decodedToken.sub;

      const res = await fetch(`${backendApiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Token': idToken,
        },
        body: JSON.stringify({ userId, idToken }),
      });

      if (!res.ok) {
        throw new Error(`Failed to login: ${res.statusText}`);
      }

      const authToken = res.headers.get('x-auth-token');

      if (authToken) {
        localStorage.setItem('authToken', authToken);

        const userResponse = await fetch(`${backendApiUrl}/user-account`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const userData = await userResponse.json();

        const identityMapping: { [key: string]: string } = {
          '無權限': 'NO_PERMISSION',
          '高階主管': 'MANAGER',
          '員工': 'EMPLOYEE',
          '管理員': 'ADMIN'
        };

        console.log('Raw identity:', userData.data.identity);
        console.log('Identity mapping:', identityMapping);

        const mappedIdentity = identityMapping[userData.data.identity] || 'NO_PERMISSION';

        console.log('Mapped identity:', mappedIdentity);

        setUser({ ...userData.data, identity: mappedIdentity });

        switch (mappedIdentity) {
          case 'NO_PERMISSION':
            navigate('/profile-setup');
            break;
          case 'MANAGER':
          case 'EMPLOYEE':
          case 'ADMIN':
            console.log('Navigating to main');
            navigate('/main');
            break;
          default:
            setError('Unrecognized user identity');
            break;
        }
      } else {
        setError('No auth token received from backend');
      }
    } catch (error) {
      console.error('Error during login request:', error);
      setError('An error occurred during the login request. Please try again.');
    }
  };

  const onFailure = () => {
    alert("Login failed, please try again later.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginForm error={error} onSuccess={onSuccess} onFailure={onFailure} />
    </GoogleOAuthProvider>
  );
};

export default Login;







// import React, { useState } from 'react';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import LoginForm from '../../component/Login/LoginForm';
// import { backendApiUrl, clientId } from '../../services/LoginApi';

// const Login: React.FC = () => {
//   const navigate = useNavigate();
//   const [error, setError] = useState<string>("");

//   const onSuccess = async (credentialResponse: any) => {
//     try {
//       const idToken = credentialResponse.credential;
//       if (!idToken) {
//         throw new Error('No ID token received from Google');
//       }

//       const decodedToken: any = jwtDecode(idToken);
//       const userId = decodedToken.sub;

//       const res = await fetch(`${backendApiUrl}/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Client-Token': idToken,
//         },
//         body: JSON.stringify({ userId, idToken }),
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to login: ${res.statusText}`);
//       }

//       const authToken = res.headers.get('x-auth-token');
//       const userHasProfile = res.headers.get('x-user-has-profile') === 'true';

//       if (authToken) {
//         localStorage.setItem('authToken', authToken);
//         if (userHasProfile) {
//           navigate('/main'); // Redirect to Main page
//         } else {
//           // Handle cases where profile setup is required
//           navigate('/profile-setup');
//         }
//       } else {
//         setError('No auth token received from backend');
//       }
//     } catch (error) {
//       setError('An error occurred during the login request. Please try again.');
//     }
//   };

//   const onFailure = () => {
//     alert("Login failed, please try again later.");
//   };

//   return (
//     <GoogleOAuthProvider clientId={clientId}>
//       <LoginForm error={error} onSuccess={onSuccess} onFailure={onFailure} />
//     </GoogleOAuthProvider>
//   );
// };

// export default Login;

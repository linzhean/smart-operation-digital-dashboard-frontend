import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: any) => void;
  onFailure: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onFailure }) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onFailure}
    />
  );
};

export default GoogleLoginButton;

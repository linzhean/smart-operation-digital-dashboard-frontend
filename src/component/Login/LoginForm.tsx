import React from 'react';
import styles from './LoginForm.module.css';
import GoogleLoginButton from './GoogleLoginButton';
import LOGO from '../../assets/icon/Logo-GIF-crop.gif'
interface LoginFormProps {
  error: string;
  onSuccess: (credentialResponse: any) => void;
  onFailure: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ error, onSuccess, onFailure }) => {
  return (
    <>
      <div className={styles.box}>
        <div className={`${styles.outDiv} ${styles.outFront}`}></div>
        <div className={`${styles.outDiv} ${styles.outBack}`}></div>
        <div className={`${styles.outDiv} ${styles.outLeft}`}></div>
        <div className={`${styles.outDiv} ${styles.outRight}`}></div>
        <div className={`${styles.outDiv} ${styles.outTop}`}></div>
        <div className={`${styles.outDiv} ${styles.outBottom}`}></div>
      </div>

      <div className={styles.title}>
        <img src={LOGO} className={styles.LOGO} />

        {error && <p className={styles.errorMsg}>{error}</p>}

        <h1 className={styles.welcome}>歡迎回到智慧儀表板系統!</h1>

        <div id='signInButton' className={styles.loginButton}>
          <GoogleLoginButton onSuccess={onSuccess} onFailure={onFailure} />
        </div>

      </div>
    </>
  );
};

export default LoginForm;

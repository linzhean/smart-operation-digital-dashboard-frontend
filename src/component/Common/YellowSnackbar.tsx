import React from 'react';
import { Snackbar, Alert, AlertProps, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import ReactDOM from 'react-dom';

interface YellowSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
  severity?: AlertProps['severity'];
}

const YellowSnackbar: React.FC<YellowSnackbarProps> = ({
  open,
  message,
  onClose,
  onRetry,
  severity = 'error'
}) => {
  return ReactDOM.createPortal(
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        zIndex: 88888889,
      }}
    >
      <Alert
        severity={severity}
        variant="filled"
        icon={false}
        sx={{
          width: '400px',
          backgroundColor: '#F5F5F5',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          position: 'relative',
          zIndex: 1301, // 提高 z-index
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'black',
          }}
        >
          <CloseIcon />
        </IconButton>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ErrorIcon style={{ marginRight: '12px', color: 'black', verticalAlign: 'middle' }} />
          <span style={{ verticalAlign: 'middle', fontSize: '1.2rem' }}>{message}</span>
        </div>

        {onRetry && (
          <Button
            color="inherit"
            size="small"
            onClick={onRetry}
            sx={{
              fontSize: '1rem',
              width: '100%',
              backgroundColor: '#FFD700',
              color: '#000000',
              fontWeight: '900',
              borderRadius: '8px',
              border: '2px solid #000000',
              '&:hover': {
                backgroundColor: '#F0E68C !important',
              },
              padding: '8px 0',
              marginTop: '12px',
            }}
          >
            重新嘗試
          </Button>
        )}
      </Alert>
    </Snackbar>,
    document.getElementById('portal-root') as HTMLElement
  );
};

export default YellowSnackbar;

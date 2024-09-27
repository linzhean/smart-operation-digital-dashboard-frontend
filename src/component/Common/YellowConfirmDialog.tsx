import React from 'react';
import { Snackbar, Alert, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactDOM from 'react-dom';

interface ConfirmationDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const YellowConfirmDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  message,
  onClose,
  onConfirm,
}) => {
  return ReactDOM.createPortal(
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        zIndex: 88888889,
      }}
    >
      <Alert
        severity="warning"
        variant="filled"
        icon={false}
        sx={{
          width: '400px',
          backgroundColor: '#FFD700',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          position: 'relative',
          zIndex: 1301,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#000000',
          }}
        >
          <CloseIcon />
        </IconButton>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ verticalAlign: 'middle', fontSize: '1.2rem' }}>{message}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={onClose}
            sx={{
              fontSize: '1rem',
              backgroundColor: '#F5F5F5',
              color: '#000000',
              fontWeight: '900',
              borderRadius: '8px',
              border: '2px solid #000000',
              '&:hover': {
                backgroundColor: '#E0E0E0',
              },
              padding: '8px 16px',
            }}
          >
            取消
          </Button>
          <Button
            onClick={onConfirm}
            sx={{
              fontSize: '1rem',
              backgroundColor: '#FFD700',
              color: '#000000',
              fontWeight: '900',
              borderRadius: '8px',
              border: '2px solid #000000',
              '&:hover': {
                backgroundColor: '#F0E68C',
              },
              padding: '8px 16px',
            }}
          >
            確認
          </Button>
        </div>
      </Alert>
    </Snackbar>,
    document.getElementById('portal-root') as HTMLElement
  );
};

export default YellowConfirmDialog;
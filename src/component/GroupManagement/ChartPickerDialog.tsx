// import React, { useState } from 'react';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';

// interface ChartPickerDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onAdd: (selectedCharts: { id: number; name: string }[]) => void;
//   charts: { id: number; name: string }[];
// }

// const ChartPickerDialog: React.FC<ChartPickerDialogProps> = ({ open, onClose, onAdd, charts }) => {
//   const [selectedCharts, setSelectedCharts] = useState<{ id: number; name: string }[]>([]);
//   console.log('Charts in ChartPickerDialog:', charts);

//   const handleToggleChart = (chart: { id: number; name: string }) => {
//     setSelectedCharts(prevSelected =>
//       prevSelected.some(selected => selected.id === chart.id)
//         ? prevSelected.filter(selected => selected.id !== chart.id)
//         : [...prevSelected, chart]
//     );
//   };

//   const handleAdd = () => {
//     onAdd(selectedCharts);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>選擇圖表</DialogTitle>
//       <DialogContent>
//         {charts.length > 0 ? (
//           charts.map(chart => (
//             <FormControlLabel
//               key={chart.id}
//               control={
//                 <Checkbox
//                   checked={selectedCharts.some(selected => selected.id === chart.id)}
//                   onChange={() => handleToggleChart(chart)}
//                   name={chart.name}
//                 />
//               }
//               label={chart.name}
//             />
//           ))
//         ) : (
//           <div>沒有可用的圖表</div>
//         )}
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           取消
//         </Button>
//         <Button onClick={handleAdd} color="primary">
//           新增
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ChartPickerDialog;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  CssBaseline,
  Box
} from '@mui/material';

interface ChartPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (selectedCharts: { id: number; name: string }[]) => void;
  charts: { id: number; name: string }[];
}

const ChartPickerDialog: React.FC<ChartPickerDialogProps> = ({ open, onClose, onAdd, charts }) => {
  const [selectedCharts, setSelectedCharts] = useState<{ id: number; name: string }[]>([]);

  const handleToggleChart = (chart: { id: number; name: string }) => {
    setSelectedCharts(prevSelected =>
      prevSelected.some(selected => selected.id === chart.id)
        ? prevSelected.filter(selected => selected.id !== chart.id)
        : [...prevSelected, chart]
    );
  };

  const handleAdd = () => {
    onAdd(selectedCharts);
    onClose();
  };

  return (
    <>
      <CssBaseline />
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          style: {
            backgroundColor: '#1e1e1e',
            borderRadius: 20,
            color: '#ffffff',
            zIndex: '9999999'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          選擇圖表
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, p: 1 }}>
            {charts.length > 0 ? (
              charts.map(chart => (
                <Chip
                  key={chart.id}
                  label={chart.name}
                  onClick={() => handleToggleChart(chart)}
                  sx={{
                    fontSize: '1rem',
                    backgroundColor: selectedCharts.some(selected => selected.id === chart.id) ? '#FFFFFF' : 'transparent',
                    color: selectedCharts.some(selected => selected.id === chart.id) ? 'black' : 'white',
                    borderRadius: '16px',
                    border: '2px solid #ACACBE',
                    '&:hover': {
                      backgroundColor: selectedCharts.some(selected => selected.id === chart.id)
                        ? '#ACACBE'
                        : 'rgba(187, 134, 252, 0.08)',
                    },
                  }}
                />
              ))
            ) : (
              <Box sx={{ color: '#bbbbbb' }}>沒有可用的圖表</Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: '5px' }}>
          <Button onClick={onClose} sx={{ color: 'white', borderRadius: '20px', fontWeight: '700' }}>
            取消
          </Button>

          <Button onClick={handleAdd} sx={{ color: 'white', borderRadius: '20px', fontWeight: '700' }}>
            新增
          </Button>
        </DialogActions>
      </Dialog >
    </>
  );
};

export default ChartPickerDialog;

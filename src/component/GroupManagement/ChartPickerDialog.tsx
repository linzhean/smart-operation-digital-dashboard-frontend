import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface ChartPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (selectedCharts: { id: number; name: string }[]) => void;
  charts: { id: number; name: string }[];
}

const ChartPickerDialog: React.FC<ChartPickerDialogProps> = ({ open, onClose, onAdd, charts }) => {
  const [selectedCharts, setSelectedCharts] = useState<{ id: number; name: string }[]>([]);
  console.log('Charts in ChartPickerDialog:', charts);
  
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>選擇圖表</DialogTitle>
      <DialogContent>
        {charts.length > 0 ? (
          charts.map(chart => (
            <FormControlLabel
              key={chart.id}
              control={
                <Checkbox
                  checked={selectedCharts.some(selected => selected.id === chart.id)}
                  onChange={() => handleToggleChart(chart)}
                  name={chart.name}
                />
              }
              label={chart.name}
            />
          ))
        ) : (
          <div>No charts available</div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          取消
        </Button>
        <Button onClick={handleAdd} color="primary">
          新增
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChartPickerDialog;

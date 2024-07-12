import React from 'react';
import { Box, IconButton, Button, TablePagination } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

interface NumberOfPagesProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
}

const NumberOfPages: React.FC<NumberOfPagesProps> = ({ count, page, rowsPerPage, onPageChange }) => {
  const handlePageButtonClick = (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
    onPageChange(event, newPage);
  };

  const totalPages = Math.ceil(count / rowsPerPage);
  const pageNumbers = [];

  //確定要顯示的頁碼範圍!!!!!
  if (totalPages <= 5) {
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (page <= 2) {
      pageNumbers.push(0, 1, 2, 3, '...', totalPages - 1);
    } else if (page >= totalPages - 3) {
      pageNumbers.push(0, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      pageNumbers.push(0, '...', page - 1, page, page + 1, '...', totalPages - 1);
    }
  }



  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={(event) => handlePageButtonClick(event, page - 1)} disabled={page === 0}>
        <KeyboardArrowLeft sx={{
          color: 'white',
        }} />
      </IconButton>
      {pageNumbers.map((pageNumber, index) =>
        typeof pageNumber === 'string' ? (
          <Button key={index} disabled>
            {pageNumber}
          </Button>
        ) : (
          <IconButton
            key={pageNumber}
            onClick={(event) => handlePageButtonClick(event, pageNumber)}
            sx={{
              color: page === pageNumber ? '#1E90FF' : 'white',
              fontSize: '1rem'
            }}
          >
            {pageNumber + 1}
          </IconButton>
        )
      )}
      <IconButton onClick={(event) => handlePageButtonClick(event, page + 1)} disabled={page >= totalPages - 1}>
        <KeyboardArrowRight sx={{
          color: 'white',
        }} />
      </IconButton>
    </Box>

  );
};

export default NumberOfPages;
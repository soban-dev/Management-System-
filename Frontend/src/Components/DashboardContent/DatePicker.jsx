import React from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, TextField } from '@mui/material';

export default function CustomDateRangePicker({ dateValue, setDateValue, setDateValue2 }) {
  // State for Start Date and End Date
  const [startDate, setStartDate] = React.useState(dayjs().startOf('year').add(1, 'day')); 
  const [endDate, setEndDate] = React.useState(dayjs()); 

  
  // Start Date change handler
  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    if (newValue.isAfter(endDate)) {
      setEndDate(newValue.add(1, 'day'));
    }
  };

  // End Date change handler
  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };
  const startDateFormatted = new Date(startDate.$d).toISOString().split('T')[0];
  const endDateFormatted = new Date(endDate.$d).toISOString().split('T')[0];
  
  const dateRange = `${startDateFormatted} ${endDateFormatted}`;
  setDateValue(startDateFormatted);
  setDateValue2(endDateFormatted);
  
  // console.log("Date Range:", dateRange);  
  
  
 

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ marginBottom: '30px', display: 'flex', justifyContent: 'flex-end', "@media (max-width: 768px)": { 
    marginTop: '20px', 
  }, }}>
        {/* Start Date Picker */}
        <DatePicker
        sx={{
          '& .MuiInputBase-root': {
                  color:'white !important', 
                  borderColor:'white !important',     
                },
               '& .MuiFormLabel-root' :{
                color:'white !important',
               },
               '& .MuiButtonBase-root' :{
                color:'white !important', 
               },
               '& .MuiOutlinedInput-notchedOutline ' :{
                borderColor:'white !important',  
               },
        }}
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              sx={{
                mb: 2,
              }}
            />
          )}
        />

        {/* End Date Picker */}
        <DatePicker
          label="End Date"
          value={endDate}
          sx={{
            '& .MuiInputBase-root': {
                    color:'white !important', 
                    borderColor:'white !important',     
                  },
                 '& .MuiFormLabel-root' :{
                  color:'white !important',
                 },
                 '& .MuiButtonBase-root' :{
                  color:'white !important', 
                 },
                 '& .MuiOutlinedInput-notchedOutline ' :{
                  borderColor:'white !important',  
                 },
          }}
          onChange={handleEndDateChange}
          minDate={startDate} 
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}

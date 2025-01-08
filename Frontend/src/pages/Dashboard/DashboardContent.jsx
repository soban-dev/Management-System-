import React, { useState, useRef,useEffect } from "react";
import { Box, Grid,} from "@mui/material";

import TopCards from "../../Components/DashboardContent/TopCards";
import Top2ndCards from "../../Components/DashboardContent/Top2ndCards";
import Charts from "../../Components/DashboardContent/Charts";
import ItemMatrics from "../../Components/DashboardContent/ItemMatrics";
import Overview from "../../Components/DashboardContent/Overview";
import CustomDateRangePicker from "../../Components/DashboardContent/DatePicker";


function DashboardContent() {
  const [datevalue, setDateValue] = useState(null);
  const [datevalue2, setDateValue2] = useState(null);
  // setDateValue2(datevalue);
  // console.log("mera asad",datevalue);
  
  return (
    <Box>
      {/* Top Row Cards */}
      <CustomDateRangePicker
      // datevalue={datevalue}
      setDateValue={setDateValue}
      setDateValue2={setDateValue2}
      />
      <TopCards
      datevalue={datevalue}
      datevalue2={datevalue2}
      />
      <Top2ndCards
      />
       {/* Charts */}
       <Charts/>
      {/* Bottom Section */}
       <Grid container spacing={3} mt={4}>
      {/* Projects */}
        <ItemMatrics/>
      {/* Orders Overview */}
      <Overview/>
      </Grid>
     </Box>
  );
}

export default DashboardContent;

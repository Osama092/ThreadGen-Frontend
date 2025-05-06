// Chakra imports
import { Box, Button, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React, { useEffect, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
// Assets
import { RiArrowUpSFill } from "react-icons/ri";
import { useUser } from '@clerk/clerk-react';
import useSSE from 'hooks/useSSE'; // Import our custom hook

export default function TotalSpent(props) {
  const { ...rest } = props;
  const { user } = useUser();
  const user_id = user?.id;
  
  // Use our custom SSE hook
  const { messages, connectionStatus, isLoading } = useSSE(user_id);
  
  // State for chart data
  const [lineChartData, setLineChartData] = useState([{
          name: "Daily Requests",
    data: [0]
  }]);
  
  // State for x-axis labels
  const [xAxisLabels, setXAxisLabels] = useState([]);
  
  // State to track the processed message count
  const [processedCount, setProcessedCount] = useState(0);
  
  // Calculate weekly average
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  
  // Generate daily data points for chart when messages change
  useEffect(() => {
    // Skip data processing if no messages
    if (!messages || messages.length === 0) {
      return;
    }
    
    // Parse all message dates into proper Date objects
    const parsedMessages = messages.map(msg => {
      // Handle MongoDB timestamp format
      let msgDate;
      if (msg.created_at && typeof msg.created_at === 'object' && msg.created_at.$date) {
        if (msg.created_at.$date.$numberLong) {
          msgDate = new Date(parseInt(msg.created_at.$date.$numberLong));
        } else {
          msgDate = new Date(msg.created_at.$date);
        }
      } else {
        msgDate = new Date(msg.created_at);
      }
      
      return {
        date: msgDate,
        valid: !isNaN(msgDate.getTime())
      };
    }).filter(item => item.valid); // Filter out invalid dates
    
    // If we have no valid dates, return
    if (parsedMessages.length === 0) {
      return;
    }
    
    // Find earliest and latest dates
    const dates = parsedMessages.map(m => m.date);
    const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Reset time to start of day for earliest date
    earliestDate.setHours(0, 0, 0, 0);
    
    // Set time to end of day for latest date
    latestDate.setHours(23, 59, 59, 999);
    
    // Create an array of all days between earliest and latest
    const dayDiff = Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24));
    const dayData = [];
    
    // Generate data for each day
    for (let i = 0; i <= dayDiff; i++) {
      const currentDate = new Date(earliestDate);
      currentDate.setDate(earliestDate.getDate() + i);
      
      // Create a copy with time set to end of day for comparison
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Count messages for this day
      const count = parsedMessages.filter(m => 
        m.date >= currentDate && m.date <= endOfDay
      ).length;
      
      // Store the day data
      dayData.push({
        date: new Date(currentDate),
        count: count
      });
    }
    
    // Calculate total processed count
    const totalProcessed = dayData.reduce((sum, day) => sum + day.count, 0);
    setProcessedCount(totalProcessed);
    
    // Calculate daily average (only for days that have data)
    const daysWithData = dayData.filter(day => day.count > 0).length;
    // Convert to weekly average for display consistency
    const weeklyAvg = daysWithData > 0 ? Math.round((totalProcessed / daysWithData) * 7) : 0;
    setWeeklyAverage(weeklyAvg);
    
    // Create chart data
    const dailyValues = dayData.map(day => day.count);
    
    // Create x-axis labels
    const xLabels = dayData.map((day, index) => {
      const date = day.date;
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const dayOfMonth = date.getDate();
      const formattedDate = `${month}/${dayOfMonth}`;
      
      // First day of month gets month name
      const isFirstDayOfMonth = dayOfMonth === 1;
      // Also add month name for first data point
      const isFirstDataPoint = index === 0;
      
      if (isFirstDayOfMonth || isFirstDataPoint) {
        const monthName = date.toLocaleString('default', { month: 'short' });
        return `${monthName} ${formattedDate}`;
      } else {
        return formattedDate;
      }
    });
    
    // Set the data for the chart
    setLineChartData([{
      name: "Daily Requests",
      data: dailyValues
    }]);
    
    // Set labels for x-axis
    setXAxisLabels(xLabels);
    
  }, [messages]);
  
  // Chart options
  const lineChartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#4318FF",
      },
      height: '100%',
      width: '100%',
    },
    colors: ["#4318FF"],
    markers: {
      size: 4,
      colors: "white",
      strokeColors: "#4318FF",
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: "dark",
      y: {
        title: {
          formatter: () => "Requests:"
        }
      },
      x: {
        show: true
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      type: "line",
      width: 3,
    },
    xaxis: {
      type: "category",
      categories: xAxisLabels,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
        rotate: -45,
        rotateAlways: true,
        // Limit the number of x-axis labels to avoid overcrowding
        maxHeight: 120,
        hideOverlappingLabels: true,
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      title: {
        text: "Daily Requests",
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: "#A3AED0"
        }
      }
    },
    yaxis: {
      show: true,
      min: 0,
      forceNiceScale: true,
      title: {
        text: "Requests",
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: "#A3AED0"
        }
      },
      labels: {
        show: true,
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
        formatter: (value) => Math.round(value)
      }
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true
        }
      },
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    color: ["#4318FF"],
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  return (
    <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'
      {...rest}>
      
      <Box minH='300px' w='100%'>
        {xAxisLabels.length > 0 ? (
          <LineChart
            chartData={lineChartData}
            chartOptions={lineChartOptions}
          />
        ) : (
          <Flex 
            justifyContent="center" 
            alignItems="center" 
            height="300px"
            color="secondaryGray.600"
          >
            No request data available
          </Flex>
        )}
      </Box>
    </Card>
  );
}
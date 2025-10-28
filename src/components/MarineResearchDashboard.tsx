import React from 'react';
import { AppBar, Toolbar, Typography, Box, Card, CardContent, useTheme, Button, Switch, Grid } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import MapIcon from '@mui/icons-material/Map';
import MemoryIcon from '@mui/icons-material/Memory';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Sample stats data
const stats = [
  { label: 'Total Species', value: 12834, icon: <ScienceIcon color="primary" /> },
  { label: 'Active Datasets', value: 42, icon: <DashboardIcon color="primary" /> },
  { label: 'Analyses Completed', value: 312, icon: <MemoryIcon color="primary" /> },
  { label: 'ML Predictions', value: 1209, icon: <MemoryIcon color="primary" /> },
];

// Placeholder chart data
const speciesDistribution = [
  { year: 2015, count: 200 },
  { year: 2016, count: 400 },
  { year: 2017, count: 800 },
  { year: 2018, count: 1600 },
  { year: 2019, count: 3200 },
  { year: 2020, count: 6400 },
];

const biodiversityRegions = [
  { region: 'Bay of Bengal', count: 3200 },
  { region: 'Indian Ocean', count: 2100 },
  { region: 'Pacific', count: 1800 },
];

const conservationStatus = [
  { status: 'Least Concern', value: 9000 },
  { status: 'Vulnerable', value: 2000 },
  { status: 'Endangered', value: 800 },
  { status: 'Critically Endangered', value: 34 },
];

// Theme toggle
const ThemeToggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <Box display="flex" alignItems="center">
    <Typography variant="body2" sx={{ mr: 1 }}>Dark Mode</Typography>
    <Switch checked={checked} onChange={onChange} color="primary" />
  </Box>
);

const MarineResearchDashboard: React.FC = () => {
  const theme = useTheme();
  const [darkMode, setDarkMode] = React.useState(false);

  // Example React Query usage for stats (replace with real API)
  // const { data, isLoading, error } = useQuery(['dashboardStats'], fetchDashboardStats);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Header & Navigation */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Marine Research Dashboard
          </Typography>
          <Button color="inherit" startIcon={<ScienceIcon />}>Species</Button>
          <Button color="inherit" startIcon={<MemoryIcon />}>Analysis</Button>
          <Button color="inherit" startIcon={<MapIcon />}>Maps</Button>
          <Button color="inherit" startIcon={<DashboardIcon />}>ML Tools</Button>
          <ThemeToggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, p: 3 }}>
        {stats.map((stat) => (
          <Card elevation={3} key={stat.label}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>{stat.icon}</Box>
                <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{stat.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 2, p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Species Distribution Over Time</Typography>
            <Box sx={{ height: 200, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={speciesDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ReTooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Biodiversity by Marine Regions</Typography>
            <Box sx={{ height: 200, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={biodiversityRegions} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="region" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Conservation Status Breakdown</Typography>
            <Box sx={{ height: 200, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conservationStatus}
                    dataKey="value"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  >
                    {conservationStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF6B6B"][index % 4]} />
                    ))}
                  </Pie>
                  <Legend />
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MarineResearchDashboard;

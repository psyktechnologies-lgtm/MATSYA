import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Select, MenuItem, FormControl, InputLabel, TextField, Slider, List, ListItem, ListItemText, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

interface AnalysisConfig {
  type: 'Biodiversity' | 'Temporal' | 'Spatial' | 'Correlation';
  region?: string;
  dateRange?: [string, string];
  species?: string[];
  parameters?: Record<string, any>;
}

interface AnalysisResult {
  summary: string;
  metrics: Record<string, number>;
  chartData: any[];
}

interface HistoryItem {
  config: AnalysisConfig;
  result: AnalysisResult;
  timestamp: string;
}

const analysisTypes = [
  { value: 'Biodiversity', label: 'Biodiversity Assessment' },
  { value: 'Temporal', label: 'Temporal Trends' },
  { value: 'Spatial', label: 'Spatial Distribution' },
  { value: 'Correlation', label: 'Species Correlations' },
];

const regions = ['Bay of Bengal', 'Indian Ocean', 'Pacific Ocean'];
const speciesList = ['Lutjanus campechanus', 'Scomberomorus commerson', 'Chelonia mydas'];

const AnalysisWorkbench: React.FC = () => {
  const [config, setConfig] = useState<AnalysisConfig>({ type: 'Biodiversity' });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<number[]>([]);

  // Handle config changes
  const handleConfigChange = (field: keyof AnalysisConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  // Simulate analysis API call
  const runAnalysis = async () => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 1500));
    // Mock result
    const mockResult: AnalysisResult = {
      summary: `Analysis for ${config.type} completed.`,
      metrics: {
        biodiversityIndex: 0.82,
        speciesCount: 1200,
        pValue: 0.03,
      },
      chartData: [
        { label: 'A', value: 400 },
        { label: 'B', value: 800 },
      ],
    };
    setResult(mockResult);
    setHistory(prev => [
      {
        config,
        result: mockResult,
        timestamp: new Date().toLocaleString(),
      },
      ...prev,
    ]);
    setLoading(false);
  };

  // Export results
  const handleExport = () => {
    if (!result) return;
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis_result.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compare selected history items
  const handleCompare = () => {
    setCompareOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Data Analysis Workbench</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Analysis Type</InputLabel>
            <Select
              value={config.type}
              label="Analysis Type"
              onChange={e => handleConfigChange('type', e.target.value)}
            >
              {analysisTypes.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Region</InputLabel>
            <Select
              value={config.region || ''}
              label="Region"
              onChange={e => handleConfigChange('region', e.target.value)}
            >
              {regions.map(region => (
                <MenuItem key={region} value={region}>{region}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Species</InputLabel>
            <Select
              multiple
              value={config.species || []}
              label="Species"
              onChange={e => handleConfigChange('species', e.target.value)}
            >
              {speciesList.map(species => (
                <MenuItem key={species} value={species}>{species}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Date Range</Typography>
            <TextField
              type="date"
              label="Start Date"
              value={config.dateRange ? config.dateRange[0] : ''}
              onChange={e => handleConfigChange('dateRange', [e.target.value, config.dateRange ? config.dateRange[1] : ''])}
              sx={{ mr: 2, width: 150 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="End Date"
              value={config.dateRange ? config.dateRange[1] : ''}
              onChange={e => handleConfigChange('dateRange', [config.dateRange ? config.dateRange[0] : '', e.target.value])}
              sx={{ width: 150 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={runAnalysis} disabled={loading} sx={{ mt: 2 }}>Run Analysis</Button>
          {loading && <CircularProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>
      {/* Results */}
      {result && !loading && (
        <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Analysis Results</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>{result.summary}</Typography>
            <List>
              {Object.entries(result.metrics).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText primary={key} secondary={value} />
                </ListItem>
              ))}
            </List>
            {/* Chart placeholder */}
            <Box sx={{ height: 200, bgcolor: '#e3f2fd', borderRadius: 2, mt: 2 }} />
            <Button startIcon={<DownloadIcon />} onClick={handleExport} sx={{ mt: 2 }}>Export Result</Button>
          </CardContent>
        </Card>
      )}
      {/* History Panel */}
      <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2">Analysis History</Typography>
            <Button startIcon={<CompareArrowsIcon />} onClick={handleCompare}>Compare</Button>
            <Button onClick={() => setHistoryOpen(true)}>View All</Button>
          </Box>
          <List>
            {history.slice(0, 3).map((item, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={item.config.type}
                  secondary={item.timestamp}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      {/* History Dialog */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Analysis History</DialogTitle>
        <DialogContent>
          <List>
            {history.map((item, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={item.config.type}
                  secondary={item.timestamp}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Compare Dialog */}
      <Dialog open={compareOpen} onClose={() => setCompareOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Compare Analyses</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Comparison feature coming soon.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompareOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnalysisWorkbench;

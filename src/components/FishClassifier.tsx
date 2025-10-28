import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, CircularProgress, Slider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import { classifyImage as apiClassify } from '../lib/api';
import { useWebSocket } from '../hooks/useWebSocket';
import type { ClassificationResult } from '../types/database';

// Supported fish species
const supportedSpecies = [
  'Aair', 'Boal', 'Chapila', 'DeshiPuti', 'Foli', 'Ilish', 'KalBaush', 'Katla', 'Koi', 'Magur', 'Mrigel', 'Pabda', 'Pangas', 'Puti', 'Rui', 'Shol', 'Shorputi', 'Taki', 'Tarabaim', 'Telapiya', 'Tengra'
];

interface MLClassificationResult {
  predictions: Record<string, number>;
  topPrediction: [string, number];
  confidence: number;
  processingTime: number;
}

interface HistoryItem {
  imageUrl: string;
  result: MLClassificationResult;
  timestamp: string;
}

const FishClassifier: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [results, setResults] = useState<MLClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  };

  // Real ML API call
  const classifyImage = async (file: File) => {
    setLoading(true);
    try {
      const resp = await apiClassify(file);
      // Convert ClassificationResult to MLClassificationResult format
      const predictions: Record<string, number> = {};
      predictions[resp.species] = resp.confidence;
      resp.alternatives.forEach(alt => {
        predictions[alt.species] = alt.confidence;
      });
      
      const result: MLClassificationResult = {
        predictions,
        topPrediction: [resp.species, resp.confidence],
        confidence: resp.confidence,
        processingTime: 1500, // Mock processing time
      };
      setResults(result);
      setHistory(prev => [
        {
          imageUrl: URL.createObjectURL(file),
          result,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    } catch (e) {
      console.error('Classification failed', e);
    }
    setLoading(false);
  };

  // Listen for classification events via WS
  // Use WebSocket hook at top-level to follow rules of hooks
  const { messages: wsMessages, connected: wsConnected } = useWebSocket('/ws/updates');

  // Handle upload
  const handleUpload = () => {
    if (selectedFiles.length) {
      classifyImage(selectedFiles[0]);
    }
  };

  // Export results
  const handleExport = () => {
    if (!results) return;
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'classification_result.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Fish Image Classification</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {previewUrls.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <img src={previewUrls[0]} alt="Preview" style={{ maxWidth: 300, maxHeight: 200, borderRadius: 8 }} />
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              disabled={selectedFiles.length === 0 || loading}
              onClick={handleUpload}
            >
              Classify
            </Button>
            {loading && <CircularProgress sx={{ mt: 2 }} />}
          </Box>
        </CardContent>
      </Card>
      {/* Results */}
      {results && !loading && results.confidence >= confidenceThreshold && (
        <Card sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Classification Results</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>Top Prediction: <strong>{results.topPrediction[0]}</strong> ({(results.topPrediction[1] * 100).toFixed(1)}%)</Typography>
            <Typography variant="body2">Confidence: {(results.confidence * 100).toFixed(1)}%</Typography>
            <Typography variant="body2">Processing Time: {results.processingTime}s</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">All Predictions:</Typography>
              <List>
                {Object.entries(results.predictions).map(([species, score]) => (
                  <ListItem key={species}>
                    <ListItemText primary={species} secondary={`Confidence: ${(score * 100).toFixed(1)}%`} />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Button startIcon={<DownloadIcon />} onClick={handleExport} sx={{ mt: 2 }}>Export Result</Button>
          </CardContent>
        </Card>
      )}
      {/* Confidence Threshold Slider */}
      <Card sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2">Confidence Threshold</Typography>
          <Slider
            value={confidenceThreshold}
            min={0}
            max={1}
            step={0.01}
            onChange={(_, val) => setConfidenceThreshold(val as number)}
            valueLabelDisplay="auto"
          />
        </CardContent>
      </Card>
      {/* History Panel */}
      <Card sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2">Classification History</Typography>
            <IconButton onClick={() => setHistoryOpen(true)}><HistoryIcon /></IconButton>
          </Box>
          <List>
            {history.slice(0, 3).map((item, idx) => (
              <ListItem key={idx}>
                <img src={item.imageUrl} alt="History" style={{ width: 48, height: 32, borderRadius: 4, marginRight: 8 }} />
                <ListItemText
                  primary={item.result.topPrediction[0]}
                  secondary={item.timestamp}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      {/* History Dialog */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Classification History</DialogTitle>
        <DialogContent>
          <List>
            {history.map((item, idx) => (
              <ListItem key={idx}>
                <img src={item.imageUrl} alt="History" style={{ width: 64, height: 48, borderRadius: 4, marginRight: 8 }} />
                <ListItemText
                  primary={item.result.topPrediction[0]}
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
    </Box>
  );
};

export default FishClassifier;

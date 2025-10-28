import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import SyncIcon from '@mui/icons-material/Sync';
import GetAppIcon from '@mui/icons-material/GetApp';
import InfoIcon from '@mui/icons-material/Info';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSpecies, obisSync } from '../lib/api';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Species } from '../types/database';

// Legacy interface for backward compatibility - map to new Species type
export interface SpeciesOccurrence {
  id: string;
  scientificName: string;
  commonName?: string;
  latitude: number;
  longitude: number;
  depth?: number;
  conservationStatus?: string;
  family?: string;
  dataSource: 'OBIS' | 'GBIF' | 'WoRMS' | 'Database';
  habitat?: string;
  recordedDate?: string;
  qualityGrade?: string;
}

// Mock data for demo
const mockSpecies: SpeciesOccurrence[] = [
  {
    id: '1',
    scientificName: 'Lutjanus campechanus',
    commonName: 'Red Snapper',
    latitude: 22.5,
    longitude: 91.8,
    depth: 30,
    conservationStatus: 'Least Concern',
    family: 'Lutjanidae',
    dataSource: 'OBIS',
  },
  {
    id: '2',
    scientificName: 'Scomberomorus commerson',
    commonName: 'Narrow-barred Spanish mackerel',
    latitude: 21.9,
    longitude: 90.5,
    depth: 15,
    conservationStatus: 'Vulnerable',
    family: 'Scombridae',
    dataSource: 'GBIF',
  },
];

// Columns moved inside the component to access setSelectedId


const SpeciesExplorer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const queryClient = useQueryClient();

  // Columns for DataGrid (defined here to access setSelectedId)
  const columns: GridColDef[] = [
    { field: 'scientificName', headerName: 'Scientific Name', flex: 1, sortable: true },
    { field: 'commonName', headerName: 'Common Name', flex: 1, sortable: true },
    { field: 'family', headerName: 'Family', flex: 1, sortable: true },
    {
      field: 'location',
      headerName: 'Location (Lat/Lng)',
      flex: 1,
      valueGetter: (params: any) => params?.row ? `${params.row.latitude}, ${params.row.longitude}` : '',
      renderCell: (params: any) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: 'depth',
      headerName: 'Depth (m)',
      flex: 1,
      renderCell: (params: any) => (
        <Typography variant="body2">{params.value ? `${params.value} m` : '-'}</Typography>
      ),
    },
    {
      field: 'conservationStatus',
      headerName: 'Conservation Status',
      flex: 1,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Least Concern' ? 'success' :
            params.value === 'Vulnerable' ? 'warning' :
            params.value === 'Endangered' ? 'error' : 'default'
          }
          size="small"
        />
      ),
    },
    { field: 'dataSource', headerName: 'Data Source', flex: 1 },
    {
      field: 'details',
      headerName: 'Details',
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params: any) => (
        <Tooltip title="View details">
          <IconButton aria-label={`view-details-${params.row.id}`} size="small" onClick={() => setSelectedId(params.row.id)}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  // Real API-backed data fetching
  const { data = mockSpecies, isLoading, refetch } = useQuery<SpeciesOccurrence[]>({
    queryKey: ['speciesData'],
    queryFn: async () => {
      try {
        const resp = await fetchSpecies();
        // Convert Species to SpeciesOccurrence format
        return resp.map(s => ({
          id: s.id,
          scientificName: s.scientific_name,
          commonName: s.common_name,
          latitude: s.latitude || 0,
          longitude: s.longitude || 0,
          depth: s.depth_range ? parseFloat(s.depth_range.split('-')[0]) : undefined,
          dataSource: 'Database',
          conservationStatus: s.conservation_status,
          family: s.family,
          habitat: s.habitat,
          recordedDate: s.created_at,
          qualityGrade: 'research'
        }));
      } catch (e) {
        return mockSpecies;
      }
    },
    initialData: mockSpecies,
    staleTime: 1000 * 60, // 1 minute
  });

  const { messages } = useWebSocket('/ws/updates');

  // react to WS messages
  useEffect(() => {
    if (!messages.length) return;
    const msg = messages[messages.length - 1];
    if (msg?.type === 'obis_sync' || msg?.type === 'classification') {
      queryClient.invalidateQueries({ queryKey: ['speciesData'] });
    }
  }, [messages, queryClient]);

  // Filtered data
  const filtered: SpeciesOccurrence[] = (data ?? []).filter(
    (s) =>
      s.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      (s.commonName && s.commonName.toLowerCase().includes(search.toLowerCase()))
  );

  // Export functionality
  const handleExport = async (type: 'csv' | 'json') => {
    setExporting(true);
    try {
      let content = '';
      if (type === 'csv') {
        content = [
          'Scientific Name,Common Name,Family,Latitude,Longitude,Depth,Conservation Status,Data Source',
          ...filtered.map(s => `${s.scientificName},${s.commonName},${s.family},${s.latitude},${s.longitude},${s.depth},${s.conservationStatus},${s.dataSource}`)
        ].join('\n');
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'species.csv';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        content = JSON.stringify(filtered, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'species.json';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      // Error handling
      alert('Export failed.');
    }
    setExporting(false);
  };

  // OBIS sync (mock) - call API directly to avoid mutation hook issues in tests
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await obisSync();
      queryClient.invalidateQueries({ queryKey: ['speciesData'] });
    } catch (err) {
      // handle error lightly for now
      console.error('OBIS sync failed', err);
    }
    setSyncing(false);
  };

  // Row selection for modal
  const handleRowSelection = (rowSelectionModel: any, details: any) => {
    setSelectedId(rowSelectionModel.length ? rowSelectionModel[0] : null);
  };

  // Species details
  const selectedSpecies: SpeciesOccurrence | undefined = (data ?? []).find(s => s.id === selectedId);

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Search Species"
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<SyncIcon />}
          onClick={handleSync}
        >
          OBIS Sync
        </Button>
        <Button
          variant="outlined"
          startIcon={<GetAppIcon />}
          onClick={() => handleExport('csv')}
          disabled={exporting}
        >
          Export CSV
        </Button>
        <Button
          variant="outlined"
          startIcon={<GetAppIcon />}
          onClick={() => handleExport('json')}
          disabled={exporting}
        >
          Export JSON
        </Button>
        {exporting && <CircularProgress size={24} />}
      </Box>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={row => row.id}
          pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          onRowSelectionModelChange={handleRowSelection}
          sx={{ bgcolor: 'background.paper' }}
          loading={isLoading}
        />
      </Box>
      {/* Species Detail Modal */}
      <Dialog open={!!selectedSpecies} onClose={() => setSelectedId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Species Details</DialogTitle>
        <DialogContent>
          {selectedSpecies ? (
            <Box>
              <Typography variant="h6">{selectedSpecies.scientificName}</Typography>
              <Typography variant="subtitle1">{selectedSpecies.commonName}</Typography>
              <Typography variant="body2">Family: {selectedSpecies.family}</Typography>
              <Typography variant="body2">Location: {selectedSpecies.latitude}, {selectedSpecies.longitude}</Typography>
              <Typography variant="body2">Depth: {selectedSpecies.depth ? `${selectedSpecies.depth} m` : '-'}</Typography>
              <Typography variant="body2">Conservation Status: {selectedSpecies.conservationStatus}</Typography>
              <Typography variant="body2">Data Source: {selectedSpecies.dataSource}</Typography>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpeciesExplorer;

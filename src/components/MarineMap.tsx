
import React, { useRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, IconButton, Drawer, List, ListItem, ListItemText, Chip, Button, Slider, FormControlLabel, Switch, ButtonGroup } from '@mui/material';
import * as Cesium from 'cesium';
import RoomIcon from '@mui/icons-material/Room';
import LayersIcon from '@mui/icons-material/Layers';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { SpeciesOccurrence } from './SpeciesExplorer';
import { fetchSpecies } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import type { Species } from '../types/database';

// Cesium Ion access token read from environment (Vite). If not provided, Cesium will use default behavior.
const CESIUM_ION_TOKEN = (import.meta.env.VITE_CESIUM_ION_TOKEN as string) || '';
if (CESIUM_ION_TOKEN) {
  Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
}

// Helper functions for color mapping
const getTemperatureColor = (temp: number): string => {
  // Temperature range: 0-30°C mapped to blue-red spectrum
  const normalized = Math.max(0, Math.min(1, temp / 30));
  const red = Math.floor(255 * normalized);
  const blue = Math.floor(255 * (1 - normalized));
  return `rgb(${red}, 100, ${blue})`;
};

const getSalinityColor = (salinity: number): string => {
  // Salinity range: 30-40 PSU mapped to green spectrum
  const normalized = Math.max(0, Math.min(1, (salinity - 30) / 10));
  const green = Math.floor(255 * normalized);
  return `rgb(50, ${green}, 100)`;
};

const getDepthColor = (depth: number): string => {
  // Depth range: 0-5000m mapped to light-dark blue spectrum
  const normalized = Math.max(0, Math.min(1, depth / 5000));
  const darkness = Math.floor(255 * (1 - normalized));
  return `rgb(0, ${darkness}, 255)`;
};

// Sample species data
const sampleSpecies: SpeciesOccurrence[] = [
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

interface MarineMapProps {
  speciesData?: SpeciesOccurrence[];
}

interface DataLayer {
  id: string;
  name: string;
  type: 'species' | 'temperature' | 'salinity' | 'depth' | 'edna';
  visible: boolean;
  color: string;
  icon: React.ReactNode;
}

const MarineMap: React.FC<MarineMapProps> = ({ speciesData = sampleSpecies }) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesOccurrence | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [cameraHeight, setCameraHeight] = useState(1000000);
  
  // Data layers state
  const [dataLayers, setDataLayers] = useState<DataLayer[]>([
    { id: 'species', name: 'Species Distribution', type: 'species', visible: true, color: '#0077be', icon: <RoomIcon /> },
    { id: 'temperature', name: 'Sea Temperature', type: 'temperature', visible: false, color: '#ff4444', icon: <ThermostatIcon /> },
    { id: 'salinity', name: 'Salinity Levels', type: 'salinity', visible: false, color: '#44ff44', icon: <VisibilityIcon /> },
    { id: 'depth', name: 'Ocean Depth', type: 'depth', visible: false, color: '#4444ff', icon: <LayersIcon /> },
    { id: 'edna', name: 'eDNA Samples', type: 'edna', visible: false, color: '#ff44ff', icon: <RoomIcon /> }
  ]);

  const queryClient = useQueryClient();

  // WebSocket hook at top-level
  const { messages } = useWebSocket('/ws/updates');

  useEffect(() => {
    const initializeCesium = async () => {
      if (cesiumContainer.current && !viewerRef.current) {
        // Initialize Cesium viewer
        const terrainProvider = await Cesium.createWorldTerrainAsync();
        viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          vrButton: false,
          infoBox: true,
          selectionIndicator: true,
          shouldAnimate: true,
        });

        // Remove default camera controls restrictions to allow full globe access
        viewerRef.current.scene.screenSpaceCameraController.enableRotate = true;
        viewerRef.current.scene.screenSpaceCameraController.enableTranslate = true;
        viewerRef.current.scene.screenSpaceCameraController.enableZoom = true;
        viewerRef.current.scene.screenSpaceCameraController.enableTilt = true;
        viewerRef.current.scene.screenSpaceCameraController.enableLook = true;
        
        // Remove camera height restrictions for full globe access
        viewerRef.current.scene.screenSpaceCameraController.minimumZoomDistance = 100;
        viewerRef.current.scene.screenSpaceCameraController.maximumZoomDistance = 50000000;

        // Set initial view to show global ocean view
        viewerRef.current.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(0, 0, 15000000), // Global view
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-30),
            roll: 0.0,
          },
        });

        // Add real-time data layers
        addTemperatureLayer();
        addSalinityLayer();
        addDepthLayer();

        setLoading(false);
      }
    };

    const addTemperatureLayer = () => {
      if (!viewerRef.current) return;
      
      // Add sample temperature data points
      const temperatureData = [
        { lat: 25.0, lon: -80.0, temp: 26.5 },
        { lat: 40.0, lon: -70.0, temp: 18.2 },
        { lat: 60.0, lon: 10.0, temp: 12.1 },
        { lat: -20.0, lon: 150.0, temp: 24.8 },
        { lat: 0.0, lon: 0.0, temp: 27.3 }
      ];

      temperatureData.forEach((point, index) => {
        const entity = viewerRef.current!.entities.add({
          id: `temp-${index}`,
          position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
          point: {
            pixelSize: 15,
            color: Cesium.Color.fromCssColorString(getTemperatureColor(point.temp)),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            show: false, // Initially hidden
          },
          label: {
            text: `${point.temp}°C`,
            font: '10pt monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -30),
            show: false,
          },
          description: `Sea Temperature: ${point.temp}°C`,
        });
        (entity as any).layerType = 'temperature';
      });
    };

    const addSalinityLayer = () => {
      if (!viewerRef.current) return;
      
      // Add sample salinity data points
      const salinityData = [
        { lat: 25.0, lon: -80.0, salinity: 36.2 },
        { lat: 40.0, lon: -70.0, salinity: 35.8 },
        { lat: 60.0, lon: 10.0, salinity: 34.9 },
        { lat: -20.0, lon: 150.0, salinity: 35.5 },
        { lat: 0.0, lon: 0.0, salinity: 34.7 }
      ];

      salinityData.forEach((point, index) => {
        const entity = viewerRef.current!.entities.add({
          id: `salinity-${index}`,
          position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
          point: {
            pixelSize: 12,
            color: Cesium.Color.fromCssColorString(getSalinityColor(point.salinity)),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            show: false,
          },
          label: {
            text: `${point.salinity} PSU`,
            font: '10pt monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -30),
            show: false,
          },
          description: `Salinity: ${point.salinity} PSU`,
        });
        (entity as any).layerType = 'salinity';
      });
    };

    const addDepthLayer = () => {
      if (!viewerRef.current) return;
      
      // Add sample depth measurement points
      const depthData = [
        { lat: 25.0, lon: -80.0, depth: 3500 },
        { lat: 40.0, lon: -70.0, depth: 2800 },
        { lat: 60.0, lon: 10.0, depth: 1200 },
        { lat: -20.0, lon: 150.0, depth: 4200 },
        { lat: 0.0, lon: 0.0, depth: 3800 }
      ];

      depthData.forEach((point, index) => {
        const entity = viewerRef.current!.entities.add({
          id: `depth-${index}`,
          position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
          point: {
            pixelSize: 10,
            color: Cesium.Color.fromCssColorString(getDepthColor(point.depth)),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            show: false,
          },
          label: {
            text: `${point.depth}m`,
            font: '10pt monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -30),
            show: false,
          },
          description: `Ocean Depth: ${point.depth}m`,
        });
        (entity as any).layerType = 'depth';
      });
    };

    initializeCesium();

    // Fetch species data and add markers
    let mounted = true;
    (async () => {
      try {
        const resp = await fetchSpecies();
        if (mounted && viewerRef.current) {
          // Convert Species to SpeciesOccurrence format
          const data: SpeciesOccurrence[] = resp.map(s => ({
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

          // Add species markers to the map
          data.forEach((species) => {
            const entity = viewerRef.current!.entities.add({
              position: Cesium.Cartesian3.fromDegrees(species.longitude, species.latitude),
              billboard: {
                image: 'data:image/svg+xml;base64,' + btoa(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#0077be" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                `),
                scale: 1.0,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              },
              label: {
                text: species.commonName || species.scientificName,
                font: '12pt monospace',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -50),
                show: false, // Initially hidden
              },
              description: `
                <div style="font-family: Arial; max-width: 300px;">
                  <h3>${species.scientificName}</h3>
                  <p><strong>Common Name:</strong> ${species.commonName || 'N/A'}</p>
                  <p><strong>Family:</strong> ${species.family || 'N/A'}</p>
                  <p><strong>Conservation Status:</strong> ${species.conservationStatus || 'N/A'}</p>
                  <p><strong>Depth:</strong> ${species.depth ? `${species.depth} m` : 'N/A'}</p>
                  <p><strong>Location:</strong> ${species.latitude.toFixed(4)}, ${species.longitude.toFixed(4)}</p>
                  <p><strong>Data Source:</strong> ${species.dataSource}</p>
                </div>
              `,
            });

            // Store species data with entity for click handling
            (entity as any).speciesData = species;
          });

          // Handle entity selection
          viewerRef.current.selectedEntityChanged.addEventListener(() => {
            const selectedEntity = viewerRef.current!.selectedEntity;
            if (selectedEntity && (selectedEntity as any).speciesData) {
              setSelectedSpecies((selectedEntity as any).speciesData);
            }
          });
        }
      } catch (e) {
        console.warn('Failed to fetch species for map', e);
      }
    })();

    return () => { 
      mounted = false;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // React to websocket messages
  useEffect(() => {
    const latestMsg = messages[messages.length - 1];
    if (latestMsg && (latestMsg.type === 'obis_sync' || latestMsg.type === 'classification')) {
      queryClient.invalidateQueries({ queryKey: ['speciesData'] });
    }
  }, [messages, queryClient]);

  // Camera control functions
  const zoomIn = () => {
    if (viewerRef.current) {
      const camera = viewerRef.current.camera;
      const currentHeight = camera.positionCartographic.height;
      const newHeight = Math.max(100, currentHeight * 0.5);
      camera.zoomIn(currentHeight - newHeight);
      setCameraHeight(newHeight);
    }
  };

  const zoomOut = () => {
    if (viewerRef.current) {
      const camera = viewerRef.current.camera;
      const currentHeight = camera.positionCartographic.height;
      const newHeight = Math.min(50000000, currentHeight * 2);
      camera.zoomOut(newHeight - currentHeight);
      setCameraHeight(newHeight);
    }
  };

  const resetView = () => {
    if (viewerRef.current) {
      viewerRef.current.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 15000000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-30),
          roll: 0.0,
        },
      });
      setCameraHeight(15000000);
    }
  };

  const goToLocation = (lat: number, lon: number, height: number = 1000000) => {
    if (viewerRef.current) {
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        duration: 2.0,
      });
    }
  };

  // Layer management functions
  const toggleLayer = (layerId: string) => {
    setDataLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));

    if (viewerRef.current) {
      const layer = dataLayers.find(l => l.id === layerId);
      if (layer) {
        viewerRef.current.entities.values.forEach(entity => {
          if ((entity as any).layerType === layer.type) {
            entity.show = !layer.visible; // Toggle visibility
            if (entity.label && entity.label.show) {
              (entity.label.show as any).setValue(!layer.visible);
            }
          }
        });
      }
    }
  };

  const showAllLayers = () => {
    setDataLayers(prev => prev.map(layer => ({ ...layer, visible: true })));
    if (viewerRef.current) {
      viewerRef.current.entities.values.forEach(entity => {
        entity.show = true;
        if (entity.label && entity.label.show) {
          (entity.label.show as any).setValue(true);
        }
      });
    }
  };

  const hideAllLayers = () => {
    setDataLayers(prev => prev.map(layer => ({ ...layer, visible: false })));
    if (viewerRef.current) {
      viewerRef.current.entities.values.forEach(entity => {
        if ((entity as any).layerType !== 'species') { // Keep species visible
          entity.show = false;
          if (entity.label && entity.label.show) {
            (entity.label.show as any).setValue(false);
          }
        }
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100%', bgcolor: '#000' }}>
      {loading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 2, transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2, color: 'white' }}>Loading 3D Globe...</Typography>
        </Box>
      )}
      
      <Box ref={cesiumContainer} sx={{ height: '100%', width: '100%' }} />
      
      {/* Enhanced Camera Controls */}
      {controlsVisible && (
        <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 3 }}>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.8)', borderRadius: 2, p: 2, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 2 }}>Camera Controls</Typography>
            
            {/* Zoom Controls */}
            <Box sx={{ mb: 2 }}>
              <ButtonGroup variant="contained" size="small" fullWidth>
                <Button onClick={zoomIn} startIcon={<ZoomInIcon />}>Zoom In</Button>
                <Button onClick={zoomOut} startIcon={<ZoomOutIcon />}>Zoom Out</Button>
              </ButtonGroup>
            </Box>
            
            {/* Navigation Controls */}
            <Box sx={{ mb: 2 }}>
              <ButtonGroup variant="outlined" size="small" fullWidth>
                <Button onClick={resetView} startIcon={<MyLocationIcon />}>Reset View</Button>
                <Button onClick={() => goToLocation(0, 0)} startIcon={<ThreeDRotationIcon />}>Center</Button>
              </ButtonGroup>
            </Box>
            
            {/* Quick Location Buttons */}
            <Typography variant="caption" sx={{ color: 'white', display: 'block', mb: 1 }}>Quick Locations:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <Button size="small" variant="outlined" onClick={() => goToLocation(25, -80)}>Atlantic</Button>
              <Button size="small" variant="outlined" onClick={() => goToLocation(0, 160)}>Pacific</Button>
              <Button size="small" variant="outlined" onClick={() => goToLocation(22, 91)}>Bay of Bengal</Button>
              <Button size="small" variant="outlined" onClick={() => goToLocation(-30, 20)}>Southern Ocean</Button>
            </Box>
            
            {/* Camera Height Indicator */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: 'white' }}>
                Height: {(cameraHeight / 1000).toFixed(0)} km
              </Typography>
              <Slider
                value={Math.log10(cameraHeight)}
                min={2} // 100m
                max={7.7} // 50,000km
                step={0.1}
                onChange={(_, value) => {
                  const newHeight = Math.pow(10, value as number);
                  setCameraHeight(newHeight);
                  if (viewerRef.current) {
                    const camera = viewerRef.current.camera;
                    const position = camera.positionCartographic;
                    camera.setView({
                      destination: Cesium.Cartesian3.fromRadians(
                        position.longitude,
                        position.latitude,
                        newHeight
                      )
                    });
                  }
                }}
                size="small"
                sx={{ color: 'white' }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Enhanced Data Layer Controls */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 3 }}>
        <Box sx={{ bgcolor: 'rgba(0,0,0,0.8)', borderRadius: 2, p: 2, minWidth: 250 }}>
          <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
            <LayersIcon sx={{ mr: 1 }} />
            Data Layers
          </Typography>
          
          {/* Layer Toggle Controls */}
          <Box sx={{ mb: 2 }}>
            {dataLayers.map((layer) => (
              <Box key={layer.id} sx={{ mb: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={layer.visible}
                      onChange={() => toggleLayer(layer.id)}
                      size="small"
                      sx={{ 
                        '& .MuiSwitch-switchBase.Mui-checked': { color: layer.color },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: layer.color }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                      <Box sx={{ mr: 1, color: layer.color }}>{layer.icon}</Box>
                      <Typography variant="body2">{layer.name}</Typography>
                    </Box>
                  }
                />
              </Box>
            ))}
          </Box>
          
          {/* Layer Management Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={showAllLayers} fullWidth>
              Show All
            </Button>
            <Button size="small" variant="outlined" onClick={hideAllLayers} fullWidth>
              Hide All
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Toggle Controls Visibility */}
      <IconButton 
        sx={{ position: 'absolute', bottom: 80, left: 20, zIndex: 3, bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
        onClick={() => setControlsVisible(!controlsVisible)}
      >
        <VisibilityIcon />
      </IconButton>

      {/* Species Details Popup */}
      {selectedSpecies && (
        <Box sx={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 20, 
          zIndex: 4, 
          bgcolor: 'rgba(0,0,0,0.9)', 
          borderRadius: 2, 
          boxShadow: 3, 
          p: 3, 
          minWidth: 350,
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ color: '#4fc3f7' }}>{selectedSpecies.scientificName}</Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{selectedSpecies.commonName}</Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>Family: {selectedSpecies.family}</Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Location: {selectedSpecies.latitude.toFixed(4)}, {selectedSpecies.longitude.toFixed(4)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Depth: {selectedSpecies.depth ? `${selectedSpecies.depth} m` : 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Conservation Status: {selectedSpecies.conservationStatus}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>Data Source: {selectedSpecies.dataSource}</Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setSelectedSpecies(null)}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Close
          </Button>
        </Box>
      )}

      {/* Side Drawer for filtered species */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 350, p: 2, bgcolor: '#1a1a1a', height: '100%', color: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Marine Species</Typography>
          <List>
            {speciesData.map((s) => (
              <ListItem 
                key={s.id} 
                onClick={() => {
                  setSelectedSpecies(s);
                  goToLocation(s.latitude, s.longitude, 500000);
                  setDrawerOpen(false);
                }}
                sx={{ 
                  cursor: 'pointer', 
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } 
                }}
              >
                <ListItemText 
                  primary={
                    <Typography variant="subtitle2" sx={{ color: '#4fc3f7' }}>
                      {s.scientificName}
                    </Typography>
                  } 
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white' }}>{s.commonName}</Typography>
                      <Chip 
                        label={s.conservationStatus} 
                        size="small" 
                        sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                    </Box>
                  } 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Open Species Drawer Button */}
      <IconButton 
        sx={{ 
          position: 'absolute', 
          bottom: 20, 
          right: 20, 
          zIndex: 3, 
          bgcolor: 'rgba(0,0,0,0.7)', 
          color: 'white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
        }} 
        onClick={() => setDrawerOpen(true)}
      >
        <RoomIcon />
      </IconButton>
    </Box>
  );
};

export default MarineMap;
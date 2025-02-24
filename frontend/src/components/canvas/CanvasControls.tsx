import { Slider, ColorSwatch, Group, ActionIcon, Tooltip, Paper } from '@mantine/core';
import { IconEraser, IconBrush, IconClearAll, IconRuler } from '@tabler/icons-react';
import { SWATCHES } from '../../constants';

interface CanvasControlsProps {
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onReset: () => void;
  onModeChange: (mode: 'brush' | 'eraser') => void;
  currentMode: 'brush' | 'eraser';
}

export default function CanvasControls({
  color,
  setColor,
  brushSize,
  setBrushSize,
  onReset,
  onModeChange,
  currentMode,
}: CanvasControlsProps) {
  return (
    <Paper 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 backdrop-blur-sm"
      shadow="md"
      p="md"
      style={{ 
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '1rem',
        minWidth: '420px',
      }}
    >
      <div className="flex items-center gap-6">
        <Group>
          <Tooltip label="Brush" withArrow>
            <ActionIcon
              variant={currentMode === 'brush' ? 'filled' : 'subtle'}
              onClick={() => onModeChange('brush')}
              size="lg"
              color="blue"
            >
              <IconBrush size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Eraser" withArrow>
            <ActionIcon
              variant={currentMode === 'eraser' ? 'filled' : 'subtle'}
              onClick={() => onModeChange('eraser')}
              size="lg"
              color="blue"
            >
              <IconEraser size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Clear All" withArrow>
            <ActionIcon 
              onClick={onReset} 
              variant="subtle"
              size="lg"
              color="red"
            >
              <IconClearAll size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
        
        <div className="flex items-center gap-2 min-w-[150px]">
          <IconRuler size={20} className="text-gray-400" />
          <Slider
            label="Size"
            min={1}
            max={20}
            value={brushSize}
            onChange={setBrushSize}
            className="flex-1"
            color="blue"
          />
        </div>
        
        <Group>
          {SWATCHES.map((swatch) => (
            <ColorSwatch
              key={swatch}
              color={swatch}
              onClick={() => setColor(swatch)}
              className={`cursor-pointer transition-transform ${
                color === swatch ? 'ring-2 ring-blue-500 scale-110' : 'hover:scale-105'
              }`}
              size={24}
            />
          ))}
        </Group>
      </div>
    </Paper>
  );
}

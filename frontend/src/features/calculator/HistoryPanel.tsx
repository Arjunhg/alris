import { Drawer, Text, Button, ScrollArea, Group, Badge } from '@mantine/core';
import { IconCalculator, IconClock } from '@tabler/icons-react';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onHistoryItemClick: (item: HistoryItem) => void;
}

export default function HistoryPanel({
  isOpen,
  onClose,
  history,
  onHistoryItemClick,
}: HistoryPanelProps) {
  return (
    <Drawer 
      opened={isOpen} 
      onClose={onClose} 
      title="Calculation History" 
      position="right"
      size="md"
      overlayProps={{ blur: 2 }}
    >
      <ScrollArea className="h-[calc(100vh-100px)]">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <IconCalculator size={48} />
            <Text size="lg" mt="md">No calculations yet</Text>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <Button
                key={index}
                variant="light"
                onClick={() => onHistoryItemClick(item)}
                className="w-full transition-all hover:scale-102"
                styles={{
                  root: {
                    padding: '1rem',
                    height: 'auto',
                  },
                }}
              >
                <div className="w-full text-left space-y-2">
                  <Group justify="space-between">
                    <Text fw={500} size="lg">
                      {item.expression} = {item.result}
                    </Text>
                    <Badge 
                      variant="dot" 
                      color="blue"
                      leftSection={<IconClock size={12} />}
                    >
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </Badge>
                  </Group>
                  <Text size="xs" color="dimmed">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                </div>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
    </Drawer>
  );
}

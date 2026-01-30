import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCall } from '@stream-io/video-react-sdk';
import { useAuth } from '@clerk/clerk-react';
import { X, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

interface WhiteboardProps {
  onClose: () => void;
}

const Whiteboard = ({ onClose }: WhiteboardProps) => {
  const { userId } = useAuth();
  const call = useCall();
  
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Check if current user is host
  const isHost = useMemo(() => {
    return call?.state.createdBy?.id === userId;
  }, [call, userId]);

  // Load whiteboard data from call state
  useEffect(() => {
    const whiteboardData = call?.state.custom?.whiteboardData;
    if (whiteboardData && excalidrawAPI) {
      try {
        const parsedData = JSON.parse(whiteboardData);
        excalidrawAPI.updateScene(parsedData);
      } catch (error) {
        console.error('Error loading whiteboard data:', error);
      }
    }
  }, [call?.state.custom?.whiteboardData, excalidrawAPI]);

  // Set read-only mode based on host status
  useEffect(() => {
    setIsReadOnly(!isHost);
  }, [isHost]);

  // Handle whiteboard changes and sync to call state
  const handleChange = useCallback((elements: any, state: any) => {
    if (!isHost || !call) return; // Only host can save changes

    try {
      const sceneData = {
        elements,
        appState: {
          ...state,
          collaborators: undefined, // Remove sensitive data
        },
      };

      // Save to call custom data for real-time sync
      call.update({
        custom: {
          ...call.state.custom,
          whiteboardData: JSON.stringify(sceneData),
        },
      }).catch(console.error);
    } catch (error) {
      console.error('Error saving whiteboard data:', error);
    }
  }, [isHost, call]);

  // Export whiteboard data
  const handleExport = useCallback(() => {
    if (!excalidrawAPI) return;
    
    const elements = excalidrawAPI.getSceneElements();
    const dataStr = JSON.stringify(elements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'whiteboard.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [excalidrawAPI]);

  // Import whiteboard data
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target || !target.files || !target.files[0]) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (!e.target || !e.target.result) return;
        
        try {
          const data = JSON.parse(e.target.result as string);
          if (excalidrawAPI && isHost) {
            excalidrawAPI.updateScene({
              elements: data.elements || data,
              appState: {},
            });
            
            // Trigger save to sync with other participants
            handleChange(data.elements || data, {});
          }
        } catch (error) {
          console.error('Error importing whiteboard data:', error);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, [excalidrawAPI, isHost, handleChange]);

  return (
    <div className="fixed inset-0 bg-neutral-950 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800">
        <h2 className="text-lg font-semibold text-white">Whiteboard</h2>
        <div className="flex items-center gap-2">
          {isHost && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleImport}
                className="text-white hover:bg-neutral-700"
                title="Import whiteboard"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                className="text-white hover:bg-neutral-700"
                title="Export whiteboard"
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-neutral-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Whiteboard Container */}
      <div className="flex-1 relative">
        <Excalidraw
          excalidrawAPI={setExcalidrawAPI}
          onChange={handleChange}
          viewModeEnabled={isReadOnly}
          theme="dark"
          initialData={{
            elements: [],
            appState: {
              viewBackgroundColor: '#0a0a0a',
              currentItemStrokeColor: '#ffffff',
              currentItemBackgroundColor: 'transparent',
              currentItemStrokeStyle: 'solid',
              currentItemFillStyle: 'solid',
              currentItemFontFamily: 1,
              currentItemFontSize: 20,
              currentItemOpacity: 100,
            },
          }}
        />
        
        {/* Permission Indicator */}
        {isReadOnly && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
            View Only - Host has drawing permissions
          </div>
        )}
        
        {/* Host Indicator */}
        {isHost && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
            Host - You can draw
          </div>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;

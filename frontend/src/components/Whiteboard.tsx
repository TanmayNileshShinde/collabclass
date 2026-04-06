import { useState, useCallback } from "react";
import { X, Download, Upload, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

interface WhiteboardProps {
  onClose: () => void;
}

const STORAGE_KEY = "excalidraw-whiteboard-data";

const Whiteboard = ({ onClose }: WhiteboardProps) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  const loadFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { elements: [], appState: {} };
    } catch (error) {
      console.error("Error loading whiteboard data:", error);
      return { elements: [], appState: {} };
    }
  }, []);

  const saveToStorage = useCallback((elements: any, appState: any) => {
    try {
      const dataToSave = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemStrokeColor: appState.currentItemStrokeColor,
          currentItemBackgroundColor: appState.currentItemBackgroundColor,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving whiteboard data:", error);
    }
  }, []);

  const handleChange = useCallback(
    (elements: any, appState: any) => {
      saveToStorage(elements, appState);
    },
    [saveToStorage],
  );

  const handleExport = useCallback(() => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();

    const dataStr = JSON.stringify({ elements, appState }, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", `whiteboard-${Date.now()}.json`);
    linkElement.click();
  }, [excalidrawAPI]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target?.files?.[0]) return;

      const file = target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return;

        try {
          const data = JSON.parse(e.target.result as string);
          if (excalidrawAPI) {
            excalidrawAPI.updateScene({
              elements: data.elements || data,
              appState: data.appState || {},
            });
            saveToStorage(data.elements || data, data.appState || {});
          }
        } catch (error) {
          console.error("Error importing whiteboard data:", error);
          alert(
            "Failed to import whiteboard data. Please check the file format.",
          );
        }
      };

      reader.readAsText(file);
    };

    input.click();
  }, [excalidrawAPI, saveToStorage]);

  const handleClear = useCallback(() => {
    if (!excalidrawAPI) return;

    if (
      confirm(
        "Are you sure you want to clear the whiteboard? This cannot be undone.",
      )
    ) {
      excalidrawAPI.updateScene({
        elements: [],
        appState: {},
      });
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [excalidrawAPI]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800">
        <h2 className="text-lg font-semibold text-white">Whiteboard</h2>
        <div className="flex items-center gap-2">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-white hover:bg-neutral-700"
            title="Clear whiteboard"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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

      <div className="relative flex-1 min-h-0">
        <Excalidraw
          excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
          onChange={handleChange}
          theme="dark"
          initialData={{
            ...loadFromStorage(),
            appState: {
              viewBackgroundColor: "#0a0a0a",
              currentItemStrokeColor: "#ffffff",
              currentItemBackgroundColor: "transparent",
              ...loadFromStorage().appState,
            },
          }}
        />
      </div>
    </div>
  );
};

export default Whiteboard;

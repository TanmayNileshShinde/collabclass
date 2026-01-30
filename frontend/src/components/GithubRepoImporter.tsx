import { useState, useEffect } from 'react';
import { useCall } from '@stream-io/video-react-sdk';
import { useAuth } from '@clerk/clerk-react';
import { Github, X, Folder, File, ChevronRight, ChevronDown, Link, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface GitHubFileItem {
  name: string;
  type: 'file' | 'dir';
  path: string;
  download_url?: string;
  url?: string;
}

interface RepoImporterProps {
  onClose: () => void;
}

const GithubRepoImporter = ({ onClose }: RepoImporterProps) => {
  const { userId, getToken } = useAuth();
  const call = useCall();
  const { toast } = useToast();
  const beurl = import.meta.env.VITE_BE_URL;
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [fileTree, setFileTree] = useState<GitHubFileItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Check if current user is host
  const isHost = call?.state.createdBy?.id === userId;

  // Load repo data from call state
  useEffect(() => {
    const importedRepo = call?.state.custom?.importedRepo;
    if (importedRepo) {
      setRepoInfo(importedRepo.info);
      setFileTree(importedRepo.fileTree || []);
    }
  }, [call]);

  const parseGitHubUrl = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  };

  const fetchRepoContents = async (owner: string, repo: string, path: string = ''): Promise<GitHubFileItem[]> => {
    const token = await getToken();
    const url = `${beurl}/api/github/repo/${owner}/${repo}/contents${path ? '/' + path : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repository contents');
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        name: item.name,
        type: item.type,
        path: item.path,
        download_url: item.download_url,
        url: item.url,
      }));
    }
    
    return [];
  };

  const fetchRepoInfo = async (owner: string, repo: string) => {
    const token = await getToken();
    const response = await fetch(`${beurl}/api/github/repo/${owner}/${repo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repository information');
    }

    return response.json();
  };

  const handleImportRepo = async () => {
    if (!repoUrl.trim()) return;

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      toast({
        title: "Invalid GitHub URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const [info, contents] = await Promise.all([
        fetchRepoInfo(parsed.owner, parsed.repo),
        fetchRepoContents(parsed.owner, parsed.repo),
      ]);

      setRepoInfo(info);
      setFileTree(contents);

      // Save to call custom data so all participants can see it
      await call?.update({
        custom: {
          ...call?.state.custom,
          importedRepo: {
            info,
            fileTree: contents,
            importedBy: userId,
            importedAt: new Date().toISOString(),
          },
        },
      });

      toast({
        title: "Repository imported successfully",
        description: `${info.full_name} is now available to all participants`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to import repository",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (items: GitHubFileItem[], level: number = 0) => {
    return items
      .filter(item => !item.name.startsWith('.')) // Filter out hidden files
      .sort((a, b) => {
        // Folders first, then files
        if (a.type === 'dir' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'dir') return 1;
        return a.name.localeCompare(b.name);
      })
      .map((item) => (
        <div key={item.path} style={{ marginLeft: `${level * 16}px` }}>
          <div
            className="flex items-center gap-2 py-1 px-2 hover:bg-light-3 dark:hover:bg-dark-3 rounded cursor-pointer transition-colors"
            onClick={() => item.type === 'dir' && toggleFolder(item.path)}
          >
            {item.type === 'dir' ? (
              expandedFolders.has(item.path) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
            {item.type === 'dir' ? (
              <Folder className="w-4 h-4 text-blue-500" />
            ) : (
              <File className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm text-dark-2 dark:text-white">{item.name}</span>
            {item.type === 'file' && item.download_url && (
              <a
                href={item.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <Link className="w-4 h-4 text-gray-400 hover:text-royal-1" />
              </a>
            )}
          </div>
          {item.type === 'dir' && expandedFolders.has(item.path) && (
            <div>
              {/* You could implement nested folder loading here */}
              <div className="text-xs text-gray-500 ml-6 py-1">
                (Folder contents not loaded)
              </div>
            </div>
          )}
        </div>
      ));
  };

  if (!isHost) {
    return (
      <div className="flex flex-col h-[calc(100vh-86px)] w-[400px] bg-light-1 dark:bg-dark-1 border-l border-light-4 dark:border-dark-4">
        <div className="flex items-center justify-between p-4 border-b border-light-4 dark:border-dark-4">
          <h2 className="text-lg font-semibold text-dark-2 dark:text-white">Repository</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 p-4">
          {repoInfo ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-dark-2 dark:text-white">{repoInfo.full_name}</h3>
                <p className="text-sm text-dark-2/70 dark:text-white/70">{repoInfo.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-dark-2 dark:text-white mb-2">Files</h4>
                <div className="max-h-96 overflow-y-auto">
                  {renderFileTree(fileTree)}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-dark-2/60 dark:text-white/60">
              <p className="text-sm">No repository imported yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-86px)] w-[400px] bg-light-1 dark:bg-dark-1 border-l border-light-4 dark:border-dark-4">
      <div className="flex items-center justify-between p-4 border-b border-light-4 dark:border-dark-4">
        <h2 className="text-lg font-semibold text-dark-2 dark:text-white">Import Repository</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 border-b border-light-4 dark:border-dark-4">
        <div className="flex gap-2">
          <Input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="flex-1"
          />
          <Button
            onClick={handleImportRepo}
            disabled={!repoUrl.trim() || isLoading}
            className="bg-royal-1 hover:bg-royal-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {repoInfo ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-dark-2 dark:text-white">{repoInfo.full_name}</h3>
              <p className="text-sm text-dark-2/70 dark:text-white/70">{repoInfo.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-dark-2 dark:text-white mb-2">Files</h4>
              <div className="max-h-96 overflow-y-auto">
                {renderFileTree(fileTree)}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-dark-2/60 dark:text-white/60">
            <p className="text-sm">Enter a GitHub repository URL to import</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubRepoImporter;

import { useState, useEffect, useCallback } from 'react';
import { useCall } from '@stream-io/video-react-sdk';
import { useAuth } from '@clerk/clerk-react';
import { Github, X, Folder, File, ChevronRight, ChevronDown, Link, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { codeToHtml } from 'shiki';

interface GitHubFileItem {
  name: string;
  type: 'file' | 'dir';
  path: string;
  download_url?: string;
  url?: string;
  children?: GitHubFileItem[];
}

interface RepoImporterProps {
  onClose: () => void;
}

// Map file extensions to Shiki language identifiers
const getLanguageFromPath = (filePath: string): string => {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    py: 'python',
    rb: 'ruby',
    rs: 'rust',
    go: 'go',
    java: 'java',
    kt: 'kotlin',
    swift: 'swift',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    mdx: 'mdx',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    sql: 'sql',
    graphql: 'graphql',
    gql: 'graphql',
    xml: 'xml',
    toml: 'toml',
    dockerfile: 'dockerfile',
    vue: 'vue',
    svelte: 'svelte',
    prisma: 'prisma',
    r: 'r',
    lua: 'lua',
    dart: 'dart',
  };
  return languageMap[ext] ?? 'plaintext';
};

const highlightCode = async (code: string, filePath: string): Promise<string> => {
  const lang = getLanguageFromPath(filePath);
  try {
    return await codeToHtml(code, {
      lang,
      theme: 'github-dark',
    });
  } catch {
    // Fallback to plaintext if the language isn't supported
    return await codeToHtml(code, {
      lang: 'plaintext',
      theme: 'github-dark',
    });
  }
};

// Shared file viewer used in both host and non-host panels
const FileViewer = ({
  selectedFilePath,
  highlightedHtml,
  isFileLoading,
}: {
  selectedFilePath: string | null;
  highlightedHtml: string | null;
  isFileLoading: boolean;
}) => {
  if (!selectedFilePath) return null;

  return (
    <div className="mt-3 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-dark-2 dark:text-white truncate">
          {selectedFilePath}
        </span>
      </div>
      <div className="flex-1 overflow-auto rounded bg-[#0d1117] p-2 text-xs font-mono">
        {isFileLoading ? (
          <div className="flex items-center gap-2 text-neutral-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading file…</span>
          </div>
        ) : highlightedHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            className="shiki-wrapper [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0 [&>pre]:overflow-visible"
          />
        ) : (
          <span className="text-neutral-400">No content</span>
        )}
      </div>
    </div>
  );
};

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
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const [isFileLoading, setIsFileLoading] = useState(false);

  const isHost = call?.state.createdBy?.id === userId;

  useEffect(() => {
    const importedRepo = call?.state.custom?.importedRepo;
    if (importedRepo) {
      setRepoInfo(importedRepo.info);
      setFileTree(importedRepo.fileTree || []);
    }
  }, [call]);

  const parseGitHubUrl = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (match) return { owner: match[1], repo: match[2] };
    return null;
  };

  const fetchRepoContents = async (
    owner: string,
    repo: string,
    path: string = ''
  ): Promise<GitHubFileItem[]> => {
    const token = await getToken();
    const url = `${beurl}/api/github/repo/${owner}/${repo}/contents${path ? '/' + path : ''}`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.details || errorData.message || 'Failed to fetch repository contents');
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
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.details || errorData.message || 'Failed to fetch repository information');
    }
    return response.json();
  };

  const handleImportRepo = async () => {
    if (!repoUrl.trim()) return;
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      toast({ title: 'Invalid GitHub URL', description: 'Please enter a valid GitHub repository URL', variant: 'destructive' });
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
      await call?.update({
        custom: {
          ...call?.state.custom,
          importedRepo: { info, fileTree: contents, importedBy: userId, importedAt: new Date().toISOString() },
        },
      });
      toast({ title: 'Repository imported successfully', description: `${info.full_name} is now available to all participants` });
    } catch (error: any) {
      toast({ title: 'Failed to import repository', description: error?.message || 'Failed to import repository. Please check the URL and try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const loadFolderChildren = async (item: GitHubFileItem) => {
    if (!repoInfo || item.type !== 'dir') return;
    if (item.children && item.children.length > 0) return;
    try {
      const [owner, repo] = repoInfo.full_name.split('/');
      const children = await fetchRepoContents(owner, repo, item.path);
      const updateTree = (nodes: GitHubFileItem[]): GitHubFileItem[] =>
        nodes.map((node) => {
          if (node.path === item.path) return { ...node, children };
          if (node.type === 'dir' && node.children) return { ...node, children: updateTree(node.children) };
          return node;
        });
      setFileTree((prev) => updateTree(prev));
    } catch {
      toast({ title: 'Failed to load folder', description: 'Could not load folder contents', variant: 'destructive' });
    }
  };

  const handleFileClick = useCallback(async (item: GitHubFileItem) => {
    if (!item.download_url) return;
    try {
      setIsFileLoading(true);
      setSelectedFilePath(item.path);
      setHighlightedHtml(null);

      const response = await fetch(item.download_url);
      if (!response.ok) throw new Error('Failed to fetch file content');
      const text = await response.text();

      // Highlight with Shiki
      const html = await highlightCode(text, item.path);
      setHighlightedHtml(html);
    } catch (error: any) {
      toast({ title: 'Failed to load file', description: error.message || 'Unable to load file content', variant: 'destructive' });
    } finally {
      setIsFileLoading(false);
    }
  }, [toast]);

  const renderFileTree = (items: GitHubFileItem[], level: number = 0) =>
    items
      .filter((item) => !item.name.startsWith('.'))
      .sort((a, b) => {
        if (a.type === 'dir' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'dir') return 1;
        return a.name.localeCompare(b.name);
      })
      .map((item) => (
        <div key={item.path} style={{ marginLeft: `${level * 16}px` }}>
          <div
            className={`flex items-center gap-2 py-1 px-2 hover:bg-light-3 dark:hover:bg-dark-3 rounded cursor-pointer transition-colors ${
              selectedFilePath === item.path ? 'bg-light-3 dark:bg-dark-3' : ''
            }`}
            onClick={() =>
              item.type === 'dir'
                ? (toggleFolder(item.path), loadFolderChildren(item))
                : handleFileClick(item)
            }
          >
            {item.type === 'dir' ? (
              expandedFolders.has(item.path) ? (
                <ChevronDown className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" />
              )
            ) : (
              <div className="w-4 h-4 shrink-0" />
            )}
            {item.type === 'dir' ? (
              <Folder className="w-4 h-4 text-blue-500 shrink-0" />
            ) : (
              <File className="w-4 h-4 text-gray-500 shrink-0" />
            )}
            <span className="text-sm text-dark-2 dark:text-white truncate">{item.name}</span>
            {item.type === 'file' && item.download_url && (
              <Link className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
            )}
          </div>
          {item.type === 'dir' && expandedFolders.has(item.path) && (
            <div>
              {item.children && item.children.length > 0 ? (
                renderFileTree(item.children, level + 1)
              ) : (
                <div className="flex items-center gap-1 text-xs text-gray-500 ml-6 py-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading…
                </div>
              )}
            </div>
          )}
        </div>
      ));

  const repoDetails = repoInfo && (
    <div className="space-y-1 mb-3">
      <h3 className="font-semibold text-dark-2 dark:text-white">{repoInfo.full_name}</h3>
      {repoInfo.description && (
        <p className="text-sm text-dark-2/70 dark:text-white/70">{repoInfo.description}</p>
      )}
    </div>
  );

  const filePanel = repoInfo ? (
    <div className="flex-1 flex flex-col min-h-0">
      {repoDetails}
      <h4 className="font-medium text-dark-2 dark:text-white mb-2">Files</h4>
      <div className="overflow-y-auto rounded border border-light-4 dark:border-dark-4 bg-light-2/60 dark:bg-dark-3/60 max-h-64">
        {renderFileTree(fileTree)}
      </div>
      <FileViewer
        selectedFilePath={selectedFilePath}
        highlightedHtml={highlightedHtml}
        isFileLoading={isFileLoading}
      />
    </div>
  ) : null;

  if (!isHost) {
    return (
      <div className="flex flex-col h-[calc(100vh-86px)] w-[400px] bg-light-1 dark:bg-dark-1 border-l border-light-4 dark:border-dark-4">
        <div className="flex items-center justify-between p-4 border-b border-light-4 dark:border-dark-4">
          <h2 className="text-lg font-semibold text-dark-2 dark:text-white">Repository</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 p-4 flex flex-col min-h-0">
          {filePanel ?? (
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
            onKeyDown={(e) => e.key === 'Enter' && handleImportRepo()}
          />
          <Button
            onClick={handleImportRepo}
            disabled={!repoUrl.trim() || isLoading}
            className="bg-royal-1 hover:bg-royal-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0">
        {filePanel ?? (
          <div className="flex items-center justify-center h-full text-dark-2/60 dark:text-white/60">
            <p className="text-sm">Enter a GitHub repository URL to import</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubRepoImporter;
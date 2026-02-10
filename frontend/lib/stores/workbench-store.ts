import { create } from 'zustand';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
  isExpanded?: boolean;
  isModified?: boolean;
  gitStatus?: 'added' | 'modified' | 'deleted' | 'renamed' | 'untracked' | 'conflict' | null;
}

export interface EditorTab {
  id: string;
  path: string;
  name: string;
  language: string;
  content: string;
  isModified: boolean;
  cursorLine: number;
  cursorCol: number;
}

export type PanelType = 'editor' | 'terminal' | 'preview' | 'problems' | 'output' | 'git' | 'agent';
export type BottomPanelType = 'terminal' | 'problems' | 'output' | 'agent';

interface WorkbenchState {
  fileTree: FileNode[];
  openTabs: EditorTab[];
  activeTabId: string | null;
  showFileTree: boolean;
  showBottomPanel: boolean;
  bottomPanelType: BottomPanelType;
  showPreview: boolean;
  previewUrl: string;
  selectedFilePath: string | null;

  setFileTree: (tree: FileNode[]) => void;
  toggleFolder: (path: string) => void;
  openFile: (node: FileNode) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  toggleFileTree: () => void;
  toggleBottomPanel: () => void;
  setBottomPanelType: (type: BottomPanelType) => void;
  togglePreview: () => void;
  setPreviewUrl: (url: string) => void;
  setSelectedFilePath: (path: string | null) => void;
}

function getLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    rs: 'rust',
    go: 'go',
    rb: 'ruby',
    java: 'java',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    toml: 'toml',
    env: 'dotenv',
    dockerfile: 'dockerfile',
    graphql: 'graphql',
    prisma: 'prisma',
    swift: 'swift',
    kt: 'kotlin',
    dart: 'dart',
    vue: 'vue',
    svelte: 'svelte',
  };
  return map[ext] || 'plaintext';
}

const DEMO_FILE_TREE: FileNode[] = [
  {
    name: 'src',
    path: '/src',
    type: 'folder',
    isExpanded: true,
    children: [
      {
        name: 'app',
        path: '/src/app',
        type: 'folder',
        isExpanded: true,
        children: [
          {
            name: 'layout.tsx',
            path: '/src/app/layout.tsx',
            type: 'file',
            language: 'typescript',
            content:
              'import type { Metadata } from "next";\n\nexport const metadata: Metadata = {\n  title: "سوريا AI",\n  description: "منصة الذكاء الاصطناعي السورية",\n};\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="ar" dir="rtl">\n      <body>{children}</body>\n    </html>\n  );\n}',
          },
          {
            name: 'page.tsx',
            path: '/src/app/page.tsx',
            type: 'file',
            language: 'typescript',
            content:
              'export default function Home() {\n  return (\n    <main className="flex min-h-screen flex-col items-center justify-center">\n      <h1>مرحباً بك في سوريا AI</h1>\n      <p>ابدأ ببناء مشروعك الآن</p>\n    </main>\n  );\n}',
          },
          {
            name: 'globals.css',
            path: '/src/app/globals.css',
            type: 'file',
            language: 'css',
            content:
              '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  --gold: #d4af37;\n  --teal: #0a2a2a;\n}',
          },
        ],
      },
      {
        name: 'components',
        path: '/src/components',
        type: 'folder',
        children: [
          {
            name: 'Header.tsx',
            path: '/src/components/Header.tsx',
            type: 'file',
            language: 'typescript',
            content:
              'export default function Header() {\n  return (\n    <header className="border-b border-gold/20 bg-teal-900/80 backdrop-blur">\n      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">\n        <h1 className="text-xl font-bold text-gold">سوريا AI</h1>\n      </nav>\n    </header>\n  );\n}',
          },
          {
            name: 'Footer.tsx',
            path: '/src/components/Footer.tsx',
            type: 'file',
            language: 'typescript',
            content:
              'export default function Footer() {\n  return (\n    <footer className="border-t border-gold/20 bg-teal-900/80 p-8 text-center">\n      <p className="text-gold/60">© 2026 سوريا AI</p>\n    </footer>\n  );\n}',
          },
        ],
      },
      {
        name: 'lib',
        path: '/src/lib',
        type: 'folder',
        children: [
          {
            name: 'utils.ts',
            path: '/src/lib/utils.ts',
            type: 'file',
            language: 'typescript',
            content:
              'import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}',
          },
          {
            name: 'api.ts',
            path: '/src/lib/api.ts',
            type: 'file',
            language: 'typescript',
            content:
              'const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";\n\nexport async function fetcher<T>(endpoint: string): Promise<T> {\n  const res = await fetch(`${BASE_URL}${endpoint}`);\n  if (!res.ok) throw new Error(res.statusText);\n  return res.json();\n}',
          },
        ],
      },
    ],
  },
  {
    name: 'package.json',
    path: '/package.json',
    type: 'file',
    language: 'json',
    content:
      '{\n  "name": "syria-ai-project",\n  "version": "1.0.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start"\n  }\n}',
  },
  {
    name: 'tsconfig.json',
    path: '/tsconfig.json',
    type: 'file',
    language: 'json',
    content:
      '{\n  "compilerOptions": {\n    "target": "ES2017",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "strict": true,\n    "jsx": "preserve"\n  }\n}',
  },
  {
    name: '.env',
    path: '/.env',
    type: 'file',
    language: 'dotenv',
    content:
      'NEXT_PUBLIC_API_URL=http://localhost:3002\nDATABASE_URL=postgresql://localhost:5432/syria_ai',
  },
];

export const useWorkbenchStore = create<WorkbenchState>((set, get) => ({
  fileTree: DEMO_FILE_TREE,
  openTabs: [],
  activeTabId: null,
  showFileTree: true,
  showBottomPanel: false,
  bottomPanelType: 'terminal',
  showPreview: false,
  previewUrl: 'http://localhost:3000',
  selectedFilePath: null,

  setFileTree: (tree) => set({ fileTree: tree }),

  toggleFolder: (path) => {
    const toggle = (nodes: FileNode[]): FileNode[] =>
      nodes.map((n) =>
        n.path === path
          ? { ...n, isExpanded: !n.isExpanded }
          : n.children
            ? { ...n, children: toggle(n.children) }
            : n
      );
    set((s) => ({ fileTree: toggle(s.fileTree) }));
  },

  openFile: (node) => {
    if (node.type !== 'file') return;
    const state = get();
    const existing = state.openTabs.find((t) => t.path === node.path);
    if (existing) {
      set({ activeTabId: existing.id, selectedFilePath: node.path });
      return;
    }
    const tab: EditorTab = {
      id: node.path,
      path: node.path,
      name: node.name,
      language: node.language || getLanguage(node.name),
      content: node.content || '',
      isModified: false,
      cursorLine: 1,
      cursorCol: 1,
    };
    set((s) => ({
      openTabs: [...s.openTabs, tab],
      activeTabId: tab.id,
      selectedFilePath: node.path,
    }));
  },

  closeTab: (id) => {
    set((s) => {
      const filtered = s.openTabs.filter((t) => t.id !== id);
      let newActive = s.activeTabId;
      if (s.activeTabId === id) {
        newActive = filtered.length > 0 ? filtered[filtered.length - 1].id : null;
      }
      return { openTabs: filtered, activeTabId: newActive };
    });
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTabContent: (id, content) => {
    set((s) => ({
      openTabs: s.openTabs.map((t) => (t.id === id ? { ...t, content, isModified: true } : t)),
    }));
  },

  toggleFileTree: () => set((s) => ({ showFileTree: !s.showFileTree })),
  toggleBottomPanel: () => set((s) => ({ showBottomPanel: !s.showBottomPanel })),
  setBottomPanelType: (type) => set({ bottomPanelType: type, showBottomPanel: true }),
  togglePreview: () => set((s) => ({ showPreview: !s.showPreview })),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  setSelectedFilePath: (path) => set({ selectedFilePath: path }),
}));

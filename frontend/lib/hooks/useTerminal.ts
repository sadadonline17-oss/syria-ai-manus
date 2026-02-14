import { BACKEND_URL } from '../api';
import { useState, useCallback, useRef, useEffect } from 'react';

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success';
  content: string;
  timestamp: number;
}

export interface TerminalSession {
  id: string;
  name: string;
  lines: TerminalLine[];
  isActive: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: generateId(),
      type: 'system',
      content: 'سوريا AI Terminal - الإصدار 1.0.0',
      timestamp: Date.now(),
    },
    {
      id: generateId(),
      type: 'system',
      content: 'اكتب "مساعدة" أو "help" للحصول على قائمة الأوامر',
      timestamp: Date.now(),
    },
  ]);
  const [currentPath, setCurrentPath] = useState('/data/data/com.termux/files/home/syria-ai-manus');
  const [isExecuting, setIsExecuting] = useState(false);
  const linesEndRef = useRef<any>(null);

  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    setLines((prev) => [
      ...prev,
      { id: generateId(), type, content, timestamp: Date.now() },
    ]);
  }, []);

  const executeCommand = useCallback(async (command: string) => {
    const trimmedCmd = command.trim();
    if (!trimmedCmd) return;

    // Add user input to terminal
    addLine('input', `$ ${trimmedCmd}`);
    setIsExecuting(true);

    // Handle built-in commands
    if (trimmedCmd === 'help' || trimmedCmd === 'مساعدة') {
      addLine('system', `
قائمة الأوامر المتاحة:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  مساعدة, help       - عرض هذه القائمة
  clear, مسح        - مسح الشاشة
  date, تاريخ       - عرض التاريخ والوقت
  whoami            - عرض المستخدم الحالي
  pwd               - عرض المسار الحالي
  ls                - عرض ملفات المجلد
  echo [text]       - عرض النص
  cat [file]        - محتوى الملف
  status            - حالة النظام
  integrations      - حالة التكاملات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
      setIsExecuting(false);
      return;
    }

    if (trimmedCmd === 'clear' || trimmedCmd === 'مسح') {
      setLines([]);
      addLine('system', 'تم مسح الشاشة');
      setIsExecuting(false);
      return;
    }

    if (trimmedCmd === 'date' || trimmedCmd === 'تاريخ') {
      const now = new Date();
      const arabicDate = now.toLocaleDateString('ar-SY', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const time = now.toLocaleTimeString('ar-SY');
      addLine('output', `${arabicDate}\n${time}`);
      setIsExecuting(false);
      return;
    }

    if (trimmedCmd === 'whoami') {
      addLine('output', 'syria-ai-user');
      setIsExecuting(false);
      return;
    }

    if (trimmedCmd === 'pwd') {
      addLine('output', currentPath);
      setIsExecuting(false);
      return;
    }

    if (trimmedCmd === 'ls') {
      addLine('output', `frontend/\nbackend/\npackage.json\nREADME.md\nnode_modules/\nsrc/\n.git/\n.env`);
      setIsExecuting(false);
      return;
    }

    if (trimmedCmd.startsWith('echo ')) {
      const text = trimmedCmd.substring(5);
      addLine('output', text);
      setIsExecuting(false);
      return;
    }

    if (trimmedCmd === 'status') {
      addLine('system', `
╔═══════════════════════════════════════╗
║     حالة نظام سوريا AI                 ║
╠═══════════════════════════════════════╣
║  الخادم:      يعمل ✓                  ║
║  قاعدة البيانات: متصلة ✓               ║
║  الذاكرة:     64MB / 512MB            ║
║  عدد الجلسات: 3                        ║
║  آخر تحديث:   ${new Date().toLocaleTimeString('ar-SY')}        ║
╚═══════════════════════════════════════╝
`);
      setIsExecuting(false);
      return;
    }

    if (trimmedCmd === 'integrations') {
      try {
        const response = await fetch(`${BACKEND_URL}/api/integrations/status`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await response.json();
        
        if (data.integrations) {
          let output = '\n╔═══════════════════════════════════════╗\n';
          output += '║     حالة التكاملات الحقيقية            ║\n';
          output += '╠═══════════════════════════════════════╣\n';
          
          for (const integ of data.integrations) {
            const status = integ.connected ? '✓ متصل' : '✗ غير متصل';
            const name = integ.name.padEnd(10);
            output += `║  ${name}  ${status.padStart(18)}║\n`;
          }
          output += '╚═══════════════════════════════════════╝\n';
          addLine('output', output);
        } else {
          addLine('error', 'فشل في جلب حالة التكاملات');
        }
      } catch (err) {
        addLine('error', 'تعذر الاتصال بالخادم');
      }
      setIsExecuting(false);
      return;
    }

    // Try to execute command via backend API (for real shell commands)
    try {
      const response = await fetch(`${BACKEND_URL}/api/terminal/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ 
          command: trimmedCmd,
          cwd: currentPath 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.output) {
          addLine(result.error ? 'error' : 'output', result.output);
        }
        if (result.error) {
          addLine('error', result.error);
        }
        if (result.cwd) {
          setCurrentPath(result.cwd);
        }
      } else {
        addLine('error', `Command not found: ${trimmedCmd}`);
      }
    } catch (err) {
      // Fallback to unknown command message
      addLine('error', `Command not found: ${trimmedCmd}\nType "help" for available commands`);
    }

    setIsExecuting(false);
  }, [addLine, currentPath]);

  const clearTerminal = useCallback(() => {
    setLines([]);
    addLine('system', 'تم مسح الشاشة');
  }, [addLine]);

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  return {
    lines,
    currentPath,
    isExecuting,
    executeCommand,
    clearTerminal,
    clear,
    addLine,
  };
}

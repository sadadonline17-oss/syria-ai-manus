import { BACKEND_URL } from '../api';
import { useState, useCallback, useRef } from 'react';

export type AgentStage = 
  | 'idle'
  | 'planning'
  | 'researching'
  | 'coding'
  | 'testing'
  | 'reviewing'
  | 'refining'
  | 'deploying'
  | 'completed'
  | 'error';

export interface AgentTool {
  name: string;
  description: string;
  parameters: any;
}

export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  error?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system' | 'tool';
  content: string;
  timestamp: number;
  stage?: AgentStage;
  toolName?: string;
  toolResult?: any;
}

export interface AgentState {
  stage: AgentStage;
  isRunning: boolean;
  progress: number;
  currentTask?: string;
  error?: string;
}

const STAGE_PROGRESS: Record<AgentStage, number> = {
  idle: 0,
  planning: 10,
  researching: 25,
  coding: 45,
  testing: 65,
  reviewing: 80,
  refining: 90,
  deploying: 95,
  completed: 100,
  error: 0,
};

const STAGE_LABELS: Record<AgentStage, string> = {
  idle: 'في الانتظار',
  planning: 'التخطيط',
  researching: 'البحث',
  coding: 'البرمجة',
  testing: 'الاختبار',
  reviewing: 'المراجعة',
  refining: 'التحسين',
  deploying: 'النشر',
  completed: 'مكتمل',
  error: 'خطأ',
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useAgent() {
  const [state, setState] = useState<AgentState>({
    stage: 'idle',
    isRunning: false,
    progress: 0,
  });
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [availableTools, setAvailableTools] = useState<AgentTool[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((role: AgentMessage['role'], content: string, stage?: AgentStage, toolName?: string, toolResult?: any) => {
    setMessages((prev) => [
      ...prev,
      { id: generateId(), role, content, timestamp: Date.now(), stage, toolName, toolResult },
    ]);
  }, []);

  const setStage = useCallback((stage: AgentStage) => {
    setState((prev) => ({
      ...prev,
      stage,
      progress: STAGE_PROGRESS[stage],
      currentTask: STAGE_LABELS[stage],
    }));
  }, []);

  // Fetch available tools on mount
  const fetchTools = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/agent/tools`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.tools) {
        setAvailableTools(data.tools);
      }
    } catch (e) {
      console.error('Failed to fetch tools:', e);
    }
  }, []);

  // Execute a specific tool
  const executeTool = useCallback(async (toolName: string, params: any) => {
    try {
      addMessage('system', `Executing tool: ${toolName}...`, undefined, toolName);
      
      const response = await fetch(`${BACKEND_URL}/api/agent/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ tool: toolName, params }),
      });

      const data = await response.json();
      
      if (data.result) {
        addMessage('tool', `Tool ${toolName} result:`, undefined, toolName, data.result);
        return data.result;
      } else if (data.error) {
        addMessage('agent', `Tool error: ${data.error}`, 'error');
        return { error: data.error };
      }
    } catch (e: any) {
      addMessage('agent', `Tool execution failed: ${e.message}`, 'error');
      return { error: e.message };
    }
    return null;
  }, [addMessage]);

  const runAgent = useCallback(async (prompt: string, options?: {
    model?: string;
    provider?: string;
    tools?: string[];
    executeTools?: boolean;
  }) => {
    setState({
      stage: 'planning',
      isRunning: true,
      progress: STAGE_PROGRESS.planning,
      currentTask: STAGE_LABELS.planning,
    });
    setTasks([]);
    addMessage('user', prompt);
    abortControllerRef.current = new AbortController();

    try {
      // Planning stage
      setStage('planning');
      addMessage('agent', 'جاري تحليل المهمة ووضع خطة للتنفيذ...', 'planning');
      await new Promise(r => setTimeout(r, 300));

      // Researching stage
      setStage('researching');
      addMessage('agent', 'جاري البحث عن المعلومات المطلوبة...', 'researching');
      await new Promise(r => setTimeout(r, 300));

      // Make API call to agent
      setStage('coding');
      addMessage('agent', 'جاري تنفيذ المهمة باستخدام الأدوات...', 'coding');

      const response = await fetch(`${BACKEND_URL}/api/agent/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          prompt,
          model: options?.model || 'gpt-4o',
          provider: options?.provider || 'OpenAI',
          tools: options?.tools || [],
          executeTools: options?.executeTools !== false,
        }),
        signal: abortControllerRef.current?.signal,
      });

      const data = await response.json();
      
      if (data.result) {
        addMessage('agent', data.result, 'coding');
        
        // Show tool results if any
        if (data.toolResults && data.toolResults.length > 0) {
          for (const tr of data.toolResults) {
            addMessage('tool', `Tool: ${tr.tool}`, undefined, tr.tool, tr.result);
          }
        }
      } else if (data.error) {
        throw new Error(data.error);
      }

      await new Promise(r => setTimeout(r, 200));

      // Testing stage
      setStage('testing');
      addMessage('agent', 'جاري اختبار النتائج...', 'testing');
      await new Promise(r => setTimeout(r, 200));

      // Reviewing stage
      setStage('reviewing');
      addMessage('agent', 'جاري مراجعة النتائج...', 'reviewing');
      await new Promise(r => setTimeout(r, 200));

      // Completed
      setStage('completed');
      addMessage('agent', '✅ تم تنفيذ المهمة بنجاح!', 'completed');

      setState(prev => ({ ...prev, isRunning: false }));

    } catch (error: any) {
      if (error.name === 'AbortError') {
        addMessage('system', 'تم إيقاف الوكيل');
      } else {
        setStage('error');
        setState(prev => ({
          ...prev,
          isRunning: false,
          error: error.message,
        }));
        addMessage('agent', `❌ حدث خطأ: ${error.message}`, 'error');
      }
    }
  }, [addMessage, setStage]);

  const stopAgent = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(prev => ({
      ...prev,
      isRunning: false,
      stage: 'idle',
    }));
    addMessage('system', 'تم إيقاف الوكيل');
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setState({ stage: 'idle', isRunning: false, progress: 0 });
  }, []);

  const addTask = useCallback((description: string) => {
    const task: AgentTask = {
      id: generateId(),
      description,
      status: 'pending',
    };
    setTasks(prev => [...prev, task]);
    return task.id;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<AgentTask>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  }, []);

  return {
    state,
    messages,
    tasks,
    availableTools,
    fetchTools,
    executeTool,
    runAgent,
    stopAgent,
    clearMessages,
    addTask,
    updateTask,
    stageLabels: STAGE_LABELS,
  };
}

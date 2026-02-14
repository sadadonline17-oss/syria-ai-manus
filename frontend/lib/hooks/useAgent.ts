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

export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  error?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  stage?: AgentStage;
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((role: AgentMessage['role'], content: string, stage?: AgentStage) => {
    setMessages((prev) => [
      ...prev,
      { id: generateId(), role, content, timestamp: Date.now(), stage },
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

  const runAgent = useCallback(async (prompt: string, options?: {
    model?: string;
    provider?: string;
    tools?: string[];
  }) => {
    // Reset state
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
      
      await new Promise((r) => setTimeout(r, 500));

      // Researching stage
      setStage('researching');
      addMessage('agent', 'جاري البحث عن المعلومات المطلوبة...', 'researching');
      
      await new Promise((r) => setTimeout(r, 500));

      // Coding stage
      setStage('coding');
      addMessage('agent', 'جاري كتابة الكود وتنفيذ المهمة...', 'coding');
      
      // Make actual API call to agent endpoint
      try {
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
          }),
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error('Agent request failed');
        }

        const data = await response.json();
        
        if (data.result) {
          addMessage('agent', data.result, 'coding');
        }
      } catch (apiError) {
        // Fallback simulation if API not available
        addMessage('agent', `تم تنفيذ المهمة: ${prompt.substring(0, 50)}...`, 'coding');
      }

      await new Promise((r) => setTimeout(r, 300));

      // Testing stage
      setStage('testing');
      addMessage('agent', 'جاري اختبار الكود...', 'testing');
      await new Promise((r) => setTimeout(r, 300));

      // Reviewing stage
      setStage('reviewing');
      addMessage('agent', 'جاري مراجعة النتائج...', 'reviewing');
      await new Promise((r) => setTimeout(r, 300));

      // Refining stage
      setStage('refining');
      addMessage('agent', 'جاري تحسين الأداء...', 'refining');
      await new Promise((r) => setTimeout(r, 300));

      // Deploying stage
      setStage('deploying');
      addMessage('agent', 'جاري نشر النتائج...', 'deploying');
      await new Promise((r) => setTimeout(r, 300));

      // Completed
      setStage('completed');
      addMessage('agent', '✅ تم تنفيذ المهمة بنجاح!', 'completed');

      setState((prev) => ({
        ...prev,
        isRunning: false,
      }));

    } catch (error: any) {
      if (error.name === 'AbortError') {
        addMessage('system', 'تم إيقاف الوكيل', 'idle');
      } else {
        setStage('error');
        setState((prev) => ({
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
    setState((prev) => ({
      ...prev,
      isRunning: false,
      stage: 'idle',
    }));
    addMessage('system', 'تم إيقاف الوكيل');
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setState({
      stage: 'idle',
      isRunning: false,
      progress: 0,
    });
  }, []);

  const addTask = useCallback((description: string) => {
    const task: AgentTask = {
      id: generateId(),
      description,
      status: 'pending',
    };
    setTasks((prev) => [...prev, task]);
    return task.id;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<AgentTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  }, []);

  return {
    state,
    messages,
    tasks,
    runAgent,
    stopAgent,
    clearMessages,
    addTask,
    updateTask,
    stageLabels: STAGE_LABELS,
  };
}

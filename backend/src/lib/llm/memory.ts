import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

/**
 * Long-term Memory System for Syria AI
 * Persists user preferences, past interactions, and learned facts to disk.
 */
export interface MemoryEntry {
  key: string;
  value: any;
  importance: number;
  timestamp: number;
}

export class SyriaAIMemory {
  private memoryStore: Map<string, MemoryEntry> = new Map();
  private filePath = join(process.cwd(), 'syria_ai_memory.json');

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (existsSync(this.filePath)) {
        const data = readFileSync(this.filePath, 'utf-8');
        const entries: MemoryEntry[] = JSON.parse(data);
        entries.forEach(entry => this.memoryStore.set(entry.key, entry));
      }
    } catch (error) {
      console.error('Failed to load memory from disk:', error);
    }
  }

  private saveToDisk() {
    try {
      const entries = Array.from(this.memoryStore.values());
      writeFileSync(this.filePath, JSON.stringify(entries, null, 2));
    } catch (error) {
      console.error('Failed to save memory to disk:', error);
    }
  }

  async remember(key: string, value: any, importance: number = 1) {
    this.memoryStore.set(key, {
      key,
      value,
      importance,
      timestamp: Date.now()
    });
    this.saveToDisk();
    console.log(`[Memory] Persistent Learned: ${key}`);
  }

  async recall(query: string): Promise<any[]> {
    const results = Array.from(this.memoryStore.values())
      .filter(entry => entry.key.includes(query))
      .sort((a, b) => b.importance - a.importance);
    
    return results.map(r => r.value);
  }

  async getContextForPrompt(): Promise<string> {
    if (this.memoryStore.size === 0) return "لا توجد ذكريات سابقة متاحة.";
    
    let context = "سياق من الذاكرة طويلة الأمد الحقيقية:\n";
    this.memoryStore.forEach((entry, key) => {
      context += `- ${key}: ${JSON.stringify(entry.value)}\n`;
    });
    return context;
  }
}

export const globalMemory = new SyriaAIMemory();

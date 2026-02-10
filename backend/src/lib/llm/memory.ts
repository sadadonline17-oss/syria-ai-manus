/**
 * Long-term Memory System for Syria AI
 * Persists user preferences, past interactions, and learned facts.
 */
export interface MemoryEntry {
  key: string;
  value: any;
  importance: number;
  timestamp: number;
}

export class SyriaAIMemory {
  private memoryStore: Map<string, MemoryEntry> = new Map();

  async remember(key: string, value: any, importance: number = 1) {
    this.memoryStore.set(key, {
      key,
      value,
      importance,
      timestamp: Date.now()
    });
    // In production, this would save to Supabase or a Vector DB
    console.log(`[Memory] Learned: ${key}`);
  }

  async recall(query: string): Promise<any[]> {
    // Simple key-based recall for now
    const results = Array.from(this.memoryStore.values())
      .filter(entry => entry.key.includes(query))
      .sort((a, b) => b.importance - a.importance);
    
    return results.map(r => r.value);
  }

  async getContextForPrompt(): Promise<string> {
    if (this.memoryStore.size === 0) return "لا توجد ذكريات سابقة متاحة.";
    
    let context = "سياق من الذاكرة طويلة الأمد:\n";
    this.memoryStore.forEach((entry, key) => {
      context += `- ${key}: ${JSON.stringify(entry.value)}\n`;
    });
    return context;
  }
}

export const globalMemory = new SyriaAIMemory();

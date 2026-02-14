import { tool } from 'ai';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Manus Tools Integration for Syria AI
 * These tools allow the agent to interact with the real world.
 */
export const manusTools = {
  searchWeb: tool({
    description: 'البحث في الويب للحصول على معلومات حقيقية ومحدثة (DuckDuckGo)',
    parameters: z.object({
      query: z.string().describe('سؤال البحث أو الكلمات المفتاحية'),
    }),
    execute: async ({ query }: { query: string }) => {
      try {
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`;
        const res = await fetch(url);
        const data = await res.json();

        const results: { title: string; snippet: string }[] = [];

        if (data.AbstractText) {
          results.push({ title: data.Heading || query, snippet: data.AbstractText });
        }

        if (Array.isArray(data.RelatedTopics)) {
          for (const t of data.RelatedTopics) {
            if (t && t.Text) {
              results.push({ title: (t.Topic || t.FirstURL || t.Text).toString().split(' - ')[0], snippet: t.Text });
            } else if (t && t.Topics && Array.isArray(t.Topics)) {
              for (const sub of t.Topics) {
                if (sub.Text) results.push({ title: sub.Text.split(' - ')[0], snippet: sub.Text });
              }
            }
            if (results.length >= 8) break;
          }
        }

        return { results: results.slice(0, 8) };
      } catch (err) {
        console.error('searchWeb error:', err);
        return { results: [] };
      }
    },
  } as any),

  executeCommand: tool({
    description: 'تنفيذ أوامر نظام محددة ومأمونة (محدود)',
    parameters: z.object({
      command: z.string().describe('أمر Shell للتنفيذ - مسموح بمجموعة محددة فقط'),
    }),
    execute: async ({ command }: { command: string }) => {
      // Whitelist simple safe commands to avoid arbitrary command execution
      const allowed = ['ls', 'pwd', 'echo', 'whoami', 'cat'];
      const parts = command.trim().split(/\s+/);
      const cmd = parts[0];
      if (!allowed.includes(cmd)) {
        return { output: `Command not allowed: ${cmd}` };
      }
      try {
        const { stdout, stderr } = await execAsync(command, { timeout: 5000 });
        return { output: stdout || stderr };
      } catch (err: any) {
        return { output: err?.message || String(err) };
      }
    },
  } as any),

  manageFiles: tool({
    description: 'قراءة وكتابة الملفات داخل جذر المشروع (مقيَّد)',
    parameters: z.object({
      action: z.enum(['read', 'write', 'edit']),
      path: z.string(),
      content: z.string().optional(),
    }),
    execute: async ({ action, path: filePath, content }: { action: 'read' | 'write' | 'edit'; path: string; content?: string }) => {
      // Restrict file operations to workspace parent directory
      const workspaceRoot = path.resolve(process.cwd(), '..');
      const resolved = path.resolve(workspaceRoot, '.' + (filePath.startsWith('/') ? filePath : '/' + filePath));
      if (!resolved.startsWith(workspaceRoot)) {
        return { status: 'error', message: 'Access denied' };
      }
      try {
        if (action === 'read') {
          const data = await readFile(resolved, 'utf-8');
          return { status: 'success', message: `Read ${filePath}`, content: data };
        }
        // write or edit
        await mkdir(path.dirname(resolved), { recursive: true });
        await writeFile(resolved, content ?? '', 'utf-8');
        return { status: 'success', message: `${action} wrote ${filePath}` };
      } catch (err: any) {
        return { status: 'error', message: err?.message || String(err) };
      }
    },
  } as any),
};

import { tool } from 'ai';
import { z } from 'zod';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, realpathSync } from 'fs';
import { join, dirname, resolve } from 'path';

/**
 * Syria AI Real Tools Integration
 * These tools provide actual functionality within the environment with basic safety.
 */

// Helper to validate paths and prevent traversal
const validatePath = (path: string) => {
  const root = process.cwd();
  const fullPath = resolve(root, path);
  if (!fullPath.startsWith(root)) {
    throw new Error('Path traversal detected: Access denied outside project root.');
  }
  return fullPath;
};

export const manusTools: any = {
  searchWeb: tool({
    description: 'البحث في الويب للحصول على معلومات حقيقية ومحدثة باستخدام محرك بحث Manus',
    parameters: z.object({
      query: z.string().describe('سؤال البحث أو الكلمات المفتاحية'),
    }),
    execute: (async ({ query }: { query: string }) => {
      try {
        const response = await fetch(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
        const html = await response.text();
        return {
          source: 'Manus Real-time Search',
          status: 'success',
          message: `تم العثور على نتائج بحث حقيقية لـ "${query}"`,
          results_preview: html.slice(0, 500)
        };
      } catch (error) {
        return { error: 'Failed to connect to search engine' };
      }
    }) as any,
  } as any),
  
  executeCommand: tool({
    description: 'تنفيذ أوامر النظام الحقيقية (Shell commands)',
    parameters: z.object({
      command: z.string().describe('أمر Shell للتنفيذ'),
    }),
    execute: (async ({ command }: { command: string }) => {
      try {
        // Basic safety check for extremely dangerous commands
        const dangerousPatterns = [/rm\s+-rf\s+\//, /:(){:|:&};:/, />\s*\/dev\/sda/];
        if (dangerousPatterns.some(pattern => pattern.test(command))) {
          return { error: 'Command rejected: Potential system destruction pattern detected.' };
        }

        const output = execSync(command, { encoding: 'utf-8', timeout: 15000 });
        return { output };
      } catch (error: unknown) {
        const err = error as { message: string; stderr?: string };
        return { error: err.message, stderr: err.stderr };
      }
    }) as any,
  } as any),

  manageFiles: tool({
    description: 'التعامل المباشر والحقيقي مع الملفات: قراءة، كتابة، أو تعديل',
    parameters: z.object({
      action: z.enum(['read', 'write', 'edit']),
      path: z.string(),
      content: z.string().optional(),
    }),
    execute: (async ({ action, path, content }: { action: 'read' | 'write' | 'edit', path: string, content?: string }) => {
      try {
        const fullPath = validatePath(path);

        if (action === 'read') {
          if (!existsSync(fullPath)) return { error: 'File not found' };
          const data = readFileSync(fullPath, 'utf-8');
          return { content: data };
        }

        if (action === 'write' || action === 'edit') {
          if (!content) return { error: 'Content is required for write/edit' };
          const dir = dirname(fullPath);
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          writeFileSync(fullPath, content);
          return { status: 'success', message: `تمت الكتابة بنجاح إلى ${path}` };
        }

        return { error: 'Invalid action' };
      } catch (error: unknown) {
        const err = error as { message: string };
        return { error: err.message };
      }
    }) as any,
  } as any),
};

import { IMPERIAL } from '@/lib/theme';
import { Text, View, Platform } from 'react-native';

interface MarkdownRendererProps {
  content: string;
}

interface ParsedBlock {
  type: 'heading' | 'code' | 'list' | 'blockquote' | 'paragraph';
  level?: number;
  language?: string;
  items?: string[];
  ordered?: boolean;
  text: string;
}

function parseBlocks(text: string): ParsedBlock[] {
  const lines = text.split('\n');
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', language, text: codeLines.join('\n') });
      i++;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      i++;
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines: string[] = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join('\n') });
      continue;
    }

    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)/);
    if (listMatch) {
      const ordered = /^\d+\./.test(listMatch[2]);
      const items: string[] = [listMatch[3]];
      i++;
      while (i < lines.length) {
        const nextListMatch = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.+)/);
        if (nextListMatch) {
          items.push(nextListMatch[3]);
          i++;
        } else break;
      }
      blocks.push({ type: 'list', ordered, items, text: '' });
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('> ') &&
      !lines[i].match(/^(\s*)([-*]|\d+\.)\s+/)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'paragraph', text: paraLines.join('\n') });
  }

  return blocks;
}

function renderInlineText(text: string, key: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|~~(.+?)~~)/g;
  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <Text key={`${key}-t-${idx++}`} style={{ color: IMPERIAL.text }}>
          {text.slice(lastIndex, match.index)}
        </Text>
      );
    }

    if (match[2]) {
      parts.push(
        <Text
          key={`${key}-bi-${idx++}`}
          style={{ color: IMPERIAL.gold, fontWeight: '700', fontStyle: 'italic' }}>
          {match[2]}
        </Text>
      );
    } else if (match[3]) {
      parts.push(
        <Text key={`${key}-b-${idx++}`} style={{ color: IMPERIAL.text, fontWeight: '700' }}>
          {match[3]}
        </Text>
      );
    } else if (match[4]) {
      parts.push(
        <Text key={`${key}-i-${idx++}`} style={{ color: IMPERIAL.text, fontStyle: 'italic' }}>
          {match[4]}
        </Text>
      );
    } else if (match[5]) {
      parts.push(
        <Text
          key={`${key}-c-${idx++}`}
          style={{
            color: IMPERIAL.gold,
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            fontSize: 13,
          }}>
          {` ${match[5]} `}
        </Text>
      );
    } else if (match[6]) {
      parts.push(
        <Text
          key={`${key}-s-${idx++}`}
          style={{ color: IMPERIAL.textTertiary, textDecorationLine: 'line-through' }}>
          {match[6]}
        </Text>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <Text key={`${key}-end`} style={{ color: IMPERIAL.text }}>
        {text.slice(lastIndex)}
      </Text>
    );
  }

  return parts.length > 0 ? parts : <Text style={{ color: IMPERIAL.text }}>{text}</Text>;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const blocks = parseBlocks(content);

  return (
    <View style={{ gap: 6 }}>
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        switch (block.type) {
          case 'heading': {
            const sizes = [22, 20, 18, 16, 15, 14];
            return (
              <Text
                key={key}
                style={{
                  fontSize: sizes[(block.level || 1) - 1],
                  fontWeight: '700',
                  color: IMPERIAL.gold,
                  textAlign: 'right',
                  writingDirection: 'rtl',
                  marginTop: 4,
                  marginBottom: 2,
                }}>
                {block.text}
              </Text>
            );
          }

          case 'code':
            return (
              <View
                key={key}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 10,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: IMPERIAL.border,
                }}>
                {block.language ? (
                  <Text
                    style={{
                      fontSize: 10,
                      color: IMPERIAL.gold,
                      marginBottom: 6,
                      fontWeight: '600',
                    }}>
                    {block.language}
                  </Text>
                ) : null}
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 20,
                    color: IMPERIAL.text,
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                  }}
                  selectable>
                  {block.text}
                </Text>
              </View>
            );

          case 'blockquote':
            return (
              <View
                key={key}
                style={{
                  borderRightWidth: 3,
                  borderRightColor: IMPERIAL.gold,
                  paddingRight: 12,
                  paddingVertical: 4,
                  marginRight: 4,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 22,
                    color: IMPERIAL.textSecondary,
                    fontStyle: 'italic',
                    textAlign: 'right',
                    writingDirection: 'rtl',
                  }}>
                  {block.text}
                </Text>
              </View>
            );

          case 'list':
            return (
              <View key={key} style={{ paddingRight: 8, gap: 4 }}>
                {block.items?.map((item, li) => (
                  <View
                    key={`${key}-li-${li}`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-end',
                      gap: 6,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        lineHeight: 22,
                        color: IMPERIAL.text,
                        textAlign: 'right',
                        writingDirection: 'rtl',
                      }}>
                      {renderInlineText(item, `${key}-li-${li}`)}
                    </Text>
                    <Text style={{ color: IMPERIAL.gold, fontSize: 14, lineHeight: 22 }}>
                      {block.ordered ? `${li + 1}.` : '•'}
                    </Text>
                  </View>
                ))}
              </View>
            );

          case 'paragraph':
          default:
            return (
              <Text
                key={key}
                style={{
                  fontSize: 15,
                  lineHeight: 24,
                  color: IMPERIAL.text,
                  textAlign: 'right',
                  writingDirection: 'rtl',
                }}
                selectable>
                {renderInlineText(block.text, key)}
              </Text>
            );
        }
      })}
    </View>
  );
}

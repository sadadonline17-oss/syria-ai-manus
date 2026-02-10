import { IMPERIAL } from '@/lib/theme';
import {
  GitBranchIcon,
  GitCommitIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  RefreshCwIcon,
  FolderGit2Icon,
  PlusIcon,
  CheckIcon,
  FileIcon,
  AlertCircleIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEMO_REPOS = [
  {
    name: 'syria-ai-platform',
    branch: 'main',
    status: 'ahead',
    ahead: 3,
    behind: 0,
    lang: 'TypeScript',
  },
  {
    name: 'syria-ai-mobile',
    branch: 'develop',
    status: 'behind',
    ahead: 0,
    behind: 2,
    lang: 'React Native',
  },
  {
    name: 'syria-ai-api',
    branch: 'feature/mcp',
    status: 'synced',
    ahead: 0,
    behind: 0,
    lang: 'Hono',
  },
];

const DEMO_CHANGES = [
  { file: 'src/components/Hero.tsx', status: 'modified' as const },
  { file: 'src/lib/agent.ts', status: 'added' as const },
  { file: 'src/styles/theme.css', status: 'modified' as const },
  { file: 'tests/agent.test.ts', status: 'added' as const },
  { file: 'README.md', status: 'deleted' as const },
];

const DEMO_COMMITS = [
  {
    hash: 'a3f2c1d',
    message: 'feat: add MCP protocol support',
    author: 'Syria AI',
    time: 'منذ ساعة',
  },
  {
    hash: 'b7e4f2a',
    message: 'fix: agent loop stage transitions',
    author: 'Syria AI',
    time: 'منذ 3 ساعات',
  },
  { hash: 'c1d8e3b', message: 'refactor: workbench layout', author: 'Syria AI', time: 'منذ يوم' },
  {
    hash: 'd4a9f5c',
    message: 'feat: golden eagle animation',
    author: 'Syria AI',
    time: 'منذ يومين',
  },
];

export default function GitScreen() {
  const insets = useSafeAreaInsets();
  const [commitMsg, setCommitMsg] = useState('');
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [cloneUrl, setCloneUrl] = useState('');

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: IMPERIAL.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => setShowCloneModal(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: IMPERIAL.accent,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
          }}>
          <PlusIcon size={14} color={IMPERIAL.gold} />
          <Text style={{ fontSize: 12, color: IMPERIAL.gold, fontWeight: '600' }}>Clone</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: IMPERIAL.gold }}>Git</Text>
          <Text style={{ fontSize: 12, color: IMPERIAL.textTertiary }}>
            إدارة المستودعات والأكواد
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginBottom: 10,
            justifyContent: 'flex-end',
          }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: IMPERIAL.gold }}>المستودعات</Text>
          <FolderGit2Icon size={16} color={IMPERIAL.gold} />
        </View>
        {DEMO_REPOS.map((repo) => (
          <TouchableOpacity
            key={repo.name}
            activeOpacity={0.7}
            style={{
              backgroundColor: IMPERIAL.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: IMPERIAL.border,
              padding: 14,
              marginBottom: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {repo.status === 'ahead' && <ArrowUpIcon size={12} color={IMPERIAL.success} />}
                {repo.status === 'behind' && <ArrowDownIcon size={12} color={IMPERIAL.warning} />}
                {repo.status === 'synced' && <CheckIcon size={12} color={IMPERIAL.success} />}
                <Text
                  style={{
                    fontSize: 11,
                    color:
                      repo.status === 'synced'
                        ? IMPERIAL.success
                        : repo.status === 'ahead'
                          ? IMPERIAL.success
                          : IMPERIAL.warning,
                  }}>
                  {repo.status === 'synced'
                    ? 'متزامن'
                    : repo.status === 'ahead'
                      ? `+${repo.ahead}`
                      : `-${repo.behind}`}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: IMPERIAL.text }}>
                  {repo.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Text style={{ fontSize: 10, color: IMPERIAL.textTertiary }}>{repo.lang}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Text style={{ fontSize: 11, color: IMPERIAL.textSecondary }}>
                      {repo.branch}
                    </Text>
                    <GitBranchIcon size={12} color={IMPERIAL.textSecondary} />
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, gap: 6 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: IMPERIAL.accent,
                  borderWidth: 1,
                  borderColor: IMPERIAL.border,
                }}>
                <ArrowDownIcon size={12} color={IMPERIAL.gold} />
                <Text style={{ fontSize: 10, color: IMPERIAL.gold, fontWeight: '600' }}>Pull</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: IMPERIAL.accent,
                  borderWidth: 1,
                  borderColor: IMPERIAL.border,
                }}>
                <ArrowUpIcon size={12} color={IMPERIAL.gold} />
                <Text style={{ fontSize: 10, color: IMPERIAL.gold, fontWeight: '600' }}>Push</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: IMPERIAL.accent,
                  borderWidth: 1,
                  borderColor: IMPERIAL.border,
                }}>
                <RefreshCwIcon size={12} color={IMPERIAL.gold} />
                <Text style={{ fontSize: 10, color: IMPERIAL.gold, fontWeight: '600' }}>Sync</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginBottom: 10,
            justifyContent: 'flex-end',
          }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: IMPERIAL.gold }}>التغييرات</Text>
          <AlertCircleIcon size={16} color={IMPERIAL.gold} />
        </View>
        <View
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            overflow: 'hidden',
          }}>
          {DEMO_CHANGES.map((change, i) => (
            <View
              key={change.file}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                gap: 8,
                borderBottomWidth: i < DEMO_CHANGES.length - 1 ? 1 : 0,
                borderBottomColor: IMPERIAL.border,
              }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    change.status === 'added'
                      ? IMPERIAL.git.added
                      : change.status === 'modified'
                        ? IMPERIAL.git.modified
                        : IMPERIAL.git.deleted,
                }}
              />
              <Text
                style={{
                  fontSize: 10,
                  color:
                    change.status === 'added'
                      ? IMPERIAL.git.added
                      : change.status === 'modified'
                        ? IMPERIAL.git.modified
                        : IMPERIAL.git.deleted,
                  fontWeight: '600',
                  width: 50,
                }}>
                {change.status === 'added'
                  ? 'جديد'
                  : change.status === 'modified'
                    ? 'معدّل'
                    : 'محذوف'}
              </Text>
              <View style={{ flex: 1 }} />
              <Text style={{ fontSize: 12, color: IMPERIAL.text }} numberOfLines={1}>
                {change.file}
              </Text>
              <FileIcon size={12} color={IMPERIAL.textTertiary} />
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <TouchableOpacity
            disabled={!commitMsg.trim()}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: commitMsg.trim() ? IMPERIAL.primary : IMPERIAL.accent,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}>
            <GitCommitIcon
              size={14}
              color={commitMsg.trim() ? IMPERIAL.primaryForeground : IMPERIAL.textTertiary}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: commitMsg.trim() ? IMPERIAL.primaryForeground : IMPERIAL.textTertiary,
              }}>
              Commit
            </Text>
          </TouchableOpacity>
          <TextInput
            value={commitMsg}
            onChangeText={setCommitMsg}
            placeholder="رسالة الـ Commit..."
            placeholderTextColor={IMPERIAL.textTertiary}
            style={{
              flex: 1,
              backgroundColor: IMPERIAL.card,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: IMPERIAL.border,
              paddingHorizontal: 12,
              fontSize: 12,
              color: IMPERIAL.text,
              textAlign: 'right',
            }}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginBottom: 10,
            justifyContent: 'flex-end',
          }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: IMPERIAL.gold }}>
            سجل الـ Commits
          </Text>
          <GitCommitIcon size={16} color={IMPERIAL.gold} />
        </View>
        <View
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            overflow: 'hidden',
          }}>
          {DEMO_COMMITS.map((commit, i) => (
            <View
              key={commit.hash}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                gap: 8,
                borderBottomWidth: i < DEMO_COMMITS.length - 1 ? 1 : 0,
                borderBottomColor: IMPERIAL.border,
              }}>
              <Text style={{ fontSize: 10, color: IMPERIAL.textTertiary }}>{commit.time}</Text>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text
                  style={{ fontSize: 12, color: IMPERIAL.text, fontWeight: '500' }}
                  numberOfLines={1}>
                  {commit.message}
                </Text>
                <Text style={{ fontSize: 10, color: IMPERIAL.textTertiary, marginTop: 2 }}>
                  {commit.hash}
                </Text>
              </View>
              <View
                style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: IMPERIAL.gold }}
              />
            </View>
          ))}
        </View>
      </View>

      <Modal visible={showCloneModal} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}>
          <View
            style={{
              backgroundColor: IMPERIAL.cardSolid,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: IMPERIAL.border,
              padding: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: IMPERIAL.gold,
                textAlign: 'center',
                marginBottom: 16,
              }}>
              Clone Repository
            </Text>
            <TextInput
              value={cloneUrl}
              onChangeText={setCloneUrl}
              placeholder="https://github.com/user/repo.git"
              placeholderTextColor={IMPERIAL.textTertiary}
              style={{
                backgroundColor: IMPERIAL.card,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: IMPERIAL.border,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 13,
                color: IMPERIAL.text,
                marginBottom: 12,
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowCloneModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: IMPERIAL.border,
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 13, color: IMPERIAL.textTertiary }}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: IMPERIAL.primary,
                  alignItems: 'center',
                }}>
                <Text
                  style={{ fontSize: 13, fontWeight: '600', color: IMPERIAL.primaryForeground }}>
                  Clone
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

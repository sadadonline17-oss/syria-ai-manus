import { IMPERIAL } from '@/lib/theme';
import { useWorkbenchStore, type FileNode } from '@/lib/stores/workbench-store';
import {
  FolderIcon,
  FolderOpenIcon,
  FileIcon,
  FileTextIcon,
  FileCodeIcon,
  FileJsonIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ImageIcon,
} from 'lucide-react-native';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

function getFileIcon(name: string, size: number) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const iconProps = { size, strokeWidth: 1.5 };

  if (['tsx', 'ts', 'jsx', 'js'].includes(ext))
    return <FileCodeIcon {...iconProps} color={IMPERIAL.agent.coding} />;
  if (['json', 'yaml', 'yml', 'toml'].includes(ext))
    return <FileJsonIcon {...iconProps} color={IMPERIAL.warning} />;
  if (['md', 'txt', 'env'].includes(ext))
    return <FileTextIcon {...iconProps} color={IMPERIAL.textSecondary} />;
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'].includes(ext))
    return <ImageIcon {...iconProps} color={IMPERIAL.agent.researching} />;
  if (['css', 'scss', 'less'].includes(ext))
    return <FileCodeIcon {...iconProps} color={IMPERIAL.agent.planning} />;
  if (['html', 'xml'].includes(ext))
    return <FileCodeIcon {...iconProps} color={IMPERIAL.error} />;
  return <FileIcon {...iconProps} color={IMPERIAL.fileTree.fileIcon} />;
}

function FileTreeItem({ node, depth }: { node: FileNode; depth: number }) {
  const { toggleFolder, openFile, selectedFilePath } = useWorkbenchStore();
  const isSelected = selectedFilePath === node.path;
  const isFolder = node.type === 'folder';

  const handlePress = () => {
    if (isFolder) {
      toggleFolder(node.path);
    } else {
      openFile(node);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.6}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
          paddingRight: 8 + depth * 16,
          paddingLeft: 8,
          backgroundColor: isSelected ? IMPERIAL.fileTree.selectedBg : 'transparent',
          borderRightWidth: isSelected ? 2 : 0,
          borderRightColor: IMPERIAL.gold,
          gap: 4,
        }}
      >
        {isFolder ? (
          node.isExpanded ? (
            <ChevronDownIcon size={12} color={IMPERIAL.textTertiary} />
          ) : (
            <ChevronRightIcon size={12} color={IMPERIAL.textTertiary} />
          )
        ) : (
          <View style={{ width: 12 }} />
        )}

        {isFolder ? (
          node.isExpanded ? (
            <FolderOpenIcon size={15} color={IMPERIAL.fileTree.folderIcon} strokeWidth={1.5} />
          ) : (
            <FolderIcon size={15} color={IMPERIAL.fileTree.folderIcon} strokeWidth={1.5} />
          )
        ) : (
          getFileIcon(node.name, 14)
        )}

        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            color: isSelected ? IMPERIAL.gold : IMPERIAL.text,
            fontWeight: isSelected ? '600' : '400',
            flex: 1,
          }}
        >
          {node.name}
        </Text>

        {node.gitStatus && (
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                node.gitStatus === 'added' ? IMPERIAL.git.added :
                node.gitStatus === 'modified' ? IMPERIAL.git.modified :
                node.gitStatus === 'deleted' ? IMPERIAL.git.deleted :
                IMPERIAL.git.untracked,
            }}
          />
        )}
      </TouchableOpacity>

      {isFolder && node.isExpanded && node.children?.map((child) => (
        <FileTreeItem key={child.path} node={child} depth={depth + 1} />
      ))}
    </View>
  );
}

export default function FileTree() {
  const { fileTree } = useWorkbenchStore();

  return (
    <View style={{ flex: 1, backgroundColor: IMPERIAL.fileTree.bg }}>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: IMPERIAL.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '700', color: IMPERIAL.gold, letterSpacing: 0.5 }}>
          المستكشف
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {fileTree.map((node) => (
          <FileTreeItem key={node.path} node={node} depth={0} />
        ))}
      </ScrollView>
    </View>
  );
}

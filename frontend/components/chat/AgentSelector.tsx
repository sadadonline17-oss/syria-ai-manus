import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput } from 'react-native';
import { useAgentStore } from '@/lib/stores/agent-store';
import { AGENTS, AGENT_CATEGORIES, type Agent } from '@/lib/agents';
import { IMPERIAL } from '@/lib/theme';

interface AgentSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export function AgentSelector({ visible, onClose }: AgentSelectorProps) {
  const { selectedAgent, setSelectedAgent, setSystemPrompt } = useAgentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAgents = AGENTS.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.nameAr.includes(searchQuery) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setSystemPrompt(agent.systemPrompt);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>اختر الوكيل</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن وكيل..."
              placeholderTextColor={IMPERIAL.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.categoriesContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={AGENT_CATEGORIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === item.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(item.id)}>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item.id && styles.categoryTextActive,
                    ]}>
                    {item.nameAr}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <FlatList
            data={filteredAgents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.agentItem,
                  selectedAgent?.id === item.id && styles.agentItemActive,
                ]}
                onPress={() => handleSelectAgent(item)}>
                <View style={[styles.agentIcon, { backgroundColor: item.color }]}>
                  <Text style={styles.agentIconText}>{item.name[0]}</Text>
                </View>
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>{item.nameAr}</Text>
                  <Text style={styles.agentDescription} numberOfLines={1}>
                    {item.descriptionAr}
                  </Text>
                  <View style={styles.capabilitiesContainer}>
                    {item.capabilities.slice(0, 3).map((cap, index) => (
                      <View key={index} style={styles.capabilityBadge}>
                        <Text style={styles.capabilityText}>{cap}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                {selectedAgent?.id === item.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: IMPERIAL.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: IMPERIAL.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: IMPERIAL.text,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: IMPERIAL.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: IMPERIAL.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: IMPERIAL.text,
    borderWidth: 1,
    borderColor: IMPERIAL.border,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: IMPERIAL.surface,
    borderWidth: 1,
    borderColor: IMPERIAL.border,
  },
  categoryButtonActive: {
    backgroundColor: IMPERIAL.gold,
    borderColor: IMPERIAL.gold,
  },
  categoryText: {
    fontSize: 14,
    color: IMPERIAL.textSecondary,
  },
  categoryTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  agentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: IMPERIAL.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: IMPERIAL.border,
  },
  agentItemActive: {
    borderColor: IMPERIAL.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  agentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentIconText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  agentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: IMPERIAL.text,
    marginBottom: 2,
  },
  agentDescription: {
    fontSize: 12,
    color: IMPERIAL.textSecondary,
    marginBottom: 4,
  },
  capabilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  capabilityBadge: {
    backgroundColor: IMPERIAL.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: IMPERIAL.border,
  },
  capabilityText: {
    fontSize: 10,
    color: IMPERIAL.textTertiary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: IMPERIAL.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
});

import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';

import { useTasks } from '../src/hooks/useTasks';
// import { useAuthContext } from '../src/contexts/AuthContext';
import { TaskItem } from '../src/components/TaskItem';
import { FilterBar } from '../src/components/FilterBar';
import { EmptyState } from '../src/components/EmptyState';

export default function HomeScreen() {
  const router = useRouter();
//   const { signOut } = useAuthContext();

  const {
    tasks,
    allTasksCount,
    pendingCount,
    completedCount,
    filter,
    loading,
    setFilter,
    toggleTask,
    removeTask,
  } = useTasks();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-3 text-gray-500 text-sm">
          Carregando tarefas...
        </Text>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDERIZAÇÃO PRINCIPAL
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => router.push('/profile')}
                accessibilityLabel="Abrir perfil"
                accessibilityRole="button"
              >
                <Text className="text-3xl">👤</Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={signOut}
                accessibilityLabel="Sair"
                accessibilityRole="button"
              >
                <Text className="text-3xl">🚪</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View className="flex-1 bg-gray-50 relative">
        <FilterBar
          activeFilter={filter}
          allCount={allTasksCount}
          pendingCount={pendingCount}
          completedCount={completedCount}
          onFilterChange={setFilter}
        />

        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={toggleTask} onDelete={removeTask} />
          )}
          ListEmptyComponent={<EmptyState filter={filter} />}
          contentContainerStyle={
            tasks.length === 0
              ? { flexGrow: 1 }
              : { paddingVertical: 8, paddingBottom: 100 }
          }
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          onPress={() => router.push('/form')}
          className="absolute bottom-8 right-6 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
          accessibilityLabel="Adicionar nova tarefa"
          accessibilityRole="button"
        >
          <Text
            className="text-white text-4xl font-light"
            style={{ lineHeight: 46 }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
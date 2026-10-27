import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, currentCompleted: number) => void;
  onDelete: (id: number) => void;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const router = useRouter();

  const isCompleted = task.completed === 1;

  const handleEdit = () => {
    router.push(`/form?id=${task.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir tarefa",
      `Tem certeza que deseja excluir "${task.title}"?\n\nEsta ação não pode ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel", // Não faz nada — apenas fecha o Alert
        },
        {
          text: "Excluir",
          style: "destructive", // Vermelho no iOS, padrão no Android
          onPress: () => onDelete(task.id),
        },
      ],
    );
  };

  return (
    <View className="bg-white rounded-2xl mx-4 mb-3 p-4 shadow-sm flex-row items-start">
      <TouchableOpacity
        onPress={() => onToggle(task.id, task.completed)}
        // Círculo: verde preenchido quando concluída, apenas borda quando pendente
        className={`w-6 h-6 rounded-full border-2 mr-3 mt-1 items-center justify-center flex-shrink-0 ${
          isCompleted
            ? "bg-green-500 border-green-500"
            : "border-gray-300 bg-white"
        }`}
        accessibilityLabel={
          isCompleted ? "Marcar como pendente" : "Marcar como concluída"
        }
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
      >
        {isCompleted && <Text className="text-white text-xs font-bold">✓</Text>}
      </TouchableOpacity>

      <View className="flex-1">
        <Text
          className={`text-base font-semibold leading-5 ${
            isCompleted ? "line-through text-gray-400" : "text-gray-800"
          }`}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text
            className={`text-sm mt-1 leading-4 ${
              isCompleted ? "text-gray-300" : "text-gray-500"
            }`}
            numberOfLines={3}
          >
            {task.description}
          </Text>
        ) : null}

        <Text className="text-xs text-gray-300 mt-2">
          {formatDate(task.createdAt)}
        </Text>
      </View>

      <View className="flex-row gap-2 ml-2 flex-shrink-0">
        <TouchableOpacity
          onPress={handleEdit}
          className="w-9 h-9 rounded-xl bg-indigo-50 items-center justify-center"
          accessibilityLabel={`Editar tarefa ${task.title}`}
          accessibilityRole="button"
        >
          <Text className="text-base">✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="w-9 h-9 rounded-xl bg-red-50 items-center justify-center"
          accessibilityLabel={`Excluir tarefa ${task.title}`}
          accessibilityRole="button"
        >
          <Text className="text-base">🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

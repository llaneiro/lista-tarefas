import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TaskFilter } from "../types/task";

interface FilterBarProps {
  activeFilter: TaskFilter;
  allCount: number;
  pendingCount: number;
  completedCount: number;
  onFilterChange: (filter: TaskFilter) => void;
}

interface FilterButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
}

function FilterButton({ label, count, isActive, onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 items-center py-2 px-1 rounded-lg ${
        isActive ? "bg-indigo-600" : "bg-transparent"
      }`}
      accessibilityLabel={`Filtrar por ${label}: ${count} tarefa${count !== 1 ? "s" : ""}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <Text
        className={`text-xs font-semibold ${
          isActive ? "text-white" : "text-gray-500"
        }`}
      >
        {label}
      </Text>

      <Text
        className={`text-xs font-bold mt-0.5 ${
          isActive ? "text-indigo-200" : "text-gray-400"
        }`}
      >
        {count}
      </Text>
    </TouchableOpacity>
  );
}

export function FilterBar({
  activeFilter,
  allCount,
  pendingCount,
  completedCount,
  onFilterChange,
}: FilterBarProps) {
  return (
    <View className="flex-row bg-gray-100 rounded-xl p-1 mx-4 mb-4 mt-3">
      <FilterButton
        label="Todas"
        count={allCount}
        isActive={activeFilter === "all"}
        onPress={() => onFilterChange("all")}
      />
      <FilterButton
        label="Pendentes"
        count={pendingCount}
        isActive={activeFilter === "pending"}
        onPress={() => onFilterChange("pending")}
      />
      <FilterButton
        label="Concluídas"
        count={completedCount}
        isActive={activeFilter === "completed"}
        onPress={() => onFilterChange("completed")}
      />
    </View>
  );
}

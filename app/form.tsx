import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

import * as TaskRepository from '../src/database/taskRepository';


export default function FormScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const { id } = useLocalSearchParams<{ id?: string }>();

  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(isEditing);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Tarefa' : 'Nova Tarefa',
    });
  }, [isEditing, navigation]);

  useEffect(() => {
    if (!isEditing) return;

    async function loadTask() {
      try {
        const task = await TaskRepository.getTaskById(Number(id));

        if (!task) {
          Alert.alert('Erro', 'Tarefa não encontrada.');
          router.back();
          return;
        }

        setTitle(task.title);
        setDescription(task.description ?? '');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar a tarefa.');
        router.back();
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id, isEditing, router]);

 
  const handleSave = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      Alert.alert(
        'Campo obrigatório',
        'Por favor, informe um título para a tarefa.',
      );
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await TaskRepository.updateTask({
          id: Number(id),
          title: trimmedTitle,
          description: description.trim() || null,
        });
      } else {
        await TaskRepository.createTask({
          title: trimmedTitle,
          description: description.trim() || null,
        });
      }

      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-3 text-gray-500 text-sm">Carregando tarefa...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
     
      <ScrollView
        className="flex-1 px-4 pt-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5">
          <Text className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
            Título *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Estudar React Native"
            placeholderTextColor="#9ca3af"
            className="bg-white rounded-xl px-4 py-3 text-base text-gray-800 border border-gray-200"
            maxLength={100}
            returnKeyType="next"
            autoFocus={!isEditing}
          />
          <Text className="text-xs text-gray-400 mt-1 text-right">
            {title.length}/100
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
            Descrição (opcional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione detalhes sobre a tarefa..."
            placeholderTextColor="#9ca3af"
            className="bg-white rounded-xl px-4 py-3 text-base text-gray-800 border border-gray-200"
            multiline
            numberOfLines={4}
            // `textAlignVertical="top"` faz o texto começar do topo em Android
            textAlignVertical="top"
            maxLength={500}
            style={{ minHeight: 100 }}
          />
          <Text className="text-xs text-gray-400 mt-1 text-right">
            {description.length}/500
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`rounded-xl py-4 items-center mb-4 ${
            saving ? 'bg-indigo-300' : 'bg-indigo-600'
          }`}
          accessibilityRole="button"
          accessibilityLabel={
            isEditing ? 'Salvar alterações' : 'Adicionar tarefa'
          }
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-base">
              {isEditing ? '💾 Salvar Alterações' : '✅ Adicionar Tarefa'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center py-3 mb-8"
          accessibilityRole="button"
          accessibilityLabel="Cancelar e voltar"
        >
          <Text className="text-gray-400 text-sm">Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
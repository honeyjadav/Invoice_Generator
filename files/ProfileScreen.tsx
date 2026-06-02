import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import SafeAreaWrapper from '../ui/SafeAreaWrapper';
import { useProfile } from '../../hooks/useProfile';
import { BusinessDetails } from '../../types/types';

const fields: { key: keyof BusinessDetails; label: string; placeholder: string }[] = [
  { key: 'name', label: 'Business Name *', placeholder: 'Your business name' },
  { key: 'address', label: 'Address', placeholder: 'Full address' },
  { key: 'phone', label: 'Phone', placeholder: '+91 XXXXX XXXXX' },
  { key: 'email', label: 'Email', placeholder: 'business@email.com' },
  { key: 'gstin', label: 'GSTIN', placeholder: '22AAAAA0000A1Z5' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loadProfile, saveProfile } = useProfile();
  const [form, setForm] = useState<BusinessDetails>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const updateField = (key: keyof BusinessDetails, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Required', 'Business name is required.');
      return;
    }
    const ok = saveProfile(form);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.replace('/');
    } else {
      Alert.alert('Error', 'Could not save profile.');
    }
  };

  return (
    <SafeAreaWrapper>
      <Text style={styles.title}>Business Profile</Text>
      <Text style={styles.subtitle}>This info will appear on all your invoices.</Text>

      <View style={styles.card}>
        {fields.map(({ key, label, placeholder }) => (
          <View key={key} style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#aaa"
              value={form[key]}
              onChangeText={(val) => updateField(key, val)}
              keyboardType={key === 'phone' ? 'phone-pad' : key === 'email' ? 'email-address' : 'default'}
              autoCapitalize={key === 'email' || key === 'gstin' ? 'none' : 'words'}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>{saved ? '✓ Saved!' : 'Save Profile'}</Text>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },
  fieldGroup: { gap: 4 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: '#F8F9FF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#222',
    borderWidth: 1,
    borderColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

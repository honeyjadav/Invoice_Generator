import { StyleSheet, TouchableOpacity, Text, Alert, View } from 'react-native';
import { Product, InvoiceSummaryData } from '../../types/types';

export default function ActionButtons({
  businessName,
  products,
  totals,
  onClear,
  onSave,
}: {
  businessName: string;
  products: Product[];
  totals: InvoiceSummaryData;
  onClear: () => void;
  onSave: () => void;
}) {
  const handleGenerateInvoice = () => {
    if (!businessName.trim()) {
      Alert.alert('Error', 'Please enter your business name');
      return;
    }
    if (products.some((p) => !p.name.trim() || !p.amount)) {
      Alert.alert('Error', 'Please fill all product fields');
      return;
    }
    onSave();
  };

  const handleClearForm = () => {
    Alert.alert('Confirm', 'Clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => onClear() },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.clearButton} onPress={handleClearForm}>
        <Text style={styles.clearText}>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateInvoice}>
        <Text style={styles.generateText}>Save Invoice</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e53935',
  },
  clearText: {
    color: '#e53935',
    fontWeight: '700',
    fontSize: 15,
  },
  generateButton: {
    flex: 2,
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
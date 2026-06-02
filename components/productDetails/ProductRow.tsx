import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { Product } from '../../types/types';

export default function ProductRow({
  product,
  onUpdate,
  onDelete,
}: {
  product: Product;
  onUpdate: (field: keyof Product, value: string) => void;
  onDelete: () => void;
}) {
  const amount = (parseFloat(product.quantity) || 0) * (parseFloat(product.rate) || 0);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="Product name"
          placeholderTextColor="#aaa"
          value={product.name}
          onChangeText={(text) => onUpdate('name', text)}
        />
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, styles.descInput]}
        placeholder="Description (optional)"
        placeholderTextColor="#aaa"
        value={product.description}
        onChangeText={(text) => onUpdate('description', text)}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Qty"
          placeholderTextColor="#aaa"
          value={product.quantity}
          onChangeText={(text) => onUpdate('quantity', text)}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Rate ₹"
          placeholderTextColor="#aaa"
          value={product.rate}
          onChangeText={(text) => onUpdate('rate', text)}
          keyboardType="numeric"
        />
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Amt</Text>
          <Text style={styles.amountValue}>₹{amount.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F8F9FF',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#222',
    borderWidth: 1,
    borderColor: '#eee',
  },
  descInput: {
    marginBottom: 8,
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    borderRadius: 10,
  },
  deleteText: {
    color: '#e53935',
    fontSize: 14,
    fontWeight: 'bold',
  },
  amountBox: {
    flex: 1,
    backgroundColor: '#EEF4FF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 10,
    color: '#888',
  },
  amountValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});
import { StyleSheet, View, Text } from 'react-native';
import ProductRow from './ProductRow';
import AddProductButton from './AddProductButton';
import { Product } from '../../types/types';

export default function ProductList({
  products,
  onAdd,
  onUpdate,
  onDelete,
}: {
  products: Product[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Product, value: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Items</Text>
      <View style={styles.header}>
        <Text style={[styles.headerText, { flex: 2 }]}>Product</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Price</Text>
        <View style={{ width: 36 }} />
      </View>
      {products.map((item) => (
        <ProductRow
          key={item.id}
          product={item}
          onUpdate={(field, value) => onUpdate(item.id, field, value)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
      <AddProductButton onPress={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  header: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
});
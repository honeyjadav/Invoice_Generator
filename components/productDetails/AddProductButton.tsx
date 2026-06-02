import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function AddProductButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>+ Add Item</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#2196F3',
    fontWeight: '600',
    fontSize: 14,
  },
});
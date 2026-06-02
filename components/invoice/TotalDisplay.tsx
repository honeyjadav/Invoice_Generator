import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { InvoiceSummaryData, TaxMode } from '../../types/types';

export default function TotalDisplay({
  subtotal, cgst, sgst, igst, total, taxMode, onTaxModeChange,
}: InvoiceSummaryData & { onTaxModeChange: (mode: TaxMode) => void }) {
  return (
    <View style={styles.container}>
      {/* Tax Mode Toggle */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Tax Type:</Text>
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, taxMode === 'cgst_sgst' && styles.toggleActive]}
            onPress={() => onTaxModeChange('cgst_sgst')}
          >
            <Text style={[styles.toggleText, taxMode === 'cgst_sgst' && styles.toggleTextActive]}>
              CGST + SGST
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, taxMode === 'igst' && styles.toggleActive]}
            onPress={() => onTaxModeChange('igst')}
          >
            <Text style={[styles.toggleText, taxMode === 'igst' && styles.toggleTextActive]}>
              IGST
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
      </View>

      {taxMode === 'cgst_sgst' ? (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>CGST (9%)</Text>
            <Text style={styles.value}>₹{cgst.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>SGST (9%)</Text>
            <Text style={styles.value}>₹{sgst.toFixed(2)}</Text>
          </View>
        </>
      ) : (
        <View style={styles.row}>
          <Text style={styles.label}>IGST (18%)</Text>
          <Text style={styles.value}>₹{igst.toFixed(2)}</Text>
        </View>
      )}

      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 3,
    flex: 1,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleActive: {
    backgroundColor: '#2196F3',
  },
  toggleText: {
    fontSize: 12,
    color: '#777',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: '#777',
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});

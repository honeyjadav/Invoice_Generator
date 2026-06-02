import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useInvoices } from '../../hooks/useInvoices';
import InvoiceCard from '../../components/invoice/InvoiceCard';

export default function HistoryScreen() {
  const { invoices, loadInvoices, deleteInvoice } = useInvoices();

  // Reload every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, [])
  );

  const handleDelete = (id: number) => {
    Alert.alert('Delete Invoice', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteInvoice(id) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Invoice History</Text>
      {invoices.length === 0 ? (
        <Text style={styles.empty}>No invoices yet.</Text>
      ) : (
        invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            onDelete={handleDelete}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 60,
    fontSize: 16,
  },
});
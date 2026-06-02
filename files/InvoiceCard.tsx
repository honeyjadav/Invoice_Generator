import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Invoice } from '../../hooks/useInvoices';

export default function InvoiceCard({
  invoice,
  onDelete,
}: {
  invoice: Invoice;
  onDelete: (id: number) => void;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const date = new Date(invoice.created_at).toLocaleDateString();

  const handleDelete = () => {
    Alert.alert('Delete Invoice', `Delete ${invoice.invoice_number}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(invoice.id) },
    ]);
  };

  return (
    <>
      {/* Card */}
      <TouchableOpacity style={styles.card} onPress={() => setShowDetail(true)} activeOpacity={0.8}>
        <View style={styles.row}>
          <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {/* Customer name - not business name */}
        <Text style={styles.customerName}>
          {invoice.customer_name ? `To: ${invoice.customer_name}` : 'No customer name'}
        </Text>
        <Text style={styles.businessSub}>From: {invoice.business_name}</Text>
        <View style={styles.row}>
          <Text style={styles.total}>₹{invoice.total.toFixed(2)}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Detail Modal */}
      <Modal visible={showDetail} animationType="slide" onRequestClose={() => setShowDetail(false)}>
        <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{invoice.invoice_number}</Text>
            <TouchableOpacity onPress={() => setShowDetail(false)}>
              <Text style={styles.closeBtn}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.modalDate}>Date: {invoice.invoice_date}</Text>

          {/* Business */}
          <Text style={styles.sectionTitle}>From (Your Business)</Text>
          <View style={styles.detailCard}>
            <DetailRow label="Name" value={invoice.business_name} />
            <DetailRow label="Address" value={invoice.business_address} />
            <DetailRow label="Phone" value={invoice.business_phone} />
            <DetailRow label="Email" value={invoice.business_email} />
            <DetailRow label="GSTIN" value={invoice.business_gstin} />
          </View>

          {/* Customer */}
          <Text style={styles.sectionTitle}>Bill To</Text>
          <View style={styles.detailCard}>
            <DetailRow label="Name" value={invoice.customer_name} />
            <DetailRow label="Address" value={invoice.customer_address} />
            <DetailRow label="Phone" value={invoice.customer_phone} />
            <DetailRow label="Email" value={invoice.customer_email} />
            <DetailRow label="GSTIN" value={invoice.customer_gstin} />
          </View>

          {/* Items */}
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.detailCard}>
            {invoice.items?.map((item, i) => (
              <View key={item.id} style={[styles.itemRow, i < invoice.items.length - 1 && styles.itemBorder]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
                  <Text style={styles.itemSub}>{item.quantity} × ₹{item.rate}</Text>
                </View>
                <Text style={styles.itemAmount}>₹{item.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.detailCard}>
            <DetailRow label="Subtotal" value={`₹${invoice.subtotal.toFixed(2)}`} />
            {invoice.tax_mode === 'igst' ? (
              <DetailRow label="IGST (18%)" value={`₹${invoice.igst?.toFixed(2) ?? '0.00'}`} />
            ) : (
              <>
                <DetailRow label="CGST (9%)" value={`₹${invoice.cgst.toFixed(2)}`} />
                <DetailRow label="SGST (9%)" value={`₹${invoice.sgst.toFixed(2)}`} />
              </>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{invoice.total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  invoiceNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2196F3',
  },
  date: { fontSize: 12, color: '#888' },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  businessSub: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  total: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  // Modal
  modal: { flex: 1, backgroundColor: '#F5F7FF' },
  modalContent: { padding: 20, paddingBottom: 60 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  closeBtn: { fontSize: 14, color: '#2196F3', fontWeight: '600' },
  modalDate: { fontSize: 13, color: '#888', marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    elevation: 1,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 13, color: '#888', flex: 1 },
  detailValue: { fontSize: 13, color: '#222', fontWeight: '500', flex: 2, textAlign: 'right' },
  itemRow: { paddingVertical: 8, flexDirection: 'row', alignItems: 'center' },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemName: { fontSize: 14, fontWeight: '600', color: '#222' },
  itemDesc: { fontSize: 12, color: '#888' },
  itemSub: { fontSize: 12, color: '#777', marginTop: 2 },
  itemAmount: { fontSize: 14, fontWeight: 'bold', color: '#2196F3' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#2196F3' },
});

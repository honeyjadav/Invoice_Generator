import { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import SafeAreaWrapper from "../ui/SafeAreaWrapper";
import ProductList from "../productDetails/ProductList";
import TotalDisplay from "../invoice/TotalDisplay";
import ActionButtons from "../Buttons/ActionButtons";
import { Product, CustomerDetails, TaxMode } from "../../types/types";
import calculateTotals from "../../utils/calculations";
import { useInvoices } from "../../hooks/useInvoices";
import { useProfile } from "../../hooks/useProfile";

const emptyCustomer: CustomerDetails = { name: '', address: '', phone: '', email: '', gstin: '' };
const emptyProduct = (): Product => ({
  id: Date.now().toString(),
  name: '', description: '', quantity: '', rate: '', amount: 0,
});

export default function InvoiceGeneratorScreen() {
  const router = useRouter();
  const { profile, loaded, loadProfile, isProfileComplete } = useProfile();
  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [products, setProducts] = useState<Product[]>([emptyProduct()]);
  const [taxMode, setTaxMode] = useState<TaxMode>('cgst_sgst');
  const { saveInvoice } = useInvoices();

  useEffect(() => {
    loadProfile();
  }, []);

  // Redirect to profile if not complete
  useEffect(() => {
    if (loaded && !isProfileComplete) {
      Alert.alert(
        'Profile Required',
        'Please complete your business profile first.',
        [{ text: 'Go to Profile', onPress: () => router.replace('/(tabs)/profile') }]
      );
    }
  }, [loaded, isProfileComplete]);

  const updateCustomer = (field: keyof CustomerDetails, value: string) =>
    setCustomer((prev) => ({ ...prev, [field]: value }));

  const handleAddProduct = () => setProducts([...products, emptyProduct()]);

  const handleUpdateProduct = (id: string, field: keyof Product, value: string) => {
    setProducts(products.map((p) => {
      if (p.id !== id) return p;
      const updated = { ...p, [field]: value };
      updated.amount = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.rate) || 0);
      return updated;
    }));
  };

  const handleDeleteProduct = (id: string) => {
    if (products.length > 1) setProducts(products.filter((p) => p.id !== id));
  };

  const handleClearForm = () => {
    setCustomer(emptyCustomer);
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setProducts([emptyProduct()]);
    setTaxMode('cgst_sgst');
  };

  const handleSave = () => {
    try {
      const { subtotal, cgst, sgst, igst, total } = calculateTotals(products, taxMode);
      const invoiceNumber = saveInvoice(profile, customer, invoiceDate, products, subtotal, cgst, sgst, igst, total, taxMode);
      Alert.alert("Invoice Saved", `Invoice ${invoiceNumber} saved successfully!`);
      handleClearForm();
    } catch {
      Alert.alert("Error", "Failed to save invoice");
    }
  };

  const { subtotal, cgst, sgst, igst, total } = calculateTotals(products, taxMode);

  if (!loaded) return null;

  return (
    <SafeAreaWrapper>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>New Invoice</Text>
        <TextInput
          style={styles.dateInput}
          value={invoiceDate}
          onChangeText={setInvoiceDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      {/* Business Info (read-only from profile) */}
      <View style={styles.profileBanner}>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          {profile.gstin ? <Text style={styles.profileSub}>GSTIN: {profile.gstin}</Text> : null}
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Text style={styles.editProfile}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Customer Details */}
      <Text style={styles.sectionLabel}>Bill To</Text>
      <View style={styles.card}>
        {(['name', 'address', 'phone', 'email', 'gstin'] as (keyof CustomerDetails)[]).map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            placeholderTextColor="#aaa"
            value={customer[field]}
            onChangeText={(val) => updateCustomer(field, val)}
          />
        ))}
      </View>

      {/* Products */}
      <ProductList
        products={products}
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
      />

      <TotalDisplay
        subtotal={subtotal}
        cgst={cgst}
        sgst={sgst}
        igst={igst}
        total={total}
        taxMode={taxMode}
        onTaxModeChange={setTaxMode}
      />

      <ActionButtons
        businessName={profile.name}
        products={products}
        totals={{ subtotal, cgst, sgst, igst, total, taxMode }}
        onClear={handleClearForm}
        onSave={handleSave}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  profileBanner: {
    backgroundColor: '#EEF4FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D9FF',
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  profileSub: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  editProfile: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
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
});

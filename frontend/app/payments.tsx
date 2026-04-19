import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { createOrder, OrderResponse } from '../api/payments';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const { colors } = useTheme();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initiateOrder();
  }, []);

  const initiateOrder = async () => {
    try {
      setLoading(true);
      const orderData = await createOrder();
      setOrder(orderData);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      Alert.alert('Error', 'Could not initiate payment. Please try again later.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const onMessage = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    
    if (data.status === 'success') {
      Alert.alert('Success', 'Payment successful! You are now a PRO member.');
      await refreshProfile();
      router.replace('/(tabs)/profile');
    } else if (data.status === 'error') {
      Alert.alert('Payment Failed', data.message || 'Something went wrong.');
      router.back();
    }
  };

  if (loading || !order) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // HTML content for Razorpay Checkout
  const checkoutHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <script>
          const options = {
            "key": "${order.razorpay_key_id}",
            "amount": "${order.amount}",
            "currency": "${order.currency}",
            "name": "EchoFluent",
            "description": "EchoFluent Pro Upgrade",
            "order_id": "${order.order_id}",
            "prefill": {
              "name": "${profile?.name || ''}",
              "email": "${profile?.email || ''}"
            },
            "handler": function (response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                status: 'success',
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature
              }));
            },
            "modal": {
              "ondismiss": function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  status: 'error',
                  message: 'Payment cancelled'
                }));
              }
            }
          };
          const rzp = new Razorpay(options);
          rzp.open();
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
      </View>
      <WebView
        originWhitelist={['*']}
        source={{ html: checkoutHtml }}
        onMessage={onMessage}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webViewLoader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  webview: {
    flex: 1,
  },
  webViewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  }
});

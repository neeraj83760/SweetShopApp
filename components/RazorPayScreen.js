import React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";

const RazorpayScreen = ({ route, navigation }) => {
  const { orderId, amount, currency } = route.params || {};

    console.log("Order ID received:", orderId);

  if (!orderId) {
    Alert.alert("Error", "Invalid order ID. Please try again.");
    navigation.goBack();
    return null;
  }

  console.log("Order ID:", orderId); // Debugging log

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </head>
    <body onload="payNow()">
        <script>
            function payNow() {
                var options = {
                    "key": "rzp_test_5ph8Ao9mD275Oi",
                    "amount": ${amount * 100}, 
                    "currency": "${currency}",
                    "name": "Gaur Sweet Shop",
                    "description": "Order Payment",
                    "order_id": "order_QBJsAXaOkHwbfL",
                    "handler": function (response) {
                        try {
                            window.ReactNativeWebView.postMessage(JSON.stringify(response));
                        } catch (error) {
                            console.error("Error posting message:", error);
                        }
                    },
                    "prefill": {
                        "name": "Lata's Customer",
                        "email": "customer@example.com",
                        "contact": "9999999999"
                    },
                    "theme": {
                        "color": "#F37254"
                    }
                };
                var rzp1 = new Razorpay(options);
                rzp1.open();
            }
        </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ html: htmlContent }}
        onMessage={(event) => {
          try {
            const paymentData = JSON.parse(event.nativeEvent.data);
            console.log("Payment Success:", paymentData);
            Alert.alert("Payment Successful", "Your order has been placed!");
            navigation.goBack();
          } catch (error) {
            console.error("Payment Parsing Error:", error);
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView Error:", nativeEvent);
          Alert.alert("Payment Error", "Something went wrong. Please try again.");
          navigation.goBack();
        }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="blue" />}
      />
    </View>
  );
};

export default RazorpayScreen;

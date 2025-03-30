import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import RazorpayCheckout from "react-native-razorpay";

const CartScreen = ({ route, navigation }) => {
  const { cart, removeFromCart } = route.params;
  const totalCartPrice = cart.reduce((total, item) => total + item.itemTotalPrice, 0);

  // Razorpay Payment Handler
  const handlePayment = () => {
    const options = {
      description: "Sweet Shop Payment",
      currency: "INR",
      amount: totalCartPrice * 100, // Convert to paisa
      key: "your_razorpay_key_id", // Replace with your Razorpay Key
      name: "Gaur Sweet Shop",
      prefill: {
        email: "customer@example.com",
        contact: "9999999999",
        name: "Customer",
      },
      theme: { color: "#ff6600" },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        Alert.alert("Payment Successful", `Payment ID: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        Alert.alert("Payment Failed", error.description);
      });
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>Cart</Text>
      <ScrollView>
        {cart.map((item, index) => (
          <View key={index} style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
              <Text style={{ fontSize: 16, color: "gray" }}>₹{item.itemTotalPrice}</Text>
              <Text style={{ fontSize: 16, color: "gray" }}>{item.quantity} kg</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(index)}>
              <FontAwesome name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 10 }}>Total Price: ₹{totalCartPrice}</Text>

      {/* Razorpay Payment Button */}
      <TouchableOpacity
        style={{ marginTop: 16, backgroundColor: "green", padding: 12, borderRadius: 8, alignItems: "center" }}
        onPress={handlePayment}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Proceed to Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 16, backgroundColor: "red", padding: 10, borderRadius: 8, alignItems: "center" }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;

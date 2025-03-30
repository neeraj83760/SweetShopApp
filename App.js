import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import RazorpayScreen from "./components/RazorPayScreen"; // Import RazorpayScreen

const { width } = Dimensions.get("window");

const sweets = [
  { id: "1", name: "Gulab Jamun", price: 250, image: require("./assets/gulab_jamun.jpeg") },
  { id: "2", name: "Rasgulla", price: 300, image: require("./assets/rasgulla.jpeg") },
  { id: "3", name: "Barfi", price: 400, image: require("./assets/barfi.jpeg") },
  { id: "4", name: "Ladoo", price: 350, image: require("./assets/ladoo.jpeg") },
  { id: "5", name: "Kaju Katli", price: 500, image: require("./assets/Kaju_Katli.jpeg") },
  { id: "6", name: "Jalebi", price: 200, image: require("./assets/jalebi.jpeg") },
];

function SweetShop() {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState({});

  const addToCart = (item) => {
    if (!item || !item.id) return;
    const quantity = selectedQuantity[item.id] || 0.5;
    const itemTotalPrice = item.price * quantity;
    setCart([...cart, { ...item, quantity, itemTotalPrice }]);
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const totalCartPrice = cart.reduce((total, item) => total + item.itemTotalPrice, 0);

const initiatePayment = async () => {
  try {
    console.log("Initiating payment...");
    
    // Step 1: Create an order
    const response = await fetch("http://13.235.68.202:5000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000, currency: "INR", receipt: "order_rcptid_11" }),
    });

    const orderData = await response.json();
    console.log("Order Response:", orderData);

    if (!orderData.id) {
      throw new Error("Order ID not received from backend");
    }

    // Step 2: Prepare Razorpay options
    const options = {
      description: "Purchase Sweets",
      image: "https://your-logo-url.com",
      currency: "INR",
      key: "rzp_test_5ph8Ao9mD275Oi", // Replace with your Razorpay API key
      amount: 1000 * 100, // Razorpay expects amount in paise
      name: "Gaur Sweet Shop",
      order_id: orderData.id,
      prefill: {
        email: "customer@example.com",
        contact: "9999999999",
        name: "John Doe",
      },
      theme: { color: "#F37254" },
    };

    console.log("Razorpay options:", options);

    // Step 3: Open Razorpay payment gateway
    const razorpayResponse = await RazorpayCheckout.open(options);
    console.log("Payment Successful:", razorpayResponse);
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Oops! Something went wrong. Payment failed.");
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16, alignItems: "center" }}>
      <Image source={require("./assets/logo1.png")} style={{ width: 360, height: 150, marginBottom: 5, marginTop: 30 }} />

      <TouchableOpacity 
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ff6600",
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          justifyContent: "center",
          width: "90%",
          elevation: 5
        }} 
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="shopping-cart" size={20} color="white" />
        <Text style={{ color: "white", marginLeft: 10, fontSize: 18, fontWeight: "bold" }}>View Cart ({cart.length})</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {sweets.map((item) => (
          <View key={item.id} style={{ width: width * 0.45, marginBottom: 16, padding: 10, borderRadius: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 }}>
            <Image source={item.image} style={{ width: "100%", height: 150, borderRadius: 10 }} />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 8, color: "#333", textAlign: "center" }}>{item.name}</Text>
            <Text style={{ fontSize: 16, color: "#666", marginBottom: 8, textAlign: "center" }}>₹{item.price}/kg</Text>
            <Picker
              selectedValue={selectedQuantity[item.id] || 0.5}
              onValueChange={(value) => setSelectedQuantity({ ...selectedQuantity, [item.id]: value })}
              style={{ marginBottom: 10 }}
            >
              <Picker.Item label="500g" value={0.5} />
              <Picker.Item label="1kg" value={1} />
            </Picker>
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "#ff6600",
                padding: 12,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                elevation: 5
              }}
              onPress={() => addToCart(item)}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Cart Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: "white", padding: 16, marginTop: 100 }}>
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

          {/* Proceed to Payment Button */}
          <TouchableOpacity 
            style={{ marginTop: 16, backgroundColor: "green", padding: 12, borderRadius: 8, alignItems: "center" }}
            onPress={initiatePayment}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Proceed to Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ marginTop: 16, backgroundColor: "red", padding: 10, borderRadius: 8, alignItems: "center" }} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Close Cart</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View> 
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SweetShop" component={SweetShop} />
        <Stack.Screen name="RazorpayScreen" component={RazorpayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

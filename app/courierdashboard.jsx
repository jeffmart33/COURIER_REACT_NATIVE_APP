import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import DashboardHome from "../components/DashboardHome";

import WithdrawModal from "../components/WithdrawModal";
import BankModal from "../components/BankModal";
import MoreMenu from "../components/MoreMenu";
import BottomNavigation from "../components/BottomNavigation";
import History from "../components/History";
import ActiveOrder from "../components/ActiveOrder";
import RequestOrder from "../components/RequestOrder";

import Wallet from "../components/Wallet";

import useCourierProfile from "../hooks/useCourierProfile";
import useWallet from "../hooks/useWallet";
import ProfileScreen from "../components/ProfileScreen";
import useLocationTracking from "../hooks/useLocationTracking";
import Referral from "../components/Referral";
import Campaigns from "../components/Campaigns";
import EditProfileModal from "../components/EditProfileModal";

import Sidebar from "../components/Sidebar";
import useOrderSocket from "../hooks/useOrderSocket";
import useOrderActions from "../hooks/useOrderActions";
import useDashboardData from "../hooks/useDashboardData";
import useAuth from "../hooks/useAuth";
import socket from "../services/socket";
import {
  registerForPushNotifications,
  startNotificationListeners,
} from "../services/notifications";

/* ================= MAIN DASHBOARD ================= */
export default function CourierDashboard() {

  /* ================= RESPONSIVE ================= */

  const { width } = Dimensions.get("window");  const isTablet = width >= 768;
  const isMobile = width < 768;

  /* ================= STATES ================= */

  const [online, setOnline] = useState(false);
  const [onlineLoading, setOnlineLoading] = useState(false);

  const [profileData, setProfileData] = useState({});

  const [activeTab, setActiveTab] = useState("Home");
  useEffect(() => {
  console.log("Current Active Tab:", activeTab);
}, [activeTab]);

  const [location, setLocation] = useState({
    lat: 6.5244,
    lng: 3.3792,
  });

  const [wallet, setWallet] = useState({
    available: 0,
    pending: 0,
    today: 0,
    weekly: 0,
    monthly: 0,
    totalEarned: 0,
  });

  const [bankAccount, setBankAccount] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const [rating, setRating] = useState(0);

  const [completedOrders, setCompletedOrders] = useState(0);

  const [orderStage, setOrderStage] = useState("Assigned");

  const [incomingOrders, setIncomingOrders] = useState([]);

  const [activeOrder, setActiveOrder] = useState(null);

  const [orderTimer, setOrderTimer] = useState(0);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const [weeklyEarnings, setWeeklyEarnings] = useState([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);

  const [deliveryHistory, setDeliveryHistory] = useState([]);

  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    averageFee: 0,
  });

  const [showBankModal, setShowBankModal] = useState(false);

  const [bankName, setBankName] = useState("");

  const [accountName, setAccountName] = useState("");

  const [accountNumber, setAccountNumber] = useState("");

  /* ================= DERIVED DATA ================= */

  const incomingOrder = incomingOrders[0] || null;

  useEffect(() => {
    console.log("Incoming Orders:", incomingOrders);
  }, [incomingOrders]);

  

  useLocationTracking({
  online,
  setLocation,
  activeOrder,
  orderStage,
  setOrderStage,
});

  
  /* ================= ORDER TIMER ================= */

  useEffect(() => {
    const expiresAt =
      incomingOrder?.offer?.expiresAt ||
      incomingOrder?.expiresAt;

    if (!expiresAt) {
      setOrderTimer(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor(
          (new Date(expiresAt) - new Date()) /
            1000
        )
      );

      setOrderTimer(remaining);

      if (remaining <= 0) {
        clearInterval(interval);

        setIncomingOrders((prev) =>
          prev.filter(
            (o) => o._id !== incomingOrder._id
          )
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingOrder]);

  

  

  useOrderSocket({
  online,
  activeOrder,
  setIncomingOrders,
  setActiveOrder,
  setOrderStage,
  setActiveTab,
});


const {
  loadDashboardData,
} = useDashboardData({
  setDeliveryHistory,
  setWeeklyEarnings,
  setStats,
  setIncomingOrders,
  setWallet,
  setBankAccount,
  setTransactions,
  setActiveOrder,
  setOrderStage,
  setActiveTab,
});

useCourierProfile({
  setProfileData,
  setOnline,
  setRating,
  setCompletedOrders,
});


const {
  isWithinRadius,
  nextStage,
  acceptOrder,
  rejectOrder,
} = useOrderActions({
  activeOrder,
  orderStage,
  location,
  activeTab,
  setActiveOrder,
  setOrderStage,
  setActiveTab,
  setIncomingOrders,
});

const {
  handleLogout,
} = useAuth({
  setOnline,
});

useWallet({
  setWallet,
  setBankAccount,
  setTransactions,
});





/* ================= PUSH NOTIFICATIONS ================= */
useEffect(() => {
  const setupNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("courierToken");

      console.log("Dashboard Token:");
      console.log(token);

      if (!token) {
        console.log("No courier token found.");
        return;
      }

      await registerForPushNotifications(token);
    } catch (error) {
      console.log("Notification setup failed:");
      console.log(error);
    }
  };

  setupNotifications();

  const subscription = startNotificationListeners();

  return () => {
    subscription?.remove?.();
  };
}, []);


/* ================= SCREEN RENDER ================= */

const renderContent = () => {
  switch (activeTab) {

    case "Requests":
      return (
        <RequestOrder
          orders={incomingOrders}
          acceptOrder={acceptOrder}
          rejectOrder={rejectOrder}
          secondsLeft={orderTimer}
        />
      );

    case "Orders":
      return (
        <ActiveOrder
          order={activeOrder}
          stage={orderStage}
          onNext={nextStage}
        />
      );

    case "Wallet":
      return (
        <Wallet
          wallet={wallet}
            transactions={transactions}
          bankAccount={bankAccount}
          setBankAccount={setBankAccount}
          setShowWithdrawModal={setShowWithdrawModal}
          showBankModal={showBankModal}
          setShowBankModal={setShowBankModal}
          bankName={bankName}
          setBankName={setBankName}
          accountName={accountName}
          setAccountName={setAccountName}
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
        />
      );

case "History":
  return (
    <History
      orders={deliveryHistory}
      transactions={transactions}
    />
  );
    

      case "Profile":
  return (
    <ProfileScreen
      rating={rating}
      completedOrders={completedOrders}
      online={online}
      profileData={profileData}
      setProfileData={setProfileData}
      setShowEditModal={setShowEditModal}
      handleLogout={handleLogout}
      stats={stats}
    />
  );

    case "Referral":
      return (
        <Referral
          profileData={profileData}
        />
      );

    case "Campaigns":
      return <Campaigns />;

    default:
      return (
        <DashboardHome
          online={online}
          setOnline={setOnline}
          onlineLoading={onlineLoading}
          setOnlineLoading={setOnlineLoading}
          wallet={wallet}
          rating={rating}
          completedOrders={completedOrders}
          profileData={profileData}
          location={location}
          setLocation={setLocation}
          router={router}
          incomingOrders={incomingOrders}
          weeklyEarnings={weeklyEarnings}
          activeOrder={activeOrder}
          orderStage={orderStage}
            loadDashboardData={loadDashboardData}
            
        
        />
      );
  }
};
return (
  <SafeAreaView style={styles.container}>

    {!isMobile && (
  <Sidebar
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    incomingOrders={incomingOrders}
    handleLogout={handleLogout}
    online={online}
  />
)}

    <View
      style={[
        styles.main,
        !isMobile && {
          marginLeft: 260,
        },
      ]}
    >
      {renderContent()}
    </View>

    <EditProfileModal
      visible={showEditModal}
      onClose={() => setShowEditModal(false)}
      profileData={profileData}
      setProfileData={setProfileData}
    />

<WithdrawModal
  visible={showWithdrawModal}
  wallet={wallet}
  bankAccount={bankAccount}
  withdrawAmount={withdrawAmount}
  setWithdrawAmount={setWithdrawAmount}
  setWallet={setWallet}
  setShowWithdrawModal={setShowWithdrawModal}
/>

<MoreMenu
  visible={showMoreMenu}
  onClose={() => setShowMoreMenu(false)}
  setActiveTab={setActiveTab}
  handleLogout={handleLogout}
/>

{isMobile && (
  <BottomNavigation
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    incomingOrders={incomingOrders}
    setShowMoreMenu={setShowMoreMenu}
  />
)}

<BankModal
  visible={showBankModal}
  onClose={() => setShowBankModal(false)}
  bankName={bankName}
  setBankName={setBankName}
  accountName={accountName}
  setAccountName={setAccountName}
  accountNumber={accountNumber}
  setAccountNumber={setAccountNumber}
  setBankAccount={setBankAccount}
/>


  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  main: {
    flex: 1,
  },
});

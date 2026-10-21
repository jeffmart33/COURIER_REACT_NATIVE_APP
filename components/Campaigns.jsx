import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "../services/api";

const TABS = [
  { key: "current", label: "Current" },
  { key: "future", label: "Future" },
  { key: "past", label: "Past" },
];

const formatDate = (value) =>
  new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

function Campaigns() {
  const [tab, setTab] = useState("current");
  const [groups, setGroups] = useState({ current: [], future: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await AsyncStorage.getItem("courierToken");

      const res = await API.get("/api/courier/campaigns", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroups({
        current: res.data?.current || [],
        future: res.data?.future || [],
        past: res.data?.past || [],
      });
    } catch {
      setError("Unable to load campaigns.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const list = groups[tab] || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          🏆 Campaigns
        </Text>

        <Text style={styles.headerText}>
          Finish the deliveries in time and the bonus goes to your wallet.
        </Text>

      </View>

      <View style={styles.tabs}>
        {TABS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.tab,
              tab === item.key && styles.activeTab,
            ]}
            onPress={() => setTab(item.key)}
          >
            <Text
              style={[
                styles.tabText,
                tab === item.key && styles.activeTabText,
              ]}
            >
              {item.label} ({groups[item.key].length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#f97316"
          style={{ marginTop: 30 }}
        />
      ) : error ? (
        <TouchableOpacity
          style={styles.card}
          onPress={load}
        >
          <Text style={styles.empty}>
            {error} Tap to try again.
          </Text>
        </TouchableOpacity>
      ) : list.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.empty}>
            No {tab} campaigns.
          </Text>
        </View>
      ) : (
        list.map((campaign) => {
          const target = campaign.target_deliveries || 1;
          const done = Math.min(campaign.progress || 0, target);
          const percent = Math.round((done / target) * 100);
          const reward = `${campaign.currency || "NGN"} ${Number(campaign.reward_amount || 0).toLocaleString()}`;

          return (
            <View
              key={campaign.id}
              style={styles.card}
            >

              <View style={styles.cardTop}>
                <Text style={styles.title}>
                  {campaign.title}
                </Text>

                <Text style={styles.reward}>
                  {reward}
                </Text>
              </View>

              {!!campaign.description && (
                <Text style={styles.description}>
                  {campaign.description}
                </Text>
              )}

              <Text style={styles.meta}>
                {campaign.target_deliveries} deliveries
                {campaign.area_label ? ` in ${campaign.area_label}` : ""}
              </Text>

              <Text style={styles.meta}>
                {formatDate(campaign.starts_at)} to {formatDate(campaign.ends_at)}
              </Text>

              {tab !== "future" && (
                <>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percent}%` },
                        campaign.reached && styles.progressDone,
                      ]}
                    />
                  </View>

                  <Text style={styles.progressText}>
                    {done} of {campaign.target_deliveries} deliveries
                  </Text>
                </>
              )}

              {tab === "past" && (
                <Text
                  style={[
                    styles.status,
                    campaign.reached ? styles.won : styles.missed,
                  ]}
                >
                  {campaign.reached
                    ? "Completed. Hooks adds the bonus to your payout."
                    : "You missed this campaign."}
                </Text>
              )}

              {tab === "current" && campaign.reached && (
                <Text style={[styles.status, styles.won]}>
                  Target reached. Hooks adds the bonus to your payout.
                </Text>
              )}

            </View>
          );
        })
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 18,
  },

  header: {
    backgroundColor: "#f97316",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  headerText: {
    color: "#fff",
    marginTop: 8,
    lineHeight: 20,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#fff",
  },

  tabText: {
    color: "#6b7280",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#f97316",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginRight: 10,
  },

  reward: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16a34a",
  },

  description: {
    color: "#4b5563",
    marginTop: 6,
    lineHeight: 20,
  },

  meta: {
    color: "#6b7280",
    marginTop: 6,
    fontSize: 13,
  },

  progressTrack: {
    height: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    marginTop: 14,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#f97316",
    borderRadius: 10,
  },

  progressDone: {
    backgroundColor: "#16a34a",
  },

  progressText: {
    marginTop: 6,
    color: "#374151",
    fontWeight: "600",
  },

  status: {
    marginTop: 10,
    fontWeight: "700",
  },

  won: {
    color: "#16a34a",
  },

  missed: {
    color: "#dc2626",
  },

  empty: {
    color: "#6b7280",
    textAlign: "center",
  },
});

export default Campaigns;

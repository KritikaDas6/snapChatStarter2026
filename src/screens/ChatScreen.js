import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../components/Header";
import BasicChatbot from "../chatbots/BasicChatbot";

const JOSH = require("../../assets/profiles/josh-gada.png");
const LOLA = require("../../assets/profiles/lola-rae.png");
const WENDY = require("../../assets/profiles/wendy.png");
const ISABELLA = require("../../assets/profiles/isabella.png");
const CINDY = require("../../assets/profiles/cindy-lu.png");
const CASSIE = require("../../assets/profiles/cassie-lu.png");
const JENNIFER = require("../../assets/profiles/jennifer-nguyen.png");

export const CHATBOTS = {
  BasicChatbot: {
    id: "BasicChatbot",
    name: "Salsa Dancers",
    imageUrl: "https://loremflickr.com/140/140",
    component: BasicChatbot,
  },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread", badge: 4 },
  { key: "topics", label: "Topics" },
  { key: "groups", label: "Groups", badge: 3 },
  { key: "stories", label: "Stories", badge: 2 },
];

const PINNED_GROUPS = [
  {
    id: "gym-crew",
    name: "Gym Crew 💪",
    avatars: [JOSH, LOLA, WENDY],
  },
  {
    id: "socal-snapmates",
    name: "SoCal SnapMates ☀️",
    avatars: [JOSH, ISABELLA, CINDY],
  },
  {
    id: "fashionistas",
    name: "Fashionistas 👗",
    avatars: [LOLA, WENDY, CASSIE],
  },
];

const CHAT_ROWS = [
  {
    id: "lola",
    name: "Lola Rae",
    avatar: LOLA,
    status: "New Snap",
    statusColor: "#A855F7",
    statusIcon: "square",
    time: "2h",
  },
  {
    id: "team",
    name: "Team Snapchat",
    avatar: null,
    status: "Received",
    statusColor: "#A855F7",
    statusIcon: "square-outline",
    time: "2h",
  },
  {
    id: "rob",
    name: "Rob Black",
    avatar: JOSH,
    status: "New Chat",
    statusColor: "#3B82F6",
    statusIcon: "chatbubble",
    time: "2h",
  },
  {
    id: "isabella",
    name: "Isabella",
    avatar: ISABELLA,
    status: "New Snap",
    statusColor: "#EF4444",
    statusIcon: "square",
    time: "5h",
  },
  {
    id: "jennifer",
    name: "Jennifer Nguyen",
    avatar: JENNIFER,
    status: "Received",
    statusColor: "#A855F7",
    statusIcon: "square-outline",
    time: "1d",
  },
];

function PinnedGroup({ group, onPress }) {
  return (
    <Pressable style={styles.pinnedItem} onPress={onPress}>
      <View style={styles.pinnedCircle}>
        {group.avatars.map((source, index) => (
          <Image
            key={`${group.id}-${index}`}
            source={source}
            style={[
              styles.pinnedAvatar,
              index === 0 && styles.pinnedAvatarTop,
              index === 1 && styles.pinnedAvatarLeft,
              index === 2 && styles.pinnedAvatarRight,
            ]}
          />
        ))}
      </View>
      <Text style={styles.pinnedName} numberOfLines={2}>
        {group.name}
      </Text>
    </Pressable>
  );
}

function ChatRow({ chat, onPress }) {
  return (
    <Pressable style={styles.chatRow} onPress={onPress}>
      {chat.avatar ? (
        <Image source={chat.avatar} style={styles.chatAvatar} />
      ) : (
        <View style={[styles.chatAvatar, styles.teamAvatar]}>
          <Ionicons name="ghost" size={28} color="#111" />
        </View>
      )}

      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{chat.name}</Text>
        <View style={styles.statusRow}>
          <Ionicons
            name={chat.statusIcon}
            size={12}
            color={chat.statusColor}
          />
          <Text style={[styles.statusText, { color: chat.statusColor }]}>
            {chat.status}
          </Text>
          <Text style={styles.timeText}> • {chat.time}</Text>
        </View>
      </View>

      <Ionicons name="camera-outline" size={26} color="#B0B0B0" />
    </Pressable>
  );
}

export default function ChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [activeFilter, setActiveFilter] = useState("all");

  function openGroupChat(group) {
    navigation.navigate("Conversation", {
      chatbotName: group.name,
      chatId: group.id,
    });
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          marginBottom: tabBarHeight,
        },
      ]}
    >
      <Header title="Chat" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map((filter) => {
            const selected = activeFilter === filter.key;
            return (
              <Pressable
                key={filter.key}
                style={[styles.filterChip, selected && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    selected && styles.filterLabelActive,
                  ]}
                >
                  {filter.label}
                </Text>
                {filter.badge ? (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{filter.badge}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pinnedRow}
        >
          {PINNED_GROUPS.map((group) => (
            <PinnedGroup
              key={group.id}
              group={group}
              onPress={() => openGroupChat(group)}
            />
          ))}
        </ScrollView>

        <View style={styles.chatList}>
          {CHAT_ROWS.map((chat) => (
            <ChatRow
              key={chat.id}
              chat={chat}
              onPress={() =>
                navigation.navigate("Conversation", {
                  chatbotName: chat.name,
                  chatId: chat.id,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  filtersRow: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: "#D6F0FF",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  filterLabelActive: {
    color: "#0A84FF",
  },
  filterBadge: {
    backgroundColor: "#0A84FF",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  pinnedRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 18,
  },
  pinnedItem: {
    width: 92,
    alignItems: "center",
  },
  pinnedCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#F2F2F7",
    marginBottom: 8,
    overflow: "hidden",
    position: "relative",
  },
  pinnedAvatar: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#fff",
  },
  pinnedAvatarTop: {
    top: 4,
    alignSelf: "center",
    left: 20,
    zIndex: 3,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  pinnedAvatarLeft: {
    bottom: 6,
    left: 4,
    zIndex: 2,
  },
  pinnedAvatarRight: {
    bottom: 6,
    right: 4,
    zIndex: 1,
  },
  pinnedName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
    lineHeight: 16,
  },
  chatList: {
    marginTop: 8,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EFEFEF",
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F2F2F7",
  },
  teamAvatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  timeText: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
});

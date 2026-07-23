import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

// Drop these into your project's ./assets folder (or update the paths below
// to wherever you keep them) — see the assets/ folder included alongside this file.
const LOLA_AVATAR = require("../../assets/profiles/lola-rae.png");
const ISABELLA_AVATAR = require("../../assets/profiles/isabella.png");
const WENDY_AVATAR = require("../../assets/profiles/wendy.png");

export default function GroupChatProfile({ route, navigation }) {
  const {
    groupName = "Fashionistas",
    groupEmoji = "👗",
    // optional textured banner image for the header — swap in your own asset
    headerBackground = null,
    members = [
      { id: "1", name: "Lola", avatar: LOLA_AVATAR, online: true },
      { id: "2", name: "Isabella", avatar: ISABELLA_AVATAR, online: true },
      { id: "3", name: "Wendy", avatar: WENDY_AVATAR, online: true },
    ],
    hashtags = ["#Brunch", "#Vogue", "#DinnerParties", "#LABaddies"],
    matchLabel = "SnapMates Match",
    snapcodeUri = null,
    streak = 111,
    friendsCount = 1234,
    location = "Los Angeles",
    ageRange = "28-32",
    interests = [
      { id: "1", label: "Vegans", emoji: "🥑" },
      { id: "2", label: "Career Changers", emoji: "💼" },
      { id: "3", label: "Artsy", emoji: "🎨" },
      { id: "4", label: "Travelers", emoji: "✈️" },
    ],
    prompt = "What would you add to the menu of your favorite SoCal food spot? 👀",
    sharedMemories = [],
  } = route.params || {};

  const names = members.map((m) => m.name).join(" • ");

  const HeaderWrapper = headerBackground ? ImageBackground : View;
  const headerWrapperProps = headerBackground
    ? { source: { uri: headerBackground }, style: styles.header }
    : { style: [styles.header, styles.headerFallbackBg] };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderWrapper {...headerWrapperProps}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerTopRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="upload" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="settings-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{groupName}</Text>
            <Text style={styles.titleEmoji}>{groupEmoji}</Text>
          </View>

          <View style={styles.avatarsRow}>
            {members.map((m) => (
              <View key={m.id} style={styles.avatarWrap}>
                <View style={styles.avatarRing}>
                  {m.avatar ? (
                    <Image
                      source={typeof m.avatar === "string" ? { uri: m.avatar } : m.avatar}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={[styles.avatarImage, styles.avatarFallback]}>
                      <Text style={styles.avatarInitial}>
                        {(m.name || "U").charAt(0)}
                      </Text>
                    </View>
                  )}
                </View>
                {m.online && <View style={styles.onlineDot} />}
              </View>
            ))}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsRow}
            contentContainerStyle={styles.tagsRowContent}
          >
            {hashtags.map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagPillText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </HeaderWrapper>

        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.snapcodeRow}>
            <View style={styles.snapcodeBox}>
              {snapcodeUri ? (
                <Image source={{ uri: snapcodeUri }} style={styles.snapcodeImage} />
              ) : (
                <Ionicons name="qr-code" size={48} color="#000" />
              )}
            </View>
            <View style={styles.snapcodeTextWrap}>
              <Text style={styles.namesText} numberOfLines={1}>
                {names}
              </Text>
              <Text style={styles.matchLabel}>{matchLabel}</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsRow}
          >
            <View style={styles.statPill}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statText}>{streak}</Text>
            </View>
            <View style={styles.statPill}>
              <Ionicons name="chatbubble-ellipses-outline" size={14} color="#333" />
              <Text style={styles.statText}>{friendsCount.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.statPill}>
              <Text style={styles.statEmoji}>☀️</Text>
              <Text style={[styles.statText, styles.linkText]}>{location}</Text>
              <Ionicons name="chevron-forward" size={14} color="#7B5FE0" />
            </TouchableOpacity>
            <View style={styles.statPill}>
              <Text style={styles.statText}>{ageRange}</Text>
            </View>
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsRow}
          >
            {interests.map((interest) => (
              <View key={interest.id} style={styles.statPill}>
                <Text style={styles.statEmoji}>{interest.emoji}</Text>
                <Text style={styles.statText}>{interest.label}</Text>
              </View>
            ))}
          </ScrollView>

          <Text style={styles.sectionLabel}>TODAY'S PROMPT</Text>
          <Text style={styles.prompt}>{prompt}</Text>

          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Send a chat"
              placeholderTextColor="#999"
            />
            <TouchableOpacity>
              <Ionicons name="mic-outline" size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleLeft}>Our Story</Text>
              <TouchableOpacity style={styles.newStoryBtn}>
                <Ionicons name="add" size={16} color="#000" />
                <Text style={styles.newStoryText}>New Story</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.storyCard}>
              <View style={styles.storyThumbRing}>
                <Image
                  source={{ uri: "https://loremflickr.com/120/120" }}
                  style={styles.storyThumb}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.storyTitle}>Our Story • Group Only</Text>
              </View>
              <Ionicons name="ellipsis-horizontal" size={18} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleLeft}>Shared Memories</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>+ New</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={
                sharedMemories.length
                  ? sharedMemories
                  : [{ id: "1" }, { id: "2" }, { id: "3" }]
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => i.id}
              renderItem={() => (
                <View style={styles.memoryThumb}>
                  <Image
                    style={styles.memoryImage}
                    source={{ uri: "https://loremflickr.com/120/200" }}
                  />
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const RING_COLOR = "#8B5CF6";
const SHEET_RADIUS = 28;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFE7EA" },

  header: {
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: 16,
  },
  headerFallbackBg: {
    backgroundColor: "#D9C7CE",
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTopRight: { flexDirection: "row" },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#fff" },
  titleEmoji: { fontSize: 22, marginLeft: 8 },

  avatarsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  avatarWrap: { marginHorizontal: 10 },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2.5,
    borderColor: RING_COLOR,
    padding: 3,
    backgroundColor: "#fff",
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 40 },
  avatarFallback: {
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { fontWeight: "700", fontSize: 22, color: "#555" },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CD964",
    borderWidth: 2,
    borderColor: "#fff",
  },

  tagsRow: { marginTop: 24 },
  tagsRowContent: { paddingRight: 16 },
  tagPill: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tagPillText: { fontWeight: "600", color: "#000", fontSize: 13 },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    marginTop: -SHEET_RADIUS / 2,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: 600,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 18,
  },

  snapcodeRow: { flexDirection: "row", alignItems: "center" },
  snapcodeBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#FFFC00",
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  snapcodeImage: { width: "100%", height: "100%" },
  snapcodeTextWrap: { marginLeft: 16, flex: 1 },
  namesText: { fontSize: 19, fontWeight: "800", color: "#000" },
  matchLabel: { fontSize: 13, color: "#888", marginTop: 2 },

  statsRow: { paddingVertical: 14 },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  statEmoji: { fontSize: 14, marginRight: 6 },
  statText: { fontWeight: "600", fontSize: 13, color: "#333" },
  linkText: { color: "#7B5FE0", marginRight: 2 },

  sectionLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "700",
    letterSpacing: 0.8,
    textAlign: "center",
    marginTop: 12,
  },
  prompt: {
    fontSize: 17,
    color: "#000",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18,
    lineHeight: 24,
  },

  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 24,
  },
  chatInput: { flex: 1, fontSize: 15, color: "#000" },

  section: { marginTop: 8, marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitleLeft: { fontWeight: "800", fontSize: 17 },
  sectionAction: { color: "#666", fontWeight: "600" },

  newStoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  newStoryText: { marginLeft: 4, fontWeight: "600", fontSize: 13 },

  storyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 10,
    borderRadius: 14,
  },
  storyThumbRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: RING_COLOR,
    padding: 2,
    marginRight: 12,
  },
  storyThumb: { width: "100%", height: "100%", borderRadius: 24 },
  storyTitle: { fontWeight: "600", fontSize: 14 },

  memoryThumb: {
    marginRight: 10,
    width: 100,
    height: 140,
    borderRadius: 8,
    overflow: "hidden",
  },
  memoryImage: { width: "100%", height: "100%" },
});
import {
  Image,
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../../utils/hooks/supabase";
import { useAuthentication } from "../../utils/hooks/useAuthentication";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BITMOJI = require("../../assets/snapchat/personalBitmoji.png");
const GHOST = require("../../assets/snapchat/ghostlogo.png");
const DEFAULT_AVATAR = require("../../assets/snapchat/defaultprofile.png");

// Profile avatars used in "My Groups" below
const JOSH_AVATAR = require("../../assets/profiles/josh-gada.png");
const LOLA_AVATAR = require("../../assets/profiles/lola-rae.png");
const CINDY_AVATAR = require("../../assets/profiles/cindy-lu.png");
const JENNIFER_AVATAR = require("../../assets/profiles/jennifer-nguyen.png");
const ISABELLA_AVATAR = require("../../assets/profiles/isabella.png");
const CASSIE_AVATAR = require("../../assets/profiles/cassie-lu.png");
const WENDY_AVATAR = require("../../assets/profiles/wendy.png");

const INTEREST_CHIPS = [
  { key: "school", emoji: "🎓", label: "UC Berkeley" },
  { key: "music", emoji: "🩰", label: "Ballet" },
  { key: "outdoors", emoji: "🥾", label: "Rock Climbing" },
  { key: "fashion", emoji: "👗", label: "Fashion" },
  { key: "entrepreneurship", emoji: "💰", label: "Entrepreneurship" },
  { key: "rap", emoji: "🎤", label: "Rap" },
  { key: "racing", emoji: "🏎️", label: "Racing" },
];

const MEMORIES = [
  {
    id: "1",
    uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    id: "2",
    uri: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
  },
  {
    id: "3",
    uri: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80",
  },
  {
    id: "4",
    uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
  },
];

const GROUPS = [
  {
    id: "1",
    name: "SoCal SnapMates ☀️",
    avatars: [JOSH_AVATAR, CINDY_AVATAR, JENNIFER_AVATAR],
  },
  {
    id: "2",
<<<<<<< HEAD
    name: "Fashionistas 👗",
    avatars: [LOLA_AVATAR, ISABELLA_AVATAR, WENDY_AVATAR],
=======
    name: "Salsa Dancers 💃",
    avatars: [
      "https://sdk.bitmoji.com/render/panel/20048676-103221902646_4-s5-v1.png?transparent=1&palette=1&scale=1",
      "https://i.imgur.com/FxsJ3xy.jpg",
      "https://sdk.bitmoji.com/render/panel/20048676-103221902646_4-s5-v1.png?transparent=1&palette=1&scale=1",
    ],
>>>>>>> main
  },
  {
    id: "3",
    name: "Gym Crew 💪",
    avatars: [JOSH_AVATAR, JENNIFER_AVATAR, CASSIE_AVATAR],
  },
];

const MAP_REGION = {
  latitude: 34.0195,
  longitude: -118.4912,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

function Chip({ emoji, label, onPress, showChevron }) {
  return (
    <Pressable style={styles.chip} onPress={onPress}>
      <Text style={styles.chipEmoji}>{emoji}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
      {showChevron ? (
        <Ionicons name="chevron-forward" size={12} color="#8E8E93" />
      ) : null}
    </Pressable>
  );
}

function GroupBubble({ group }) {
  return (
    <View style={styles.groupItem}>
      <View style={styles.groupCircle}>
        {group.avatars.map((source, index) => (
          <Image
            key={`${group.id}-${index}`}
            source={source}
            style={[
              styles.groupAvatar,
              index === 0 && styles.groupAvatarTop,
              index === 1 && styles.groupAvatarLeft,
              index === 2 && styles.groupAvatarRight,
            ]}
          />
        ))}
      </View>
      <Text style={styles.groupName} numberOfLines={2}>
        {group.name}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuthentication();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [displayName, setDisplayName] = useState("Wendy Zhang");
  const [username, setUsername] = useState("wendy-zhang");
  const [birthdayLabel, setBirthdayLabel] = useState("July 6");
  const [astrology, setAstrology] = useState("Cancer");
  const [interestChips, setInterestChips] = useState(INTEREST_CHIPS);
  const [isAddingChip, setIsAddingChip] = useState(false);
  const [newChipText, setNewChipText] = useState("");

  function handleAddChip() {
    const label = newChipText.trim();
    if (!label) {
      setIsAddingChip(false);
      return;
    }
    setInterestChips((chips) => [
      ...chips,
      { key: `custom-${Date.now()}`, emoji: "✨", label },
    ]);
    setNewChipText("");
    setIsAddingChip(false);
  }

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    if (!user) return;

    const email = user.email || user.user_metadata?.email || "";
    const metaName =
      user.user_metadata?.full_name ||
      user.user_metadata?.userName ||
      (email ? email.slice(0, email.indexOf("@")) : "");

    if (metaName) {
      setDisplayName(metaName);
      setUsername(metaName.toLowerCase().replace(/\s+/g, "-"));
    }

    async function fetchProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, birthday, avatar_url")
        .eq("id", user.id)
        .single();

      if (error || !data) return;

      if (data.username) {
        const name = String(data.username).includes("@")
          ? String(data.username).split("@")[0]
          : data.username;
        setDisplayName(name);
        setUsername(String(name).toLowerCase().replace(/\s+/g, "-"));
      }

      if (data.birthday) {
        const match = String(data.birthday).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) {
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const month = monthNames[Number(match[1]) - 1];
          setBirthdayLabel(`${month} ${Number(match[2])}`);
        } else {
          setBirthdayLabel(data.birthday);
        }
      }

      if (data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }

    fetchProfile();
  }, [user]);

  const heroSource = avatarUrl ? { uri: avatarUrl } : BITMOJI;
  const snapcodeSource = avatarUrl ? { uri: avatarUrl } : DEFAULT_AVATAR;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Hero / Bitmoji header */}
        <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
          <View style={styles.heroGlowMint} />
          <View style={styles.heroGlowGold} />
          <View style={styles.heroGlowBlue} />

          <View style={styles.topBar}>
            <Pressable
              style={styles.circleBtn}
              onPress={() => navigation.goBack()}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={22} color="#000" />
            </Pressable>
            <View style={styles.topBarRight}>
              <Pressable style={styles.circleBtn} hitSlop={8}>
                <Ionicons name="share-outline" size={20} color="#000" />
              </Pressable>
              <Pressable
                style={styles.circleBtn}
                onPress={() => navigation.navigate("Settings")}
                hitSlop={8}
              >
                <Ionicons name="settings-outline" size={20} color="#000" />
              </Pressable>
            </View>
          </View>

          <Image source={heroSource} style={styles.heroBitmoji} />
        </View>

        {/* White profile card */}
        <View style={styles.card}>
          <View style={styles.identityRow}>
            <View style={styles.snapcode}>
              <Image source={snapcodeSource} style={styles.snapcodeImage} />
              <View style={styles.snapcodeDots} />
            </View>
            <View style={styles.identityText}>
              <Text style={styles.displayName}>{displayName}</Text>
              <Text style={styles.username}>{username}</Text>
            </View>
          </View>

          <View style={styles.chipsWrap}>
            <Chip emoji="🎂" label={birthdayLabel} />
            <Chip emoji="👻" label="480,506" />
            <Chip
              emoji="♋"
              label={astrology}
              showChevron
              onPress={() => navigation.navigate("Astrology")}
            />
            {interestChips.map((chip) => (
              <Chip key={chip.key} emoji={chip.emoji} label={chip.label} />
            ))}
            {isAddingChip ? (
              <TextInput
                style={styles.addChipInput}
                value={newChipText}
                onChangeText={setNewChipText}
                placeholder="Type interest..."
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleAddChip}
                onBlur={handleAddChip}
              />
            ) : (
              <Pressable
                style={styles.addChipBtn}
                onPress={() => setIsAddingChip(true)}
              >
                <Text style={styles.addChipBtnText}>Add +</Text>
              </Pressable>
            )}
          </View>

          {/* My Stories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, styles.sectionTitleInline]}>
                My Stories
              </Text>
              <Pressable style={styles.newStoryBtn}>
                <Ionicons name="add" size={14} color="#000" />
                <Text style={styles.newStoryText}>New Story</Text>
              </Pressable>
            </View>
            <View style={styles.storyRow}>
              <View style={styles.storyIcon}>
                <Ionicons name="camera" size={20} color="#000" />
              </View>
              <Text style={styles.storyLabel}>
                My Story <Text style={styles.storyMeta}>• SnapMates Only</Text>
              </Text>
              <Ionicons name="ellipsis-horizontal" size={18} color="#8E8E93" />
            </View>
          </View>

          {/* Favorite Memories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorite Memories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.memoriesRow}
            >
              {MEMORIES.map((memory) => (
                <Image
                  key={memory.id}
                  source={{ uri: memory.uri }}
                  style={styles.memoryThumb}
                />
              ))}
            </ScrollView>
          </View>

          {/* My Groups */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Groups</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.groupsRow}
            >
              {GROUPS.map((group) => (
                <GroupBubble key={group.id} group={group} />
              ))}
            </ScrollView>
          </View>

          {/* Snap Map */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Snap Map</Text>
            <View style={styles.mapCard}>
              <MapView
                style={styles.map}
                initialRegion={MAP_REGION}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                pointerEvents="none"
              >
                <Marker coordinate={MAP_REGION}>
                  <Image source={heroSource} style={styles.mapPin} />
                </Marker>
              </MapView>
              <Pressable
                style={styles.mapFooter}
                onPress={() => navigation.navigate("UserTab", { screen: "Map" })}
              >
                <View style={styles.mapFooterLeft}>
                  <Ionicons name="location" size={18} color="#000" />
                  <View>
                    <Text style={styles.mapFooterTitle}>Sharing Location</Text>
                    <Text style={styles.mapFooterSubtitle}>with Everyone</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Image source={GHOST} style={styles.footerGhost} />
            <Text style={styles.footerText}>Profile Started on Jun 16, 2026</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F3F0E8",
  },
  scroll: {
    flex: 1,
  },
  hero: {
    height: 360,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#E8F2D8",
  },
  heroGlowMint: {
    position: "absolute",
    top: -40,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(180, 220, 160, 0.55)",
  },
  heroGlowGold: {
    position: "absolute",
    top: 40,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(245, 220, 120, 0.45)",
  },
  heroGlowBlue: {
    position: "absolute",
    bottom: 20,
    left: SCREEN_WIDTH * 0.25,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(170, 210, 230, 0.4)",
  },
  topBar: {
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  topBarRight: {
    flexDirection: "row",
    gap: 10,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBitmoji: {
    width: 260,
    height: 300,
    marginTop: 8,
    resizeMode: "contain",
  },
  card: {
    marginTop: -28,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 22,
    minHeight: 700,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  snapcode: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#FFFC00",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#111",
    borderStyle: "dashed",
  },
  snapcodeImage: {
    width: 42,
    height: 42,
    borderRadius: 8,
    resizeMode: "cover",
  },
  snapcodeDots: {
    ...StyleSheet.absoluteFillObject,
  },
  identityText: {
    flex: 1,
  },
  displayName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    letterSpacing: -0.3,
  },
  username: {
    marginTop: 2,
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 22,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 4,
  },
  chipEmoji: {
    fontSize: 13,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },
  addChipBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFC00",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  addChipBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
  addChipInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 13,
    fontWeight: "600",
    minWidth: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
  },
  sectionTitleInline: {
    marginBottom: 0,
  },
  newStoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 2,
  },
  newStoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },
  storyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  storyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8E8ED",
    alignItems: "center",
    justifyContent: "center",
  },
  storyLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  storyMeta: {
    fontWeight: "500",
    color: "#8E8E93",
  },
  memoriesRow: {
    gap: 10,
    paddingRight: 8,
  },
  memoryThumb: {
    width: 92,
    height: 140,
    borderRadius: 16,
    backgroundColor: "#E8E8ED",
  },
  groupsRow: {
    gap: 18,
    paddingRight: 8,
  },
  groupItem: {
    width: 100,
    alignItems: "center",
  },
  groupCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F2F2F7",
    marginBottom: 8,
    overflow: "hidden",
    position: "relative",
  },
  groupAvatar: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DDD",
  },
  groupAvatarTop: {
    top: 8,
    left: 24,
    zIndex: 3,
  },
  groupAvatarLeft: {
    bottom: 10,
    left: 10,
    zIndex: 2,
  },
  groupAvatarRight: {
    bottom: 10,
    right: 10,
    zIndex: 1,
  },
  groupName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
  },
  mapCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#F2F2F7",
  },
  map: {
    width: "100%",
    height: 150,
  },
  mapPin: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  mapFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FFF",
  },
  mapFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mapFooterTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  mapFooterSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 1,
  },
  footer: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 20,
    gap: 8,
  },
  footerGhost: {
    width: 22,
    height: 22,
    opacity: 0.35,
    resizeMode: "contain",
  },
  footerText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
});
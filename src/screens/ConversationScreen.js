import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function ConversationScreen({ navigation, route }) {
  const chatbotName = route.params?.chatbotName ?? "Salsa Dancers";

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      name: "DAILY PROMPT",
      text: "What is your favorite salsa style? LA, New York, Cuban, or Colombian? 💃✨",
      color: "#BEBC00",
    },
    {
      id: "2",
      sender: "me",
      name: "ME",
      text: "My wife and I ❤️ LA style!!",
      color: "#FF2D55",
    },
    {
      id: "3",
      sender: "bot",
      name: "Bobby",
      text: "hmm, new yooork all the way 🗽🗽",
      color: "hsl(110, 63%, 52%)",
    },
    {
      id: "4",
      sender: "bot",
      name: "Doug",
      text: "Colombian for me! 💃🇨🇴",
      color: "#33BBFF",
    }
  ]);

  const listRef = useRef();

  function sendMessage() {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: "me",
        name: "ME",
        text: message,
        color: "#FF2D55",
      },
    ]);

    setMessage("");
  }

function renderMessage({ item }) {
    return (
      <View style={styles.messageWrapper}>
        <Text
          style={[
            styles.sender,
            { color: item.color, textTransform: "uppercase" },
          ]}
        >
          {item.name}
        </Text>

        <View
          style={[
            styles.messageRow,
            {
              borderLeftColor: item.color,
              backgroundColor: item.name === "DAILY PROMPT" ? "#F2F2F2" : "transparent"
            },
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={`Open ${chatbotName} profile`}
          style={styles.headerTitleButton}
          onPress={() =>
            navigation.navigate("Snapmategroupprofile", {
              groupName: chatbotName,
            })
          }
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>💃</Text>
          </View>

          <Text numberOfLines={1} style={styles.username}>
            {chatbotName}
          </Text>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity accessibilityLabel="Start an audio call" hitSlop={8}>
            <Ionicons name="call-outline" size={24} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Start a video call" hitSlop={8}>
            <Ionicons name="videocam-outline" size={26} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messages}
        />

        {/* INPUT AREA */}

        {/* INPUT AREA */}

        <View style={styles.inputBar}>
          {/* Camera */}
          <TouchableOpacity>
            <Ionicons name="camera" size={27} color="#000" />
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Chat"
            style={styles.input}
            onSubmitEditing={sendMessage}
          />

          {/* Dynamic Button */}
          {message.length > 0 ? (
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Ionicons name="arrow-up" size={22} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons name="mic" size={24} />
            </TouchableOpacity>
          )}

          {/* Emoji */}
          <TouchableOpacity>
            <Text style={styles.emoji}>🙂</Text>
          </TouchableOpacity>

          {/* Plus */}
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={28} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  headerTitleButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: "#FFFC00",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  avatarEmoji: {
    fontSize: 22,
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    flex: 1,
  },

  headerIcons: {
    flexDirection: "row",
    gap: 18,
  },

  messages: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  messageWrapper: {
    marginVertical: 7,
  },

sender: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: 0.5, // Adds a tiny bit of space between the uppercase letters
  },

  messageRow: {
    borderLeftWidth: 6, // Makes the colored bar thicker
    paddingLeft: 10, // Space between the colored bar and the text
    paddingVertical: 10, // Space above and below the text
    // MAKE SURE THERE IS NO borderRadius HERE!
  },

  messageText: {
    fontSize: 18,
    color: "#222",
  },

  inputBar: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#F1F1F5",
    borderRadius: 20,
    paddingHorizontal: 18,
    fontSize: 17,
  },

  emoji: {
    fontSize: 25,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0A84FF",
    justifyContent: "center",
    alignItems: "center",
  },
});

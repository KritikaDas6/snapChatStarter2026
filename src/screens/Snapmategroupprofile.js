import React from "react";
import { View, Text, ScrollView, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";


export default function GroupChatProfile({ route, navigation }) {
 const {
   groupName = "Group",
   members = [
     { id: "1", name: "Lola", avatar: null },
     { id: "2", name: "Isabella", avatar: null },
     { id: "3", name: "Wendy", avatar: null },
   ],
   tags = ["SnapMates Match"],
   prompt = "What would you add to the menu of your favorite SoCal food spot? 👀",
   sharedMemories = [],
   location = "Los Angeles",
 } = route.params || {};


 return (
   <ScrollView style={styles.container}>
     <View style={styles.header}>
       <View style={styles.headerTop}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
           <Text style={styles.back}>‹</Text>
         </TouchableOpacity>
         <Text style={styles.title}>{groupName}</Text>
         <View style={{ width: 24 }} />
       </View>


       <View style={styles.avatarsRow}>
         {members.map((m) => (
           <View key={m.id} style={styles.avatarWrap}>
             <View style={styles.avatar}>
               <Text style={styles.avatarInitial}>{(m.name || "U").charAt(0)}</Text>
             </View>
             <Text style={styles.avatarName} numberOfLines={1}>
               {m.name}
             </Text>
           </View>
         ))}
       </View>


       <View style={styles.meta}>
         <Text style={styles.metaLine}>{tags.join(" • ")}</Text>
         <Text style={styles.metaLineSmall}>{location}</Text>
       </View>
     </View>


     <View style={styles.body}>
       <Text style={styles.sectionTitle}>TODAY'S PROMPT</Text>
       <Text style={styles.prompt}>{prompt}</Text>


       <TouchableOpacity style={styles.sendChatBtn}>
         <Text style={styles.sendChatText}>Send a chat</Text>
       </TouchableOpacity>


       <View style={styles.section}>
         <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitleLeft}>Our Story</Text>
           <TouchableOpacity>
             <Text style={styles.sectionAction}>+ New Story</Text>
           </TouchableOpacity>
         </View>
         <View style={styles.storyCard}>
           <Text>Our Story • Group Only</Text>
         </View>
       </View>


       <View style={styles.section}>
         <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitleLeft}>Shared Memories</Text>
           <TouchableOpacity>
             <Text style={styles.sectionAction}>+ New</Text>
           </TouchableOpacity>
         </View>


         <FlatList
           data={sharedMemories.length ? sharedMemories : [{ id: "1" }, { id: "2" }, { id: "3" }]}
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
 );
}


const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: "#fff" },
 header: { padding: 16, backgroundColor: "#fff" },
 headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
 back: { fontSize: 28 },
 title: { fontSize: 20, fontWeight: "700" },
 avatarsRow: { flexDirection: "row", marginTop: 12 },
 avatarWrap: { alignItems: "center", marginRight: 12, width: 64 },
 avatar: { height: 56, width: 56, borderRadius: 28, backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center" },
 avatarInitial: { fontWeight: "700" },
 avatarName: { fontSize: 12, marginTop: 6, textAlign: "center" },
 meta: { marginTop: 10 },
 metaLine: { fontWeight: "600" },
 metaLineSmall: { color: "#666", marginTop: 4 },
 body: { padding: 16 },
 sectionTitle: { fontSize: 12, color: "#999", marginBottom: 6, letterSpacing: 0.5 },
 prompt: { fontSize: 16, marginBottom: 12 },
 sendChatBtn: { backgroundColor: "#F2F2F2", padding: 12, borderRadius: 8, marginBottom: 16 },
 sendChatText: { color: "#666" },
 section: { marginTop: 12 },
 sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
 sectionTitleLeft: { fontWeight: "700" },
 sectionAction: { color: "#666" },
 storyCard: { backgroundColor: "#FAFAFA", padding: 14, borderRadius: 8 },
 memoryThumb: { marginRight: 10, width: 100, height: 140, borderRadius: 8, overflow: "hidden" },
 memoryImage: { width: "100%", height: "100%" },
});

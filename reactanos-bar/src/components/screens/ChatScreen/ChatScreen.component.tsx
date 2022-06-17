import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { View, Image } from "react-native";
import { Day, GiftedChat, Send } from "react-native-gifted-chat";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../InitApp";
import { useSelector } from "react-redux";
import { StyledView } from "./ChatScreen.styled";
import { useFocusEffect } from "@react-navigation/native";

const ChatScreen = ({ navigation, route }: any) => {
  const [messages, setMessages] = useState([]);
  const userData: any = useSelector<any>((store) => store.auth);
  //table = userData.user.table;

  useLayoutEffect(() => {
    let table = userData.user?.table || route.params.table;
    const unsubscribe = onSnapshot(
      query(collection(db, "chatMeza" + table), orderBy("createdAt", "desc")),
      (snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            _id: doc.data()._id,
            text: doc.data().text,
            createdAt: doc.data().createdAt.toDate(),
            user: doc.data().user,
          }))
        )
    );
    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    let table = userData.user?.table || route.params.table;

    addDoc(collection(db, "chatMeza" + table), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  function renderDay(props: any) {
    return <Day {...props} textStyle={{ color: "black" }} />;
  }

  return (
    <StyledView colors={["#6190E8", "#A7BFE8"]}>
      <GiftedChat
        optionTintColor="#optionTintColor"
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderUsernameOnMessage={true}
        renderAvatarOnTop={true}
        maxInputLength={21}
        user={{
          _id: userData?.user?.email || 1,
          name: userData?.user?.name || "",
        }}
        textInputProps={{
          borderColor: "#222",
          placeholder: "Escribe un mensaje aquí...",
        }}
        renderDay={renderDay}
        renderSend={(props) => (
          <Send {...props}>
            <View style={{ marginRight: 10, marginBottom: 5 }}>
              <Image
                style={{ height: 35, width: 35 }}
                source={require("../../../../assets/icon.png")}
                resizeMode={"center"}
              />
            </View>
          </Send>
        )}
      />
    </StyledView>
  );
};

export default ChatScreen;

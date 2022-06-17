    import React, { useCallback, useLayoutEffect, useState } from 'react';
    import { View, Image } from 'react-native';
    import { Day, GiftedChat, Send  } from 'react-native-gifted-chat'
    import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
    import { db } from "../../../InitApp";
    import { useSelector } from 'react-redux'
    
    const ChatScreen = ({ navigation }: any) => {

        const [messages, setMessages] = useState<any>([]);
        const userData:any = useSelector<any>(store => store.auth);
    
        useLayoutEffect(() => {
            const unsubscribe = onSnapshot(query(collection(db, "chatMeza#"), orderBy("createdAt", "desc")), (snapshot =>
                setMessages(snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                    user: doc.data().user
                })))
            ))
            return unsubscribe;
        }, [])
    
        const onSend = useCallback((messages = []) => {
            setMessages((previousMessages:any) =>
                GiftedChat.append(previousMessages, messages))
            const {
                _id,
                createdAt,
                text,
                user } = messages[0]
            addDoc(collection(db, "chatMeza#"), {
                _id,
                createdAt,
                text,
                user
            });
        }, []);

        function renderDay(props : any) {
            return <Day {...props} textStyle={{color: 'black'}}/>
        }
        
        return (      
            <GiftedChat  
                messagesContainerStyle={{ backgroundColor: '#848cc4', borderColor: '#a5d1f1', shadowColor: '#a5d1f1' }}
                optionTintColor='#optionTintColor'
                messages={messages}
                onSend={messages => onSend(messages)}
                renderUsernameOnMessage={true}
                renderAvatarOnTop={true}
                maxInputLength={21}
                user={{
                    _id: userData?.currentUser?.email || 1,
                    //name: userData?.currentUser?.displayName || '',
                    name: userData?.user?.name || '',
                }}
                textInputProps={{                      
                    borderColor: '#222', 
                    placeholder:"Escribe un mensaje aquí...",   
                }} 
                renderDay={renderDay}
                renderSend={props => (
                    <Send {...props} >
                        <View style={{marginRight: 10, marginBottom: 5}}>
                            <Image style = {{height:35, width:35}} source={require('../../../../assets/icon.png')} resizeMode={'center'}/>
                        </View>
                </Send> )}           
            />      
        );
    }
    
    export default ChatScreen;
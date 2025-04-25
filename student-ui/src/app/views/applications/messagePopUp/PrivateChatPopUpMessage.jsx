import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import useAuth from "../../../hooks/useAuth";
import useHttp from "../../../c1hooks/http";


const PrivateChatPopUpMessage = ({
     input,
     sender,
     username,
     setInput,
     messages,
     isStudent,
     sendMessage,
     popUpUsername
}) => {

    return (
        <div
            style={{
                padding: '20px',
                margin: '0 auto',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
                💬 Chat with <strong>{isStudent ? sender : popUpUsername}</strong>
            </h3>

            <div
                style={{
                    height: '300px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '10px',
                    background: '#f9f9f9',
                    marginBottom: '10px',
                }}
            >
                {messages.map((msg, idx) => {
                    let senderUsername = msg.userSender?.username || msg.sender;
                    let isSender = senderUsername === username;

                    console.log("msg", msg)
                    console.log("msg.userSender?.username", msg.userSender?.username)
                    console.log("isSender", isSender)
                    return (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                flexDirection: isSender ? 'row-reverse' : 'row',
                                alignItems: 'flex-end',
                                marginBottom: '10px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '20px',
                                    margin: '0 8px',
                                }}
                            >
                                {isSender ? '👤' : '💬'}
                            </div>
                            <div
                                style={{
                                    background: isSender ? '#dcf8c6' : 'rgb(211,199,199)',
                                    padding: '10px 15px',
                                    borderRadius: '20px',
                                    maxWidth: '70%',
                                    wordBreak: 'break-word',
                                    alignItems: 'flex-end',
                                }}
                            >
                                <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '2px' }}>
                                    {msg.sender}
                                </div>
                                <div style={{ fontSize: '14px' }}>{msg.content}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '20px',
                        marginRight: '10px',
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: '10px 16px',
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default PrivateChatPopUpMessage;

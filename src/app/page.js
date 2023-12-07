"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Chat.module.css";

export default function Home() {


  // State: threads
  // - This array represents all the chat threads available in the application.
  // - Each thread is an object with its own unique id, a title, and an array of messages.
  // - The structure allows easy tracking and updating of individual threads and their messages.
  // - Example of a thread object: { id: 'thread-1', title: 'Thread Title', messages: [{ sender: 'patient', messageText: 'Hi', timestamp: '2021-01-01T00:00:00Z' }] }
  const [threads, setThreads] = useState([]);

  // State: currentThreadId
  // - This state holds the ID of the thread that is currently active or being viewed.
  // - It's essential for identifying which thread's messages should be displayed in the chat area and to which thread new messages should be sent.
  // - By tracking the current thread ID, we can easily filter the relevant messages for display and append new messages to the correct thread.
  const [currentThreadId, setCurrentThreadId] = useState(null);

  // State: inputText
  // - Manages the text input for new messages.
  // - This state is used to capture and reset the user's input in the message send box, making it ready for sending a new message and clearing it afterwards.
  const [inputText, setInputText] = useState("");

  // State: newThreadTitle
  // - Holds the title for a new chat thread that a user wishes to create.
  // - This state is crucial for creating new threads with unique titles, enhancing the chat application's functionality by allowing dynamic thread creation.
  const [newThreadTitle, setNewThreadTitle] = useState("");

  // State: role
  // - Represents the current role of the user in the chat, which can be either 'patient' or 'doctor'.
  // - This state is critical for setting the context of the messages sent, as it determines the sender's role in each message within a chat thread.
  // - By distinguishing between patients and doctors, the application can provide a more tailored chat experience, allowing for role-specific functionalities and interactions.
  const [role, setRole] = useState("patient");

  const handleCreateThread = (e) => {
    e.preventDefault();
    const newThread = {
      id: `thread-${threads.length + 1}`,
      title: newThreadTitle,
      messages: [],
    };
    setThreads([...threads, newThread]);
    setNewThreadTitle("");
  };

  const handleSelectThread = (threadId) => {
    setCurrentThreadId(threadId);
  };

  const handleSendMessage = () => {
    if (inputText.trim() && currentThreadId) {
      const updatedThreads = threads.map((thread) => {
        if (thread.id === currentThreadId) {
          return {
            ...thread,
            messages: [
              ...thread.messages,
              {
                sender: role,
                messageText: inputText,
                timestamp: new Date().toLocaleTimeString(),
              },
            ],
          };
        }
        return thread;
      });
      setThreads(updatedThreads);
      setInputText("");
      scrollToBottom(); // Scroll to bottom after sending a message
    }
  };

  const messageEndRef = useRef(null); // Create a ref for the end of the messages

  const scrollToBottom = () => {
    messageEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if(messageEndRef){
      scrollToBottom(); // Scroll to bottom when messages change
    }
    
  }, [threads, currentThreadId]); // Depend on threads, as it contains messages, scroll to bottom on thread enter aswell

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Patient-Doctor Chat</h1>
        <div className={styles.headerControls}>
          <div className={styles.greeting}>
            Hello {role.charAt(0).toUpperCase() + role.slice(1)}!
          </div>
          <select
            value={role}
            onChange={(e) => {setRole(e.target.value); setCurrentThreadId(null)}}
            className={styles.roleSelector}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

      </div>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <form
            action=""
            onSubmit={(e) => handleCreateThread(e)}
            className={styles.newThreadForm}
          >
            <input
              type="text"
              value={newThreadTitle}
              required
              onChange={(e) => setNewThreadTitle(e.target.value)}
              placeholder="New Thread Title"
              className={styles.newThreadInput}
            />
            <button className={styles.newThreadButton}>Create Thread</button>
          </form>
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={`${styles.threadItem} ${
                currentThreadId === thread.id ? styles.activeThread : ""
              }`}
              onClick={() => handleSelectThread(thread.id)}
            >
              {thread.title}
            </div>
          ))}
        </div>

        <div className={styles.mainContent}>
          {currentThreadId ? (
            <>
              <div className={styles.threadControls}>
                <div className={styles.threadTitle}>
                  {
                    threads.find((thread) => thread.id === currentThreadId)
                      ?.title
                  }
                </div>
              </div>

              <div className={styles.messageArea}>
                {threads
                  .find((thread) => thread.id === currentThreadId)
                  ?.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`${styles.message} ${
                        msg.sender === "patient"
                          ? styles.patient
                          : styles.doctor
                      }`}
                    >
                      <b>{msg.sender}:</b> {msg.messageText} <br />
                      <small>{msg.timestamp}</small>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
              </div>

              <form
                className={styles.inputSection}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <div className={styles.messageArea}>
              <div className={styles.noThreadMessage}>
                Please select or start a new thread from the sidebar.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

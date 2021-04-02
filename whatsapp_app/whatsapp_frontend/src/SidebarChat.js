import "./Chat.css";
import React from 'react'
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";

export default function SidebarChat() {
    return (
        <div className="sidebarChat">
            <Avatar/>
            <div className="sidebarChat_info">
                <h3>Room Name</h3>
                <p>This is the Last Message</p>
            </div>
        </div>
    )
}
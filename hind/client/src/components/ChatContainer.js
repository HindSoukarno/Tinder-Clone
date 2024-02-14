import ChatHeader from './ChatHeader'
import MatchesDisplay from './MatchesDisplay'
import ChatDisplay from './ChatDisplay'
import { useState } from 'react'


const ChatContainer = ({user}) => {

  
    return (
        <div className="chat-container">
            <ChatHeader  user={user}/>

            <div>
                <button className="option" >Matches</button>
                <button className="option" >Chat</button>
            </div>

           <MatchesDisplay/>
           <ChatDisplay/>
        </div>
    )
}

export default ChatContainer
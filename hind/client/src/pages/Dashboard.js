import TinderCard from 'react-tinder-card';
import { useEffect, useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import axios from 'axios';
import {useCookies} from 'react-cookie'

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [lastDirection, setLastDirection] = useState();
  const [genderedUsers, setGenderedUsers] = useState(null);
  const userId = cookies.user

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', {
        params: { userId }
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGenderedUsers = async () => {
    try {
      if (user) {
        const response = await axios.get('http://localhost:8000/gendered-users', {
          params: { gender: user?.gender_interest }
        });
        setGenderedUsers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getGenderedUsers();
  }, [user]);


  console.log('user', user);
  console.log('genderedUsers', genderedUsers);

  const characters = [
    { name: 'Danny', url: 'https://www.asiamediajournal.com/wp-content/uploads/2022/11/Free-Download-KIRBY-PFP-1392x1392.jpg' },
    { name: 'LORD VOLDEMORT', url: 'https://i.pinimg.com/736x/9e/64/ef/9e64efec4873a804696219231eb149ed.jpg' },
    { name: 'Mister fresh', url: 'https://i.pinimg.com/originals/31/c9/1b/31c91b68fe5cdece0ab63c6337ae6929.png' },
    { name: 'Kate', url: 'https://i.pinimg.com/originals/5e/8a/78/5e8a78dda2c2163bfbda5f086183d19b.jpg' },
    { name: 'kerobero', url: 'https://comicvine.gamespot.com/a/uploads/scale_medium/11112/111121983/7181498-5675041594-latest' }
  ];

  
  const updateMatches = async (matchedUserId) => {
    try {
        await axios.put('http://localhost:8000/addmatch', {
            userId,
            matchedUserId
        })
        getUser()
    } catch (err) {
        console.log(err)
    }
}
  
  
  
  
  const swiped = (direction, swipedUserId) => {
    if (direction === 'right') {
        updateMatches(swipedUserId)
    }
    setLastDirection(direction)
}


  const outOfFrame = (name) => {
    console.log(name + ' left the screen!');
  };

  const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId)





  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
            <div className="card-container">
              {characters.map((character) => (
                <TinderCard
                  className="swipe"
                  key={character.name}
                  onSwipe={(dir) => swiped(dir, character.name)}
                  onCardLeftScreen={() => outOfFrame(character.name)}
                >
                  <div style={{ backgroundImage: 'url(' + character.url + ')' }} className="card">
                    <h3>{character.name}</h3>
                  </div>
                </TinderCard>
              ))}
              <div className="swipe-info">{lastDirection ? <p>You swiped {lastDirection}</p> : <p />}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

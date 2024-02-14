import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ user }) => {
    const [cookies, , removeCookie] = useCookies(['UserId', 'AuthToken']);
    const navigate = useNavigate(); // Get the navigate function

    const logout = () => {
        removeCookie('UserId');
        removeCookie('AuthToken');
        // Redirect to the home page or another appropriate page
        navigate('/');
    };

    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src={user.url} alt={"photo of " + user.first_name} />
                </div>
                <h3>{user.first_name}</h3>
            </div>
            <i className="log-out-icon" onClick={logout}>⇦</i>
        </div>
    );
};

export default ChatHeader;

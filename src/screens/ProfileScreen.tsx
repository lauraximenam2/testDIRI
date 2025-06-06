// src/screens/ProfileScreen.tsx
import React, { useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import {
    FiUser, FiCalendar,
    FiChevronRight, FiLogOut,
} from 'react-icons/fi';
import { useAuthContext } from '../contexts/AuthContext'; 
import { signOut } from 'firebase/auth'; 
import { auth } from '../../firebase-config'; 
import { FormattedMessage, useIntl } from 'react-intl'; 
import logger from '../services/logging'; 

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuthContext(); // Obtenemos currentUser y authLoading
  const intl = useIntl();


  useEffect(() => {
    if (currentUser) {
    } else if (!authLoading) {
      navigate('/login'); 
    }
    return () => {
    };
  }, [currentUser, authLoading, navigate]);


  const handleLogout = async () => { // Convertir a async
    const confirmLogout = window.confirm(intl.formatMessage({ id: "profile.logoutConfirm" }));
    if (confirmLogout) {
      try {
        await signOut(auth);
        navigate('/login');
      } catch (error) {       
        alert(intl.formatMessage({ id: "profile.logoutError" }));
      }
    } 

  };


  const profileOptions = [
    { labelId: 'profile.myBookings', path: '/bookings', icon: FiCalendar },
  ];

  if (authLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="w-12 h-12 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const userName = currentUser.displayName || currentUser.email?.split('@')[0] || intl.formatMessage({id: "general.userFallbackName"});
  const userEmail = currentUser.email || intl.formatMessage({ id: "profile.emailUnavailable" }); 
  const userAvatar = currentUser.photoURL;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-16">
   
      <main className="flex-grow p-4 sm:p-6 space-y-6 md:space-y-8">
        <section className="flex flex-col items-center p-6 space-y-4 text-center bg-white border border-gray-200 rounded-xl shadow-lg sm:flex-row sm:text-left sm:space-y-0 sm:space-x-6">
          <div className="relative flex-shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={intl.formatMessage({ id: "profile.avatarAlt" }, { name: userName })}
                className="object-cover w-20 h-20 rounded-full shadow-md sm:w-24 sm:h-24 ring-2 ring-offset-2 ring-primary"
              />
            ) : (
              <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full shadow-md sm:w-24 sm:h-24 ring-2 ring-offset-1 ring-gray-300">
                <FiUser size={36} className="text-gray-500 sm:size-44" /> 
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <h2 className="text-xl font-bold text-gray-800 truncate sm:text-2xl">{userName}</h2>
            <p className="text-sm text-gray-600 truncate sm:text-base">{userEmail}</p>
          </div>
        </section>

        <nav className="bg-white border border-gray-200 rounded-lg shadow-md">
          {profileOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <Link
                key={option.path}
                to={option.path}
                onClick={() => logger.info(`ProfileScreen: Navegando a ${option.path}`, { bookingData: {} as Omit<any, "id" | "bookedAt" | "status"> })}
                className={`flex items-center justify-between p-4 text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-primary focus:outline-none focus-visible:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary
                            ${index < profileOptions.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent size={20} className="text-gray-500" />
                  <span className="font-medium"><FormattedMessage id={option.labelId} /></span>
                </div>
                <FiChevronRight size={20} className="text-gray-400" />
              </Link>
            );
          })}
        </nav>

        <div className="pt-4">
          <Button
            variant="error"
            fullWidth
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 shadow hover:shadow-md"
          >
            <FiLogOut size={18} />
            <span><FormattedMessage id="profile.logoutButton" /></span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;
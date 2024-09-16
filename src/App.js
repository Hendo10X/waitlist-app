import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyBXZkJSHpJcIMXZjWG8u931BBMBFIQYBkk",
  authDomain: "capsule-waitlist.firebaseapp.com",
  projectId: "capsule-waitlist",
  storageBucket: "capsule-waitlist.appspot.com",
  messagingSenderId: "256196982139",
  appId: "1:256196982139:web:de89a545c2ebcbbb0ab9de",
  measurementId: "G-Z58DL101CW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const UNSPLASH_ACCESS_KEY = 'oXdBmyHy758LmSwMBA_8RN9VQJrWjzez_rmZ8rvBhVs'; // Replace with your Unsplash access key

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=space&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        setBackgroundImage(data.urls.full);
      } catch (error) {
        console.error('Error fetching background image:', error);
      }
    };

    fetchBackgroundImage();
    const intervalId = setInterval(fetchBackgroundImage, 60000); // Fetch new image every minute

    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const q = query(collection(db, "waitlist"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await addDoc(collection(db, "waitlist"), { email });
        toast.success("You have joined!");
        setEmail('');
      } else {
        toast.warning("Email already added.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
      {/* Background image */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" />
      
      {/* Content */}
      <motion.div 
        className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-md space-y-8">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.div 
              className="mt-3 px-3 py-2 bg-blue-100 rounded-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
            >
              <span className="text-blue-500 text-sm font-medium">coming soon</span>
            </motion.div>
            <motion.h2 
              className="mt-6 text-center text-5xl font-bold text-white font-Soria"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              TIME TRAVEL AWAITS
            </motion.h2>
            <motion.p 
              className="mt-2 text-center text-gray-200 max-w-sm font-Inter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Be among the first to experience the future of time travel. Join our waitlist and unlock the power of time capsules. Your journey begins here.
            </motion.p>
          </motion.div>
          <motion.form 
            className="mt-8 space-y-6 font-Spline" 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 font-Spline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? 'Submitting...' : 'Join waitlist'}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
}
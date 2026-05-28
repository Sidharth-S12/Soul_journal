<<<<<<< HEAD
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp
=======
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    serverTimestamp
>>>>>>> 1242b10 (pages updated)
} from 'firebase/firestore';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';

// Get current user ID
const getCurrentUserId = () => {
<<<<<<< HEAD
  const auth = getAuth();
  return auth.currentUser?.uid;
=======
    const auth = getAuth();
    return auth.currentUser?.uid;
>>>>>>> 1242b10 (pages updated)
};

/**
 * Save a new trade to Firestore
 */
export const saveTrade = async (tradeData) => {
<<<<<<< HEAD
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Validate required fields
    if (!tradeData.instrument || !tradeData.entryPrice) {
      throw new Error('Missing required fields: instrument, entryPrice');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    
    const tradeDocument = {
      ...tradeData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(tradesCollection, tradeDocument);
    console.log('Trade saved with ID:', docRef.id);
    
    return {
      success: true,
      id: docRef.id,
      data: tradeDocument
    };
  } catch (error) {
    console.error('Error saving trade:', error);
    throw error;
  }
=======
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        // Validate required fields
        if (!tradeData.instrument || !tradeData.entryPrice) {
            throw new Error('Missing required fields: instrument, entryPrice');
        }

        const tradesCollection = collection(db, 'users', userId, 'trades');

        const tradeDocument = {
            ...tradeData,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(tradesCollection, tradeDocument);
        console.log('Trade saved with ID:', docRef.id);

        return {
            success: true,
            id: docRef.id,
            data: tradeDocument
        };
    } catch (error) {
        console.error('Error saving trade:', error);
        throw error;
    }
>>>>>>> 1242b10 (pages updated)
};

/**
 * Get all trades for current user
 */
export const getAllTrades = async () => {
<<<<<<< HEAD
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    const snapshot = await getDocs(tradesCollection);
    
    const trades = [];
    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return trades;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
=======
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const tradesCollection = collection(db, 'users', userId, 'trades');
        const snapshot = await getDocs(tradesCollection);

        const trades = [];
        snapshot.forEach((doc) => {
            trades.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return trades;
    } catch (error) {
        console.error('Error fetching trades:', error);
        throw error;
    }
>>>>>>> 1242b10 (pages updated)
};

/**
 * Update a trade
 */
export const updateTrade = async (tradeId, updatedData) => {
<<<<<<< HEAD
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradeRef = doc(db, 'users', userId, 'trades', tradeId);
    
    await updateDoc(tradeRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });

    console.log('Trade updated:', tradeId);
    return { success: true, id: tradeId };
  } catch (error) {
    console.error('Error updating trade:', error);
    throw error;
  }
=======
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const tradeRef = doc(db, 'users', userId, 'trades', tradeId);

        await updateDoc(tradeRef, {
            ...updatedData,
            updatedAt: serverTimestamp()
        });

        console.log('Trade updated:', tradeId);
        return { success: true, id: tradeId };
    } catch (error) {
        console.error('Error updating trade:', error);
        throw error;
    }
>>>>>>> 1242b10 (pages updated)
};

/**
 * Delete a trade
 */
export const deleteTrade = async (tradeId) => {
<<<<<<< HEAD
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradeRef = doc(db, 'users', userId, 'trades', tradeId);
    await deleteDoc(tradeRef);

    console.log('Trade deleted:', tradeId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting trade:', error);
    throw error;
  }
=======
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const tradeRef = doc(db, 'users', userId, 'trades', tradeId);
        await deleteDoc(tradeRef);

        console.log('Trade deleted:', tradeId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting trade:', error);
        throw error;
    }
>>>>>>> 1242b10 (pages updated)
};

/**
 * Get trades filtered by date range
 */
export const getTradesByDateRange = async (startDate, endDate) => {
<<<<<<< HEAD
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    const q = query(
      tradesCollection,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    );

    const snapshot = await getDocs(q);
    const trades = [];
    
    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return trades;
  } catch (error) {
    console.error('Error fetching trades by date:', error);
    throw error;
  }
=======
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const tradesCollection = collection(db, 'users', userId, 'trades');
        const q = query(
            tradesCollection,
            where('createdAt', '>=', startDate),
            where('createdAt', '<=', endDate)
        );

        const snapshot = await getDocs(q);
        const trades = [];

        snapshot.forEach((doc) => {
            trades.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return trades;
    } catch (error) {
        console.error('Error fetching trades by date:', error);
        throw error;
    }
>>>>>>> 1242b10 (pages updated)
};

/**
 * Get trades by result (Win/Loss)
 */
export const getTradesByResult = async (result) => {
<<<<<<< HEAD
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    const q = query(tradesCollection, where('result', '==', result));

    const snapshot = await getDocs(q);
    const trades = [];
    
    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return trades;
  } catch (error) {
    console.error('Error fetching trades by result:', error);
    throw error;
  }
};

export default {
  saveTrade,
  getAllTrades,
  updateTrade,
  deleteTrade,
  getTradesByDateRange,
  getTradesByResult
=======
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const tradesCollection = collection(db, 'users', userId, 'trades');
        const q = query(tradesCollection, where('result', '==', result));

        const snapshot = await getDocs(q);
        const trades = [];

        snapshot.forEach((doc) => {
            trades.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return trades;
    } catch (error) {
        console.error('Error fetching trades by result:', error);
        throw error;
    }
};

export default {
    saveTrade,
    getAllTrades,
    updateTrade,
    deleteTrade,
    getTradesByDateRange,
    getTradesByResult
>>>>>>> 1242b10 (pages updated)
};

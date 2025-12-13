// ============================================
// NEXUS TECH - FIREBASE CONFIGURATION
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp, Timestamp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBt0RLkHSe0R5164VsaT93Hb-T_nTUw1AY",
    authDomain: "nexus-tech-ds-website.firebaseapp.com",
    projectId: "nexus-tech-ds-website",
    storageBucket: "nexus-tech-ds-website.firebasestorage.app",
    messagingSenderId: "477aborting856636",
    appId: "1:477856636:web:nexustech"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// ============================================
// AUTH FUNCTIONS
// ============================================

// Check if user is admin
async function isAdmin(uid) {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() && userDoc.data().role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Get current user data
async function getCurrentUserData() {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            return { uid: user.uid, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

// Create or update user profile
async function createUserProfile(user, additionalData = {}) {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        const { email, displayName, photoURL } = user;
        const createdAt = serverTimestamp();
        
        try {
            await setDoc(userRef, {
                email,
                displayName: displayName || additionalData.name || '',
                photoURL: photoURL || '',
                role: 'client', // Default role
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.error('Error creating user profile:', error);
        }
    }
    
    return userRef;
}

// ============================================
// CLIENT FUNCTIONS
// ============================================

// Get all clients (admin only)
async function getAllClients() {
    try {
        const q = query(collection(db, 'users'), where('role', '==', 'client'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting clients:', error);
        return [];
    }
}

// Add new client (admin only)
async function addClient(clientData) {
    try {
        const docRef = await addDoc(collection(db, 'users'), {
            ...clientData,
            role: 'client',
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding client:', error);
        throw error;
    }
}

// Update client
async function updateClient(clientId, data) {
    try {
        await updateDoc(doc(db, 'users', clientId), {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    }
}

// ============================================
// PROJECT FUNCTIONS
// ============================================

// Get all projects (admin)
async function getAllProjects() {
    try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting projects:', error);
        return [];
    }
}

// Get projects for specific client
async function getClientProjects(clientId) {
    try {
        const q = query(collection(db, 'projects'), where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting client projects:', error);
        return [];
    }
}

// Create project
async function createProject(projectData) {
    try {
        const docRef = await addDoc(collection(db, 'projects'), {
            ...projectData,
            status: projectData.status || 'pending',
            progress: projectData.progress || 0,
            milestones: projectData.milestones || [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

// Update project
async function updateProject(projectId, data) {
    try {
        await updateDoc(doc(db, 'projects', projectId), {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}

// Delete project
async function deleteProject(projectId) {
    try {
        await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}

// ============================================
// MESSAGE FUNCTIONS
// ============================================

// Get messages for a project or conversation
async function getMessages(conversationId) {
    try {
        const q = query(
            collection(db, 'messages'),
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'asc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting messages:', error);
        return [];
    }
}

// Send message
async function sendMessage(messageData) {
    try {
        const docRef = await addDoc(collection(db, 'messages'), {
            ...messageData,
            createdAt: serverTimestamp(),
            read: false
        });
        return docRef.id;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

// Get all conversations (admin)
async function getAllConversations() {
    try {
        const q = query(collection(db, 'conversations'), orderBy('lastMessageAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting conversations:', error);
        return [];
    }
}

// Get or create conversation
async function getOrCreateConversation(clientId, clientName) {
    try {
        // Check if conversation exists
        const q = query(collection(db, 'conversations'), where('clientId', '==', clientId));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        }
        
        // Create new conversation
        const docRef = await addDoc(collection(db, 'conversations'), {
            clientId,
            clientName,
            lastMessage: '',
            lastMessageAt: serverTimestamp(),
            unreadCount: 0,
            createdAt: serverTimestamp()
        });
        
        return { id: docRef.id, clientId, clientName };
    } catch (error) {
        console.error('Error with conversation:', error);
        throw error;
    }
}

// ============================================
// FILE FUNCTIONS
// ============================================

// Upload file
async function uploadFile(file, path, metadata = {}) {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file, { customMetadata: metadata });
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Save file info to Firestore
        const fileDoc = await addDoc(collection(db, 'files'), {
            name: file.name,
            path: path,
            url: downloadURL,
            size: file.size,
            type: file.type,
            ...metadata,
            createdAt: serverTimestamp()
        });
        
        return { id: fileDoc.id, url: downloadURL, name: file.name };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

// Get files for project
async function getProjectFiles(projectId) {
    try {
        const q = query(collection(db, 'files'), where('projectId', '==', projectId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting project files:', error);
        return [];
    }
}

// Get files for client
async function getClientFiles(clientId) {
    try {
        const q = query(collection(db, 'files'), where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting client files:', error);
        return [];
    }
}

// Delete file
async function deleteFile(fileId, filePath) {
    try {
        // Delete from Storage
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
        
        // Delete from Firestore
        await deleteDoc(doc(db, 'files', fileId));
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
}

// ============================================
// RESOURCE FUNCTIONS (How-to videos, PDFs)
// ============================================

// Get all resources
async function getAllResources() {
    try {
        const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting resources:', error);
        return [];
    }
}

// Add resource (admin only)
async function addResource(resourceData, file) {
    try {
        let url = resourceData.url || '';
        
        // If file is provided, upload it
        if (file) {
            const path = `resources/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            url = await getDownloadURL(snapshot.ref);
        }
        
        const docRef = await addDoc(collection(db, 'resources'), {
            ...resourceData,
            url,
            createdAt: serverTimestamp()
        });
        
        return docRef.id;
    } catch (error) {
        console.error('Error adding resource:', error);
        throw error;
    }
}

// Delete resource
async function deleteResource(resourceId, resourcePath) {
    try {
        if (resourcePath) {
            const storageRef = ref(storage, resourcePath);
            await deleteObject(storageRef);
        }
        await deleteDoc(doc(db, 'resources', resourceId));
    } catch (error) {
        console.error('Error deleting resource:', error);
        throw error;
    }
}

// ============================================
// SITE CONFIG FUNCTIONS (Website Images)
// ============================================

// Get site config
async function getSiteConfig() {
    try {
        const docSnap = await getDoc(doc(db, 'config', 'site'));
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting site config:', error);
        return null;
    }
}

// Update site image
async function updateSiteImage(imageKey, file) {
    try {
        const path = `site-images/${imageKey}`;
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        
        // Update config
        await setDoc(doc(db, 'config', 'site'), {
            [imageKey]: url,
            [`${imageKey}UpdatedAt`]: serverTimestamp()
        }, { merge: true });
        
        return url;
    } catch (error) {
        console.error('Error updating site image:', error);
        throw error;
    }
}

// ============================================
// PAYMENT FUNCTIONS (Stripe)
// ============================================

// Get invoices for client
async function getClientInvoices(clientId) {
    try {
        const q = query(collection(db, 'invoices'), where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting invoices:', error);
        return [];
    }
}

// Create invoice (admin)
async function createInvoice(invoiceData) {
    try {
        const docRef = await addDoc(collection(db, 'invoices'), {
            ...invoiceData,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating invoice:', error);
        throw error;
    }
}

// ============================================
// SERVICE BOOKING FUNCTIONS
// ============================================

// Get all bookings
async function getAllBookings() {
    try {
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting bookings:', error);
        return [];
    }
}

// Create booking
async function createBooking(bookingData) {
    try {
        const docRef = await addDoc(collection(db, 'bookings'), {
            ...bookingData,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

// Get notifications for user
async function getUserNotifications(userId) {
    try {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(20)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
}

// Create notification
async function createNotification(notificationData) {
    try {
        await addDoc(collection(db, 'notifications'), {
            ...notificationData,
            read: false,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

// Mark notification as read
async function markNotificationRead(notificationId) {
    try {
        await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    } catch (error) {
        console.error('Error marking notification read:', error);
    }
}

// ============================================
// EXPORTS
// ============================================

export {
    // Firebase instances
    app, auth, db, storage, googleProvider,
    
    // Auth
    onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    sendPasswordResetEmail, signInWithPopup, updateProfile,
    isAdmin, getCurrentUserData, createUserProfile,
    
    // Firestore helpers
    collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, onSnapshot, serverTimestamp, Timestamp,
    
    // Storage helpers
    ref, uploadBytes, getDownloadURL, deleteObject, listAll,
    
    // Clients
    getAllClients, addClient, updateClient,
    
    // Projects
    getAllProjects, getClientProjects, createProject, updateProject, deleteProject,
    
    // Messages
    getMessages, sendMessage, getAllConversations, getOrCreateConversation,
    
    // Files
    uploadFile, getProjectFiles, getClientFiles, deleteFile,
    
    // Resources
    getAllResources, addResource, deleteResource,
    
    // Site Config
    getSiteConfig, updateSiteImage,
    
    // Payments
    getClientInvoices, createInvoice,
    
    // Bookings
    getAllBookings, createBooking,
    
    // Notifications
    getUserNotifications, createNotification, markNotificationRead
};

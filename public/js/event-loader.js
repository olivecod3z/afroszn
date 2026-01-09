// Load event data from Firebase
import { db, doc, getDoc } from './firebase-config.js';

// Get event ID from URL parameter
function getEventIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('eventId') || 'event_001'; // Default fallback
}

// Fetch event data from Firestore
async function loadEventData() {
    try {
        const eventId = getEventIdFromURL();
        
        // Fetch from Firestore
        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);
        
        if (!eventSnap.exists()) {
            console.error('Event not found');
            return null;
        }
        
        const eventData = eventSnap.data();
        eventData.eventId = eventId; // Add the ID
        
        return eventData;
        
    } catch (error) {
        console.error('Error loading event:', error);
        return null;
    }
}

// Display event on page
async function displayEvent() {
    const eventData = await loadEventData();
    
    if (!eventData) {
        alert('Event not found');
        return;
    }
    
    // Update page with event data
    document.querySelector('.event-hero-title').textContent = eventData.eventName;
    document.querySelector('.event-title').textContent = eventData.eventName;
    document.querySelector('.event-date').textContent = eventData.eventDate;
    document.querySelector('.location-info').textContent = eventData.location;
    document.querySelector('.description').textContent = eventData.description;
    
    // Update ticket prices
    const ticketTypes = eventData.ticketTypes;
    const earlyBird = ticketTypes.find(t => t.name === 'Early Bird');
    const regular = ticketTypes.find(t => t.name === 'Regular');
    const vip = ticketTypes.find(t => t.name === 'VIP');
    
    // Store in global variable for ticketcard.js to use
    window.currentEvent = eventData;
    
    console.log('Event loaded:', eventData);
}

// Run when page loads
document.addEventListener('DOMContentLoaded', displayEvent);

export { loadEventData, getEventIdFromURL };
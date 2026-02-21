/**
 * CloudAlertService - Modular service for creating and managing cloud alerts
 * 
 * Handles:
 * - Alert creation with retry (3 attempts)
 * - Specific error classification
 * - Location validation
 * - Detailed logging
 */

import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Classifies Firebase errors into user-friendly messages
 */
function classifyError(error) {
    const code = error?.code || '';
    const message = error?.message || String(error);

    console.error("[CloudAlertService] Raw error code:", code, "message:", message);

    if (code === 'permission-denied' || code === 'PERMISSION_DENIED') {
        return "Cloud write permission denied. Please check Firestore security rules and ensure they are deployed.";
    }
    if (code === 'unauthenticated' || code === 'UNAUTHENTICATED') {
        return "Authentication failed. Please refresh the page and try again.";
    }
    if (code === 'not-found' || code === 'NOT_FOUND') {
        return "Firestore database not found. Please ensure Firestore is enabled in Firebase Console.";
    }
    if (code === 'unavailable' || code === 'UNAVAILABLE') {
        return "Database connection error. Please check your internet connection.";
    }
    if (code === 'resource-exhausted' || code === 'RESOURCE_EXHAUSTED') {
        return "Database quota exceeded. Please try again later.";
    }
    if (code === 'failed-precondition' || code === 'FAILED_PRECONDITION') {
        return "Firestore not initialized. Please create a Firestore database in Firebase Console.";
    }
    if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('network')) {
        return "Network error. Please check your internet connection and try again.";
    }
    if (message.includes('Missing or insufficient permissions')) {
        return "Cloud write permission denied. Deploy Firestore rules: firebase deploy --only firestore:rules";
    }

    return `Cloud alert error: ${message}`;
}

/**
 * Validates location data before sending to Firestore
 */
function validateLocation(locData) {
    if (!locData) return { valid: false, error: "Location missing" };
    if (typeof locData.lat !== 'number' || typeof locData.lng !== 'number') {
        return { valid: false, error: "Location data invalid (lat/lng must be numbers)" };
    }
    if (locData.lat < -90 || locData.lat > 90) {
        return { valid: false, error: "Invalid latitude value" };
    }
    if (locData.lng < -180 || locData.lng > 180) {
        return { valid: false, error: "Invalid longitude value" };
    }
    return { valid: true };
}

/**
 * Creates a cloud alert with retry mechanism (max 3 attempts)
 * 
 * @param {string} sessionId - Unique session identifier
 * @param {object} locData - Location object { lat, lng, accuracy? }
 * @param {Function} onStatusChange - Callback for status updates
 * @returns {Promise<{success: boolean, alertId?: string, error?: string}>}
 */
export async function createCloudAlert(sessionId, locData, onStatusChange) {
    console.log("[CloudAlertService] Creating cloud alert...", { sessionId, locData });

    // Validate inputs
    if (!sessionId) {
        return { success: false, error: "Session ID missing. Please refresh and try again." };
    }

    const locationCheck = validateLocation(locData);
    if (!locationCheck.valid) {
        console.error("[CloudAlertService] Location validation failed:", locationCheck.error);
        // Allow alert creation even with bad location - use "Unavailable" marker
        console.warn("[CloudAlertService] Proceeding with location marked as unavailable");
    }

    const alertData = {
        sessionId,
        status: 'SOS',
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        expiresAt: (() => {
            const d = new Date();
            d.setHours(d.getHours() + 2);
            return d;
        })(),
        location: locationCheck.valid ? locData : { lat: 0, lng: 0, unavailable: true }
    };

    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            if (attempt > 1) {
                console.log(`[CloudAlertService] Retry attempt ${attempt}/3...`);
                if (onStatusChange) {
                    onStatusChange(`Alert temporarily failed. Retrying... (${attempt}/3)`);
                }
                // Wait before retry (exponential backoff: 1s, 2s)
                await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            } else {
                if (onStatusChange) {
                    onStatusChange("Creating cloud alert...");
                }
            }

            console.log(`[CloudAlertService] Attempt ${attempt}/3 - writing to Firestore...`);
            const docRef = await addDoc(collection(db, 'alerts'), alertData);

            console.log(`[CloudAlertService] SUCCESS! Alert created with ID: ${docRef.id}`);
            return { success: true, alertId: docRef.id };

        } catch (err) {
            lastError = err;
            console.error(`[CloudAlertService] Attempt ${attempt}/3 failed:`, {
                code: err?.code || null,
                message: err?.message || String(err),
                name: err?.name || null
            });

            // Don't retry on permission/auth errors - they won't change
            const code = err?.code || '';
            if (
                code === 'permission-denied' ||
                code === 'PERMISSION_DENIED' ||
                code === 'unauthenticated' ||
                code === 'UNAUTHENTICATED' ||
                code === 'failed-precondition' ||
                code === 'FAILED_PRECONDITION'
            ) {
                console.error("[CloudAlertService] Non-retryable error, aborting retries");
                break;
            }
        }
    }

    const errorMessage = classifyError(lastError);
    const debug = {
        code: lastError?.code || null,
        message: lastError?.message || String(lastError),
        name: lastError?.name || null
    };
    console.error("[CloudAlertService] All attempts failed. Final error:", errorMessage, "Debug:", debug);
    return { success: false, error: errorMessage, debug };
}

export default { createCloudAlert };

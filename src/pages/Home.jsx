import { useState, useEffect, useRef } from 'react';
import { db } from "../firebase";
import { updateDoc, doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import SOSButton from '../components/SOSButton';
import StatusBadge from '../components/StatusBadge';
import { createCloudAlert } from '../services/CloudAlertService';

export default function Home({ user }) {
    const [status, setStatus] = useState('Idle');
    const [location, setLocation] = useState(null);
    const [errorObj, setErrorObj] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [sosStatus, setSosStatus] = useState(null);
    const [alertId, setAlertId] = useState(null);
    const [watchId, setWatchId] = useState(null);
    const alertIdRef = useRef(null);
    const navigate = useNavigate();
    const showDebugErrorDetails = import.meta.env.DEV || import.meta.env.VITE_SOS_DEBUG === 'true';

    // Background location tracking for nearby-users feature
    useEffect(() => {
        if (!user || !navigator.geolocation) return;

        const id = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    await setDoc(doc(db, 'users', user.uid), {
                        location: { lat: latitude, lng: longitude },
                        lastActive: serverTimestamp()
                    }, { merge: true });
                    console.log("[LocationTracker] Updated user location:", latitude, longitude);
                } catch (err) {
                    console.error("[LocationTracker] Error updating user location:", err);
                }
            },
            (err) => console.log("[LocationTracker] Background location info:", err.message),
            { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 }
        );

        return () => navigator.geolocation.clearWatch(id);
    }, [user]);

    // Helper: send SMS via triggerSos with retry (max 3 attempts)
    const callTriggerSos = async (uid, lat, lng) => {
        const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
        const baseUrl = import.meta.env.DEV
            ? `http://127.0.0.1:5001/${projectId}/us-central1`
            : `https://us-central1-${projectId}.cloudfunctions.net`;

        const payload = {
            uid,
            lat,
            lng,
            timestamp: new Date().toISOString()
        };

        let lastError = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`[SOS] SMS attempt ${attempt}/3...`);
                setSosStatus(attempt > 1 ? `SMS sending failed. Retrying... (${attempt}/3)` : "Sending Alert...");

                const response = await fetch(`${baseUrl}/triggerSos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                console.log("[SOS] triggerSos response:", result);

                if (response.ok) {
                    return { success: true, result };
                } else {
                    lastError = result.error || `HTTP ${response.status}`;
                    console.error(`[SOS] Attempt ${attempt} failed:`, lastError);
                }
            } catch (err) {
                lastError = err.message;
                console.error(`[SOS] Attempt ${attempt} network error:`, err);
            }
        }
        return { success: false, error: lastError };
    };

    const handleSOS = async () => {
        if (status === 'SOS') return;
        console.log("[SOS] SOS button clicked!");

        if (!navigator.geolocation) {
            setErrorObj('Geolocation is not supported by your browser.');
            return;
        }

        setStatus('SOS');
        setErrorObj(null);
        setSuccessMsg(null);
        setSosStatus("Fetching Location...");

        const sessionId = uuidv4();

        const id = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const locData = { lat: latitude, lng: longitude, accuracy };
                setLocation(locData);
                console.log("[SOS] Location fetched:", latitude, longitude, "accuracy:", accuracy);

                // First time alert creation (use ref to prevent race condition)
                if (!alertIdRef.current) {
                    alertIdRef.current = 'pending';
                    setSosStatus("Creating cloud alert...");

                    const alertResult = await createCloudAlert(sessionId, locData, (statusMsg) => {
                        setSosStatus(statusMsg);
                    });

                    if (alertResult.success) {
                        alertIdRef.current = alertResult.alertId;
                        setAlertId(alertResult.alertId);
                        console.log("[SOS] Alert created with ID:", alertResult.alertId);

                        // Trigger Cloud Function for SMS with retry
                        const uid = user ? user.uid : 'anonymous';
                        const smsResult = await callTriggerSos(uid, latitude, longitude);

                        if (smsResult.success) {
                            setSosStatus(null);
                            setSuccessMsg("Emergency Alert Created Successfully");
                            console.log("[SOS] SMS sent successfully!");
                        } else {
                            setSosStatus(null);
                            setSuccessMsg("Emergency Alert Created Successfully");
                            setErrorObj("Note: SMS delivery failed. Alert is still active. Error: " + smsResult.error);
                            console.error("[SOS] SMS failed but alert is active:", smsResult.error);
                        }
                    } else {
                        console.error("[SOS] Cloud alert creation failed:", alertResult.error, alertResult.debug || null);
                        const message = showDebugErrorDetails && alertResult?.debug?.code
                            ? `${alertResult.error} (code: ${alertResult.debug.code})`
                            : alertResult.error;
                        setErrorObj(message);
                        setSosStatus(null);
                        alertIdRef.current = null;
                    }
                } else if (alertIdRef.current !== 'pending') {
                    // Update location
                    try {
                        await updateDoc(doc(db, 'alerts', alertIdRef.current), {
                            location: locData,
                            lastUpdated: serverTimestamp()
                        });
                    } catch (err) {
                        console.error('[SOS] Failed to update location', err);
                    }
                }
            },
            async (err) => {
                console.error("[SOS] GPS Error:", err.message);

                // Fallback: try to use last known location from Firestore
                if (user) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        if (userDoc.exists() && userDoc.data().location) {
                            const lastLoc = userDoc.data().location;
                            setLocation(lastLoc);
                            setErrorObj('GPS unavailable. Using last known location.');
                            console.log("[SOS] Using last known location:", lastLoc);

                            if (!alertIdRef.current) {
                                alertIdRef.current = 'pending';
                                setSosStatus("Creating cloud alert...");

                                const alertResult = await createCloudAlert(sessionId, lastLoc, (statusMsg) => {
                                    setSosStatus(statusMsg);
                                });

                                if (alertResult.success) {
                                    alertIdRef.current = alertResult.alertId;
                                    setAlertId(alertResult.alertId);

                                    const smsResult = await callTriggerSos(user.uid, lastLoc.lat, lastLoc.lng);
                                    if (smsResult.success) {
                                        setSosStatus(null);
                                        setSuccessMsg("Emergency Alert Created Successfully (using last known location)");
                                    } else {
                                        setSosStatus(null);
                                        setSuccessMsg("Emergency Alert Created Successfully (using last known location)");
                                        setErrorObj("Note: SMS delivery failed. Error: " + smsResult.error);
                                    }
                                } else {
                                    console.error("[SOS] Cloud alert creation failed (fallback location):", alertResult.error, alertResult.debug || null);
                                    const message = showDebugErrorDetails && alertResult?.debug?.code
                                        ? `${alertResult.error} (code: ${alertResult.debug.code})`
                                        : alertResult.error;
                                    setErrorObj(message);
                                    setSosStatus(null);
                                    alertIdRef.current = null;
                                }
                            }
                            return;
                        }
                    } catch (fetchErr) {
                        console.error("[SOS] Failed to fetch last known location:", fetchErr);
                    }
                }

                setErrorObj(`GPS Error: ${err.message}. No fallback location available.`);
                setStatus('Idle');
                setSosStatus(null);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
        setWatchId(id);
    };

    const handleStop = async () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }

        setStatus('SAFE');
        setSosStatus(null);
        if (alertIdRef.current && alertIdRef.current !== 'pending') {
            try {
                await updateDoc(doc(db, 'alerts', alertIdRef.current), {
                    status: 'SAFE',
                    endedAt: serverTimestamp()
                });
            } catch (err) {
                console.error('Failed to update safe status', err);
            }
        }
    };

    return (
        <>
            <div className="header">
                <h1>Smart Disaster Router</h1>
                <StatusBadge status={status} />
            </div>

            <div className="main-content">
                <div className="privacy-statement">
                    🔒 Location shared only during active SOS.
                </div>

                {errorObj && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{errorObj}</div>}
                {successMsg && <div style={{ color: '#00ff88', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>✅ {successMsg}</div>}
                {sosStatus && <div style={{ color: '#ffaa00', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>⏳ {sosStatus}</div>}

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <button className="btn" onClick={() => navigate('/contacts')} style={{ background: '#444' }}>
                        Manage Emergency Contacts
                    </button>
                </div>

                {status === 'Idle' && (
                    <SOSButton onClick={handleSOS} disabled={false} />
                )}

                {status === 'SOS' && (
                    <>
                        <button className="btn btn-stop" onClick={handleStop}>Stop & Mark Safe</button>
                        {location && <MapView location={location} />}
                        {alertId && (
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                Tracking Link: <a href={`/track/${alertId}`}>/track/{alertId}</a>
                            </div>
                        )}
                    </>
                )}

                {status === 'SAFE' && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2>You are safe.</h2>
                        <p>Emergency tracking has been disabled.</p>
                        <button style={{ marginTop: '1rem' }} className="btn btn-stop" onClick={() => window.location.reload()}>Reset Defaults</button>
                    </div>
                )}
            </div>
        </>
    );
}

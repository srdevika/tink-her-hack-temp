import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';

export default function Track() {
    const { alertId } = useParams();
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!alertId) return;

        const unsub = onSnapshot(doc(db, 'alerts', alertId), (docSnap) => {
            setLoading(false);
            if (docSnap.exists()) {
                setAlert(docSnap.data());
            } else {
                setError('Alert not found.');
            }
        }, (err) => {
            console.error(err);
            setError('Failed to fetch tracking data.');
            setLoading(false);
        });

        return () => unsub();
    }, [alertId]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading tracking data...</div>;
    if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;
    if (!alert) return <div style={{ padding: '2rem', textAlign: 'center' }}>No data available.</div>;

    return (
        <>
            <div className="header">
                <h1>Emergency Tracker</h1>
                <StatusBadge status={alert.status} />
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    Alert ID: {alertId}
                </div>
            </div>

            <div className="main-content">
                {alert.status === 'EXPIRED' ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2>Alert Expired</h2>
                        <p>This tracking session is no longer active.</p>
                    </div>
                ) : (
                    alert.location && <MapView location={alert.location} />
                )}
                {alert.status === 'SAFE' && (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--secondary)' }}>
                        <strong>User has reported they are safe.</strong>
                    </div>
                )}
            </div>
        </>
    );
}

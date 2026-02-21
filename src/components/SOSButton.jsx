import { useState } from 'react';

export default function SOSButton({ onClick, disabled }) {
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!confirming) {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000); // reset after 3 seconds
            return;
        }

        setLoading(true);
        await onClick();
        setLoading(false);
        setConfirming(false);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <button
                className="btn btn-sos"
                onClick={handleClick}
                disabled={disabled || loading}
                aria-label="Send Emergency SOS"
                style={{
                    background: confirming ? '#ffaa00' : 'var(--danger-color)',
                    transform: confirming ? 'scale(1.05)' : 'scale(1)'
                }}
            >
                {loading ? 'Sending...' : confirming ? 'Click again to confirm' : 'SOS'}
            </button>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                {confirming ? 'Double check before sending!' : 'Press to send emergency alert and start tracking.'}
            </p>
        </div>
    );
}

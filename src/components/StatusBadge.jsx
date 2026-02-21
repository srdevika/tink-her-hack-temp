export default function StatusBadge({ status }) {
    let badgeClass = 'status-idle';

    switch (status) {
        case 'SOS':
            badgeClass = 'status-sos';
            break;
        case 'SAFE':
            badgeClass = 'status-safe';
            break;
        case 'EXPIRED':
            badgeClass = 'status-expired';
            break;
        default:
            badgeClass = 'status-idle';
    }

    return (
        <div className={`status-badge ${badgeClass}`}>
            {status}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function EmergencyContacts({ user }) {
    const [contacts, setContacts] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        fetchContacts();
    }, [user]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const q = query(
                collection(db, 'emergencyContacts'),
                where('uid', '==', user.uid)
            );
            const snapshot = await getDocs(q);
            const contactList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setContacts(contactList);
        } catch (err) {
            console.error("Error fetching contacts:", err);
            setError("Failed to load contacts. Please check Firestore rules.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!user) {
            setError("You must be logged in to add contacts.");
            return;
        }
        if (!name.trim() || !phone.trim()) {
            setError("Both name and phone number are required.");
            return;
        }

        // E.164 phone validation
        const cleanPhone = phone.replace(/\s+/g, '');
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(cleanPhone)) {
            setError("Invalid phone format. Use E.164 format: +<country code><number> (e.g., +911234567890)");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'emergencyContacts'), {
                uid: user.uid,
                name: name.trim(),
                phone: cleanPhone,
                createdAt: serverTimestamp()
            });
            setContacts([...contacts, { id: docRef.id, uid: user.uid, name: name.trim(), phone: cleanPhone }]);
            setName('');
            setPhone('');
            setSuccessMsg("Emergency Contact Saved Successfully");
            console.log("[EmergencyContacts] Contact saved:", { name: name.trim(), phone: cleanPhone });
        } catch (err) {
            console.error("Error adding contact:", err);
            setError("Failed to add contact. Error: " + err.message);
        }
    };

    const handleDeleteContact = async (id) => {
        try {
            setError(null);
            setSuccessMsg(null);
            await deleteDoc(doc(db, 'emergencyContacts', id));
            setContacts(contacts.filter(c => c.id !== id));
            setSuccessMsg("Contact deleted.");
        } catch (err) {
            console.error("Error deleting contact:", err);
            setError("Failed to delete contact.");
        }
    };

    if (!user) {
        return (
            <div className="main-content">
                <div className="header">
                    <h1>Emergency Contacts</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Authenticating... Please wait.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="header">
                <button className="btn" onClick={() => navigate('/')} style={{ marginBottom: '1rem', background: '#555' }}>
                    &larr; Back to Dashboard
                </button>
                <h1>Emergency Contacts</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage contacts who will receive your SOS alerts.</p>
            </div>

            {error && <div style={{ color: '#ff4444', textAlign: 'center', margin: '1rem 0', padding: '0.75rem', background: '#2a1010', borderRadius: '8px' }}>{error}</div>}
            {successMsg && <div style={{ color: '#00ff88', textAlign: 'center', margin: '1rem 0', padding: '0.75rem', background: '#0a2a10', borderRadius: '8px', fontWeight: 'bold' }}>✅ {successMsg}</div>}

            <div style={{ background: '#222', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h3>Add New Contact</h3>
                <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Contact Name (e.g., Mom)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', background: '#333', color: '#fff' }}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone (+911234567890)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', background: '#333', color: '#fff' }}
                        required
                    />
                    <button type="submit" className="btn btn-sos" style={{ padding: '0.8rem', fontSize: '1rem', height: 'auto', width: '100%', borderRadius: '8px' }}>
                        Add Contact
                    </button>
                </form>
            </div>

            <div style={{ background: '#222', padding: '1.5rem', borderRadius: '12px' }}>
                <h3>Your Contacts</h3>
                {loading ? (
                    <p style={{ marginTop: '1rem' }}>Loading...</p>
                ) : contacts.length === 0 ? (
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No emergency contacts added yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                        {contacts.map((c) => (
                            <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #444' }}>
                                <div>
                                    <strong>{c.name}</strong>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{c.phone}</div>
                                </div>
                                <button
                                    onClick={() => handleDeleteContact(c.id)}
                                    style={{ background: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

import { firebase } from '../firebase';

const API_BASE = (process.env.REACT_APP_VALUA_API_URL || '').replace(/\/$/, '');

export const PopertyService = {
    addProperty,
    getProperties,
    getPropertyById,
};

async function addProperty(address, name, email, phone, condition, urgency, coments, lat, lng) {
    const payload = {
        address: address || '',
        name: name || '',
        email: email || '',
        phone: phone || '',
        condition: condition || '',
        urgency: urgency || '',
        coments: coments || '',
        lat: Number(lat) || 0,
        lng: Number(lng) || 0,
    };

    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/properties`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const json = await res.json();
                return json.data || json;
            }
            console.warn(`[valua-api] POST /properties failed (${res.status}), falling back to Firestore.`);
        } catch (apiErr) {
            console.warn('[valua-api] Connection failed, falling back to Firestore:', apiErr.message);
        }
    }

    const db = firebase.firestore();
    return db.collection("Properties").add({
        ...payload,
        createdAt: new Date().toISOString()
    });
}

async function getProperties() {
    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/properties?limit=100`);
            if (res.ok) {
                const json = await res.json();
                return json.data || [];
            }
            console.warn(`[valua-api] GET /properties failed (${res.status}), falling back to Firestore.`);
        } catch (apiErr) {
            console.warn('[valua-api] Connection failed, falling back to Firestore:', apiErr.message);
        }
    }

    const db = firebase.firestore();
    const snapshot = await db.collection('Properties').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getPropertyById(id) {
    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/properties/${encodeURIComponent(id)}`);
            if (res.ok) {
                const json = await res.json();
                return json.data || null;
            }
            if (res.status === 404) return null;
        } catch (apiErr) {
            console.warn('[valua-api] Connection failed, falling back to Firestore:', apiErr.message);
        }
    }

    const db = firebase.firestore();
    const doc = await db.collection('Properties').doc(String(id)).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
}


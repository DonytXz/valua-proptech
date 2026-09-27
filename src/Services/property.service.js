import { firebase } from '../firebase';

export const PopertyService = {
    addProperty,
    getProperties,
    getPropertyById,
};

function addProperty(address, name, email, phone, condition, urgency, coments, lat, lng) {
    const db = firebase.firestore();
    const newProperty = {
        address: address || '',
        name: name || '',
        email: email || '',
        phone: phone || '',
        condition: condition || '',
        urgency: urgency || '',
        coments: coments || '',
        lat: Number(lat) || 0,
        lng: Number(lng) || 0,
        createdAt: new Date().toISOString()
    };

    return db.collection("Properties").add(newProperty);
}

async function getProperties() {
    const db = firebase.firestore();
    const snapshot = await db.collection('Properties').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getPropertyById(id) {
    const db = firebase.firestore();
    const doc = await db.collection('Properties').doc(String(id)).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
}

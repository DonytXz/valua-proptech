import React from 'react';
import { PropertyDetails } from '@/Components/PropertyDetails';
import { useLocation } from 'react-router-dom';

const Property = () => {
    const { state } = useLocation();
    let id = state;

    return (
        <div className="min-h-[calc(100vh-10rem)] bg-slate-50">
            <PropertyDetails id={id} />
        </div>
    );
};

export default Property;

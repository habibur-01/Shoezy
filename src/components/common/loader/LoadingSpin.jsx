import React from 'react';

const LoadingSpin = () => {
    return (
        <div className="flex items-center justify-center ">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpin;
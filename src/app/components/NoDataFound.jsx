'use client';

import Image from 'next/image';


const NoDataFound = ({ message = 'No Data Found' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] py-10 text-center">
            <Image
                src="/assets/images/nodatafound.svg" // ✅ Reference path from public folder
                alt="No Data"
                width={300}
                height={200}
                className="mb-6"
            />
            <h4 className="text-lg text-gray-500 font-medium">{message}</h4>
        </div>
    );
};

export default NoDataFound;

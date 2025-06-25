import { useCallback, useState } from "react";

const useGetEventsData = () => {
    const [isRFIFetching, setIsRFIFetching] = useState(false);
    const [isProductFetching, setIsProductFetching] = useState(false);

    const getRFIData = useCallback(async (offset, limit, rfiCallCount, cb) => {
        setIsRFIFetching(true);
        try {
            await fetch(`https://localhost:3000/getUsers?skip=${offset*limit}&limit=${limit}&usercount=${rfiCallCount}`);
            //const userData = await response.json();
            //console.log('response = ', JSON.parse(response));
            cb();
        } finally {
            setIsRFIFetching(false);
        }
    }, []);

    const getProductData = useCallback(async (offset, limit, productCallCount, cb) => {
        setIsProductFetching(true);
        try {
            await fetch(`https://localhost:3000/getProducts?skip=${offset*limit}&limit=${limit}&productcount=${productCallCount}`);
            cb();
        } finally {
            setIsProductFetching(false);
        }
    }, []);

    return { getRFIData, isRFIFetching, getProductData, isProductFetching }
};

export default useGetEventsData;
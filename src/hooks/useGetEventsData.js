import { useCallback, useState } from "react";
const API_URL = 'https://localhost:3000';

const useGetEventsData = () => {
    const [isRFIFetching, setIsRFIFetching] = useState(false);
    const [isSubmittalsFetching, setIsSubmittalsFetching] = useState(false);
    const [isProductFetching, setIsProductFetching] = useState(false);
    const [isIssuesFetching, setIsIssuesFetching] = useState(false);

    const getRFIData = useCallback(async (offset, limit, rfiCallCount, cb) => {
        setIsRFIFetching(true);
        try {
            await fetch(`${API_URL}/rfis?skip=${offset*limit}&limit=${limit}&usercount=${rfiCallCount}`);
            //const userData = await response.json();
            //console.log('response = ', JSON.parse(response));
            cb();
        } finally {
            setIsRFIFetching(false);
        }
    }, []);

    const getSubmittalsData = useCallback(async (offset, limit, submittalCallCount, cb) => {
        setIsSubmittalsFetching(true);
        try {
            await fetch(`${API_URL}/submittals?skip=${offset*limit}&limit=${limit}&submittalcount=${submittalCallCount}`);
            cb();
        } finally {
            setIsSubmittalsFetching(false);
        }
    }, []);

    const getProductData = useCallback(async (offset, limit, productCallCount, cb) => {
        setIsProductFetching(true);
        try {
            await fetch(`${API_URL}/products?skip=${offset*limit}&limit=${limit}&productcount=${productCallCount}`);
            cb();
        } finally {
            setIsProductFetching(false);
        }
    }, []);

    const getIssuesData = useCallback(async (offset, limit, issuesCallCount, cb) => {
        setIsIssuesFetching(true);
        try {
            await fetch(`${API_URL}/issues?skip=${offset*limit}&limit=${limit}&issuescount=${issuesCallCount}`);
            cb();
        } finally {
            setIsIssuesFetching(false);
        }
    }, []);

    return { 
        getRFIData, isRFIFetching, 
        getSubmittalsData, isSubmittalsFetching, 
        getProductData, isProductFetching, 
        getIssuesData, isIssuesFetching 
    };
};

export default useGetEventsData;
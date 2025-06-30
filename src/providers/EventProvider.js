import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import useGetEventsData from "../hooks/useGetEventsData.js";

const PAGE_LIMIT = 10; // Default page size
const INITIAL_PAGINATION = { pageIndex: 0, pageSize: PAGE_LIMIT };
const STREAM_API_URL = 'https://localhost:3002';

const EventContext = createContext({});

const EventProvider = ({children}) => {
    // Refs
    const rfiCallCountRef = useRef(0);
    const submittalCallCountRef = useRef(0);
    const productCallCountRef = useRef(0);
    const issuesCallCountRef = useRef(0);

    // Common States
    const [question, setQuestion] = useState(''); 

    // RFI States
    const [rfiPara, setRfiPara] = useState('');
    const [rfiHeaders, setRfiHeaders] = useState([]);
    const [rfiData, setRfiData] = useState([]);
    const [totalRfiRecords, setTotalRfiRecords] = useState(0);
    const [rfiPagination, setRfiPagination] = useState(INITIAL_PAGINATION);
    // Sunmittals States
    const [submittalsPara, setSubmittalsPara] = useState('');
    const [submittalsHeaders, setSubmittalsHeaders] = useState([]);
    const [submittalsData, setSubmittalsData] = useState([]);
    const [totalSubmittalsRecords, setTotalSubmittalsRecords] = useState(0);
    const [submittalsPagination, setSubmittalsPagination] = useState(INITIAL_PAGINATION);
    // Product States
    const [productPara, setProductPara] = useState('');
    const [productHeaders, setProductHeaders] = useState([]);
    const [productData, setProductData] = useState([]);
    const [totalProductRecords, setTotalProductRecords] = useState(0);
    const [productPagination, setProductPagination] = useState(INITIAL_PAGINATION);
    // Issues States
    const [issuesPara, setIssuesPara] = useState('');
    const [issuesHeaders, setIssuesHeaders] = useState([]);
    const [issuesData, setIssuesData] = useState([]);
    const [totalIssuesRecords, setTotalIssuesRecords] = useState(0);
    const [issuesPagination, setIssuesPagination] = useState(INITIAL_PAGINATION);

    // Hooks
    const { 
        isRFIFetching,
        getRFIData, 
        isSubmittalsFetching,
        getSubmittalsData,
        isProductFetching,
        getProductData,
        isIssuesFetching,
        getIssuesData,  
    } = useGetEventsData();
    
    const getEventsData = (inputText) => {
        if(!inputText) return;

        setQuestion(inputText);
        setRfiPagination(INITIAL_PAGINATION);
        setProductPagination(INITIAL_PAGINATION);
        setIssuesPagination(INITIAL_PAGINATION);

        // RFIs Call
        rfiCallCountRef.current = 0;
        getRFIData(rfiPagination.pageIndex, rfiPagination.pageSize, rfiCallCountRef.current, () => {
            setRfiPara('');
            setRfiHeaders([]);
            setRfiData([]);
            rfiCallCountRef.current = rfiCallCountRef.current + 1;
        });

        // Submittals Call
        submittalCallCountRef.current = 0;
        getSubmittalsData(submittalsPagination.pageIndex, submittalsPagination.pageSize, submittalCallCountRef.current, () => {
            setSubmittalsPara('');
            setSubmittalsHeaders([]);
            setSubmittalsData([]);
            submittalCallCountRef.current = submittalCallCountRef.current + 1;
        });

        // Products Call
        productCallCountRef.current = 0;
        getProductData(productPagination.pageIndex, productPagination.pageSize, productCallCountRef.current, () => {
            setProductPara('');
            setProductHeaders([]);
            setProductData([]);
            productCallCountRef.current = productCallCountRef.current + 1;
        });

        // Issues Call
        issuesCallCountRef.current = 0;
        getIssuesData(issuesPagination.pageIndex, issuesPagination.pageSize, issuesCallCountRef.current, () => {
            setIssuesPara('');
            setIssuesHeaders([]);
            setIssuesData([]);
            issuesCallCountRef.current = issuesCallCountRef.current + 1;
        });
    };

    const scrollToBottom = useCallback(() => {
        const element = document.getElementById('chat-conatainer');
        if(element) {
            element.scrollIntoView({
                block: 'end', 
                inline: 'start', 
                behavior:'smooth'
            });
        }
    }, []);

    useEffect(() => {
        if(rfiCallCountRef.current<=1 && submittalCallCountRef.current<=1 && 
                productCallCountRef.current<=1 && issuesCallCountRef.current<=1) {
            scrollToBottom();
        }
    }, [scrollToBottom, rfiPara, rfiData, submittalsPara, submittalsData, productPara, productData, issuesPara, issuesData]);

    useEffect(() => {
        if (isRFIFetching || rfiCallCountRef.current===0) return; // Avoid fetching if data is already present

        const eventSource = new EventSource(`${STREAM_API_URL}/events/rfis`);

        if(typeof (eventSource) !== 'undefined') {
            console.log('RFIs successful!');
        } else {
            console.log('no response!');
        }

        eventSource.onmessage = event => {
            const eventData = JSON.parse(event.data);
            const { 
                rfiPara: rfiText, rfiHeader: newRfiHeader, rfi: newRfi, totalRfiRecords: totalRfiRecs,
            } = eventData;

            if (rfiText) {
                console.log('rfiText = ', rfiText);
                setRfiPara((prevPara) => prevPara + rfiText);
            }

            if (newRfiHeader) {
                console.log('newRfiHeader = ', newRfiHeader);
                setRfiHeaders((prevHeaders) => [...prevHeaders, newRfiHeader]);
            }

            if (newRfi) {
                console.log('newRfi = ', newRfi);
                setRfiData((prevData) => [...prevData, newRfi]);
            }

            if(totalRfiRecs) {
                console.log('totalRfiRecs = ', totalRfiRecs);
                setTotalRfiRecords(totalRfiRecs);
            }
        }

        return () => {
            eventSource.close();
        };
    }, [isRFIFetching]);

    useEffect(() => {
        if (isSubmittalsFetching || submittalCallCountRef.current===0) return; // Avoid fetching if data is already present

        const eventSource = new EventSource(`${STREAM_API_URL}/events/submittals`);

        if(typeof (eventSource) !== 'undefined') {
            console.log('Submittals successful!');
        } else {
            console.log('no response!');
        }

        eventSource.onmessage = event => {
            const eventData = JSON.parse(event.data);
            const { 
                submittalPara: submittalText, submittalHeader: newSubmittalHeader, submittal: newSubmittal, totalSubmittalRecords: totalSubmittalRecs,
            } = eventData;

            if (submittalText) {
                console.log('submittalText = ', submittalText);
                setSubmittalsPara((prevPara) => prevPara + submittalText);
            }

            if (newSubmittalHeader) {
                console.log('newSubmittalHeader = ', newSubmittalHeader);
                setSubmittalsHeaders((prevHeaders) => [...prevHeaders, newSubmittalHeader]);
            }

            if (newSubmittal) {
                console.log('newSubmittal = ', newSubmittal);
                setSubmittalsData((prevData) => [...prevData, newSubmittal]);
            }

            if(totalSubmittalRecs) {
                console.log('totalSubmittalRecs = ', totalSubmittalRecs);
                setTotalSubmittalsRecords(totalSubmittalRecs);
            }
        }

        return () => {
            eventSource.close();
        };
    }, [isSubmittalsFetching]);

    useEffect(() => {
        if (isProductFetching || productCallCountRef.current===0) return; // Avoid fetching if data is already present

        const eventSource = new EventSource(`${STREAM_API_URL}/events/products`);

        if(typeof (eventSource) !== 'undefined') {
            console.log('Schedules successful!');
        } else {
            console.log('no response!');
        }

        eventSource.onmessage = event => {
            const eventData = JSON.parse(event.data);
            const { 
                schedulesPara: productText, productHeader: newProductHeader, product: newProduct, totalProductRecords: totalProducts
            } = eventData;

            if (productText) {
                console.log('productText = ', productText);
                setProductPara((prevPara) => prevPara + productText);
            }

            if (newProductHeader) {
                console.log('newProductHeader = ', newProductHeader);
                setProductHeaders((prevHeaders) => [...prevHeaders, newProductHeader]);
            }

            if (newProduct) {
                console.log('newProduct = ', newProduct);
                setProductData((prevData) => [...prevData, newProduct]);
            }

            if(totalProducts) {
                console.log('totalProduct = ', totalProducts);
                setTotalProductRecords(totalProducts);
            }
        }

        return () => {
            eventSource.close();
        };
    }, [isProductFetching]);

    useEffect(() => {
        if (isIssuesFetching || issuesCallCountRef.current===0) return; // Avoid fetching if data is already present

        const eventSource = new EventSource(`${STREAM_API_URL}/events/issues`);

        if(typeof (eventSource) !== 'undefined') {
            console.log('Issues successful!');
        } else {
            console.log('no response!');
        }

        eventSource.onmessage = event => {
            const eventData = JSON.parse(event.data);
            const { 
                issuesPara: issueText, issueHeader: newIssueHeader, issue: newIssue, totalIssuesRecords: totalIssues
            } = eventData;

            if (issueText) {
                console.log('issueText = ', issueText);
                setIssuesPara((prevPara) => prevPara + issueText);
            }

            if (newIssueHeader) {
                console.log('newIssueHeader = ', newIssueHeader);
                setIssuesHeaders((prevHeaders) => [...prevHeaders, newIssueHeader]);
            }

            if (newIssue) {
                console.log('newIssue = ', newIssue);
                setIssuesData((prevData) => [...prevData, newIssue]);
            }

            if(totalIssues) {
                console.log('totalIssues = ', totalIssues);
                setTotalIssuesRecords(totalIssues);
            }
        }

        return () => {
            eventSource.close();
        };
    }, [isIssuesFetching]);

    useEffect(() => {
        if (isRFIFetching || rfiCallCountRef.current===0) return;

        // Fetch RFI data from the server
        rfiCallCountRef.current = rfiCallCountRef.current + 1;
        getRFIData(rfiPagination.pageIndex, rfiPagination.pageSize, rfiCallCountRef.current, () => {
            setRfiData([]);
        });
    }, [rfiPagination.pageIndex, getRFIData]);

    useEffect(() => {
        if (isSubmittalsFetching || submittalCallCountRef.current===0) return;

        // Fetch RFI data from the server
        submittalCallCountRef.current = submittalCallCountRef.current + 1;
        getSubmittalsData(submittalsPagination.pageIndex, submittalsPagination.pageSize, submittalCallCountRef.current, () => {
            setSubmittalsData([]);
        });
    }, [submittalsPagination.pageIndex, getSubmittalsData]);

    useEffect(() => {
        if (isProductFetching || productCallCountRef.current===0) return;

        // Fetch product data from the server
        productCallCountRef.current = productCallCountRef.current + 1;
        getProductData(productPagination.pageIndex, productPagination.pageSize, productCallCountRef.current, () => {
            setProductData([]);
        });
    }, [productPagination.pageIndex, getProductData]);

    useEffect(() => {
        if (isIssuesFetching || issuesCallCountRef.current===0) return;

        // Fetch product data from the server
        issuesCallCountRef.current = issuesCallCountRef.current + 1;
        getIssuesData(issuesPagination.pageIndex, issuesPagination.pageSize, issuesCallCountRef.current, () => {
            setIssuesData([]);
        });
    }, [issuesPagination.pageIndex, getIssuesData]);

    return (
        <EventContext.Provider value={{
            question, setQuestion,
            rfiPara, rfiHeaders, rfiData, totalRfiRecords, rfiPagination, setRfiPagination,
            submittalsPara, submittalsHeaders, submittalsData, totalSubmittalsRecords, submittalsPagination, setSubmittalsPagination,
            productPara, productHeaders, productData, totalProductRecords, productPagination, setProductPagination,
            issuesPara, issuesHeaders, issuesData, totalIssuesRecords, issuesPagination, setIssuesPagination,
            getEventsData
        }}>
            {children}
        </EventContext.Provider>
    );
};

const useEventProvider = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventProvider must be used within a EventProvider');
  }

  return context;
};

export { EventProvider, useEventProvider };
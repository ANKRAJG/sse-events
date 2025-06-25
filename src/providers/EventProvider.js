import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import useGetEventsData from "../hooks/useGetEventsData.js";

const PAGE_LIMIT = 10; // Default page size

const EventContext = createContext({});

const EventProvider = ({children}) => {
    // Refs
    const rfiCallCountRef = useRef(0);
    const productCallCountRef = useRef(0);

    // RFI States
    const [rfiPara, setRfiPara] = useState('');
    const [rfiHeaders, setRfiHeaders] = useState([]);
    const [rfiData, setRfiData] = useState([]);
    const [totalRfiRecords, setTotalRfiRecords] = useState(0);
    const [rfiPagination, setRfiPagination] = useState({ pageIndex: 0, pageSize: PAGE_LIMIT });
    // Product States
    const [productPara, setProductPara] = useState('');
    const [productHeaders, setProductHeaders] = useState([]);
    const [productData, setProductData] = useState([]);
    const [productPagination, setProductPagination] = useState({ pageIndex: 0, pageSize: PAGE_LIMIT });
    const [totalProductRecords, setTotalProductRecords] = useState(0);

    // Hooks
    const { 
        isRFIFetching,
        getRFIData, 
        isProductFetching,
        getProductData 
    } = useGetEventsData();
    
    const getEventsData = (inputText) => {
        rfiCallCountRef.current = 0;
        getRFIData(rfiPagination.pageIndex, rfiPagination.pageSize, rfiCallCountRef.current, () => {
            setRfiPara('');
            setRfiHeaders([]);
            setRfiData([]);
            rfiCallCountRef.current = rfiCallCountRef.current + 1;
        });

        productCallCountRef.current = 0;
        getProductData(productPagination.pageIndex, productPagination.pageSize, productCallCountRef.current, () => {
            setProductPara('');
            setProductHeaders([]);
            setProductData([]);
            productCallCountRef.current = productCallCountRef.current + 1;
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
        if(rfiCallCountRef.current<=1 && productCallCountRef.current<=1) {
            scrollToBottom();
        }
    }, [scrollToBottom, rfiPara, rfiData, productPara, productData]);

    useEffect(() => {
        if (isRFIFetching || rfiCallCountRef.current===0) return; // Avoid fetching if data is already present

        const eventSource = new EventSource('https://localhost:3002/events/rfis');

        if(typeof (eventSource) !== 'undefined') {
            console.log('successful!');
        } else {
            console.log('no response!');
        }

        eventSource.onmessage = event => {
            const eventData = JSON.parse(event.data);
            const { 
                para1: rfiText, userHeader: newRfiHeader, user: newRfi, totalUserRecords: totalRfiRecs,
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
        if (isProductFetching || productCallCountRef.current===0) return; // Avoid fetching if data is already present

        const eventSource = new EventSource('https://localhost:3002/events/products');

        if(typeof (eventSource) !== 'undefined') {
            console.log('successful!');
        } else {
            console.log('no response!');
        }

        eventSource.onmessage = event => {
            const eventData = JSON.parse(event.data);
            const { 
                para2: productText, productHeader: newProductHeader, product: newProduct, totalProductRecords: totalProducts
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
        if (isRFIFetching || rfiCallCountRef.current===0) return;

        // Fetch RFI data from the server
        rfiCallCountRef.current = rfiCallCountRef.current + 1;
        getRFIData(rfiPagination.pageIndex, rfiPagination.pageSize, rfiCallCountRef.current, () => {
            setRfiData([]);
        });
    }, [rfiPagination.pageIndex, getRFIData]);

    useEffect(() => {
        if (isProductFetching || productCallCountRef.current===0) return;

        // Fetch product data from the server
        productCallCountRef.current = productCallCountRef.current + 1;
        getProductData(productPagination.pageIndex, productPagination.pageSize, productCallCountRef.current, () => {
            setProductData([]);
        });
    }, [productPagination.pageIndex, getProductData]);

    return (
        <EventContext.Provider value={{
            rfiCallCountRef, rfiPara, rfiHeaders, rfiData, totalRfiRecords, rfiPagination, setRfiPagination,
            productCallCountRef, productPara, productHeaders, productData, totalProductRecords, productPagination, setProductPagination,
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
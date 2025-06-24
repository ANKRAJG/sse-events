import { useEffect, useState, useCallback, useRef } from 'react';
import CustomTable from './CustomTable.js';

const PAGE_LIMIT = 10; // Default page size

const EventComponent = () => {
    // User data states
    const usersCallCount = useRef(0);
    const [userPara, setUserPara] = useState('');
    const [userheaders, setUserHeaders] = useState([]);
    const [userData, setUserData] = useState([]);
    const [totalUserRecords, setTotalUserRecords] = useState(0);
    const [isUserFetching, setIsUserFetching] = useState(false);
    const [userPagination, setUserPagination] = useState({
        pageIndex: 0, // Initial page index -> corresponds to offset
        pageSize: PAGE_LIMIT, // Default page size  -> corresponds to limit,
    });

    // Product data states
    const productsCallCount = useRef(0);
    const [productPara, setProductPara] = useState('');
    const [productHeaders, setProductHeaders] = useState([]);
    const [productData, setProductData] = useState([]);
    const [totalProductRecords, setTotalProductRecords] = useState(0);
    const [isProductFetching, setIsProductFetching] = useState(false);
    const [productPagination, setProductPagination] = useState({
        pageIndex: 0, // Initial page index -> corresponds to offset
        pageSize: PAGE_LIMIT, // Default page size  -> corresponds to limit,
    });

    // Fetch user data from the server
    const fetchUsersTableData = useCallback(async (offset = 0, limit = 10) => {
        setIsUserFetching(true);
        try {
            usersCallCount.current = usersCallCount.current + 1;
            await fetch(`https://localhost:3000/getUsers?skip=${offset*limit}&limit=${limit}&usercount=${usersCallCount.current}`);
            //const userData = await response.json();
            //console.log('response = ', JSON.parse(response));
            setUserData([]);
        } finally {
            setIsUserFetching(false);
        }
    }, []);

    // Fetch product data from the server
    const fetchProductsTableData = useCallback(async (offset = 0, limit = 10) => {
        setIsProductFetching(true);
        try {
            productsCallCount.current = productsCallCount.current + 1;
            await fetch(`https://localhost:3000/getProducts?skip=${offset*limit}&limit=${limit}&productcount=${productsCallCount.current}`);
            setProductData([]);
        } finally {
            setIsProductFetching(false);
        }
    }, []);

    useEffect(() => {
        if (isUserFetching) return; // Avoid fetching if data is already present

        const eventSource = new EventSource('https://localhost:3002/events/rfis');

        if(typeof (eventSource) !== 'undefined') {
            console.log('successful!');
        } else {
            console.log('no response!');
        }

        eventSource.onmessage = event => {
            const eventData = JSON.parse(event.data);
            const { 
                para1: userText, userHeader: newUserHeader, user: newUser, totalUserRecords: totalUsers,
            } = eventData;

            if (userText) {
                console.log('userText = ', userText);
                setUserPara((prevPara) => prevPara + userText);
            }

            if (newUserHeader) {
                console.log('newUserHeader = ', newUserHeader);
                setUserHeaders((prevHeaders) => [...prevHeaders, newUserHeader]);
            }

            if (newUser) {
                console.log('newUser = ', newUser);
                setUserData((prevData) => [...prevData, newUser]);
            }

            if(totalUsers) {
                console.log('total = ', totalUsers);
                setTotalUserRecords(totalUsers);
            }
        }

        return () => {
            eventSource.close();
        };
    }, [isUserFetching]);

    useEffect(() => {
        if (isUserFetching) return; // Avoid fetching if data is already present

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
        if (isUserFetching) return;

        fetchUsersTableData(userPagination.pageIndex, userPagination.pageSize);
    }, [userPagination.pageIndex, fetchUsersTableData]);

    useEffect(() => {
        if (isProductFetching) return;

        if(productsCallCount.current === 0) {
            setTimeout(() => {
                fetchProductsTableData(productPagination.pageIndex, userPagination.pageSize); 
            },  200);
        } else {
            fetchProductsTableData(productPagination.pageIndex, userPagination.pageSize);
        }
    }, [productPagination.pageIndex, fetchProductsTableData]);

  return (
    <div className="chat-container">
        <div dangerouslySetInnerHTML={{__html: userPara}} />
        {userheaders.length > 0 && (
            <CustomTable 
                columns={userheaders}
                data={userData}
                pagination={userPagination}
                setPagination={setUserPagination}
                totalRecords={totalUserRecords}
                isFetching={isUserFetching}
            />
        )}

        <div dangerouslySetInnerHTML={{__html: productPara}} />  
        {productHeaders.length > 0 && (
            <CustomTable
                columns={productHeaders}
                data={productData}
                pagination={productPagination}
                setPagination={setProductPagination}
                totalRecords={totalProductRecords}
                isFetching={isProductFetching}
            />
        )}
    </div>
  );
};

export default EventComponent;
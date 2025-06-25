import CustomTable from './CustomTable.js';
import { useEventProvider } from '../providers/EventProvider.js';

const EventComponent = () => {

    const { 
        rfiHeaders, rfiPara, rfiData, totalRfiRecords, rfiPagination, setRfiPagination,
        productHeaders, productPara, productData, totalProductRecords, productPagination, setProductPagination,
    } = useEventProvider();

  return (
    <div className="chat-container" id="chat-conatainer">
        <div className="para-conatiner" dangerouslySetInnerHTML={{__html: rfiPara}} />
        {rfiHeaders.length > 0 && (
            <CustomTable 
                columns={rfiHeaders}
                data={rfiData}
                pagination={rfiPagination}
                setPagination={setRfiPagination}
                totalRecords={totalRfiRecords}
            />
        )}

        <div className="para-conatiner" dangerouslySetInnerHTML={{__html: productPara}} />  
        {productHeaders.length > 0 && (
            <CustomTable
                columns={productHeaders}
                data={productData}
                pagination={productPagination}
                setPagination={setProductPagination}
                totalRecords={totalProductRecords}
            />
        )}
    </div>
  );
};

export default EventComponent;
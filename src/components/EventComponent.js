import CustomTable from './CustomTable.js';
import { useEventProvider } from '../providers/EventProvider.js';

const EventComponent = () => {

    const { 
        rfiHeaders, rfiPara, rfiData, totalRfiRecords, rfiPagination, setRfiPagination,
        submittalsPara, submittalsHeaders, submittalsData, totalSubmittalsRecords, submittalsPagination, setSubmittalsPagination,
        productHeaders, productPara, productData, totalProductRecords, productPagination, setProductPagination,
        issuesPara, issuesHeaders, issuesData, totalIssuesRecords, issuesPagination, setIssuesPagination,
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

        <div className="para-conatiner" dangerouslySetInnerHTML={{__html: submittalsPara}} />  
        {submittalsHeaders.length > 0 && (
            <CustomTable
                columns={submittalsHeaders}
                data={submittalsData}
                pagination={submittalsPagination}
                setPagination={setSubmittalsPagination}
                totalRecords={totalSubmittalsRecords}
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

        <div className="para-conatiner" dangerouslySetInnerHTML={{__html: issuesPara}} />  
        {issuesHeaders.length > 0 && (
            <CustomTable
                columns={issuesHeaders}
                data={issuesData}
                pagination={issuesPagination}
                setPagination={setIssuesPagination}
                totalRecords={totalIssuesRecords}
            />
        )}
    </div>
  );
};

export default EventComponent;
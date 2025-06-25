export const FIXED_STREAM_TIME = 50; // in milliseconds

export const getTableHeaders = (data) => {
    return data[0] ? Object.keys(data[0]) : [];
};

export const getUsersLimitedFields = (items) => {
    return items.map(item => {
        return {
            userId: item.id, 
            firstName: item.firstName,
            lastName: item.lastName,
            maidenName: item.maidenName,
            age: item.age,
            email: item.email,
            phone: item.phone,
            username: item.username,
            birthDate: item.birthDate,
            role: item.role,
            height: item.height,
            weight: item.weight,
        };
    });
};

export const getProductsLimitedFields = (items) => {
    return items.map(item => {
        return {
            productId: item.id, 
            title: item.title,
            category: item.category,
            price: item.price,
            discountPercentage: item.discountPercentage,
            rating: item.rating,
            stock: item.stock,
            brand: item.brand,
            weight: item.weight,
            warrantyInformation: item.warrantyInformation,
            availabilityStatus: item.availabilityStatus,
            returnPolicy: item.returnPolicy,
        };
    });
};

export const getAALimitedFields = (items) => {
    return items.map(item => {
        return {
            id: item.data.display_id, 
            title: item.data.title,
            status: item.data.status, 
            assigneeUser: item.data.assignee_user_names, 
            question: item.data.question, 
            priority: item.data.priority,
            location: item.data.location, 
            type: item.data.rfi_type, 
            risk: item.data.risk, 
            trade: item.data.trades_prediction,
            buildingSystem: item.data.building_system_prediction, 
            buildingSubsystem: item.data.building_subsystem_prediction, 
        };
    });
};

export const firstPara = [
    `<p><strong>Reasoning:</strong> To find all <code class="code-snips-red">RFIs</code> related to concrete, I need to check multiple fields where concrete might be mentioned:</p>`,
    `<ol>`,
    `<li>The "disciplines" array field might contain 'Concrete' as a discipline</li>`,
    `<li>The "building_components" array field might contain concrete-related components</li>`,
    `<li>The "title" or "question" fields might mention concrete</li>`,
    `</ol>`,
    `<p>Since the user wants to see all RFIs related to concrete, I'll use OR conditions to include any RFI that matches any of these criteria. I'll return all columns as instructed.</p>`
];

export const secondPara = [
    `<p><strong>Reasoning:</strong> To find <code class="code-snips-red">Submittals</code> related to concrete, I need to check where "concrete" might be mentioned in the database. Looking at the schema, I can see several potential fields where concrete might be referenced:</p>`,
    `<ol>`,
    `<li>The <code class="code-snips">trades_prediction</code> column has "concrete" as one of its possible values</li>`,
    `<li>The <code class="code-snips">title</code> and <code class="code-snips">description</code> fields might contain the word "concrete"</li>`,
    `<li>The <code class="code-snips">spec_section_title</code> might reference concrete</li>`,
    `</ol>`,
    `<p>Since the question specifically asks about concrete, I'll use the <code class="code-snips">trades_prediction</code> field as the primary filter, which has an AI-generated prediction of the trade. I'll also search for "concrete" in the title and description fields to catch any items that might not be properly classified in the trades_prediction.</p>`
];

export const broadcastStreams = (stream, dataArr, key, iteratorAdder, extraTime=0) => {
    dataArr.forEach((item, i) => {
        // send SSE every 50ms
        setTimeout(() => {
            const data = {};
            data[key] = item;
            stream.write(`data: ${JSON.stringify(data)}\n\n`);
        }, (FIXED_STREAM_TIME * (i + iteratorAdder)) + extraTime);
    });
};

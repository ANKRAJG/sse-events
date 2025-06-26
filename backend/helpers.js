// Constants
export const FIXED_STREAM_TIME = 50; // in milliseconds
export const INITIAL_CALL_NUMBER = 0;

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

export const getRFILimitedFields = (items) => {
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

export const getSubmittalLimitedFields = (items) => {
    return items.map(item => {
        return {
            id: item.data.display_id, 
            title: item.data.title,
            status: 'Open | Submitted', 
            ballInCourt: item.data.ball_in_court_user_names, 
            spec: `${item.data.spec_section_number} ${item.data.spec_section_title}`, 
            type: item.data.type_value, 
            priority: item.data.priority_value,
            package: item.data.package_title, 
            trade: item.data.trades_prediction,
            discipline: item.data.discipline_prediction, 
            buildingSystem: item.data.building_system_prediction, 
            buildingSubsystem: item.data.building_subsystem_prediction, 
        };
    });
};

export const schedulesPara = [
    `<p><strong>Reasoning:</strong> The question asks for all <code class="code-snips-red">Schedule</code> activities related to concrete. Looking at the schema, I can see that "concrete" could be found in the trades_prediction column, which contains AI-generated trade classifications. According to the SQL tips, when a question mentions a trade, I should filter on trades_prediction.</p>`,  
    `<p>The trades_prediction column has a possible value of 'concrete', which is what we need to filter on. Since we want to see all details about these activities, I'll use SELECT * to return all columns for activities where the trades_prediction is 'concrete'.</p>`
];

export const broadcastStreams = (stream, dataArr, key, iteratorAdder, extraTime=0, canCall) => {
    const extra_time_wait = canCall ? extraTime : 0;
    dataArr.forEach((item, i) => {
        // send SSE every 50ms
        setTimeout(() => {
            const data = {};
            data[key] = item;
            stream.write(`data: ${JSON.stringify(data)}\n\n`);
        }, (FIXED_STREAM_TIME * (i + iteratorAdder)) + extra_time_wait);
    });
};

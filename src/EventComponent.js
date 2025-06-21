import { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';
import { useTable, TableRow, TableCell } from '@adsk/alloy-react-table';

const EventComponent = () => {
    const [headers, setHeaders] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/events');

        if(typeof (eventSource) !== 'undefined') {
            console.log('successful!');
        } else {
            console.log('no response!');
        }

        eventSource.onmessage = event => {
            const eventData = JSON.parse(event.data);
            const newHeader = eventData.header;
            if (newHeader) {
                console.log('newHeader = ', newHeader);
                setHeaders((prevHeaders) => [...prevHeaders, newHeader]);
            }

            const newUser = eventData.user;
            if (newUser) {
                console.log('newUser = ', newUser);
                setData((prevData) => [...prevData, newUser]);
            }
        }

        return () => eventSource.close();
    }, []);

  return (
    <div>
        <table>
            <thead>
                <tr>
                    {headers?.map((header) => (
                        <th key={header.name}>{header.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data?.map((user, index) => (
                    <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.maidenName}</td>
                        <td>{user.age}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.username}</td>
                        <td>{user.birthDate}</td>
                        <td>{user.role}</td>
                        <td>{user.height}</td>
                        <td>{user.weight}</td>
                    </tr>
                ))}
            </tbody>        
        </table>
    </div>
  );
};

export default EventComponent;
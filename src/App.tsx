import React, {useState, useEffect} from 'react';
import {fetchData} from "./AppService";
import logo from './logo.svg';
import './App.css';
import {inspect} from "util";

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
}

const App: React.FC = () => {
    const [data, setData] = useState<Item[]>([]);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const fetchedData = await fetchData();
                console.log(`fetchedData : ${fetchedData}`)
                setData(fetchedData);
            } catch (error) {
                // Handle error
            }
        };

        fetchDataAsync();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <h1>Data from Django API:</h1>
                    <ul>
                        {data !== undefined && data.length > 0 ?
                            data.map(item => (
                                <li key={item.id}>
                                    <strong>{item.name}</strong>: {item.description}
                                </li>
                            ))
                            : <li>No data available</li>
                        }
                    </ul>
                </div>
                <a href="http://localhost:8000/accounts/login/">Sign in with Google</a>
            </header>
        </div>
    );
}

export default App;

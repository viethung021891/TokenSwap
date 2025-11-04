
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TokenDetail from './TokenDetail';
import Multiselect from 'multiselect-react-dropdown';

const API_BASE = process.env.REACT_APP_APIBase;

const ListToken = ({ tokens, chains }) => {
    const [availableTokens, setAvailableTokens] = useState([]);
    const [availableChains, setAvailableChains] = useState([]);
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [selectedChains, setSelectedChains] = useState([]);

    // Fetch the list of tokens when an API is selected
    useEffect(() => {
        axios.get(`${API_BASE}/tokens/getTokenList`)
            .then(response => {
                setAvailableChains(response.data.chainMap);
                setAvailableTokens(response.data.tokenList);
                if (response.data.tokenList.length > 0) {
                    var chainIds = Array.from(
                        new Set(
                            response.data.tokenList
                                .flatMap((row) => row.chainList.map((chain) => chain.chainId))
                        )
                    );
                    if (chainIds && chainIds.length > 0) {
                        var selectChains = response.data.chainMap.filter((chain) => {
                            return chainIds.includes(chain.chainId) ? chain.chainId : null
                        });
                        setSelectedChains(selectChains);
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching tokens", error);
            });
    }, []);

    const handleTokenChange = (selected) => {
        setSelectedTokens([...selected]);
    };

    const handleChainChange = (selected) => {
        console.log('selected', selected);
        setSelectedChains([...selected]);
    };

    return (
        <div className="App">
            <div className="container">
                <div>
                    <h3>Tokens</h3>
                    <Multiselect
                        options={availableTokens} // Options to display in the dropdown
                        onSelect={handleTokenChange} // Function will trigger on select event
                        onRemove={handleTokenChange} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                        showCheckbox={true}
                    />
                </div>

                {/* Chain Select */}
                <div>
                    <h3>Chains</h3>
                    <Multiselect
                        options={availableChains} // Options to display in the dropdown
                        onSelect={handleChainChange} // Function will trigger on select event
                        onRemove={handleChainChange} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                        showCheckbox={true}
                        selectedValues={selectedChains}
                    />
                </div>
            </div>
            {selectedTokens.length > 0 && (
                <div className="list-token">
                    {selectedTokens.reduce((rows, token, index) => {
                        if (index % 3 === 0) rows.push([]); // Create a new row every 2 tokens
                        rows[rows.length - 1].push(token);
                        return rows;
                    }, []).map((row, rowIndex) => (
                        <div key={rowIndex} className="token-row">
                            {row.map((token, index) => (
                                <TokenDetail
                                    key={index}
                                    token={token}
                                    chains={selectedChains}
                                    selectedAPI="ODOS"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListToken;

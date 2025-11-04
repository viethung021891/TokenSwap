import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FaPlus, FaTrashAlt } from 'react-icons/fa'; // Import trash icon from react-icons

const ResultItem = ({ swap, color }) => {
  return (
    <div class="result-item" style={{ color: color }}>
      <img className='token-image' title={swap.name}
        src={`/images/${swap.name.toLowerCase()}.png`}
        alt={swap.name}
      />
      {swap.value}
    </div>
  );
};

const TokenColumn = ({ token, initialQuantity, chains, selectedAPI, onRemove}) => {
  const [quantity, setQuantity] = useState(initialQuantity || '');
  const [swapResult, setSwapResult] = useState(null);
  const [revertResult, setRevertResult] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const listChainsInfo = chains.map(chain => {
      const contract = token.chainList.find(c => c.chainId === chain.chainId);
      return contract ? {
        tokenId: contract.tokenId,
        chainId: chain.chainId,
        name: chain.name,
        selectedAPI: contract.API,
        decimal: contract.decimal,
        ETHID: contract.ETHID
      } : null;
    }).filter(chain => chain !== null);

    if (listChainsInfo.length === 0) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_APIBase}/swap`, {
          listChainsInfo,
          quantity,
        }, { signal: abortController.signal });
        if (response && response.data && response.data.swapResults && response.data.revertResults) {
          setSwapResult(response.data.swapResults.filter(result => result && result !== undefined).sort((a, b) => b.value - a.value));
          setRevertResult(response.data.revertResults.filter(result => result && result !== undefined).sort((a, b) => b.value - a.value));
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error('Error fetching data', error);
        }
      }
    };

    const startPolling = async () => {
      while (isMounted && quantity) {
        await fetchData();
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    };

    if (quantity) {
      startPolling();
    }

    return () => {
      isMounted = false;
      abortController.abort();
    };

  }, [token, quantity, chains, selectedAPI]);

  // useEffect(() => {
  //   const abortController = new AbortController();
  //   let isMounted = true; // to check if component is still mounted

  //   const listChainsInfo = chains.map(chain => {
  //     const contract = token.chainList.find(c => c.chainId === chain.chainId);
  //     return contract ? {
  //       tokenId: contract.tokenId,
  //       chainId: chain.chainId,
  //       name: chain.name,
  //       selectedAPI: contract.API,
  //       decimal: contract.decimal,
  //       ETHID: contract.ETHID
  //     } : null;
  //   }).filter(chain => chain !== null);

  //   if (listChainsInfo.length === 0) {
  //     return;
  //   }

  //   const fetchSwapData = async () => {
  //     try {
  //       const response = await axios.post(`${process.env.REACT_APP_APIBase}/swap`, {
  //         listChainsInfo,
  //         quantity,
  //       }, { signal: abortController.signal });
  //       return response.data.filter(result => result && result !== undefined).sort((a, b) => b.value - a.value);
  //     } catch (error) {
  //       if (axios.isCancel(error)) {
  //         console.log('Fetch swap data canceled:', error.message);
  //       } else {
  //         console.error('Error fetching swap data', error);
  //       }
  //       return [];
  //     }
  //   };

  //   const fetchRevertData = async (swapResult) => {
  //     if (swapResult === null) return [];
  //     try {
  //       const response = await axios.post(`${process.env.REACT_APP_APIBase}/revert`, {
  //         listChainsInfo,
  //         quantity: swapResult.value,
  //       }, { signal: abortController.signal });
  //       return response.data.filter(result => result && result !== undefined).sort((a, b) => b.value - a.value);
  //     } catch (error) {
  //       if (axios.isCancel(error)) {
  //         console.log('Fetch revert data canceled:', error.message);
  //       } else {
  //         console.error('Error fetching revert data', error);
  //       }
  //       return [];
  //     }
  //   };

  //   const fetchData = async () => {
  //     const swapResults = await fetchSwapData();
  //     let revertResults = [];
  //     if (swapResults && swapResults.length > 0) {
  //       revertResults = await fetchRevertData(swapResults[0]);
  //     }
  //     setSwapResult(swapResults);
  //     setRevertResult(revertResults);
  //   };

  //   const startPolling = async () => {
  //     while (isMounted && quantity) {
  //       await fetchData();
  //       await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds after fetchData completes
  //     }
  //   };

  //   if (quantity) {
  //     startPolling();
  //   }
  //   else{
  //     setSwapResult([]);
  //     setRevertResult([]);
  //   }

  //   return () => {
  //     isMounted = false;
  //     abortController.abort();
  //   };
  // }, [token, quantity, chains, selectedAPI]);

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  return (
    <div className="token-result-column" key={initialQuantity || 'custom'}>
      <div className="quantity-header">
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={handleQuantityChange}
          />
          <button className="remove-button" onClick={onRemove} title="Remove">
            <FaTrashAlt />
          </button>
      </div>
      <div className="result-row">
        <div className="swap-column">
          {swapResult && swapResult.length > 0 && (
            <div>
              {swapResult.map((swap, index) => (
                <div key={index}>
                  {!isNaN(swap.value) && (
                    <ResultItem swap={swap} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="revert-column">
          {revertResult && revertResult.length > 0 && (
            <div>
              {revertResult.map((revert, index) => (
                <div key={index}>
                  {!isNaN(revert.value) && (
                    <ResultItem swap={revert} color={revert.value > quantity ? 'blue' : (revert.value < quantity ? 'red' : '')} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TokenDetail = React.memo(({ token, chains, selectedAPI }) => {
  const [listQuantity, setListQuantity] = useState(token.ListQuantity || [1]);
  const handleRemoveColumn = (index) => {
    setListQuantity((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddColumn = () => {
    setListQuantity((prev) => [...prev, prev[prev.length - 1] + 2 || 2]); // Add next quantity
  };

  return (
    <div className="token-item">
      {/* Token Name Column */}
      <div className="token-name-column">
        <div className="token-name">
          <p>{token.name}</p>
        </div>
        {/* Add Column Button */}
        <div className="add-column">
          <button className="add-button" onClick={handleAddColumn} title="Add Column">
            <FaPlus />
          </button>
        </div>
      </div>
      <div className="token-detail-row">
      {/* Quantity Columns */}
      {listQuantity.map((quantity, index) => (
        <div key={quantity} className="token-column">
          <TokenColumn
            token={token}
            initialQuantity={quantity}
            chains={chains}
            onRemove={() => handleRemoveColumn(index)} // Pass removal handler
            selectedAPI={selectedAPI}
          />
        </div>
      ))}
      </div>
    </div>
  );
});


export default TokenDetail;

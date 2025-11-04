import React, { useEffect } from 'react';
import axios from 'axios';

const TokenResult = ({ highestValue, tokenId }) => {
  useEffect(() => {
    const sendRevert = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/revert', {
          tokenId: tokenId,
          value: highestValue,
        });
        console.log('Revert Response:', response.data);
      } catch (error) {
        console.error('Error sending revert', error);
      }
    };

    if (highestValue !== null) {
      sendRevert();
    }
  }, [highestValue, tokenId]);

  return (
    <div className="token-result">
      <h4>Highest Value Sent to APIRevert: {highestValue}</h4>
    </div>
  );
};

export default TokenResult;

const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const proxies = require('../data/proxy');
const axiosRetry = require('axios-retry').default;

axiosRetry(axios, {
    retries: 3, // Number of retries
    retryDelay: (retryCount) => {
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error) => {
        return error.response?.status === 429; // retry only on rate limit errors
    },
});

const revertToken = async (req, res) => {
    const { listChainsInfo, quantity } = req.body;  // Sent by the client
    const resultPromises = listChainsInfo.map(async (chain) => {
        try {
            const response = await revertTokenChain(chain.chainId, chain.tokenId, quantity, chain.selectedAPI, chain.decimal, chain.ETHID);
            if (response !== null)
                return { chainId: chain.chainId, name: chain.name, value: parseFloat(response.toFixed(process.env.SWAP_DECIMAL || 4)) };
        } catch (error) {
            console.error('Error fetching revert data', error);
            return null;
        }
    });
    const result = await Promise.all(resultPromises);
    res.status(200).json(result);
};

const revertTokenChain = async (chainId, tokenId, quantity, selectedAPI, decimal, ETHID) => {
    let result = null;  // Process the response from the public API
    let response = null;

    let proxyServer;
    let agent;
    try {
        const proxy = proxies[Math.floor(Math.random() * proxies.length)];
        proxyServer = `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
        agent = new HttpsProxyAgent(proxyServer);
    } catch (error) {
        console.log('Error setting up proxy: ', error);
        return null;
    }
    try {
        if (selectedAPI === "ODOS") {
            const quantityPost = BigInt(quantity * Math.pow(10, decimal || 6));
            console.log('quantityPost', quantityPost.toString());
            response = await axios.post(`${process.env.PUBLIC_API_ODOS_SWAP}`, {
                "chainId": chainId,
                "inputTokens": [
                    {
                        "amount": quantityPost.toString(),
                        "tokenAddress": tokenId
                    }
                ],
                "outputTokens": [
                    {
                        "proportion": 1,
                        "tokenAddress": ETHID || "0x0000000000000000000000000000000000000000"
                    }
                ],
            }, { httpsAgent: agent });
            result = response.data?.outAmounts?.[0] / 1e18;
        } else if (selectedAPI === "WOWMAX") {
            let requestUrl = `${process.env.PUBLIC_API_WOWMAX_SWAP}/${chainId}/quote?amount=${quantity}&to=${ETHID || "0x0000000000000000000000000000000000000000"}&from=${tokenId}`;
            response = await axios.get(requestUrl, { httpsAgent: agent });
            result = (response.data?.amountOut) / 1e18;
        }
        return result;
    } catch (ex) {
        console.log('Error fetching swap result: ', ex);
        return null;
    }
};

exports.revertToken = revertToken;
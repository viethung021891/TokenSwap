const { chainMap } = require('../data/chainMap');
const xlsx = require('xlsx');

//declare getTokenList function as async
async function getTokenList(req, res) {
    try {
        //Get token list from /data/TokenId.xlsx 
        const workbook = xlsx.readFile(process.env.TOKEN_FILE_PATH);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const tokenData = xlsx.utils.sheet_to_json(worksheet);

        //Get token list from 1st column, distinct values
        //Each item in the tokenList is an object with name, list chainObject with chainId from Column Chain and toeknId from column Contract
        const tokenList = [...new Set(tokenData.map(token => token.Token))].map(token => ({
            name: token,
            chainList: tokenData
                .filter(t => t.Token === token)
                .map(t => ({
                    chainId: t.Chain,
                    tokenId: t.Contract,
                    API: t.API,
                    decimal: t.Decimal,
                    ETHID: t.ETHID
                }))
        }));

        res.json({ tokenList, chainMap });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tokens: ' + error });
    }
};

//declare function getChainList as async, read the chainMap from the config/chainMap.js file, filter by ApiName and return the list of items
async function getChainList(req, res) {
    // const apiName = req.query.apiSource || 'ODOS';
    try {
        // const chainList = chainMap[apiName].map(chain => ({
        //     name: chain.name,
        //     chainId: chain.id
        // }));
        res.json(chainMap);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching chains' });
    }
}


module.exports = {
    getTokenList,
    getChainList
}
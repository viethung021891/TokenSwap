const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    ChainId: { type: Number, required: true },
    tokenId: { type: String }
});

module.exports = mongoose.model('Token', TokenSchema);

const { Web3 } = require('web3')

class TradeContract {
    constructor(){
        const abi = require('../../abi/Trade.json').abi;
        this.web3 = new Web3(new Web3.providers.HttpProvider(process.env.CONTRACT_NETWORK));
        this.contract = new this.web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
    }

    async readContract(method, ...args){
        return this.contract.methods[method](...args).call({
            from: process.env.CONTRACT_ACCESS_ACCOUNT
        });
    }

    async writeContract(method, ...args){
        return this.contract.methods[method](...args).send({
            from: process.env.CONTRACT_ACCESS_ACCOUNT
        });
    }

    async getEventLogs(eventName = 'ALLEVENTS', fromBlock = 0, toBlock = 'latest'){
        return this.contract.getPastEvents(eventName, {
            fromBlock,
            toBlock
        }).then((events) => events.map((event) => {
            try{
                const length = event.returnValues['__length__'];
                for(let i = 0; i < length; i++){
                    delete event.returnValues[String(i)];
                }
    
                return { 
                    name: event.event,
                    block: {
                        hash: event.blockHash,
                        number: event.blockNumber
                    },
                    transaction: {
                        hash: event.transactionHash,
                        index: event.transactionIndex 
                    },
                    value: event.returnValues
                }
            }catch{
                return {}
            }
        }))
    }
}

// module.exports = new TradeContract();
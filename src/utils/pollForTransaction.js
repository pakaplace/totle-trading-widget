import web3 from 'web3';
export default async (txnHash, interval) => {
  let transactionReceiptAsync;
  interval = interval ? interval : 500;
  transactionReceiptAsync = (txnHash, resolve, reject) => {
      try {
          var receipt = window.web3.eth.getTransactionReceipt(txnHash);
          if (receipt == null) {
              setTimeout( () => {
                  transactionReceiptAsync(txnHash, resolve, reject);
              }, interval);
          } else {
              resolve(receipt);
          }
      } catch(e) {
          reject(e);
      }
  };
  return new Promise(function (resolve, reject) {
          transactionReceiptAsync(txnHash, resolve, reject);
      });

  // if (Array.isArray(txnHash)) {
  //     var promises = [];
  //     txnHash.forEach( (oneTxHash) => {
  //         promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
  //     });
  //     return Promise.all(promises);
  // } else {
  //     return new Promise(function (resolve, reject) {
  //             transactionReceiptAsync(txnHash, resolve, reject);
  //         });
  // }
};
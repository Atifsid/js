function myPromise(executor) {
    /*
        onResolve -> to store resolveCallback
        onReject -> to store rejectCallback
        isCalled -> check and mark the promise as resolved/rejected
        isFulfilled -> executor isFulfilled
        isRejected -> executor isRejected

        (!isCalled && isFulfilled) or (!isCalled && isRejected) is used to enable synchronous promises.
        onResolve and onReject works for asynchronous tasks as asynchronous functions can be passed in executor function directly (setTimeout here).
    */

    let onResolve, onReject, isCalled = false, 
      isFulfilled = false, isRejected = false, output, err;

  this.then = function(resolveCallback) {
    onResolve = resolveCallback;
    
    // check if the promise has not yet resolved/rejected and executor isFulfilled
    if(!isCalled && isFulfilled) {
      isCalled = true;
      onResolve(output);
    }

    // Returning this to enable chaining of then
    return this;
  }
  
  this.catch = function(rejectCallback) {
    onReject = rejectCallback;
    
    // check if the promise has not yet resolved/rejected and executor isRejected
    if(!isCalled && isRejected) {
      isCalled = true;
      onReject(err);
    }
    
    // Returning this to enable chaining of catch
    return this;
  }

  function resolver(data) {
    isFulfilled = true;
    output = data;
    
    if(typeof onResolve=== 'function' && !isCalled){
      isCalled = true;
      onResolve(data);
    }
  }
  
  function rejecter(error) {
    isRejected = true;
    err = error;
    
    if(typeof onReject === 'function' && !isCalled){
      isCalled = true;
      onReject(error);
    }
  }
  
  executor(resolver, rejecter);
}

let p1 = new myPromise(
    (resolve, reject) => setTimeout(() => resolve('Resolved successfully with a delay', 1000))
  );
p1.then((data) => console.log(data));
  
let p2 = new myPromise(
    (resolve, reject) => resolve('Resolved right away')
);
p2.then((data) => console.log(data));
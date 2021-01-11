function createRequestQueue() {
  /**
   * Your mission:
   * Create and return a request queue with the following methods.
   * Carefully read the description of each method in the task description.
   *
   * enqueue(id: number, request: () => Promise<string>): Promise<string>;
   *
   * cancel(id: number): void;
   *
   * processNext(): Promise<boolean>;
   *
   * size(): number;
   */
  this.elements=[];
  this.enqueue = async (id, func) => {
    let p = new Promise((resolve, reject) => {
    	this.elements.push({id: id, func: func, status: "pending", resolve: resolve, reject: reject});
      /* (async () => {
        let currentElementIdx = this.elements.findIndex(x => x.id ===id);
        if (this.elements[currentElementIdx].status === "pending") {
          let value = await this.elements[currentElementIdx].func();
          resolve(value);
        }
        else {
          reject("Trying to process cancelled item");
        }
      })() */
    });
    return p;
  };
  this.cancel = (id) => {
    let currentElementIdx = this.elements.findIndex(x => x.id === id);
    if (currentElementIdx !== -1) {
        this.elements[currentElementIdx].status = "cancelled";
        this.elements[currentElementIdx].reject("Trying to resolve cancelled request");
    }
  };
  this.processNext = async () => {
  	let currentElementIdx = this.elements.findIndex(x => x.status ==="pending");
    if (currentElementIdx === -1 || this.elements[currentElementIdx].status === "cancelled")
      return new Promise(resolve => resolve(false))
  	try {
    	let value = await this.elements[currentElementIdx].func();
      this.elements[currentElementIdx].resolve(value);
      this.elements[currentElementIdx].status = "processed";
      return new Promise(resolve => resolve(true))
    }
    catch (err) {
    	console.log(err.message);
      this.elements[currentElementIdx].reject("Enquee rejected");
    	return new Promise(resolve => resolve(false))
    }
  }
  this.size = () => {
      return this.elements.filter(x => x.status === "pending").length;
  }
  return this;
}
const test = async () => {
  let requestQueue =  createRequestQueue();
  /* const promise = requestQueue.enqueue(0, async () => 'hello world');
  await requestQueue.processNext();
  promise.then((value) => console.log(value));
    let executed = false;
  const request = async () => {
    executed = true;
    return '42';
  };
  const promise1 = requestQueue.enqueue(42, request);
  requestQueue.cancel(42);
  await requestQueue.processNext();
  console.log(executed);
  promise1
  .then(() => {
    throw new Error('This "then" should not be reachable if your code works correctly');
  })
  .catch((err) => console.log(err)); */
  /* requestQueue.enqueue(41, async () => '41');
  requestQueue.enqueue(42, async () => '42');
  console.log(requestQueue.size())
  requestQueue.cancel(43);
  console.log(requestQueue.size()) */
  /* const executed = [false, false, false];
  const request0 = async () => {
    executed[0] = true;
    return '0';
  };
  const request1 = async () => {
    executed[1] = true;
    return '1';
  };
  const request2 = async () => {
    executed[2] = true;
    return '2';
  };
  requestQueue.enqueue(0, request0);
  requestQueue.enqueue(1, request1);
  requestQueue.enqueue(2, request2);
   console.log(requestQueue.size())
   console.log(executed)
  await requestQueue.processNext();
   console.log(requestQueue.size())
   console.log(executed)
  await requestQueue.processNext();
   console.log(requestQueue.size())
   console.log(executed)
  await requestQueue.processNext();
   console.log(requestQueue.size())
   console.log(executed) */
   const errorRequest = async () => {
        throw new Error('This request has an error in it');
      };
      const promise = requestQueue.enqueue(0, errorRequest);
      promise.catch(() => {
        // Avoid an unhandled promise rejection warning
      });
      await requestQueue.processNext();
}
test();
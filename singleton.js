const { Consumer } = require('./src/Consumer');
const { JobQueue } = require('./src/JobQueue');

const jobQueueInstance = new JobQueue();
const consumerInstance = new Consumer(jobQueueInstance);
jobQueueInstance.consumer = consumerInstance;

module.exports = {
    jobQueueInstance,
    consumerInstance,
}
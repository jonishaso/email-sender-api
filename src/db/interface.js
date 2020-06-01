import createDebugger from 'debug'
import mongoose from 'mongoose'

import { mongoAtlasLink } from '#root/config'

const debug = createDebugger('express:dbmodel')

const connectionOptions = {
  keepAlive: true,
  poolSize: 50,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const emailSchema = new mongoose.Schema({
  bcc: String,
  cc: String,
  subject: String,
  text: String,
  to: String,
})

const emailDbModel = mongoose.model('email', emailSchema)

const bundleDisconnection = () => {
  process.on('beforeExit', (code) => {
    debug('About to exit with code: %s', code)
  })
  for (let i of ['SIGINT', 'SIGUSR1', 'SIGUSR2']) {
    process.on(i, () => {
      mongoose.connection.close(() => {
        debug('mongodb will close')
        process.exit()
      })
    })
  }
}

bundleDisconnection()

class MongoInterface {
  constructor() {
    mongoose.connect(mongoAtlasLink, connectionOptions)
    mongoose.connection.on('error', (err) => {
      debug('mongo connect err: %o', err)
    })
    mongoose.connection.on('close', () => debug('mongo connection close'))
    mongoose.connection.on('connected', () => debug('mongodb connected'))
    this._dbModel = emailDbModel
  }

  /**
   * a high-order function, fellowing pattern of checking db connection
   * then determine close connection or not by param passed in
   * @param  {data for store, condition for deleting or finding} data
   * @param  {determine close db connection} needClose=true
   * @param  {pass db model action function } coreFunc
   * @param  {the key of db action's return} feedbackKey
   */
  _performAction(data, needClose = true, coreFunc, feedbackKey) {
    let feedback = {}
    return new Promise(async (resolve, reject) => {
      try {
        if (mongoose.connection.readyState === 0) await mongoose.connect(mongoAtlasLink, connectionOptions)
        let result = await coreFunc(data)
        feedbackKey !== '' ? (feedback[feedbackKey] = result[feedbackKey]) : (feedback['result'] = result)
        debug('db returns: %o', feedback)
        if (needClose) await mongoose.connection.close()
        resolve(feedback)
      } catch (error) {
        debug('e in perform action: %o', error)
        feedback.errMessage = error.message
        feedback.errName = error.name
        if (needClose) await mongoose.connection.close()
        reject(feedback)
      }
    })
  }

  // insert a record
  performInsert(data, needClose = true) {
    return this._performAction(data, needClose, (n) => this._dbModel.create(n), '_id')
  }

  // delete by db _id
  performDeleteOne(recordId, needClose = true) {
    let tmp = { _id: recordId }
    return this._performAction(tmp, needClose, (n) => this._dbModel.deleteOne(n), 'deletedCount')
  }

  //find all stored email
  performFindAll(needClose = true) {
    return this._performAction({}, needClose, () => this._dbModel.find({}), '')
  }
}

export default new MongoInterface()

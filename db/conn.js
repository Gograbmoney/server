const mongoose = require('mongoose')
//DATABASE =  mongodb+srv://nrmlsumit:Sumit210%40@cluster0.hahwy.mongodb.net/gograbmoney?retryWrites=true&w=majority
//DATABASE =  mongodb://localhost:27017
const DB = process.env.DATABASE

mongoose.connect(DB).then(() => {
    console.log(`Connection successful`)
}).catch((err) => {
    console.log(err)
})  
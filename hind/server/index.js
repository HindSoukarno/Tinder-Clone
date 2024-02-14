const PORT = 8000
const express = require('express')
const {MongoClient} = require('mongodb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')

const uri = 'mongodb+srv://hindsoukarno123:sakura12@cluster0.r4gqka4.mongodb.net/Cluster0?retryWrites=true&w=majority'

const app = express()
app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {res.json('Hello yupina!')})

app.post('/signup', async(req, res) => { 

    const client = new MongoClient(uri)
    const {email, password} = req.body

    const generatedUserId = uuidv4()
    const hashedPassword=await bcrypt.hash(password, 10)

    try {
      await client.connect()
      const database= client.db('app-data')
      const users= database.collection('users') 

       const existingUSER = await users.findOne({email})

       if (existingUSER) {
           return res.status(409).send('User already exists. Please log in.')
       }
            const sanitizedEmail= email.toLowerCase()

            const data={
                user_id: generatedUserId,
                email: sanitizedEmail,
                hashed_Password: hashedPassword,
            }

            const insertedUser= await users.insertOne(data)
    
            const token = jwt.sign(insertedUser, sanitizedEmail, {expiresIn: 60*48,})
            
            res.status(201).json({token , userId: generatedUserId})
        }

        catch (err) { console.log(err) }

})


app.post('/login', async(req, res) => {

    const client = new MongoClient(uri)
    const {email, password} = req.body

    try {
        await client.connect()
       const database= client.db('app-data')
       const users= database.collection('users') 

       const user = await users.findOne({email})

       const correctPassword = await bcrypt.compare(password, user.hashed_Password)
        
        if (user && correctPassword )
        
        {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 48
            })
            res.status(201).json({token ,userId: user.user_id})
        }

        res.status(400).json('Invalid Credentials')
    }
    catch (err) {
        console.log(err)}
        finally {
            await client.close()
        }
})





app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId

    console.log('userId',userId)

     try {
        await client.connect()
       const database= client.db('app-data')
       const users= database.collection('users')
    
       const query={users_id: userId}
       const user = await users.findOne(query)
       res.send(user)
    }

            finally { await client.close()  }

})


app.get('/gendered-users', async (req, res) => {
    const client = new MongoClient(uri)
    const gender = req.query.gender
    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = {gender_identity: {$eq: 'man'}}
        const foundUsers = await users.find(query).toArray()
        res.send(foundUsers)

    } finally {
        await client.close()
    }
})


app.get('/messages', async (req, res) => {
    const {userId, correspondingUserId} = req.query
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }
        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close()
    }
})

app.post('/message', async (req, res) => {
    const client = new MongoClient(uri)
    const message = req.body.message

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})



app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData


     try {
        await client.connect()
       const database= client.db('app-data')
       const users= database.collection('users')
    
       const query={users_id: formData.users_id}
       const updatedDocument=
        {
             $set:{
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            } ,
        
        }
        const insertedUser = await users.updateOne(query, updatedDocument)
        res.send(insertedUser)
    }

finally { await client.close()}

})


app.listen(PORT, () => console.log('Server runing on PORT ' + PORT))

 
const bcrypt = require('bcryptjs')
const express = require('express')
const jwt= require('jsonwebtoken') 
const router = express.Router()
 require('../db/conn')
const User = require('../models/userSchema')
 const authenticate = require('../middleware/authenticate')

 

  // Promise REturn type not that easy or confusing 
// Asyn Await mode 

 router.post('/register', async (req, res)=>{
   
    const {name, email, mobile, password, cpassword} = req.body

    if(!name|| !email|| !mobile|| !password|| !cpassword){
        return res.status(400).json({error: 'PLZ Fill all the details'})
    }
   
    try{
        const UserExist =await User.findOne({email: email})
         
        if(UserExist){
            res.status(400).json({error:'User already exist'})
        }
        const user = new User({name, email ,mobile , password, cpassword})

         //saves the data into db but first checks the decrypt in userSchema
        await user.save()     
        res.status(200).json({ message: 'User registered Successfully !!! '})
        res.send('User registered Successfully !!!')
    }
    catch(err){
        console.log(err)
    }
})  

     // Login check

     router.post('/signin', async (req,res)=>{
        let token;

        try{
       const {email, password} = req.body
       if(!email || !password){
           return res.status(400).json({error:'Please fill all fields'})
           }
      
         const CheckLogin = await User.findOne({email: email})
         
         //checks the email first later the password with isMatch, if not this
         //then the email error won't display

         if(CheckLogin){
            const isMatch = await bcrypt.compare(password, CheckLogin.password)
       
            token = await CheckLogin.generateAuthToken()
            console.log(token);

            //store in cookies

            res.cookie('jwtoken', token,{
                expires:new Date(Date.now() + 1000*60*60*24*15),
                httpOnly: true
            })
            if(!isMatch){
               res.status(400).json({ error:'Invalid Credentails'})
         }else{
             res.json({ message: 'User login successful !!!' })
         }
        } 
       }
       catch(er){
           console.log(er)
       }
      })

        // About Us Page authenticate
        
      router.get('/about', authenticate, (req,res)=>{
        console.log(`Hello about me opened`)
       res.json(req.rootUser)
         })

      router.get('/getdata', authenticate, (req,res)=>{
        console.log(`Hello Contact data and home data here`)
        res.json(req.rootUser)
      })

      router.post('/contact', authenticate, async (req,res) =>{ 
        try{
            const {name , email, mobile, message} = req.body
            if(!name || !email || !mobile|| !message){
                console.log('Error in contact form');
               res.json({message: 'Fill all the fields to contact us'})
            }            
                 const Usercontact = await User.findOne({_id: req.UserID})
                 if(Usercontact){
                    const Usermessage = await Usercontact.addMessage(name, email, mobile, message)
                    await Usercontact.save()
                    res.status(200).json({message:'YOur contact form reached Us'})
                 }          
        }
        catch(err){
              console.log(err);
        }     
      })

      //Logout page
      router.get('/logout', (req,res) => {
          console.log('Logged out');
          res.clearCookie('jwtoken', {path:'/'})
          res.status(200).send('Logged out Successfully')
          
      })

 module.exports = router;
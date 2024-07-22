import createTokenAndSaveCookie from "../jwt/genrateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;
    
    try {
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already registered" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            fullName,  // Ensure fullName is being passed here
            email,
            password: hashPassword
        });

        // Save the user to the database
        await newUser.save();

        // If newUser is successfully created, generate token and save it to cookie
        createTokenAndSaveCookie(newUser._id, res);
        return res.status(201).json({ message: "User created successfully", newUser });

    } catch (error) {
        console.error("Signup Error: ", error);  // Improved error logging
        return res.status(500).json({ error: "Something went wrong in the internal server" });
    }
};

export const login=async (req,res)=>{
    const {email,password}=req.body;
    try{
        
        const user=await User.findOne({email});
        const isMatch=bcrypt.compare(password,user.password);
        if(!user || !isMatch){
            return res.status(400).json({error:"Invalid User credentials"})
        }
        createTokenAndSaveCookie(user._id,res);
        res.status(200).json({message:"USer logged in Sucessfully",user:{
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
        }})
      
    }catch(error){
            console.log(error);
            res.status(500).json({error:"Internal Server error"});
    }
}

export const logout=async(req,res)=>{
    try{
        res.clearCookie("jwt");
        res.status(200).json({message:"User Logged out sucessfully"});

    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server error"});
    }
};

export const allUsers=async (req,res)=>{
    try{
        const allUsers= await User.find().select("-password");
        res.status(201).json(
            allUsers,
        );
    }catch(error){
        console.log("Error in allUsers Controllers: "+error);

    }
}
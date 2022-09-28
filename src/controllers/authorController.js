const authorModel = require("../models/authorModel")
const bcrypt = require("bcrypt");
const { isValidEmail, isValidPass, isValidName, isValidTitleEnum } = require("../util/validator")

//-------------------------------------createAuthor-------------------------------------------
const createAuthor = async (req, res) => {
    try {
        const reqBody = req.body;
        const { fname, lname, title, email, password } = reqBody

        // ------------------ data present or not in the body--------------------
        const objKey = Object.keys(reqBody).length

        if (objKey === 0)
            return res.status(400).send({ status: false, msg: "Please fill data" });

        if (objKey > 5)
            return res.status(400).send({ status: false, msg: "You can't input extra field" });

        //----------------data present or not in the body-----------------
        if (!fname)
            return res.status(400).send({ status: false, msg: 'Please fill fname' })

        if (!lname)
            return res.status(400).send({ status: false, msg: 'Please fill lname' })

        if (!title)
            return res.status(400).send({ status: false, msg: 'Please fill title' })

        if (!email)
            return res.status(400).send({ status: false, msg: 'Please fill email' })

        if (!password)
            return res.status(400).send({ status: false, msg: 'Please fill password' })

        // ------------------------ data validations-----------------------------
        if (!isValidName(fname))
            return res.status(400).send({ status: false, message: "Enter valid name first" });

        if (!isValidName(lname))
            return res.status(400).send({ status: false, message: "Enter valid last name" })

        if (!isValidTitleEnum(title))
            return res.status(400).send({ status: false, message: "Enter valid last title" })

        if (!isValidEmail(email))
            return res.status(400).send({ status: false, message: "Enter valid email formate" })

        if (!isValidPass(password))
            return res.status(400).send({ status: false, message: "Enter valid password" });
      
        // ---------------------------existUser or not------------------------------
        const existUser = await authorModel.findOne({ email });
        if (existUser)
            return res.status(401).send({ status: false, message: "This email already registered" })

        //-------------------password hashing-------------------
        const hashPassword = await bcrypt.hash(password, 10);
        req.body.password = hashPassword

        //-------------------author creation--------------------
        const newAuthor = await authorModel.create(reqBody);

        res.status(201).send({ status: true, data: newAuthor })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createAuthor };

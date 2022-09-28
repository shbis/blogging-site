const authorModel = require('../models/authorModel')
const { isValidEmail, isValidPass } = require("../util/validator")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

//-------------------------------------------login--------------------------------------------
const authorLogin = async (req, res) => {
    try {
        const reqBody = req.body;
        const { email, password } = reqBody

        // -----------------data present or not or extra in the body-------------------
        const objKey = Object.keys(reqBody).length

        if (objKey === 0)
            return res.status(400).send({ status: false, msg: "Please fill data" });

        if (objKey > 2)
            return res.status(400).send({ status: false, msg: "You can't input extra field" });

        //----------------email & password present or not in the body----------------
        if (!email)
            return res.status(400).send({ status: false, msg: 'Please fill email' })

        if (!password)
            return res.status(400).send({ status: false, msg: 'Please fill password' })

        // --------------------- email, password validations------------------------
        if (!isValidEmail(email))
            return res.status(400).send({ status: false, message: "Wrong email" })

        if (!isValidPass(password))
            return res.status(400).send({ status: false, message: "Wrong password" });

        // ---------------------------verifying author------------------------------
        const existUser = await authorModel.findOne({ email });
        if (!existUser)
            return res.status(401).send({ status: false, message: "Register yourself" })

        // ---------------------------decoding hash password---------------------------
        const matchPass = bcrypt.compare(password, existUser.password);

        if (!matchPass)
            return res.status(400).send({ status: false, message: "You Entered Wrong password" })

        //------------------token generation-----------------
        const token = jwt.sign({ authorId: existUser._id, }, process.env.SECRET_KEY);

        res.setHeader("x-api-key", token)

        return res.status(200).send({ status: true, token: token })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { authorLogin }

const blogModel = require("../models/blogModel");
const { isValidObjectId, isValidText } = require("../util/validator")

//---------------------------------------createBlog-------------------------------------
const createBlog = async (req, res) => {
    try {
        const reqBody = req.body
        const { title, body, authorId, category, tags, subcategory, isPublished } = reqBody

        //----------creating object-----------
        const data = {
            authorId: req.user,
            title: title,
            body: body,
            category: category,
            tags: tags,
            subcategory: subcategory,
            isPublished: isPublished
        }
        console.log(req.user)

        // -----------------data present or not or extra in the body-------------------
        const objKey = Object.keys(reqBody).length

        if (objKey == 0)
            return res.status(400).send({ status: false, msg: "Please fill field" });

        if (objKey > 7)
            return res.status(400).send({ status: false, msg: "You can't input extra field" });

        //-------------------data present or not in the body---------------------
        if (!title)
            return res.status(400).send({ status: false, msg: 'Please fill title' })

        if (!body)
            return res.status(400).send({ status: false, msg: 'Please fill body' })

        if (!authorId)
            return res.status(400).send({ status: false, msg: 'Please fill authorId' })

        // --------------------- title, body, authorId validations--------------------
        if (!isValidText(title))
            return res.status(400).send({ status: false, msg: "Enter valid title" });

        if (!isValidText(body))
            return res.status(400).send({ status: false, msg: "Enter valid body" });

        if (!isValidObjectId(authorId))
            return res.status(400).send({ status: false, msg: "Enter valid authorId" });

        //----------------------------checking Authorization--------------------------
        if (authorId != req.user)
            return res.status(403).send({ status: false, msg: "You are unauthorized" });

        //------------------------------blog creation------------------------
        const newBlog = await blogModel.create(data);
        return res.status(201).send({ status: true, data: newBlog });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


//--------------------------------------------getBlog-----------------------------------------------
const getBlog = async (req, res) => {
    try {
        const reqBody = req.query;
        const { authorId, category, tags, subcategory } = reqBody

        //------------------------------authorId validation------------------------
        if (authorId)
            if (!isValidObjectId(authorId))
                return res.status(400).send({ status: false, msg: "authorId is not valid" })

        if ((Object.keys(reqBody).length === 0) || (authorId || category || tags || subcategory)) {

            const blog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, reqBody] });

            if (blog.length === 0)
                return res.status(404).send({ status: false, msg: "Blog not found" });

            return res.status(200).send({ status: true, data: blog });

        } else
            return res.status(400).send({ status: false, msg: "Invalid query" });

    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};

//-------------------------------------------------updateBlog----------------------------------------------
const updateBlog = async (req, res) => {
    try {
        const reqBody = req.body;
        const blogId = req.params.blogId
        const { title, body, tags, subcategory, category, isPublished } = reqBody;

        // ------------------------data present or not or extra in the body-------------------------
        const objKey = Object.keys(reqBody).length

        if (objKey == 0)
            return res.status(400).send({ status: false, msg: "Please fill the mandatory data on the body" })

        if (objKey > 8)
            return res.status(400).send({ status: false, msg: "You can't update extra field" });

        if (Object.values(reqBody) == "")
            return res.status(400).send({ status: false, msg: "Please fill value" })

        if (Object.keys(reqBody) == "")
            return res.status(400).send({ status: false, msg: "Please fill at least one key" })

        //----------------------checking blogId-------------------------
        if (!isValidObjectId(blogId))
            return res.status(400).send({ status: false, msg: "BlogId is not valid" })

        //----------------------finding blog by id through params------------------------
        const blog = await blogModel.findById(blogId);

        if (!blog)
            return res.status(400).send({ status: false, msg: "Blog does not exists" })

        //-------------------------------checking Unauthorized---------------------------------
        if (req.user != blog.authorId)
            return res.status(403).send({ status: false, msg: "You are unauthorized." });

        if (Object.values(blog) === 0 || blog.isDeleted === true)
            return res.status(404).send({ status: false, msg: "Blog not found" });

        //----------------------------------------updating blog--------------------------------------
        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $addToSet: { tags, subcategory, category }, $set: { title, body, publishedAt: Date.now(), isPublished: isPublished } }, { new: true });

        // -------------------$addToSet----------------------
        // ["a", "b"] = tags / subcategory,(exists)
        // ["c"] = ["a", "b", "c"],(result)
        // ["a", "b", "c"] = ["a", "b", "c"],(result)

        return res.status(200).send({ status: true, msg: updatedBlog });
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//----------------------------------------deleteBlog--------------------------------------------
const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;

        //----------------------checking blogId-------------------------
        if (!isValidObjectId(blogId))
            return res.status(400).send({ status: false, msg: "BlogId is not valid" })

        //-------------------finding blog by id through params-------------------
        const blog = await blogModel.findById(blogId)

        if (!blog)
            return res.status(400).send({ status: false, msg: "Blog does not exists" })

        //-------------------------checking Unauthorized-----------------------------
        if (req.user != blog.authorId)
            return res.status(403).send({ status: false, msg: "You are unauthorized." });

        if (blog.isDeleted === true)
            return res.status(404).send({ status: false, msg: "No blog exits" })

        //--------------------------------deleting blog by id-------------------------------------
        await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() } }, { new: true });

        return res.status(200).send({ status: true, msg: `'${blog.title}' blog has been deleted.` })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//-------------------------------------------deletedByQuery-------------------------------------------------
const deletedByQuery = async (req, res) => {
    try {
        const data = req.query;
        const { authorId, category, tags, subcategory, isPublished } = data

        // ------------------------data present or not or extra in the body-------------------------
        const objKey = Object.keys(data).length
        if (objKey === 0)
            return res.status(400).send({ status: false, msg: "no data on query params" })

        if (objKey > 5)
            return res.status(400).send({ status: false, msg: "You can't put extra field" });

        if (authorId || category || tags || subcategory || isPublished) {
            //------------------------------finding blog by id through query-------------------------
            const findBlog = await blogModel.find({ $and: [{ authorId: req.user }, data] });

            if (findBlog.length === 0)
                return res.status(404).send({ status: false, msg: "blog not found" });

            const findAuthor = findBlog[0].authorId;

            //--------------------------------deleting blog by query-------------------------
            if (findAuthor) {
                const allBlog = await blogModel.updateMany(
                    { $and: [data, { authorId: req.user }, { isDeleted: false }] },
                    { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() } }
                );

                //-----------------------------sending response-------------------------------
                if (allBlog.modifiedCount === 0) {
                    return res.status(400).send({ status: false, msg: "No blog to be deleted" });
                } else
                    return res.status(200).send({ status: true, data: `${allBlog.modifiedCount} blog deleted` });

            } else
                res.status(400).send({ status: false, msg: "Found author is not valid" });

        } else
            return res.status(400).send({ status: false, msg: "Invalid query" });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deletedByQuery, };

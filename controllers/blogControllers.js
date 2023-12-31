const Blog = require("../models/Blogs");
const Rating = require("../models/Rating");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const getBlogsByAuthor = asyncErrorHandler(async (req, res) => {
  let author = req.user._id;
  let blogs = await Blog.find({ author: author }).populate("author");
  return res.render("blogsByAuthor", { blogs });
});

const postBlog = asyncErrorHandler(async (req, res) => {
  let user = req.user;
  const newBlog = await Blog.create({
    title: req.body.title,
    snippet: req.body.snippet,
    description: req.body.description,
    image: req.file,
    author: user._id,
    price: req.body.price,
  });
  res.status(201).json({
    status: "success",
    data: {
      newBlog,
    },
  });
});

const getBlog = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).populate("author");
  const ratings = await Rating.find({ blog: blog._id }).populate("user");
  res.render("blog", { blog, ratings });
});

const getBlogs = asyncErrorHandler(async (req, res) => {
  let search = req.query.search || "";
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || 2;
  let sort = req.query.sort || "rating";
  let skip = (page - 1) * limit;
  sort && sort.split(",").join(" ");

  const blogs = await Blog.find({ title: { $regex: search, $options: "i" } })
    .populate("author")
    .skip(skip)
    .limit(limit)
    .sort(sort);
  let totalBlogs = await Blog.find({ title: { $regex: search, $options: "i" } })
    .populate("author")
    .countDocuments();
  res.render("blogs", {
    page,
    limit,
    totalPages: Math.ceil(totalBlogs / limit),
    blogs,
    previous: page - 1,
    next: page + 1,
  });
});

const getUpdateBlog = asyncErrorHandler(async (req, res) => {
  let id = req.params.id;
  let blog = await Blog.findById(id);
  res.render("updateBlog", { blog });
});

const updateBlog = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  console.log("hello");
  // const { title, description, snippet } = req.body;
  if (req.user.role === "author") {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body,
          image: req.file,
        },
      },
      { new: true, runValidators: true }
    );
    return res.redirect("/app/v1/blogs/author");
  }
});

const deleteBlog = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  return res.redirect("/app/v1/blogs/author");
});

let postRating = asyncErrorHandler(async (req, res) => {
  let user = req.user._id;
  let blog = req.params.id;

  let duplicateRating = await Rating.findOne({ user: user, blog: blog });
  if (duplicateRating) {
    duplicateRating.ratings = req.body.ratings;
    await duplicateRating.save();
    return res.redirect("/app/v1/blogs/ratings/:id");
  }
  await Rating.create({
    ratings: +req.body.ratings,
    user: user,
    blog: blog,
  });
  res.redirect("/app/v1/blogs/ratings/:id");
});

const dashboard = (req, res) => {
  if (req.user.role === "admin") {
    return res.render("adminDashBoard");
  }
  if (req.user.role === "user") {
    return res.render("userDashBoard");
  }
  if (req.user.role === "author") {
    return res.render("authorDashBoard");
  }
};

module.exports = {
  postBlog,
  getBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  postRating,
  dashboard,
  getUpdateBlog,
  getBlogsByAuthor,
};

const stripe = require("stripe")(
  "sk_test_51O5R2kSCi320FAxpfOupAoCwckxAPfWdAquURzGgsGq4mJqadlytA5lYH8xi6i7wU8ruWR1HZbt3beB2hMFmS2BC00bgZr5o5o"
);
const Blog = require("../models/Blogs");
const router = require("express").Router();

const MY_DOMAIN = "http://localhost:5000/app/v1/payment";

router.get("/create-checkout-session/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("checkout", { blog });
});

router.post("/create-checkout-session/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: blog.title,
          },
          unit_amount: blog.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${MY_DOMAIN}/success`,
    cancel_url: `${MY_DOMAIN}/cancel`,
  });

  res.redirect(303, session.url);
});

router.get("/success", (req, res) => {
  res.render("success");
});

router.get("/cancel", (req, res) => {
  res.render("cancel");
});

module.exports = router;

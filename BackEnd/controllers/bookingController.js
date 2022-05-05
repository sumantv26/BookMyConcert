const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const errIdentifier = require("../utils/errIdentifier");
const Concert = require("../models/ConcertModels/Concert");

exports.getCheckoutSession = errIdentifier.catchAsync(
  async (req, res, next) => {
    const concert = await Concert.findById(req.params.concertId);
    const quantity = req.body?.quantity || 1;

    console.log(__dirname);
    if (!concert)
      return errIdentifier.generateError(next, "Concert not found!", 404);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${req.protocol}://${req.get("host")}/`,
      cancel_url: `${req.protocol}://${req.get("host")}/concert/:${
        concert._id
      }`,
      customer_email: req.user.email,
      client_reference_id: concert._id,
      line_items: [
        {
          name: concert.name,
          description: concert.description,
          images: [`${__dirname}/../public/img/concerts/${concert.coverImage}`],
          amount: concert.price * 100,
          currency: "inr",
          quantity,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      session,
    });
  }
);

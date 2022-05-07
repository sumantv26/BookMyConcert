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
      success_url: `${req.protocol}://${req.get("host")}/user/me/bookings`,
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

//TODO:
exports.getAllBookings = errIdentifier.catchAsync(async (req, res, next) => {});

// async function createBookingEntry(session) {
//   const tour = session.client_reference_id;
//   const user = (await User.findOne({ email: session.customer_email })).id;
//   const price = session.amount_total / 100;
//   await Booking.create({ tour, user, price });
// }

//TODO:
exports.webhookCheckout = errIdentifier.catchAsync(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRWHSEC
    );
  } catch (err) {
    return res.status(400).send(err.message);
  }
  if (event.type === "checkout.session.completed")
    // createBookingEntry(event.data.object);
    res.status(200).json({ recieved: true });
});

exports.getMyBookings = errIdentifier.catchAsync(async (req, res, next) => {});

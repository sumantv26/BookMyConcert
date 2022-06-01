const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getModel = require("../utils/getModel");
const mongoose = require("mongoose");
const errIdentifier = require("../utils/errIdentifier");
const AllUsers = require("../models/UserModels/AllUsers");
const Concert = require("../models/ConcertModels/Concert");
const Booking = require("../models/ConcertModels/Booking");

exports.getCheckoutSession = errIdentifier.catchAsync(
  async (req, res, next) => {
    console.log(req.params.concertId);
    const concert = await Concert.findById(req.params.concertId);
    const quantity = req.body?.quantity || 1;
    console.log(__dirname);
    if (!concert)
      return errIdentifier.generateError(next, "Concert not found!", 404);

    if (concert.bookedSlots + quantity > concert.totalSlots)
      return errIdentifier.generateError(
        next,
        "Concert is fully booked! Sorry for the inconvenience",
        409
      );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `https://rave-square-concert-booking.netlify.app/success`,
      cancel_url: `https://rave-square-concert-booking.netlify.app/bookings`,
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

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    res.status(200).json({
      status: "success",
      session,
      client_secret: paymentIntent.client_secret,
    });
  }
);

//TODO:
exports.getAllBookings = errIdentifier.catchAsync(async (req, res, next) => {
  const allBookings = await Booking.find({ concertId: req.params.concertId });
});

async function createBookingEntry(session) {
  const concertId = session.client_reference_id;
  const { role } = await AllUsers.findOne({ email: session.customer_email });
  const Model = getModel(role);
  const customerId = (await Model.findOne({ email: session.customer_email }))
    .id;
  const price = session.line_items[0].amount / 100;
  const quantity = session.quantity;
  await Booking.create({
    concertId,
    customerId,
    price,
    noOfBookings: quantity,
  });
  await Concert.findByIdAndUpdate(concertId, {
    $inc: { amtCollected: price, bookedSlots: quantity },
  });
}

exports.webhookCheckout = errIdentifier.catchAsync(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(err.message);
  }
  if (event.type === "checkout.session.completed")
    createBookingEntry(event.data.object);
  res.status(200).json({ recieved: true });
});

exports.getMyBookings = errIdentifier.catchAsync(async (req, res, next) => {
  // const newBooking = await Booking.create({
  //   concertId: mongoose.Types.ObjectId("62624b36dc2f7cdf0889e010"),
  //   customerId: mongoose.Types.ObjectId("625e40de3a2fd0d7ead3d918"),
  //   noOfBookings: 3,
  //   price: 3000,
  // });
  // console.log(newBooking);
  const myBookings = await Booking.find({ customerId: req.user.id })
    .populate({
      path: "concertId",
      // select: {
      //   name: 1,
      //   coverImage: 1,
      // },
    })
    .populate({
      path: "customerId",
      select: {
        name: 1,
        avatar: 1,
      },
    });

  res.status(200).json({
    status: "success",
    myBookings,
  });
});

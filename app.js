const express = require("express");
const app = express();
// const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require("cors");
const mongoose = require("mongoose");
const moment = require("moment");
const nodemailer = require('nodemailer');
const path = require("path");
const http = require("http");
require("dotenv").config();
const morgan = require("morgan");
const cron = require("node-cron");

// mongoose
//   .connect(process.env.DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Database Connected........."))
//   .catch((err) => console.log("Database Not Connected !!!"));

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(async() =>{
    console.log("Database Connected.........");
    
     }

  ).catch((err) => console.log("Database Not Connected !!!"));
  const promocodeModel = require("./Model/Admin/promocode");
const product = require("./Routes/Admin/product");
const fruits = require("./Routes/Admin/fruits");
const admin = require("./Routes/Admin/admin");
const user = require("./Routes/User/user");
const clubuser = require("./Routes/User/clubuser");
const wallet = require("./Routes/User/wallet");

const driver = require("./Routes/User/driver");
const transport = require("./Routes/User/transporter");

const vehicle = require("./Routes/User/vehicle");
const banner = require("./Routes/Admin/addbanner");
const clubbanner = require("./Routes/Admin/addclubbanner");

const disbanner = require("./Routes/Admin/adddisbanner");
const promocode = require("./Routes/Admin/promocode");
const delivery = require("./Routes/Admin/Deliverycharges");
const image = require("./Routes/Admin/image");
const video = require("./Routes/Admin/video");
const feedback = require("./Routes/Admin/feedback");
const category = require("./Routes/Admin/Category");
const Testimonial = require("./Routes/Admin/Testimonial");

const subcategory = require("./Routes/Admin/Subcategory");
const title = require("./Routes/Admin/Title");
const Abandoned = require("./Routes/Admin/Abandoned");
const tag = require("./Routes/Admin/Tag");
const text = require("./Routes/Admin/Text");
const unit = require("./Routes/Admin/Unit");
const businessprofile = require("./Routes/Admin/BusinessProfile");
const subscriptionorder = require("./Routes/User/subscriptionorder");
const FirebaseConfig = require("./Routes/Admin/Firebaseconfig");

const loan = require("./Routes/User/loan");
const blog = require("./Routes/User/blog");
const contact = require("./Routes/User/contact");
const order = require("./Routes/User/order");
const address = require("./Routes/User/address");
const otp = require("./Routes/User/otp");
const checkin=require('./Routes/User/checkin');
const checkout=require("./Routes/User/checkout");
const leaves = require("./Routes/User/leaves");
const Phonepay = require("./Routes/User/Phonepay");
const SobcriberController=require('./Controller/User/subscriptionorder');

app.use(morgan("dev"));
// app.use(helmet());
// app.use(cors({ origin: 'https://parnetslink.co.in' }));
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({
    origin: [ 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


// app.use(cors());
// app.use(express.static("Public"));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
// });
// app.use(limiter);



app.use("/api/admin", FirebaseConfig);
app.use("/api/admin", businessprofile);
app.use("/api/admin", admin);
app.use("/api/admin", product);
app.use("/api/admin", fruits);
app.use("/api/admin", image);
app.use("/api/admin", video);
app.use("/api/admin", feedback);
app.use("/api/admin", banner);
app.use("/api/admin", clubbanner);

app.use("/api/admin", disbanner);
app.use("/api/admin", promocode);
app.use("/api/admin", delivery);
app.use("/api/admin", category);
app.use("/api/admin", Testimonial);

app.use("/api/admin", subcategory);
app.use("/api/admin", title);
app.use("/api/admin", Abandoned);

app.use("/api/admin", tag);
app.use("/api/admin", text);
app.use("/api/admin", unit);
app.use("/api/user", subscriptionorder);
app.use("/api/user",checkin);
app.use("/api/user",checkout);

app.use("/api/user",leaves);
app.use("/api/user", user);
app.use("/api/user", clubuser);

app.use("/api/user", driver);
app.use("/api/user", transport);
app.use("/api/user", vehicle);
app.use("/api/user", loan);
app.use("/api/user", blog);
app.use("/api/user", contact);
app.use("/api/user", wallet);

app.use("/api/user", order);
app.use("/api/user", address);
app.use("/api/user", otp);
app.use("/api/user", Phonepay);


var today = new Date();

var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

moment(today).format("MMMM d, YYYY");
const checkExpirationTime = () => {
  promocodeModel
    .find({})
    .exec()
    .then((Coupon) => {
      if (Coupon) {
        Coupon.map((getCoupon) => {
          if (
            moment().format("DD/MM/YYYY") ===
            moment(getCoupon.enddate, "YYYY-MM-DD").format("DD/MM/YYYY")
          ) {
            promocodeModel
              .findOneAndDelete({
                _id: getCoupon._id,
              })
              .exec()
              .then((deleteCoupon) => {
                console.log(`Coupon doesnt exists or expired`);
              })
              .catch((error) => {
                console.log(error, "Error occured on coupon section");
              });
          }
        });
      }
      if (!Coupon) {
        console.log("No Coupon found...");
      }
    });
};

//   SobcriberController.processSubscriptions();
// Run every day at midnight (00:00)

// Cron job for midnight (00:00)
cron.schedule(
  "0 0 * * *", // Cron expression for midnight every day
  async () => {
    try {
      console.log("Cron job started: Running daily subscription processing at midnight...");

      // Call the processSubscriptions function
      await SobcriberController.processSubscriptions();

      console.log("Cron job completed: Subscription processing at midnight finished.");
    } catch (error) {
      console.error("Error in midnight cron job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Set the timezone to Asia/Kolkata
  }
);

// Cron job for after noon (12:00 PM)
cron.schedule(
  "0 12 * * *", // Cron expression for 12:00 PM every day
  async () => {
    try {
      console.log("Cron job started: Running daily subscription processing at noon...");

      // Call the processSubscriptions function
      await SobcriberController.processSubscriptions();

      console.log("Cron job completed: Subscription processing at noon finished.");
    } catch (error) {
      console.error("Error in noon cron job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Set the timezone to Asia/Kolkata
  }
);

console.log("Cron jobs scheduled for midnight and noon subscription processing.");

// app.get("/", (req, res) => {
//   return res.send("Hello, Abhinandhan Orgaincs!");
// }); 
app.use(express.static(path.join(__dirname, 'build'))); // Change 'build' to your frontend folder if needed

// Redirect all requests to the index.html file

app.get("*", (req, res) => {
  return  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 7999;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
 setInterval(checkExpirationTime, 12000);

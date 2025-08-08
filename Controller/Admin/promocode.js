const promocodeModel = require("../../Model/Admin/promocode");

function generateRandomCode(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}


class promocode {

    async postaddpromocode(req, res) {
        let { promocode, enddate, startdate, discountpercentage } = req.body;
        let isUnique = false;
        let couponCode;

        // Ensure unique code
        while (!isUnique) {
            couponCode = generateRandomCode();
            const existingCoupon = await promocodeModel.findOne({ code: couponCode });
            if (!existingCoupon) {
                isUnique = true;
            }
        }
        try {
            let newpromocode = new promocodeModel({
                promocode,
                code: couponCode,
                enddate, startdate,
                discountpercentage
            })

            let save = newpromocode.save()

            if (save) {
                return res.json({ success: "promocode added successfully" })
            }

        } catch (error) {
            console.log(error)
        }
    }
    async posteditpromocode(req, res) {
        const id = req.params.id;
        let { promocode, enddate, startdate, discountpercentage } = req.body;
        let obj = {};
        if (promocode) {
            obj["promocode"] = promocode;
        }
        if (enddate) {
            obj["enddate"] = enddate;
        }
        if (startdate) {
            obj["startdate"] = startdate;
        }
        if (discountpercentage) {
            obj["discountpercentage"] = discountpercentage;
        }
        try {
            await promocodeModel
                .findOneAndUpdate(
                    { _id: id },
                    { $set: obj },
                    { new: true }
                )

            let user = await promocodeModel.findOne({ _id: id });
            if (user) {
                return res.json({ success: "success" })
            }
            else {
                return res.json({ error: "error" })
            }
        } catch (err) {
            console.log(err);
        }
    }
    async getallpromocode(req, res) {
        let promocode = await promocodeModel.find({}).sort({ _id: -1 });

        if (promocode) {
            return res.json({ promocode: promocode });
        } else {
            return res.status(403).json({ error: "not able find promocode" })
        }
    }

    async getavailablecoupons(req, res) {
        try {
            // Get the current date
            const currentDate = new Date();

            // Find coupons that are valid (start date <= current date <= end date)
            const availableCoupons = await promocodeModel.find({
                startdate: { $lte: currentDate }, // Start date must be less than or equal to the current date
                enddate: { $gte: currentDate },    // End date must be greater than or equal to current date
            });



            res.status(200).json({ availableCoupons: availableCoupons });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        }
    };

    async checkpromocode(req, res) {
        try {
            const { promocode, userId, userName } = req.body;

            // Find the promo code in the database

            console.log("promocode", promocode);

            const promoData = await promocodeModel.findOne({ code: promocode });

            // Check if the promo code exists
            if (!promoData) {
                return res.status(400).json({ error: "Invalid promo code!" });
            }

            const currentDate = new Date();

            // Validate if the promo code has not started
            if (promoData.startdate && currentDate < new Date(promoData.startdate)) {
                return res.status(400).json({ error: "Promo code is not active yet!" });
            }

            // Validate if the promo code has expired
            if (promoData.enddate && currentDate > new Date(promoData.enddate)) {
                return res.status(400).json({ error: "Promo code has expired!" });
            }

            // Track the user's usage of the promo code
            await promocodeModel.findOneAndUpdate(
                { _id: promoData._id },
                { $push: { used: { userId, userName } } }
            );

            return res.status(200).json({
                success: "Promo code applied successfully!",
                discount: promoData.discountpercentage,
            });
        } catch (error) {
            console.error("Error while checking promo code:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }



    async postdeletepromocode(req, res) {
        let id = req.params.id;
        const data = await promocodeModel.deleteOne({ _id: id });

        return res.json({ success: "Successfully" });
    }
    async getCouponBycode(req, res) {
        try {
            let { promocode, userId } = req.body;
            console.log("promocode,userId", promocode, userId)
            let data = await promocodeModel.findOne({ promocode: promocode });
            if (!data) return res.status(400).json({ error: "coupon not found!" });
            let am = data.used.filter((ele) => ele.userId === userId)
            if (am.length !== 0) return res.status(400).json({ error: "You already used coupon" });
            return res.status(200).json({ success: data })

        } catch (error) {
            console.log(error);
        }
    }

}

const promocodeController = new promocode();
module.exports = promocodeController;
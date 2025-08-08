
const mongoose = require("mongoose");
const checkoutModel = require("../../Model/User/checkout");
const { default: axios } = require("axios");

const ObjectId = mongoose.Types.ObjectId;
class CheckOut {
//   async checkout(req, res) {
//     let data = req.body[0];
//      try {
//       data.map(async (datas) => {
//         let neworder = new checkoutModel({
//           userid: datas.userid,
//           amount: datas.amount,
//           tax: datas.tax,
//           productname: datas.productname,
//           productId: datas.productId,
//           offerprice: datas.offerprice,
//           firstName: datas.firstName,
//           quantity: datas.quantity,
//            lastName:datas.lastName,
//        mobile:datas.mobile,
//           address: datas.address,
//           price: datas.price,
//           productdescription: datas.productdescription,
//           productbrand: datas.productbrand,
//           productmodel: datas.productmodel,
//           city: datas.city,
//           state: datas.state,
//           country: datas.country,
//           pinCode: datas.pinCode,
//           category1: datas.category1,
        
//           email:datas.email,
//         });
//         neworder.save();
//         console.log(data,"data");
//       })
//       .catch(function (error) {
//         console.error(error);
//       });
  
  
//   return res.status(200).json({ success: "success" });
// } catch (error) {
//   console.log(error);
// }
// }
async checkout1(req, res) {
  let orderdata = req.body[0];
 
  try {
  

        let neworder = new checkoutModel({
            userid: orderdata[0].userid,
          amount: orderdata[0].amount,
          tax: orderdata[0].tax,
          productname: orderdata[0].productname,
          productId: orderdata[0].productId,
          offerprice: orderdata[0].offerprice,
          firstName: orderdata[0].firstName,
          quantity: orderdata[0].quantity,
           lastName:orderdata[0].lastName,
       mobile:orderdata[0].mobile,
          address: orderdata[0].address,
          price: orderdata[0].price,
          productdescription: orderdata[0].productdescription,
          productbrand: orderdata[0].productbrand,
          productmodel: orderdata[0].productmodel,
          city: orderdata[0].city,
          state: orderdata[0].state,
          country: orderdata[0].country,
          pinCode: orderdata[0].pinCode,
          category1: orderdata[0].category1,
        
          email:orderdata[0].email,
          });
          neworder.save().then((data) => {
            // console.log(data);
          });
    
          return res.status(200).json({ success: "success" });
        } catch (error) {
          console.log(error);
        }
      }
    
  async getcheckout(req, res) {
    let userid = req.params.userid;

    let checkout = await checkoutModel.aggregate([
        {
        $match: { userid: new ObjectId(userid) },
      },
      {
        $sort: { _id: -1 },
      },
    ]);
    if (checkout) {
      return res.status(200).json({ checkout: checkout, userid: userid });
    } else {
      return res.status(500).json({ error: "something went wrong" });
    }
  }
  async getcheckoutAll(req, res) {
    let checkout = await checkoutModel.aggregate([
      {
        $sort: { _id: -1 },
      },
    ]);
    if (checkout) {
      return res.status(200).json({ checkout: checkout });
    } else {
      return res.status(500).json({ error: "something went wrong" });
    }
  }
  async deleteorder(req, res) {
    let id = req.params.id;
    const data = await checkoutModel.findOneAndUpdate({ _id: id },{status:"Canceled"});
    if (data) {
      console.log(data);
      return res.json({ success: "Canceled successfully" });
    } else {
      return res.status(500).json({ error: "cannot able to do" });
    }
  }
 
}

const checkoutController = new CheckOut();
module.exports = checkoutController;

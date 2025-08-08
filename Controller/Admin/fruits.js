const fruitsModal = require("../../Model/Admin/fruits");
const SubcategoryModel = require("../../Model/Admin/Subcategory");
const CategoryModel = require("../../Model/Admin/Category");
const {
  isValid,
  isValidNum,
  isValidString,
  isValidObjectId,
  validUrl,
} = require("../../Config/function");
const { default: mongoose } = require("mongoose");

class fruits {
  async addfruits(req, res) {
    try {
      let {
        productname,
        description,
        subscribe,
        category,
        subcategory,
        Clubweight,
        tag,
        price,
        discount,
        stock,
        unit,
        miniunit,
        ministock,
        clubdiscount,
        weight,
      } = req.body;
const categoryExists = await CategoryModel.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ error: "Category not found" });
      }
       const subcategoryExists = await SubcategoryModel.findById(subcategory);
      if (!categoryExists) {
        return res.status(404).json({ error: "Category not found" });
      }
      let offerPrice = price - Math.round(price * (discount / 100));
      let obj = {
        productname,
        description,
        category,
        subscribe,
        Clubweight,
        subcategory,
        tag,
        price,
        discount,
        stock,
        unit,
        miniunit,
        ministock,
        clubdiscount,
        weight,
        offerPrice: offerPrice,
      };

      let NewMarketfruits = new fruitsModal(obj);
      NewMarketfruits.save().then((data) => {
        return res.status(200).json({
          fruits: NewMarketfruits,
          Success: "Product Added successfully",
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getMarketfruitsList(req, res) {
    try {
      const marketfruitsList = await fruitsModal.find({}).sort({_id:-1});
      if (marketfruitsList) {
        return res.status(200).json({ fruitsList: marketfruitsList });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async changefruitsActiveStatus(req, res) {
    try {
      let fruits = req.params.fruitsid;

      const data = await fruitsModal.findOneAndUpdate(
        { _id: fruits },
        { status: "Inactive" }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.json({ success: "Blocked Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async changefruitsInactiveStatus(req, res) {
    try {
      let fruits = req.params.fruitsid;
      const data = await fruitsModal.findOneAndUpdate(
        { _id: fruits },
        { status: "Active" }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.json({ success: "Approved Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getfruitsByCategory(req, res) {
    try {
      const category = req.query.category;

      const findfruits = await fruitsModal.find({
        category: category,
      }).sort({_id:-1});
      const fruitsCount = findfruits.length;
      if (findfruits.length != 0)
        return res
          .status(200)
          .json({ fruitsCount: fruitsCount, fruitsDetails: findfruits });
      return res
        .status(200)
        .json({ success: false, msg: "Product is not available." });
    } catch (error) {
      console.log(error);
    }
  }
  async addfruitsPhotos(req, res) {
    try {
      let { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      let obj = {};
      if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr.length; i++) {
          if (arr[i].fieldname == "Photos") {
            obj["file"] = arr[i].filename;
          }
        }
      }

      let data = await fruitsModal.updateOne(
        { _id: id },
        { $push: { Photos: obj } }
      );

      return res.status(200).json({ success: "Successfully Added" });
    } catch (error) {
      console.log(error);
    }
  }
  async removefruitsPhotos(req, res) {
    try {
      let removeId = req.params.removeId;
      let id = req.params.id;
      console.log(id, removeId);
      let add = await fruitsModal.findOneAndUpdate(
        { _id: id },
        { $pull: { Photos: { _id: removeId } } },
        { new: true }
      );
      if (!add)
        return res.status(400).json({ success: "Something went worng" });
      return res.status(200).json({ success: "Successfully deleted" });
    } catch (err) {
      console.log(err);
    }
  }
  async removefruitsWeight(req, res) {
    try {
      const { id, removeId } = req.params; 
      console.log(`fruits ID: ${id}, Weight ID: ${removeId}`);

   
      const updatedfruits = await fruitsModal.findOneAndUpdate(
        { _id: id },
        { $pull: { weight: { _id: removeId } } },
        { new: true } 
      );

      if (!updatedfruits) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong, product not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully deleted",
        updatedfruits,
      });
    } catch (err) {
      console.error("Error removing weight:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  async removefruitsClubWeight(req, res) {
    try {
      const { id, removeId } = req.params; 
      console.log(`fruits ID: ${id}, Weight ID: ${removeId}`);

    
      const updatedfruits = await fruitsModal.findOneAndUpdate(
        { _id: id },
        { $pull: { Clubweight: { _id: removeId } } },
        { new: true }
      );

      if (!updatedfruits) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong, product not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully deleted",
        updatedfruits,
      });
    } catch (err) {
      console.error("Error removing weight:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  async getfruitsBysubCategory(req, res) {
    try {
      const subcategory = req.query.subcategory;

      const findfruits = await fruitsModal.find({
        subcategory: subcategory,
      });

      const fruitsCount = findfruits.length;
      if (findfruits.length != 0)
        return res
          .status(200)
          .json({ fruitsCount: fruitsCount, fruitsDetails: findfruits });
      return res
        .status(200)
        .json({ success: false, msg: "Product is not available." });
    } catch (error) {
      console.log(error);
    }
  }
  async postaddmultifruits(req, res) {
    let { fruits } = req.body;
  
    console.log("Received data:", { fruits });
  
    if (!fruits || !Array.isArray(fruits)) {
      return res.status(400).json({ error: "Invalid input data" });
    }
  
    try {

      await fruitsModal.deleteMany({});
      console.log("All existing products deleted");
  
 
      const fruitsPromises = fruits.map(async (datas) => {
        console.log("Processing product:", datas);
  
       
        let offerPrice = datas.price - Math.round(datas.price * (datas.discount / 100));
  
       
        Object.keys(datas).forEach(
          (key) => (datas[key] === undefined || datas[key] === null) && delete datas[key]
        );
        let weight = Array.isArray(datas.weight) ? datas.weight : [];
        let Clubweight = Array.isArray(datas.Clubweight) ? datas.Clubweight : [];
        weight.forEach((item) => {
          if (!item.id) item.id = new mongoose.Types.ObjectId(); 
        });
        Clubweight.forEach((item) => {
          if (!item.id) item.id = new mongoose.Types.ObjectId(); 
        });
  
        try {
          let newfruits = new fruitsModal({
            productname: datas.productname,
            category: datas.category,
            subcategory: datas.subcategory,
            description: datas.description,
            price: datas.price,
            discount: datas.discount || 0,
            unit: datas.unit,
            offerPrice: offerPrice,
            miniunit: datas.miniunit || "",
            ministock: datas.ministock || 0,
            stock: datas.stock,
            clubdiscount: datas.clubdiscount || 0,
            weight: weight,
            Clubweight: Clubweight,
            Photos: Array.isArray(datas.Photos) ? datas.Photos : [],
            tag: datas.tag || "",
            subscribe: datas.subscribe || "",
            status: datas.status || "Active",
          });
  
          let savedFruit = await newfruits.save(); 
          return savedFruit;
        } catch (err) {
          if (err.code === 11000) {
            console.log(`Duplicate key error for product: ${datas.productname}`);
            return null; 
          }
          throw err;
        }
      });
  
      const results = await Promise.all(fruitsPromises);
      const successCount = results.filter(Boolean).length;
  
      return res.json({
        success: `${successCount} products added successfully`,
        failed: fruits.length - successCount,
      });
    } catch (err) {
      console.error("Error in postaddmultifruits:", err);
      return res.status(500).json({ error: "An error occurred while processing products" });
    }
  }

  async addfruitsbestseller(req, res) {
    let id = req.params.id;
    try {
      const data = await fruitsModal.findOneAndUpdate(
        { _id: id },
        { bestsellerstatus: true }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.json({ success: "Added to Bestseller List Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async removefruitsbestseller(req, res) {
    let id = req.params.id;
    try {
      const data = await fruitsModal.findOneAndUpdate(
        { _id: id },
        { bestsellerstatus: false }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.json({ success: "Removed from Bestseller List Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async postfruitsimage(req, res) {
    let file = req.file;
    try {
      return res.json({ success: "added success" });
    } catch {
      return res.status(404).json({ error: "Something went wrong" });
    }
  }

  async getfruitsByBrand(req, res) {
    try {
      const brand = req.query.brand;

      const findfruits = await fruitsModal.find({
        brand: brand,
      }).sort({_id:-1});

      const fruitsCount = findfruits.length;
      if (findfruits.length != 0)
        return res
          .status(200)
          .json({ fruitsCount: fruitsCount, fruitsDetails: findfruits });
      return res
        .status(200)
        .json({ success: false, msg: "Product is not available." });
    } catch (error) {
      console.log(error);
    }
  }

  async getfruitsById(req, res) {
    try {
      const fruitsid = req.params.fruitsid;

      const findfruits = await fruitsModal.findOne({
        _id: fruitsid,
      });
      if (findfruits)
        return res.status(200).json({ fruitsDetails: findfruits });
      return res
        .status(404)
        .json({ success: false, msg: "Product is not available." });
    } catch (error) {
      console.log(error);
    }
  }

  async deletefruitsById(req, res) {
    try {
      const fruitsid = req.params.fruitsid;
      const findfruits = await fruitsModal.deleteOne({
        _id: fruitsid,
      });
      if (findfruits.deletedCount != 0)
        return res
          .status(200)
          .json({ Success: "Product is deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async Updatefruits(req, res) {
    try {
      let fruitsid = req.params.fruitsid;

      const {
        productname,
        description,
        subscribe,
        Clubweight,
        category,
        subcategory,
        tag,
        price,
        discount,
        stock,
        unit,
        miniunit,
        ministock,
        clubdiscount,
        weight,
      } = req.body;

      let files = req.files;
if (category) {
        const categoryExists = await CategoryModel.findById(category);
        if (!categoryExists) {
          return res.status(404).json({ error: "Category not found" });
        }
      }
      if (subcategory) {
        const subcategoryExists = await SubcategoryModel.findById(subcategory);
        if (!subcategoryExists) {
          return res.status(404).json({ error: "Category not found" });
        }
      }
      const obj = {};

      if (productname) {
        obj.productname = productname;
      }
      if (description) {
        obj.description = description;
      }
      if (category) {
        obj.category = category;
      }
      if (subcategory) {
        obj.subcategory = subcategory;
      }
      if (tag) {
        obj.tag = tag;
      }
      if (stock) {
        const currentfruits = await fruitsModal.findById(fruitsid);
        if (!currentfruits) {
          return res.status(400).json({ error: "Product not found" });
        }

        obj.stock = currentfruits.stock + parseInt(stock);
      }
      if (subscribe) {
        obj.subscribe = subscribe;
      }
      if (unit) {
        obj.unit = unit;
      }
      if (miniunit) {
        obj.miniunit = miniunit;
      }
      if (ministock) {
        obj.ministock = ministock;
      }
      if (clubdiscount) {
        obj.clubdiscount = clubdiscount;
      }

      if (price) {
        if (!isValidNum(price))
          return res.status(400).json({ error: "Price should be Number!" });
        obj.price = price;
      }

      if (discount) {
        obj.discount = discount;
      }
      if (weight) {
        obj.weight = weight;
      }
      if (Clubweight) {
        obj.Clubweight = Clubweight;
      }
      if (price || discount) {
        const fruits = await fruitsModal.findById(fruitsid);
        let offerPrice;
        if (price && !discount) {
          offerPrice = price - Math.round(price * (fruits.discount / 100));
        } else if (!price && discount) {
          offerPrice =
            fruits.price - Math.round(fruits.price * (discount / 100));
        } else if (price && discount) {
          offerPrice = price - Math.round(price * (discount / 100));
        }

        obj.offerPrice = offerPrice;
      }

      const updatedfruits = await fruitsModal.findOneAndUpdate(
        { _id: fruitsid },
        { $set: obj },
        { new: true }
      );
      if (!updatedfruits)
        return res.status(400).json({ success: "Product not found" });

      return res
        .status(200)
        .json({ msg: "Details updated", fruits: updatedfruits });
    } catch (error) {
      console.log(error);
    }
  }
  
    async addStockPoduct(req,res){
    const { productId,stockName, addedStock } = req.body;

  try {
    let product = await fruitsModal.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }


   product.stock=product.stock+addedStock;
   
    product.stock_history.push({
         stockName,
      previousStock: product.stock - addedStock,
      addedStock,
      newStock: product.stock,
    });

   product= await product.save();


    res.status(200).json({
      message: 'Stock updated successfully',
      updatedProduct: product,
    });
      }catch(error){
          console.log(error)
      }
  }
}

const MarketfruitsController = new fruits();
module.exports = MarketfruitsController;

const productModal = require("../../Model/Admin/product");
const SubcategoryModel = require("../../Model/Admin/Subcategory");
const CategoryModel = require("../../Model/Admin/Category");
const {
  isValid,
  isValidNum,
  isValidString,
  isValidObjectId,
  validUrl,
} = require("../../Config/function");

class product {
  async addProduct(req, res) {
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

      let NewMarketproduct = new productModal(obj);
      NewMarketproduct.save().then((data) => {
        return res.status(200).json({
          product: NewMarketproduct,
          Success: "Product Added successfully",
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getMarketProductList(req, res) {
    try {
      const marketProductList = await productModal.find({}).sort({_id:-1});
      if (marketProductList) {
        return res.status(200).json({ ProductList: marketProductList });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async changeActiveStatus(req, res) {
    try {
      let product = req.params.productid;

      const data = await productModal.findOneAndUpdate(
        { _id: product },
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
  async changeInactiveStatus(req, res) {
    try {
      let product = req.params.productid;
      const data = await productModal.findOneAndUpdate(
        { _id: product },
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
  
  async getProductByCategory(req, res) {
  try {
  
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }
    const products = await productModal.find({ category: categoryId })
      .select('-__v') 
      .lean().sort({_id:-1}); 
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products.length > 0 ? products : [],
      message: products.length > 0 ? "Products retrieved successfully" : "No products found for this category"
    });

  } catch (error) {
    console.error('Error in getProductByCategory:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
  async addPhotos(req, res) {
    try {
      let { id } = req.body;
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
      
        console.log("id==>",id,obj)
        
      let data = await productModal.updateOne(
        { _id: id },
        { $push: { Photos: obj } }
      );

      return res.status(200).json({ success: "Successfully Added" });
    } catch (error) {
      console.log(error);
    }
  }
  async removePhotos(req, res) {
    try {
      let removeId = req.params.removeId;
      let id = req.params.id;
      console.log(id, removeId);
      let add = await productModal.findOneAndUpdate(
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
  async removeWeight(req, res) {
    try {
      const { id, removeId } = req.params; 
      console.log(`Product ID: ${id}, Weight ID: ${removeId}`);

      const updatedProduct = await productModal.findOneAndUpdate(
        { _id: id },
        { $pull: { weight: { _id: removeId } } },
        { new: true } 
      );

      if (!updatedProduct) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong, product not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully deleted",
        updatedProduct,
      });
    } catch (err) {
      console.error("Error removing weight:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  async removeClubWeight(req, res) {
    try {
      const { id, removeId } = req.params; 
      console.log(`Product ID: ${id}, Weight ID: ${removeId}`);

      const updatedProduct = await productModal.findOneAndUpdate(
        { _id: id },
        { $pull: { Clubweight: { _id: removeId } } },
        { new: true } 
      );

      if (!updatedProduct) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong, product not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully deleted",
        updatedProduct,
      });
    } catch (err) {
      console.error("Error removing weight:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  async getProductBysubCategory(req, res) {
    try {
      const subcategory = req.query.subcategory;

      const findProduct = await productModal.find({
        subcategory: subcategory,
      }).sort({_id:-1});

      const productCount = findProduct.length;
      if (findProduct.length != 0)
        return res
          .status(200)
          .json({ ProductCount: productCount, ProductDetails: findProduct });
      return res
        .status(200)
        .json({ success: false, msg: "Product is not available." });
    } catch (error) {
      console.log(error);
    }
  }
  async postaddmultiproduct(req, res) {
    let { product } = req.body;

    console.log("Received data:", { product });

    if (!product || !Array.isArray(product)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    try {
      const productPromises = product.map(async (datas) => {
        console.log("Processing product:", datas);
        let offerPrice =
          datas.price - Math.round(datas.price * (datas.discount / 100));
     
        Object.keys(datas).forEach(
          (key) =>
            (datas[key] === undefined || datas[key] === null) &&
            delete datas[key]
        );

        let newProduct = new productModal({
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
          weight: Array.isArray(datas.weight) ? datas.weight : [],
          Clubweight: Array.isArray(datas.Clubweight) ? datas.Clubweight : [],
          Photos: Array.isArray(datas.Photos) ? datas.Photos : [],
          tag: datas.tag || "",
          subscribe: datas.subscribe || "",
          status: datas.status || "Active",
        });

        try {
          return await newProduct.save();
        } catch (err) {
            console.log("error",err)
          if (err.code === 11000) {
            console.log(
              `Duplicate key error for product: ${datas.productname}`
            );
            return null;
          }
          throw err;
        }
      });

      const results = await Promise.all(productPromises);
      const successCount = results.filter(Boolean).length;

      return res.json({
        success: `${successCount} products created successfully`,
        failed: product.length - successCount,
      });
    } catch (err) {
      console.error("Error in postaddmultiproduct:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while creating products" });
    }
  }
  async addbestseller(req, res) {
    let id = req.params.id;
    try {
        
      const data = await productModal.findById(id );
      
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
          if(data.bestsellerstatus==true){
              data.bestsellerstatus=false
          }else{
               data.bestsellerstatus=true
          }
         await data.save();
        return res.json({ success: "Added to Bestseller List Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async removebestseller(req, res) {
    let id = req.params.id;
    try {
      const data = await productModal.findOneAndUpdate(
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
  async postproductimage(req, res) {
    let file = req.file;
    try {
      return res.json({ success: "added success" });
    } catch {
      return res.status(404).json({ error: "Something went wrong" });
    }
  }

  async getProductByBrand(req, res) {
    try {
      const brand = req.query.brand;

      const findProduct = await productModal.find({
        brand: brand,
      }).sort({_id:-1});

      const productCount = findProduct.length;
      if (findProduct.length != 0)
        return res
          .status(200)
          .json({ ProductCount: productCount, ProductDetails: findProduct });
      return res
        .status(200)
        .json({ success: false, msg: "Product is not available." });
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(req, res) {
    try {
      const productid = req.params.productid;

      const findProduct = await productModal.findOne({
        _id: productid,
      });
      if (findProduct)
        return res.status(200).json({ ProductDetails: findProduct });
      return res
        .status(404)
        .json({ success: false, msg: "Product is not available." });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductById(req, res) {
    try {
      const productid = req.params.productid;
      const findProduct = await productModal.deleteOne({
        _id: productid,
      });
      if (findProduct.deletedCount != 0)
        return res
          .status(200)
          .json({ Success: "Product is deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async addAndUpadateRating(req, res) {
    try {
      const { rating, userId, userImg, userName, text, productId } = req.body;
      let obj = { rating, userId, userImg, userName, text };
      if (!isValid(productId))
        return res.status(400).json({ error: "productId is required!" });
      if (!isValid(userId))
        return res.status(400).json({ error: "userId is required!" });
      if (!isValid(userName))
        return res.status(400).json({ error: "Name is required!" });

      let ratingData = await productModal.findOne({ _id: productId });
      if (ratingData) {
        let data = ratingData.ratingDetails.filter((i) => {
          return i.userId == userId;
        });

        if (data.length != 0) {
          let sum = 0;
          ratingData = ratingData.ratingDetails;
          for (let i = 0; i < ratingData.length; i++) {
            sum += ratingData[i].rating;
          }
          let avgRating = Math.round((sum + rating) / (ratingData.length + 1));
          await productModal.findOneAndUpdate(
            { _id: productId },
            { $pull: { ratingDetails: { userId: userId } } },
            { new: true }
          );
          let ab = await productModal.findOneAndUpdate(
            { _id: productId },
            {
              $set: { totalRating: avgRating },
              $push: {
                ratingDetails: { rating, userId, userImg, userName, text },
              },
            },
            { new: true }
          );
          return res
            .status(200)
            .json({ msg: "Successfully added", success: ab });
        } else {
          let sum = 0;
          ratingData = ratingData.ratingDetails;
          if (ratingData != 0)
            for (let i = 0; i < ratingData.length; i++) {
              sum += ratingData[i].rating;
            }
          let avgRating = Math.round((sum + rating) / (ratingData.length + 1));

          let ab = await productModal.findOneAndUpdate(
            { _id: productId },
            { $set: { totalRating: avgRating }, $push: { ratingDetails: obj } },
            { new: true }
          );
          return res
            .status(200)
            .json({ msg: "Successfully added", success: ab });
        }
      }
      return res.status(400).json({ error: "Something went worng!" });
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateProduct(req, res) {
    try {
      let productid = req.params.productid;

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
        const currentProduct = await productModal.findById(productid);
        if (!currentProduct) {
          return res.status(400).json({ error: "Product not found" });
        }
        obj.stock = currentProduct.stock + parseInt(stock);
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
        const product = await productModal.findById(productid);
        let offerPrice;
        if (price && !discount) {
          offerPrice = price - Math.round(price * (product.discount / 100));
        } else if (!price && discount) {
          offerPrice =
            product.price - Math.round(product.price * (discount / 100));
        } else if (price && discount) {
          offerPrice = price - Math.round(price * (discount / 100));
        }

        obj.offerPrice = offerPrice;
      }

      const updatedProduct = await productModal.findOneAndUpdate(
        { _id: productid },
        { $set: obj },
        { new: true }
      );
      if (!updatedProduct)
        return res.status(400).json({ success: "Product not found" });

      return res
        .status(200)
        .json({ msg: "Details updated", product: updatedProduct });
    } catch (error) {
      console.log(error);
    }
  }
  
  async addStockPoduct(req,res){
    const { productId,stockName, addedStock } = req.body;

  try {
    let product = await productModal.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

let previousStock=product.stock-product.sellproduct;

   product.stock=product.stock+addedStock;
   
    product.stock_history.push({
         stockName,
      previousStock: previousStock,
      addedStock,
      newStock: product.stock - product.sellproduct,
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

const MarketproductController = new product();
module.exports = MarketproductController;

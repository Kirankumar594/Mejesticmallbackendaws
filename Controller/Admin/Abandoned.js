const AbandonedModel = require("../../Model/Admin/Abandoned");

class Abandoned {
  async addAbandoned(req, res) {
    try {
      const { cart, user, timestamp } = req.body;
      const recentAbandonedCart = await AbandonedModel.findOne({
        'user.id': user.id,
        timestamp: {
          $gte: new Date(Date.now() - 30 * 60 * 1000) 
        }
      });
      
      console.log("recentAbandonedCart",recentAbandonedCart)

      if (recentAbandonedCart) {
        const isCartSimilar = this.compareCartContents(cart, recentAbandonedCart.cart);
        
        if (isCartSimilar) {
          return res.status(409).json({ 
            message: "Similar abandoned cart recently recorded for this user"
          });
        }
      }
      const newAbandonedCart = new AbandonedModel({
        cart,
        user,
        timestamp
      });

      await newAbandonedCart.save();
      return res.json({ success: "Abandoned cart added successfully" });
      
    } catch (error) {
      console.error("Error adding abandoned cart:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  compareCartContents(cart1, cart2) {
    const normalize = cart => cart.map(item => ({
      ...item,
      timestamp: undefined
    }));

    return JSON.stringify(normalize(cart1)) === JSON.stringify(normalize(cart2));
  }

  async getAbandoned(req, res) {
    try {
      const abandonedCarts = await AbandonedModel.find({})
        .sort({ timestamp: -1 });
      return res.json({ abandonedCarts });
    } catch (error) {
      console.error("Error fetching abandoned carts:", error);
      return res.status(500).json({Abandoned: abandonedCarts , error: "Internal server error" });
    }
  }

  async postdeleteAbandoned(req, res) {
    try {
      const { id } = req.params;
      const result = await AbandonedModel.deleteOne({ _id: id });
      
      if (result.deletedCount === 1) {
        return res.json({ success: "Successfully deleted" });
      }
      return res.status(404).json({ error: "Abandoned cart not found" });
      
    } catch (error) {
      console.error("Error deleting abandoned cart:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

const AbandonedController = new Abandoned();
module.exports = AbandonedController;
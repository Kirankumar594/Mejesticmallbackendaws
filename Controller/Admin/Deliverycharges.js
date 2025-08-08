
const DeliveryCharge = require('../../Model/Admin/Deliverycharges');


exports.getAllDeliveryCharges = async (req, res) => {
  try {
    const deliveryCharges = await DeliveryCharge.find();
    res.status(200).json({ deliveryCharges });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching delivery charges' });
  }
};


exports.addDeliveryCharge = async (req, res) => {
  const { minAmount, deliveryCharges, perKmPrice ,minKm} = req.body;

  try {
    const newCharge = new DeliveryCharge({
      minAmount,
      deliveryCharges,
      perKmPrice,
      minKm
    });

    await newCharge.save();
    res.status(200).json({ message: 'Delivery charge added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding delivery charge' });
  }
};


exports.editDeliveryCharge = async (req, res) => {
  const { id } = req.params;
  const { minAmount, deliveryCharges, perKmPrice,minKm } = req.body;

  try {
    const updatedCharge = await DeliveryCharge.findByIdAndUpdate(
      id,
      { minAmount, deliveryCharges, perKmPrice,minKm },
      { new: true }
    );

    if (!updatedCharge) {
      return res.status(404).json({ error: 'Delivery charge not found' });
    }

    res.status(200).json({ message: 'Delivery charge updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating delivery charge' });
  }
};

exports.activedeactivedeliverymake=async(req,res)=>{
    try{
        let {id}=req.params;
     
        let data=await DeliveryCharge.findById(id);
        if(!data) return res.status(400).json({error:'Data not found'});
        if(data.isActive==true){
            data.isActive=false
        }else{
             data.isActive=true
        }
        
        data=await data.save()
        return res.status(200).json({success:`Successfully updated`})
    }catch(error){
        console.log(error)
    }
}

exports.getactivedelivery=async(req,res)=>{
    try{

        let data=await DeliveryCharge.findOne({isActive:true});
        
        return res.status(200).json({success:`Successfully geting`,data})
    }catch(error){
        console.log(error)
    }
}


exports.deleteDeliveryCharge = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCharge = await DeliveryCharge.findByIdAndDelete(id);

    if (!deletedCharge) {
      return res.status(404).json({ error: 'Delivery charge not found' });
    }

    res.status(200).json({ message: 'Delivery charge deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting delivery charge' });
  }
};

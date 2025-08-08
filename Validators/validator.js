var objectID = require('mongodb').ObjectId;
class validations{
    isEmpty(str){
        if(typeof (str) == "undefined" || typeof (str) == null) {return false}
        if(typeof (str) == "string" && (str).trim().length == 0) {return false}
        if(typeof (str) == 'number' && (str).toString().trim().length == 0){return false}
        return true
    }
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };
    isValidNumber(num){
        num = Number(num);
        if(num == NaN){
            return false;
        }
        return true;
    }

    isValidPrice(num){
        num = Number(num);
        if(num == NaN){
            return false;
        }
        if(num<0){
            return false;
        }
        return true;
    }


    isValidObjectId(str){
        str=str?.toString()
        if(objectID.isValid(str)){
            return true;
        }
        return false;
    }

    isValidMobile(mobile){
        mobile=mobile?.trim();
        if(mobile?.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) ){  //&& ! (mobile.match(/0{5,}/))
            return true;
        }
        return false;
    }

    isValidEmail(emailid){
        emailid=emailid?.trim();
        if(emailid?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)){
            return true;
        }
        return false;
    }

    isValidPwd(pwd){
        if(pwd?.length<8 || pwd?.length>15){
            return false;
        }
        return true;
    }

    isOtpValidLen(otp){
        otp = otp?.trim();
        if(otp?.length == 6 && Number(otp) != NaN){
            return true;
        }
        return false;
    }
}

module.exports = new validations();
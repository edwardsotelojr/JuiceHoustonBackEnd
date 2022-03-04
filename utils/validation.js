const zipcodes = [
    77003, 77004, 77007, 77008, 77009, 77011, 77012, 77016, 77018, 77019, 77020,
    77021, 77022, 77023, 77024, 77026, 77027, 77028, 77030, 77036, 77037, 77039,
    77040, 77042, 77050, 77054, 77055, 77057, 77063, 77076, 77080, 77087, 77088,
    77091, 77092, 77093, 77096, 77098, 77201, 77401,
  ];
   module.exports = function validation(email, name, password, phone, 
    address, zipcode, gateCode,
     suiteNumber, instructions, termsOfAgreement){
    if(name.length < 1 || name.length > 15){
       return {status: 500, msg: "Name length is not valid. Must be 1-15 characters long."
    }        }     
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        //valid
    }
    else{
        return {status: 500, msg: "Invalid Email"}
    }
    if(password.length < 6 || password.length > 20){
        return {status: 500, msg: "Password length is not valid. Must be 6-20 characters long."}
    }
    if(phone.toString().length != 10){
        return {status: 500, msg: "Phone number is not valid."}
    }
    if(address.length < 2 || address.length > 50){
        return {status: 500, msg: "Address is not valid."}

    }
    var i = 0
    do{
        if(zipcodes[i] == zipcode){
            break;
        }
        i += 1
        if(i >= zipcodes.length){
            return {status: 500, msg: "Zip code is not valid. May not be eligible for delivery."}
        }
    }while(i < zipcodes.length)
    if(gateCode.length > 20){
        return {status: 500, msg: "Gate code is oddly too long..."}
    }
    if(suiteNumber.length > 20){
        return {status: 500, msg: "Suite # is oddly too long..."}
    }
    if(instructions.length > 120){
        return {status: 500, msg: "instructions too long for storage. No more than 120 Characters"}
    }
    if(termsOfAgreement == false){
        return {status: 500, msg: "Terms of Agreements was not acknowledged."}
    }
    return {status: 200, msg: "valid"}
} 

module.exports = function validation(name, phone, 
    address, zipcode, gateCode,
     suiteNumber, instructions){
    if(name.length < 1 || name.length > 15){
       return {status: 500, msg: "Name length is not valid. Must be 1-15 characters long."}        
    }   
    if(phone.toString().length != 10){
        return {status: 500, msg: "Phone number is not valid."}
    }
    if(address.length < 2 || address.length > 50){
        return {status: 500, msg: "Address is not valid."}
    }
    var i = 0
    do{
        if(zipcodes[i] == zipcode){
            break;
        }
        i += 1
        if(i >= zipcodes.length){
            return {status: 500, msg: "Zip code is not valid. May not be eligible for delivery."}
        }
    }while(i < zipcodes.length)
    if(gateCode.length > 20){
        return {status: 500, msg: "Gate code is oddly too long..."}
    }
    if(suiteNumber.length > 20){
        return {status: 500, msg: "Suite # is oddly too long..."}
    }
    if(instructions.length > 120){
        return {status: 500, msg: "instructions too long for storage. No more than 120 Characters"}
    }
    return {status: 200, msg: "valid"}
} 

module.exports = function validateOrder (name, email, phone, address, zipcode, gateCode,
     suiteNumber, instructions, agreement, card) {
        if(name.length < 1 || name.length > 15){
            return {status: 500, msg: "Name length is not valid. Must be 1-15 characters long."}        
         }   
         if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            //valid
        }
        else{
            return {status: 500, msg: "Invalid Email"}
        }
         if(phone.toString().length != 10){
             return {status: 500, msg: "Phone number is not valid."}
         }
         if(address.length < 2 || address.length > 50){
             return {status: 500, msg: "Address is not valid."}
         }
         var i = 0
         do{
             if(zipcodes[i] == zipcode){
                 break;
             }
             i += 1
             if(i >= zipcodes.length){
                 return {status: 500, msg: "Zip code is not valid. May not be eligible for delivery."}
             }
         }while(i < zipcodes.length)
         if(gateCode.length > 20){
             return {status: 500, msg: "Gate code is oddly too long..."}
         }
         if(suiteNumber.length > 20){
             return {status: 500, msg: "Suite # is oddly too long..."}
         }
         if(instructions.length > 120){
             return {status: 500, msg: "instructions too long for storage. No more than 120 Characters"}
         }
         return {status: 200, msg: "valid"}
}

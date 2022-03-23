renderIngredients = (ingredients) => {
    var str = "";
    for (const [key, value] of Object.entries(ingredients)) {
                str = str + "<p>" + key + ": " + value + " oz</p>"
    }
    return str
}

//parameters: drinks
drinksHtml = (drinks) => {
    var str = ""
    for(var i = 0; i < drinks.length; i++){
        str = str + "<div\
        style='\
          border: solid;\
          width: max-content;\
          border-radius: 10px;\
          padding: 2px;\
          margin: 2px;\
          background-color: " + drinks[i].color + ";\
        '\
      >\
        <p style='margin: 2px'>delivery date: " + drinks[i].deliveryDate + "</p>\
        " + renderIngredients(drinks[i].ingredients) + "\
        <p style='margin: 2px'>$" + String(Number(drinks[i].total).toFixed(2)) + "</p>\
      </div>\
     "
    }
    return str
}

ifInstructions = (instructions) => {
  if(instructions.length == 0){
    return ""
  }else{
    return("<p style='text-align: center; margin: 3px'>instructions: " + instruction + "</p>")
  }
}

exports.receiptHtml = (user, drinks, total) => {

    return("  <div style='background-color: rgb(123, 182, 4);'>\
  <div style=' margin-top: 7px; '>\
    <h1 style=' padding-top: 7px; margin-bottom: 0;text-align: center; font-family: \"Arial Narrow\", Arial, sans-serif; font-size: 25px;margin-bottom: 5px; '>\
      thank you " + user.name + ", for trying juice houston!\
    </h1>\
    <p style='text-align: center; margin: 3px'>address: " + user.address + ", " + user.zipcode + "</p>\
    <p style='text-align: center; margin: 3px'>phone: " + String(user.phone) + ", " + "</p>" + ifInstructions(user.instructions) + "\
    <p style='text-align: center; margin: 3px'>" + drinks.length + " juices</p>\
    <div style='justify-content: center; display: flex; flex-wrap: wrap '>\
    " + drinksHtml(drinks) + "\
    </div>\
    <p style='text-align: center; margin: 5px; padding-bottom: 10px;'>total: $" + String(Number(total).toFixed(2)) + "</p>\
  </div>\
  </div>"
    )
}

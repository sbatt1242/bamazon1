// node modules neeeded
var mysql = require('mysql');
var inquirer = require('inquirer');

// MySQL connection 
var secret_key = require('./key.js')

// connecting to MySQL
var conn = mysql.createConnection(secret_key);

conn.connect(function(err){
	if(err){
		console.log(err);
		throw err;
	}
});

console.log("\nWelcome to Bamazon!");

// Displays items from products table
var printProducts = function() {
  conn.query('SELECT * FROM products', function(err, res) {
  		console.log("\nHere are all of our ON SALE items\n");
      
      console.log("----------------------------------------------------\n");
      for (var i = 0; i < res.length; i++) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + "\n");
      }
      console.log("----------------------------------------------------\n");
      questions();
  });
};
printProducts();

// asks questions about order
function questions() {
	inquirer.prompt([
	{
    	type: "input",
    	message: "Hi! What is the ID of the item you would like to purchase? ",
    	name: "item_id"
	},
 	{
    	type:"input",
    	message: "How many would you like to purchase? (Type Q to Quit) ",
    	name: "quantity"
	}]).then(function(answers) {
    
    if ((answers.quantity == 'Q') || (answers.quantity === 'q') || (answers.quantity == '0')) {
		conn.end();
		process.exit();
		return;
    }
    
    // saves inputs from  questions() into a variable
    chosenItem = answers.item_id;
    itemQuantity = parseInt(answers.quantity);

    conn.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE item_id= ' + chosenItem, function(err, res) {
		if(err) throw err;

		// checks to see if theres's enough items in stock

		// if not enough items in stock
    	if(res[0].stock_quantity < itemQuantity) {
			inquirer.prompt([{
    			type:"input",
    			message: "Insufficient quantity, there isn\'t enough of this item in stock. Type 'T' to TRY AGAIN or press 'Q' to QUIT ", 
    			name: "check"
			}]).then(function(answers) {
    			// if q is typed, program quits, else start over
    			if ((answers.check === 'Q') || (answers.check === 'q')) {
					conn.end();
					process.exit();
					return;
    			} else { printProducts(); }
    		});
    	}

    	// if there's enough items in stock tp fullfill order...
     	else {
			conn.query("UPDATE products SET? WHERE?", [{stock_quantity: res[0].stock_quantity - itemQuantity}, {item_id: chosenItem}], function(err, result){});

			// makes sure itemQuantity is greater than or equal to 1
			if (itemQuantity >= 1) {
				console.log("\nTOTAL COST: $" + (res[0].price * itemQuantity) + " for buying " + itemQuantity + " copy/copies of " + res[0].product_name);
			}
    		
    		//order fullfilled
    		console.log("\nYour order will be shipped in less than 24hrs.\n");
    		console.log("\nSTORE DATABASE HAS BEEN UPDATED\n");
    		console.log("----------------------------------------------------");
    		
    		// prints items list again
    		printProducts();
    	}
	});
});
}

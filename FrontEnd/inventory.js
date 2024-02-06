// Define an object to store the active inventory numbers for each item
var activeInventory = {
    1: 50,
    2: 100,
    3: 75,
    4: 120
};

// Function to increment quantity
function incrementQuantity(itemId) {
    var input = document.getElementById('quantity' + itemId);
    var value = parseInt(input.value, 10);
    input.value = value + 1;
}

// Function to decrement quantity
function decrementQuantity(itemId) {
    var input = document.getElementById('quantity' + itemId);
    var value = parseInt(input.value, 10);
    if (value > 1) {
        input.value = value - 1;
    }
}


// Function to add quantity
function addQuantity(itemId) {
    var input = document.getElementById('quantity' + itemId);
    var value = parseInt(input.value, 10);
    var currentInventory = activeInventory[itemId]; // Get the current inventory number
    var newValue = currentInventory + value; // Calculate the new inventory number
    updateActiveInventory(itemId, newValue); // Update the inventory number
}

// Function to subtract quantity
function subtractQuantity(itemId) {
    var input = document.getElementById('quantity' + itemId);
    var value = parseInt(input.value, 10);
    var currentInventory = activeInventory[itemId]; // Get the current inventory number
    var newValue = currentInventory - value; // Calculate the new inventory number
    updateActiveInventory(itemId, newValue); // Update the inventory number
}



// Function to update active inventory number
function updateActiveInventory(itemId, newValue) {
    activeInventory[itemId] = newValue;
    // Update the current inventory display for the item
    var currentInventoryElement = document.getElementById('current-inventory-' + itemId);
    if (currentInventoryElement) {
        currentInventoryElement.textContent = "Current Inventory: " + newValue;
    }
}

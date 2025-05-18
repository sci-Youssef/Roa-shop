// Homepage-specific script
document.addEventListener('DOMContentLoaded', function() {
    console.log("Homepage script loaded");
    
    // Only run this on the homepage (check for hero section)
    if (document.querySelector('.hero')) {
        console.log("This is the homepage, looking for featured products");
        
        // Check if products variable is defined (from products.js)
        if (typeof products !== 'undefined') {
            console.log("Products array found with " + products.length + " products");
            
            // Get featured products (new arrivals and luxury items, limited to 6)
            const featuredProducts = products.filter(p => p.isNew || p.category === 'Luxury').slice(0, 6);
            console.log("Filtered to " + featuredProducts.length + " featured products");
            
            // Get the products container
            const productsContainer = document.getElementById('products-container');
            
            // Display the featured products
            if (productsContainer && typeof displayProducts === 'function') {
                console.log("Displaying featured products");
                displayProducts(productsContainer, featuredProducts);
            } else {
                console.error("Could not find products container or displayProducts function");
            }
        } else {
            console.error("Products array not found, make sure products.js is loaded before homepage.js");
        }
    }
}); 
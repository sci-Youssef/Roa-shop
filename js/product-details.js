// Product Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log("Product details page loaded");
    
    // Get product ID from URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || localStorage.getItem('currentProductId');
    
    if (productId) {
        console.log("Product ID found: " + productId);
        
        // Load product details
        loadProductDetails(parseInt(productId));
        
        // Set up sharing buttons
        setupSharingButtons(parseInt(productId));
        
        // Load related products
        loadRelatedProducts(parseInt(productId));
    } else {
        console.error("No product ID found, redirecting to products page");
        // Redirect to products page if no product ID is found
        window.location.href = 'products.html';
    }
});

// Load product details
function loadProductDetails(productId) {
    // Get product data from directly from products array (should be defined in products.js)
    if (typeof products === 'undefined') {
        console.error("Products array not defined. Make sure products.js is loaded before product-details.js");
        return;
    }
    
    const product = products.find(p => p.id === productId);
    
    if (product) {
        console.log("Product found: ", product.name);
        
        // Update page title
        document.title = `${product.name} - ROA Store`;
        
        // Update meta tags for social sharing
        document.querySelector('meta[property="og:title"]').setAttribute('content', `${product.name} - ROA Store`);
        document.querySelector('meta[property="og:description"]').setAttribute('content', product.description);
        
        // Update breadcrumb
        document.getElementById('product-breadcrumb').textContent = product.name;
        
        // Update product details
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `$${product.price}`;
        document.getElementById('product-category').textContent = product.category;
        document.getElementById('product-description').textContent = product.description;
        
        // Show/hide new tag
        const newTag = document.getElementById('product-new-tag');
        if (product.isNew) {
            newTag.classList.remove('hidden');
        } else {
            newTag.classList.add('hidden');
        }
        
        // Update product image
        const productImage = document.getElementById('product-main-image');
        productImage.src = product.image;
        productImage.alt = product.name;
        productImage.onerror = function() {
            console.warn("Product image failed to load, using fallback");
            this.onerror = null; // Prevent infinite loop
            this.src = 'images/decoration-top-left.jpg';
        };
    } else {
        console.error("Product not found with ID: " + productId);
    }
}

// Set up social media sharing buttons
function setupSharingButtons(productId) {
    const currentUrl = window.location.href;
    const productTitle = document.getElementById('product-name').textContent;
    
    // WhatsApp sharing
    document.getElementById('share-whatsapp').addEventListener('click', function() {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this amazing product: ${productTitle} ${currentUrl}`)}`;
        window.open(whatsappUrl, '_blank');
    });
    
    // Twitter sharing
    document.getElementById('share-twitter').addEventListener('click', function() {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing product from ROA Store!`)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(twitterUrl, '_blank');
    });
    
    // Pinterest sharing
    document.getElementById('share-pinterest').addEventListener('click', function() {
        const imageUrl = document.getElementById('product-main-image').src;
        const fullImageUrl = new URL(imageUrl, window.location.href).href;
        const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(fullImageUrl)}&description=${encodeURIComponent(productTitle)}`;
        window.open(pinterestUrl, '_blank');
    });
    
    // Instagram sharing (note: direct sharing to Instagram is limited, this opens Instagram)
    document.getElementById('share-instagram').addEventListener('click', function() {
        alert('Instagram sharing is best done by taking a screenshot and sharing directly from the Instagram app.');
        window.open('https://instagram.com', '_blank');
    });
    
    // Copy link
    document.getElementById('copy-link').addEventListener('click', function() {
        navigator.clipboard.writeText(currentUrl).then(function() {
            const feedback = document.getElementById('copy-feedback');
            feedback.classList.add('visible');
            setTimeout(function() {
                feedback.classList.remove('visible');
            }, 2000);
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    });
}

// Load related products (products from the same category)
function loadRelatedProducts(currentProductId) {
    if (typeof products === 'undefined') {
        console.error("Products array not defined. Make sure products.js is loaded before product-details.js");
        return;
    }
    
    const currentProduct = products.find(p => p.id === currentProductId);
    
    if (currentProduct) {
        console.log("Loading related products for category: " + currentProduct.category);
        
        const relatedProducts = products
            .filter(p => p.id !== currentProductId && p.category === currentProduct.category)
            .slice(0, 4); // Limit to 4 related products
        
        const relatedContainer = document.getElementById('related-products-container');
        
        if (relatedProducts.length > 0) {
            console.log("Found " + relatedProducts.length + " related products");
            relatedContainer.innerHTML = relatedProducts.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='images/decoration-top-left.jpg';">
                    ${product.isNew ? '<span class="new-tag">New</span>' : ''}
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">$${product.price}</p>
                        <a href="product-details.html?id=${product.id}" class="shop-now-btn">View Details</a>
                    </div>
                </div>
            `).join('');
        } else {
            // If no related products, show other products
            console.log("No related products found, showing other products");
            const otherProducts = products
                .filter(p => p.id !== currentProductId)
                .slice(0, 4);
            
            relatedContainer.innerHTML = otherProducts.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='images/decoration-top-left.jpg';">
                    ${product.isNew ? '<span class="new-tag">New</span>' : ''}
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">$${product.price}</p>
                        <a href="product-details.html?id=${product.id}" class="shop-now-btn">View Details</a>
                    </div>
                </div>
            `).join('');
        }
    }
} 
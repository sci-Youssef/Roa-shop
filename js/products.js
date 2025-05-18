// Products data - directly defined without localStorage initially
const products = [
  {
    "id": 1,
    "name": "Classic Beaded Handbag",
    "price": "250",
    "description": "Elegant beaded handbag with intricate detailing, perfect for special occasions and evening events.",
    "category": "Bags",
    "isNew": true,
    "image": "images/products/250.jpg"
  },
  {
    "id": 2,
    "name": "Luxury Evening Clutch",
    "price": "300",
    "description": "Stylish beaded evening clutch with premium craftsmanship and elegant design.",
    "category": "Accessories",
    "isNew": false,
    "image": "images/products/300EGP.jpg"
  },
  {
    "id": 3,
    "name": "ROA Signature Bag",
    "price": "450",
    "description": "Our signature beaded bag, perfect for any occasion with its timeless design.",
    "category": "Bags",
    "isNew": true,
    "image": "images/products/450EGP.jpg"
  },
  {
    "id": 4,
    "name": "Premium Beaded Collection",
    "price": "350",
    "description": "Part of our premium collection, featuring exquisite beadwork and luxury finishing.",
    "category": "Luxury",
    "isNew": true,
    "image": "images/products/350.jpg"
  },
  {
    "id": 5,
    "name": "Compact Beaded Purse",
    "price": "150",
    "description": "A stylish and compact beaded purse, perfect for carrying essentials with elegance.",
    "category": "Accessories",
    "isNew": true,
    "image": "images/products/150.jpg"
  },
  {
    "id": 6,
    "name": "Luxury Beaded Tote",
    "price": "450",
    "description": "A spacious and luxurious beaded tote with intricate patterns, suitable for day or evening use.",
    "category": "Luxury",
    "isNew": false,
    "image": "images/products/450-1.jpg"
  },
  {
    "id": 7,
    "name": "Designer Evening Bag",
    "price": "450",
    "description": "A designer beaded evening bag with unique patterns and premium quality finishing.",
    "category": "Bags",
    "isNew": true,
    "image": "images/products/450-4.jpg"
  },
  {
    "id": 8,
    "name": "Premium Crystal Collection",
    "price": "450",
    "description": "Our premium crystal-beaded bag featuring stunning crystal beads and elegant craftsmanship.",
    "category": "Luxury",
    "isNew": true,
    "image": "images/products/450-5.jpg"
  },
  {
    "id": 9,
    "name": "Bohemian Beaded Clutch",
    "price": "250",
    "description": "A bohemian-inspired beaded clutch with colorful patterns, perfect for adding a pop of color to any outfit.",
    "category": "Accessories",
    "isNew": true,
    "image": "images/products/250.jpg"
  },
  {
    "id": 10,
    "name": "Limited Edition Evening Bag",
    "price": "450",
    "description": "A limited edition evening bag with rare beads and exquisite craftsmanship, perfect for special occasions.",
    "category": "Luxury",
    "isNew": true,
    "image": "images/products/450-2.jpg"
  },
  {
    "id": 11,
    "name": "Elegant Bridal Purse",
    "price": "350",
    "description": "A delicate beaded bridal purse designed with pearl accents, perfect for your special day.",
    "category": "Bags",
    "isNew": false,
    "image": "images/products/350-1.jpg"
  },
  {
    "id": 12,
    "name": "Mini Beaded Bag",
    "price": "150",
    "description": "A mini beaded bag with a detachable chain strap, perfect for a night out or special event.",
    "category": "Accessories",
    "isNew": true,
    "image": "images/products/150.jpg"
  },
  {
    "id": 13,
    "name": "Vintage Inspired Clutch",
    "price": "300",
    "description": "A vintage-inspired clutch featuring antique beading patterns and classic design elements.",
    "category": "Bags",
    "isNew": false,
    "image": "images/products/300EGP.jpg"
  },
  {
    "id": 14,
    "name": "Festival Beaded Bag",
    "price": "450",
    "description": "A colorful and fun beaded bag designed for festival season, featuring vibrant patterns and secure closures.",
    "category": "Accessories",
    "isNew": true,
    "image": "images/products/450-3.jpg"
  }
];

// Make sure products is available globally
if (typeof window !== 'undefined') {
  window.products = products;
}

// DOM Ready event handler - runs when page is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Products.js loaded successfully!');
  
  // 1. PRODUCTS LISTING PAGES
  // Check if we're on a page with product listings
  const productsContainer = document.getElementById('products-container');
  if (productsContainer) {
    console.log('Found products container, initializing product display');
    
    // Check if we're on homepage
    const isHomepage = document.querySelector('.hero') !== null;
    if (isHomepage) {
      // On homepage, only show featured products (new items and luxury category)
      const featuredProducts = products.filter(p => p.isNew || p.category === 'Luxury').slice(0, 6);
      displayProducts(productsContainer, featuredProducts);
      console.log('Homepage: Displaying featured products');
    } else {
      // On products page, show all products initially
      displayProducts(productsContainer, products);
      console.log('Products page: Displaying all products');
    }
    
    // Initialize category tabs
    initCategoryTabs();
  }
  
  // 2. PRODUCT DETAILS PAGE
  // Check if we're on the product details page
  const productDetailContainer = document.querySelector('.product-details-section');
  if (productDetailContainer) {
    console.log('Found product details container, initializing product details');
    initProductDetailsPage();
  }
});

// Function to display products in a grid
function displayProducts(container, productsToDisplay) {
  if (!container) return;
  
  console.log(`Displaying ${productsToDisplay.length} products`);
  
  if (productsToDisplay.length === 0) {
    container.innerHTML = `
      <div class="no-products">
        <p>No products found in this category.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = productsToDisplay.map(product => `
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
  
  // Add click event to save product ID to localStorage
  const productLinks = container.querySelectorAll('.shop-now-btn');
  productLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const productId = this.href.split('id=')[1];
      localStorage.setItem('currentProductId', productId);
    });
  });
}

// Initialize category tabs functionality
function initCategoryTabs() {
  const categoryButtons = document.querySelectorAll('.category-tabs button');
  if (categoryButtons.length === 0) return;
  
  console.log('Initializing category tabs');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      const category = this.textContent.trim();
      const productsContainer = document.getElementById('products-container');
      
      if (!productsContainer) return;
      
      if (category === 'All Products') {
        displayProducts(productsContainer, products);
      } else {
        const filteredProducts = products.filter(product => 
          product.category === category || 
          (category === 'New Arrivals' && product.isNew)
        );
        displayProducts(productsContainer, filteredProducts);
      }
      
      console.log(`Filtered to category: ${category}`);
    });
  });
}

// Initialize product details page
function initProductDetailsPage() {
  // Get product ID from URL or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || localStorage.getItem('currentProductId');
  
  if (!productId) {
    console.error('No product ID found');
    window.location.href = 'products.html';
    return;
  }
  
  // Find the product by ID
  const product = products.find(p => p.id.toString() === productId.toString());
  
  if (!product) {
    console.error('Product not found');
    window.location.href = 'products.html';
    return;
  }
  
  // Update product details
  updateProductDetails(product);
  
  // Set up sharing buttons
  setupSharingButtons(product);
  
  // Load related products
  loadRelatedProducts(product);
}

// Update product details on the details page
function updateProductDetails(product) {
  // Update page title
  document.title = `${product.name} - ROA Store`;
  
  // Update meta tags for social sharing
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.setAttribute('content', `${product.name} - ROA Store`);
  if (ogDesc) ogDesc.setAttribute('content', product.description);
  
  // Update breadcrumb
  const breadcrumb = document.getElementById('product-breadcrumb');
  if (breadcrumb) breadcrumb.textContent = product.name;
  
  // Update product details
  const nameElement = document.getElementById('product-name');
  const priceElement = document.getElementById('product-price');
  const categoryElement = document.getElementById('product-category');
  const descriptionElement = document.getElementById('product-description');
  const imageElement = document.getElementById('product-main-image');
  const newTagElement = document.getElementById('product-new-tag');
  
  if (nameElement) nameElement.textContent = product.name;
  if (priceElement) priceElement.textContent = `$${product.price}`;
  if (categoryElement) categoryElement.textContent = product.category;
  if (descriptionElement) descriptionElement.textContent = product.description;
  
  if (imageElement) {
    imageElement.src = product.image;
    imageElement.alt = product.name;
    imageElement.onerror = function() {
      this.onerror = null;
      this.src = 'images/decoration-top-left.jpg';
    };
  }
  
  if (newTagElement) {
    if (product.isNew) {
      newTagElement.classList.remove('hidden');
    } else {
      newTagElement.classList.add('hidden');
    }
  }
}

// Set up social media sharing buttons
function setupSharingButtons(product) {
  const currentUrl = window.location.href;
  const productTitle = product.name;
  
  // WhatsApp sharing
  const whatsappBtn = document.getElementById('share-whatsapp');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this amazing product: ${productTitle} ${currentUrl}`)}`;
      window.open(whatsappUrl, '_blank');
    });
  }
  
  // Twitter sharing
  const twitterBtn = document.getElementById('share-twitter');
  if (twitterBtn) {
    twitterBtn.addEventListener('click', function() {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing product from ROA Store!`)}&url=${encodeURIComponent(currentUrl)}`;
      window.open(twitterUrl, '_blank');
    });
  }
  
  // Pinterest sharing
  const pinterestBtn = document.getElementById('share-pinterest');
  if (pinterestBtn) {
    pinterestBtn.addEventListener('click', function() {
      const imageUrl = document.getElementById('product-main-image').src;
      const fullImageUrl = new URL(imageUrl, window.location.href).href;
      const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(fullImageUrl)}&description=${encodeURIComponent(productTitle)}`;
      window.open(pinterestUrl, '_blank');
    });
  }
  
  // Instagram sharing
  const instagramBtn = document.getElementById('share-instagram');
  if (instagramBtn) {
    instagramBtn.addEventListener('click', function() {
      alert('Instagram sharing is best done by taking a screenshot and sharing directly from the Instagram app.');
      window.open('https://instagram.com', '_blank');
    });
  }
  
  // Copy link
  const copyLinkBtn = document.getElementById('copy-link');
  const copyFeedback = document.getElementById('copy-feedback');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(currentUrl).then(function() {
        if (copyFeedback) {
          copyFeedback.classList.add('visible');
          setTimeout(function() {
            copyFeedback.classList.remove('visible');
          }, 2000);
        }
      }).catch(function(err) {
        console.error('Could not copy text: ', err);
      });
    });
  }
}

// Load related products
function loadRelatedProducts(currentProduct) {
  const relatedContainer = document.getElementById('related-products-container');
  if (!relatedContainer) return;
  
  // Find products in the same category
  const relatedProducts = products.filter(p => 
    p.id !== currentProduct.id && p.category === currentProduct.category
  ).slice(0, 4);
  
  // If no related products in same category, show other products
  if (relatedProducts.length === 0) {
    const otherProducts = products.filter(p => p.id !== currentProduct.id).slice(0, 4);
    displayProducts(relatedContainer, otherProducts);
    return;
  }
  
  // Display related products
  displayProducts(relatedContainer, relatedProducts);
}
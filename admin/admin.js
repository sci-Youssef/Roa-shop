// Admin credentials (in a real application, this would be handled server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const closeModal = document.querySelector('.close-modal');
const productsTableBody = document.getElementById('products-table-body');

// Global products array
let adminProducts = [];

// Function to load products without reloading - with timeout safety
function loadProductsFromJs() {
    return new Promise((resolve, reject) => {
        // Set a timeout to prevent getting stuck
        const timeout = setTimeout(() => {
            console.warn('Product loading timed out - using empty product array');
            adminProducts = [];
            resolve(adminProducts);
        }, 5000); // 5 second timeout
        
        try {
            console.log("Attempting to load products from products.js...");
            
            // Direct reference to products if already loaded by script tag
            if (typeof products !== 'undefined' && Array.isArray(products)) {
                clearTimeout(timeout);
                console.log('Successfully found products in global scope:', products.length);
                // Make a deep copy to avoid reference issues
                adminProducts = JSON.parse(JSON.stringify(products));
                console.log('Copied products to adminProducts array');
                resolve(adminProducts);
                return;
            }
            
            console.log('Products not found in global scope, trying to load from script');
            
            // Try to load from script tag if not already loaded
            const script = document.createElement('script');
            script.src = '../js/products.js?t=' + Date.now(); // Add timestamp to prevent caching
            script.onload = function() {
                clearTimeout(timeout);
                if (typeof products !== 'undefined' && Array.isArray(products)) {
                    console.log('Successfully loaded products via script tag:', products.length);
                    adminProducts = JSON.parse(JSON.stringify(products));
                    resolve(adminProducts);
                } else {
                    console.log('Script loaded but products array not found');
                    // Try localStorage as last resort
                    const storedProducts = localStorage.getItem('adminProducts');
                    if (storedProducts) {
                        try {
                            adminProducts = JSON.parse(storedProducts);
                            console.log('Loaded products from localStorage:', adminProducts.length);
                            resolve(adminProducts);
                        } catch (e) {
                            console.error('Error parsing localStorage products:', e);
                            adminProducts = [];
                            resolve(adminProducts);
                        }
                    } else {
                        console.error('No products found anywhere - initializing empty array');
                        adminProducts = [];
                        resolve(adminProducts);
                    }
                }
            };
            
            script.onerror = function() {
                clearTimeout(timeout);
                console.error('Error loading products.js file');
                
                // Try localStorage as fallback
                const storedProducts = localStorage.getItem('adminProducts');
                if (storedProducts) {
                    try {
                        adminProducts = JSON.parse(storedProducts);
                        console.log('Loaded products from localStorage as fallback:', adminProducts.length);
                        resolve(adminProducts);
                    } catch (e) {
                        console.error('Error parsing localStorage products:', e);
                        adminProducts = [];
                        resolve(adminProducts);
                    }
                } else {
                    console.error('No products found in localStorage either - initializing empty array');
                    adminProducts = [];
                    resolve(adminProducts);
                }
            };
            
            document.head.appendChild(script);
        } catch (error) {
            clearTimeout(timeout);
            console.error('Error in loadProductsFromJs:', error);
            adminProducts = [];
            resolve(adminProducts);
        }
    });
}

// Check if user is logged in - with timeout safety
function checkAuth() {
    try {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (isLoggedIn) {
            showDashboard();
        }
    } catch (error) {
        console.error('Error in checkAuth:', error);
        // Default to login screen on error
        showLogin();
    }
}

// Login form handler - with better error handling
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('isAdminLoggedIn', 'true');
            showDashboard();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Error in login form handler:', error);
        alert('Login error: ' + error.message);
    }
});

// Logout handler
logoutBtn.addEventListener('click', () => {
    try {
        localStorage.removeItem('isAdminLoggedIn');
        showLogin();
    } catch (error) {
        console.error('Error in logout handler:', error);
        alert('Logout error: ' + error.message);
        // Force reload the page as a fallback
        window.location.reload();
    }
});

// Show/Hide sections - with error handling
function showDashboard() {
    try {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        
        // Add the save button to the action bar if it doesn't exist
        const actionBar = document.querySelector('.action-bar');
        if (actionBar && !document.getElementById('save-products-btn')) {
            const saveBtn = document.createElement('button');
            saveBtn.id = 'save-products-btn';
            saveBtn.className = 'btn-primary';
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Products.js';
            saveBtn.style.marginLeft = '10px';
            saveBtn.addEventListener('click', saveProductsJsFile);
            actionBar.appendChild(saveBtn);
        }
        
        // Load products and update the table
        loadProductsAndRefreshTable();
    } catch (error) {
        console.error('Error in showDashboard:', error);
        alert('Error showing dashboard: ' + error.message);
    }
}

// Load products and refresh the table - with error handling and timeout
async function loadProductsAndRefreshTable() {
    // Create a loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.innerHTML = 'Loading products...';
    loadingIndicator.style.padding = '20px';
    loadingIndicator.style.textAlign = 'center';
    if (productsTableBody) {
        productsTableBody.innerHTML = '';
        productsTableBody.appendChild(loadingIndicator);
    }
    
    try {
        console.log("Starting to load products and refresh table");
        
        // Set a timeout promise to ensure we don't get stuck
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
                console.warn("Product loading timed out - using empty product list");
                adminProducts = [];
                resolve(adminProducts);
            }, 5000); // 5 second timeout
        });
        
        // Race between actual loading and timeout
        adminProducts = await Promise.race([
            loadProductsFromJs(),
            timeoutPromise
        ]);
        
        console.log("After loading, adminProducts has", adminProducts.length, "items");
        
        // Update the table with the loaded products
        updateProductsTable();
    } catch (error) {
        console.error('Error loading products:', error);
        showStatusMessage('Error loading products. Please check console for details.', 'error');
        
        // Show error in table
        if (productsTableBody) {
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: red;">
                        Error loading products: ${error.message}<br>
                        <a href="fix-admin.html" style="color: blue;">Click here to fix</a>
                    </td>
                </tr>
            `;
        }
    }
}

function showLogin() {
    try {
        dashboardSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        loginForm.reset();
    } catch (error) {
        console.error('Error in showLogin:', error);
        alert('Error showing login: ' + error.message);
    }
}

// Modal handlers
addProductBtn.addEventListener('click', () => {
    productModal.classList.remove('hidden');
    productForm.reset();
    document.getElementById('modal-title').textContent = 'Add New Product';
    document.getElementById('product-image').required = true;
    productForm.dataset.editId = '';
});

closeModal.addEventListener('click', () => {
    productModal.classList.add('hidden');
});

// Function to save products.js file without causing page reloads
function saveProductsJsFile() {
    if (adminProducts.length === 0) {
        if (!confirm("Warning: You're about to save an empty products list. Continue?")) {
            return;
        }
    }
    
    // Format the products data as JavaScript code
    const productsScript = `// Products data - directly defined without localStorage initially
const products = ${JSON.stringify(adminProducts, null, 2)};`;
    
    // Create a download link for products.js
    const blob = new Blob([productsScript], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.js';
    
    // Create instructions for the user
    const instructions = document.createElement('div');
    instructions.className = 'status-message instructions';
    instructions.innerHTML = `
        <h3>Save Instructions:</h3>
        <ol>
            <li>A download for products.js will start automatically</li>
            <li>Save this file to replace your existing js/products.js file</li>
            <li>If you uploaded new images, make sure they are in your images folder</li>
        </ol>
        <button id="close-instructions" class="btn-secondary">Close</button>
    `;
    instructions.style.position = 'fixed';
    instructions.style.top = '50%';
    instructions.style.left = '50%';
    instructions.style.transform = 'translate(-50%, -50%)';
    instructions.style.backgroundColor = 'white';
    instructions.style.padding = '20px';
    instructions.style.borderRadius = '5px';
    instructions.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    instructions.style.zIndex = '9999';
    
    // Add the instructions to the page
    document.body.appendChild(instructions);
    
    // Add event listener to the close button
    document.getElementById('close-instructions').addEventListener('click', () => {
        instructions.remove();
    });
    
    // Start the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Also save to localStorage as backup
    localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
    
    // Show success message
    showStatusMessage('Products.js file prepared for download!', 'success');
}

// Show status message
function showStatusMessage(message, type = 'success') {
    const statusMsg = document.createElement('div');
    statusMsg.className = 'status-message';
    statusMsg.textContent = message;
    statusMsg.style.position = 'fixed';
    statusMsg.style.bottom = '20px';
    statusMsg.style.right = '20px';
    statusMsg.style.padding = '10px 20px';
    statusMsg.style.color = 'white';
    statusMsg.style.borderRadius = '4px';
    statusMsg.style.opacity = '0.9';
    
    // Set background color based on message type
    if (type === 'error') {
        statusMsg.style.backgroundColor = '#dc3545';
    } else if (type === 'warning') {
        statusMsg.style.backgroundColor = '#ffc107';
        statusMsg.style.color = '#000';
    } else {
        statusMsg.style.backgroundColor = 'var(--gold)';
    }
    
    document.body.appendChild(statusMsg);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
        statusMsg.remove();
    }, 3000);
}

// Product form handler
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(productForm);
    const imageFile = formData.get('image');
    
    // For edit, keep existing image path if no new image is provided
    let imageUrl;
    let productId = productForm.dataset.editId;
    
    if (productId) {
        // This is an edit operation
        productId = parseInt(productId);
        const existingProduct = adminProducts.find(p => p.id === productId);
        
        // Keep existing image if no new one is selected
        if (imageFile.name === '' || imageFile.size === 0) {
            imageUrl = existingProduct.image;
        } else {
            // New image for existing product - store the file name for later use
            const timestamp = Date.now();
            const imageName = `product-${timestamp}-${formData.get('price')}`;
            imageUrl = `images/${imageName}.jpg`;
            
            // Create a readable name
            showStatusMessage('Please save your new image as: ' + imageName + '.jpg', 'warning');
        }
    } else {
        // This is a new product
        productId = Date.now();
        
        // Generate a product image name that's easy to remember
        const imageName = `product-${productId}-${formData.get('price')}`;
        imageUrl = `images/${imageName}.jpg`;
        
        // Create a readable name
        showStatusMessage('Please save your image as: ' + imageName + '.jpg', 'warning');
    }

    // Create product data
    const productData = {
        id: parseInt(productId), // Ensure ID is an integer
        name: formData.get('name'),
        price: formData.get('price'),
        description: formData.get('description'),
        category: formData.get('category'),
        isNew: formData.get('isNew') === 'on',
        image: imageUrl
    };
    
    if (productForm.dataset.editId) {
        // Update existing product (find by ID and replace)
        const index = adminProducts.findIndex(p => p.id === parseInt(productForm.dataset.editId));
        if (index !== -1) {
            adminProducts[index] = productData;
        }
    } else {
        // Add new product
        adminProducts.push(productData);
    }
    
    // Save to localStorage for backup
    localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
    
    // Update the products table
    updateProductsTable();
    
    // Close modal and reset form
    productModal.classList.add('hidden');
    productForm.reset();
    productForm.dataset.editId = '';

    // Show success message
    showStatusMessage('Product saved to temporary storage! Click "Save Products.js" when finished.', 'success');
});

// Update products table
function updateProductsTable() {
    if (!productsTableBody) {
        console.error('Products table body element not found');
        return;
    }
    
    console.log('Updating products table with', adminProducts.length, 'products');
    
    if (!adminProducts || adminProducts.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">
                    <p>No products available. Add new products using the "Add New Product" button.</p>
                    <p style="margin-top: 10px;">
                        <button onclick="reloadProducts()" class="btn-secondary">Reload Products</button>
                        <button onclick="location.href='fix-admin.html'" class="btn-secondary" style="margin-left: 10px;">Fix Admin</button>
                    </p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Build HTML for each product row
    let tableHTML = '';
    
    // Loop through each product and create a table row
    adminProducts.forEach(product => {
        console.log('Processing product:', product.id, product.name);
        tableHTML += `
        <tr data-product-id="${product.id}">
            <td><img src="../${product.image}" alt="${product.name}" onerror="this.src='../images/decoration-top-left.jpg'" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.category || 'Uncategorized'}</td>
            <td>${product.isNew ? '<span class="new-tag">New</span>' : '-'}</td>
            <td>
                <button class="btn-secondary edit-product-btn" data-id="${product.id}">Edit</button>
                <button class="btn-secondary delete-product-btn" data-id="${product.id}">Delete</button>
            </td>
        </tr>
        `;
    });
    
    productsTableBody.innerHTML = tableHTML;
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

// Edit product
function editProduct(productId) {
    console.log('Editing product with ID:', productId);
    const product = adminProducts.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('modal-title').textContent = 'Edit Product';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        
        // Set category if exists, otherwise default to first option
        const categoryElement = document.getElementById('product-category');
        if (product.category && categoryElement.querySelector(`option[value="${product.category}"]`)) {
            categoryElement.value = product.category;
        }
        
        document.getElementById('product-is-new').checked = product.isNew;
        
        // Make image field optional during edit
        document.getElementById('product-image').required = false;
        
        // Store the product ID for updating
        productForm.dataset.editId = productId;
        
        productModal.classList.remove('hidden');
    } else {
        console.error('Product not found with ID:', productId);
        alert('Error: Product not found');
    }
}

// Delete product
function deleteProduct(productId) {
    console.log('Deleting product with ID:', productId);
    if (confirm('Are you sure you want to delete this product?')) {
        adminProducts = adminProducts.filter(p => p.id !== productId);
        localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
        updateProductsTable();
        showStatusMessage('Product deleted successfully. Remember to save Products.js', 'warning');
    }
}

// Add global closeModal function
function closeModal() {
    productModal.classList.add('hidden');
    productForm.reset();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin.js DOM ready - initializing admin functionality');
    
    // Check if products is available from the global scope (loaded by script tag in HTML)
    if (typeof products !== 'undefined' && Array.isArray(products)) {
        console.log('Products found in global scope:', products.length);
        // Initialize adminProducts with products array
        adminProducts = JSON.parse(JSON.stringify(products));
        
        // Check authentication and show dashboard if logged in
        checkAuth();
    } else {
        console.warn('Products not found in global scope, will attempt to load later');
        // Still check auth, loadProductsFromJs will be called when needed
        checkAuth();
    }
});

// Fix for Add New Product button
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up Add Product button handler');
    
    // Function to handle adding new products
    function handleAddProduct() {
        console.log('Add Product button clicked');
        if (!productForm || !productModal) {
            console.error('Product form or modal not found');
            return;
        }
        
        // Reset form and prepare modal
        productForm.reset();
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) modalTitle.textContent = 'Add New Product';
        
        const productImage = document.getElementById('product-image');
        if (productImage) productImage.required = true;
        
        productForm.dataset.editId = '';
        
        // Show modal
        productModal.classList.remove('hidden');
        console.log('Product modal displayed');
    }
    
    // Find and attach handler to Add Product button
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        console.log('Found Add Product button, attaching handler');
        addProductBtn.addEventListener('click', handleAddProduct);
    } else {
        console.warn('Add Product button not found on initial load');
        
        // Try again after a short delay
        setTimeout(function() {
            const btn = document.getElementById('add-product-btn');
            if (btn) {
                console.log('Found Add Product button on second attempt');
                btn.addEventListener('click', handleAddProduct);
            } else {
                console.error('Add Product button not found after delay');
            }
        }, 1000);
    }
}); 
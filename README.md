# Beaded Beauty - Handmade Bead Bags Website

A modern, responsive website showcasing handmade bead bags. This website is designed to be easily maintained and updated, perfect for hosting on GitHub Pages.

## Features

- Responsive design that works on all devices
- Mobile-friendly navigation with hamburger menu
- Product showcase with dynamic loading
- Contact form for customer inquiries
- Social media integration
- Modern and clean design

## How to Update the Website

### Updating Products

To add, remove, or modify products, edit the `js/products.js` file. Each product follows this format:

```javascript
{
    id: 1, // Unique number for each product
    name: "Product Name",
    price: 99.99,
    description: "Product description",
    image: "images/product-image.jpg"
}
```

To add a new product:
1. Add your product image to the `images` folder
2. Copy an existing product object in `products.js`
3. Update the values with your new product's information
4. Make sure to give it a unique ID
5. Add a comma after the previous product and paste your new product

### Updating Images

1. Prepare your images:
   - Recommended size: 800x600 pixels
   - Format: JPG or PNG
   - Keep file sizes under 500KB for good performance
2. Name your image files descriptively (e.g., "blue-crystal-bag.jpg")
3. Place the images in the `images` folder
4. Update the image references in `products.js` or HTML files as needed

### Updating Content

#### Homepage
Edit `index.html` to update:
- Store name/logo
- Hero section text and images
- Footer information

#### Products Page
Edit `products.html` for layout changes or `js/products.js` for product information.

#### Contact Page
Edit `contact.html` to update:
- Contact information
- Social media links
- Form fields

### Updating Styles

To modify the website's appearance, edit `styles/main.css`:
- Colors: Update the variables in the `:root` section
- Fonts: Change the Google Fonts link in HTML files and font-family in CSS
- Spacing: Modify padding and margin values
- Layout: Adjust grid and flexbox properties

## Hosting on GitHub Pages

1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to repository Settings > Pages
4. Select your main branch as the source
5. Your site will be published at `https://[username].github.io/[repository-name]`

## File Structure

```
bead-store/
├── index.html
├── products.html
├── contact.html
├── styles/
│   └── main.css
├── js/
│   ├── main.js
│   └── products.js
├── images/
│   ├── bag1.jpg
│   ├── bag2.jpg
│   └── bag3.jpg
└── README.md
```

## Need Help?

If you need assistance with updating the website or encounter any issues:
1. Check this README for guidance
2. Look for comments in the code files
3. Contact your web developer for support

## Technical Details

This website uses:
- HTML5
- CSS3 with Flexbox and Grid
- Vanilla JavaScript
- Google Fonts
- Font Awesome icons
- Mobile-first responsive design

No build tools or complex setup required - edit files directly and deploy! 
# DNS Configuration Guide for sllyd.com

## GitHub Pages Setup

### 1. Repository Configuration
- Create a new repository named `sllyd` (or your username.github.io)
- Upload all files from this directory to the repository
- Go to Settings > Pages
- Set Source to "Deploy from a branch"
- Select "main" branch and "/ (root)" folder
- Click "Save"

### 2. Custom Domain Setup
- In Settings > Pages, enter your custom domain: `sllyd.com`
- Check "Enforce HTTPS" (recommended)
- Click "Save"

## DNS Records Configuration

### For Domain Registrar (e.g., GoDaddy, Namecheap, etc.)

#### Option 1: A Records (Recommended)
Add these A records pointing to GitHub Pages IP addresses:

```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @
Value: 185.199.111.153
TTL: 3600
```

#### Option 2: CNAME Record
Add this CNAME record:

```
Type: CNAME
Name: @
Value: yourusername.github.io
TTL: 3600
```

### For Cloudflare (if using Cloudflare DNS)

1. Add your domain to Cloudflare
2. Update nameservers at your domain registrar
3. Add these DNS records:

```
Type: A
Name: @
Value: 185.199.108.153
Proxy status: DNS only (gray cloud)

Type: A
Name: @
Value: 185.199.109.153
Proxy status: DNS only (gray cloud)

Type: A
Name: @
Value: 185.199.110.153
Proxy status: DNS only (gray cloud)

Type: A
Name: @
Value: 185.199.111.153
Proxy status: DNS only (gray cloud)
```

## Verification Steps

### 1. Check DNS Propagation
- Use tools like whatsmydns.net or dnschecker.org
- Check if A records are propagated globally
- Wait 24-48 hours for full propagation

### 2. Test GitHub Pages
- Visit yourusername.github.io to ensure it works
- Check if custom domain appears in repository settings

### 3. Test Custom Domain
- Visit sllyd.com to verify it loads correctly
- Check for HTTPS redirect (should be automatic)

## Troubleshooting

### Common Issues:

1. **DNS Not Propagated**
   - Wait 24-48 hours
   - Check with multiple DNS lookup tools
   - Clear browser cache

2. **HTTPS Issues**
   - Ensure "Enforce HTTPS" is checked in GitHub Pages settings
   - Wait for SSL certificate to be issued (can take up to 24 hours)

3. **CNAME Conflicts**
   - Remove any existing CNAME records for @
   - Use A records instead of CNAME for root domain

4. **Repository Name Issues**
   - Repository must be named exactly as specified
   - Check repository visibility settings

### Testing Commands:
```bash
# Check DNS records
nslookup sllyd.com
dig sllyd.com

# Check GitHub Pages IPs
nslookup yourusername.github.io
```

## File Structure
Ensure these files are in your repository root:
- `index.html` (main page)
- `CNAME` (custom domain)
- `.nojekyll` (disable Jekyll)
- `404.html` (custom error page)
- `robots.txt` (SEO)
- `sitemap.xml` (SEO)
- `styles.css` (styling)
- `script.js` (functionality)
- `public/` (images directory)

## Security Headers (Optional)
Add these to your web server if possible:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Performance Optimization
- Images are optimized for web
- CSS and JS are minified
- Mobile-responsive design
- Fast loading times

## Support
If issues persist:
1. Check GitHub Pages documentation
2. Verify DNS configuration with your registrar
3. Test with different browsers/devices
4. Check browser developer tools for errors

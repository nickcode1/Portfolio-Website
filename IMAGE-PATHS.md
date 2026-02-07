# Portfolio Image Paths Reference

## Folder Structure You Need to Create

```
your-portfolio/
├── index.html
├── project-ai-platform.html
├── project-defi-dashboard.html
├── project-creative-studio.html
├── project-mobile-experience.html
├── project-data-visualization.html
├── project-ecommerce.html
├── project-style.css
├── images/
│   ├── profile.jpg                           (About section - 800x800px)
│   └── projects/
│       ├── ai-platform-thumb.jpg             (Project card - 800x600px)
│       ├── ai-platform-hero.jpg              (Project detail hero - 1400x600px)
│       ├── ai-platform-1.jpg                 (Gallery item - 600x600px)
│       ├── ai-platform-2.jpg                 (Gallery item - 600x600px)
│       ├── ai-platform-3.jpg                 (Gallery item - 600x600px)
│       ├── defi-dashboard-thumb.jpg          (Project card - 800x600px)
│       ├── defi-dashboard-hero.jpg           (Project detail hero - 1400x600px)
│       ├── defi-dashboard-1.jpg              (Gallery item - 600x600px)
│       ├── defi-dashboard-2.jpg              (Gallery item - 600x600px)
│       ├── defi-dashboard-3.jpg              (Gallery item - 600x600px)
│       ├── creative-studio-thumb.jpg         (Project card - 800x600px)
│       ├── creative-studio-hero.jpg          (Project detail hero - 1400x600px)
│       ├── creative-studio-1.jpg             (Gallery item - 600x600px)
│       ├── creative-studio-2.jpg             (Gallery item - 600x600px)
│       ├── creative-studio-3.jpg             (Gallery item - 600x600px)
│       ├── mobile-experience-thumb.jpg       (Project card - 800x600px)
│       ├── mobile-experience-hero.jpg        (Project detail hero - 1400x600px)
│       ├── mobile-experience-1.jpg           (Gallery item - 600x600px)
│       ├── mobile-experience-2.jpg           (Gallery item - 600x600px)
│       ├── mobile-experience-3.jpg           (Gallery item - 600x600px)
│       ├── data-visualization-thumb.jpg      (Project card - 800x600px)
│       ├── data-visualization-hero.jpg       (Project detail hero - 1400x600px)
│       ├── data-visualization-1.jpg          (Gallery item - 600x600px)
│       ├── data-visualization-2.jpg          (Gallery item - 600x600px)
│       ├── data-visualization-3.jpg          (Gallery item - 600x600px)
│       ├── ecommerce-thumb.jpg               (Project card - 800x600px)
│       ├── ecommerce-hero.jpg                (Project detail hero - 1400x600px)
│       ├── ecommerce-1.jpg                   (Gallery item - 600x600px)
│       ├── ecommerce-2.jpg                   (Gallery item - 600x600px)
│       └── ecommerce-3.jpg                   (Gallery item - 600x600px)
```

## Total Images Needed: 26 images

- 1 profile photo
- 6 project thumbnails (for cards on homepage)
- 6 project hero images (for detail pages)
- 18 gallery images (3 per project)

## Where Each Image Appears

### index.html
- `images/profile.jpg` → About section (your photo)
- `images/projects/ai-platform-thumb.jpg` → Project card 1
- `images/projects/defi-dashboard-thumb.jpg` → Project card 2
- `images/projects/creative-studio-thumb.jpg` → Project card 3
- `images/projects/mobile-experience-thumb.jpg` → Project card 4
- `images/projects/data-visualization-thumb.jpg` → Project card 5
- `images/projects/ecommerce-thumb.jpg` → Project card 6

### project-ai-platform.html
- `images/projects/ai-platform-hero.jpg` → Hero section
- `images/projects/ai-platform-1.jpg` → Gallery item 1
- `images/projects/ai-platform-2.jpg` → Gallery item 2
- `images/projects/ai-platform-3.jpg` → Gallery item 3

### project-defi-dashboard.html
- `images/projects/defi-dashboard-hero.jpg` → Hero section
- `images/projects/defi-dashboard-1.jpg` → Gallery item 1
- `images/projects/defi-dashboard-2.jpg` → Gallery item 2
- `images/projects/defi-dashboard-3.jpg` → Gallery item 3

### project-creative-studio.html
- `images/projects/creative-studio-hero.jpg` → Hero section
- `images/projects/creative-studio-1.jpg` → Gallery item 1
- `images/projects/creative-studio-2.jpg` → Gallery item 2
- `images/projects/creative-studio-3.jpg` → Gallery item 3

### project-mobile-experience.html
- `images/projects/mobile-experience-hero.jpg` → Hero section
- `images/projects/mobile-experience-1.jpg` → Gallery item 1
- `images/projects/mobile-experience-2.jpg` → Gallery item 2
- `images/projects/mobile-experience-3.jpg` → Gallery item 3

### project-data-visualization.html
- `images/projects/data-visualization-hero.jpg` → Hero section
- `images/projects/data-visualization-1.jpg` → Gallery item 1
- `images/projects/data-visualization-2.jpg` → Gallery item 2
- `images/projects/data-visualization-3.jpg` → Gallery item 3

### project-ecommerce.html
- `images/projects/ecommerce-hero.jpg` → Hero section
- `images/projects/ecommerce-1.jpg` → Gallery item 1
- `images/projects/ecommerce-2.jpg` → Gallery item 2
- `images/projects/ecommerce-3.jpg` → Gallery item 3

## Quick Tips

1. **Don't have images yet?** You can use placeholder images from:
   - Unsplash: https://unsplash.com (free stock photos)
   - Placeholder services: https://placehold.co/1400x600 (instant placeholders)

2. **Want to test quickly?** Replace any path with an Unsplash URL:
   ```html
   style="background-image: url('https://images.unsplash.com/photo-1555066931-4365d14bab8c');"
   ```

3. **Image optimization**: Before adding real images, compress them with:
   - TinyPNG: https://tinypng.com
   - Squoosh: https://squoosh.app

4. **Supported formats**: JPG, PNG, WebP, GIF, SVG

## All Image Paths Are Already Added!

All the HTML files have been updated with the correct image paths. Just create the `images` folder structure and add your images with the exact names shown above. The website will automatically display them!

# Blaze's Portfolio Website

## Overview

This is a static portfolio website for "Blaze" featuring a modern, minimalist design with animated elements and smooth scrolling effects. The project consists of a client-side HTML/CSS/JavaScript frontend with a simple Python development server for local hosting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a simple static website architecture with client-side rendering and animations. It uses vanilla JavaScript for interactivity and a Python HTTP server for development hosting.

### Frontend Architecture
- **Static HTML/CSS/JavaScript**: Pure frontend approach without frameworks
- **Responsive Design**: Mobile-first design using CSS clamp() and viewport units
- **Animation System**: CSS animations combined with Intersection Observer API for scroll-triggered effects
- **Typography**: Google Fonts (Poppins) for modern typography

### Backend Architecture
- **Development Server**: Simple Python HTTP server for local development
- **Static File Serving**: Serves HTML, CSS, JS, and other static assets
- **CORS Support**: Configured for cross-origin requests during development

## Key Components

### 1. Landing Section (Hero)
- Full-viewport hero section with animated text
- Glowing sphere visual element (CSS-based)
- Fade-in animation on page load

### 2. Portfolio Section
- Grid-based project showcase
- Staggered animation effects using Intersection Observer
- Six project cards with descriptions

### 3. Animation System
- **Intersection Observer**: Triggers animations when elements enter viewport
- **Staggered Animations**: Cards animate sequentially with 150ms delays
- **Smooth Scrolling**: Enhanced scroll behavior for anchor links

### 4. Development Server
- Python HTTP server running on port 5000
- CORS headers for development convenience
- Static file serving from project directory

## Data Flow

1. **Page Load**: HTML loads with CSS and JavaScript
2. **Animation Setup**: JavaScript initializes Intersection Observers
3. **Scroll Detection**: Observers detect when sections enter viewport
4. **Animation Triggers**: CSS classes added to trigger animations
5. **Staggered Effects**: Cards animate with calculated delays

## External Dependencies

### Fonts
- **Google Fonts**: Poppins font family (weights: 300, 400, 600)

### Runtime Dependencies
- **Python 3**: For development server
- **Modern Browser**: Supporting Intersection Observer API and CSS Grid

## Deployment Strategy

### Development
- Python HTTP server serves files locally on localhost:5000
- All assets served statically from project root

### Production Options
- Can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages)
- No server-side processing required
- All files can be served directly from CDN

### Performance Considerations
- Minimal JavaScript footprint using vanilla JS
- CSS animations leveraging GPU acceleration
- Optimized font loading with Google Fonts display=swap
- Responsive images and clamp() for scalable typography

## Key Design Decisions

### Why Static Architecture?
- **Simplicity**: Portfolio doesn't require dynamic content or user interaction
- **Performance**: Fast loading with minimal overhead
- **Deployment**: Easy to host anywhere without server requirements

### Why Vanilla JavaScript?
- **Lightweight**: No framework overhead for simple animations
- **Browser Support**: Modern API support is sufficient for target audience
- **Maintainability**: Simple codebase without build tools

### Why Python Server?
- **Development Convenience**: Quick local server setup
- **CORS Handling**: Proper headers for development
- **Minimal Dependencies**: Uses only Python standard library
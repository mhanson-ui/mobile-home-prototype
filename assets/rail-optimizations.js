// Rail-Specific Optimizations
// Performance and UX improvements for individual rail types

const RailOptimizations = {
  // Hero Spotlight optimizations
  heroSpotlight: {
    // Optimize carousel cycling performance
    optimizeCycling: (carousel) => {
      const mainContainer = carousel.querySelector('.hero-main-container');
      const thumbsTrack = carousel.querySelector('.hero-thumbs-track');
      
      if (!mainContainer || !thumbsTrack) return;
      
      let currentIndex = 0;
      const cards = Array.from(carousel.querySelectorAll('.card'));
      let cycleInterval;
      let isUserInteracting = false;
      
      // Preload images for smoother transitions
      const preloadImages = () => {
        cards.forEach(card => {
          const img = card.querySelector('img');
          if (img && img.src) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
          }
        });
      };
      
      // Smooth card transition with fade effect
      const showCard = (index) => {
        if (cards.length === 0) return;
        
        currentIndex = (index + cards.length) % cards.length;
        const card = cards[currentIndex];
        
        // Add fade transition
        mainContainer.style.opacity = '0';
        
        setTimeout(() => {
          // Update main container
          mainContainer.innerHTML = card.outerHTML;
          
          // Update thumbnails with active state
          cards.forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === currentIndex);
            thumb.classList.toggle('upcoming', idx === (currentIndex + 1) % cards.length);
          });
          
          // Fade in
          mainContainer.style.opacity = '1';
          
          if (Console.log) {
            Console.log(`hero_cycle_optimized index=${currentIndex} title=${card.querySelector('.meta')?.textContent || 'card'}`);
          }
        }, 150);
      };
      
      // Start auto-cycle with performance monitoring
      const startAutoCycle = () => {
        if (cycleInterval) clearInterval(cycleInterval);
        
        cycleInterval = setInterval(() => {
          if (cards.length > 1 && !isUserInteracting) {
            showCard(currentIndex + 1);
          }
        }, 6000); // Slightly longer for better UX
      };
      
      // Pause cycling on user interaction
      const pauseOnInteraction = () => {
        isUserInteracting = true;
        if (cycleInterval) clearInterval(cycleInterval);
        
        // Resume after 10 seconds of no interaction
        setTimeout(() => {
          isUserInteracting = false;
          startAutoCycle();
        }, 10000);
      };
      
      // Enhanced thumbnail interactions
      thumbsTrack.addEventListener('click', (e) => {
        const thumb = e.target.closest('.card');
        if (thumb) {
          const index = cards.indexOf(thumb);
          showCard(index);
          pauseOnInteraction();
        }
      });
      
      // Keyboard navigation
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          showCard(currentIndex - 1);
          pauseOnInteraction();
        } else if (e.key === 'ArrowRight') {
          showCard(currentIndex + 1);
          pauseOnInteraction();
        }
      });
      
      // Touch/swipe support for mobile
      let touchStartX = 0;
      let touchEndX = 0;
      
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });
      
      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });
      
      const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            // Swipe left - next card
            showCard(currentIndex + 1);
          } else {
            // Swipe right - previous card
            showCard(currentIndex - 1);
          }
          pauseOnInteraction();
        }
      };
      
      // Initialize
      preloadImages();
      showCard(0);
      startAutoCycle();
      
      // Pause on hover/focus
      carousel.addEventListener('mouseenter', () => {
        if (cycleInterval) clearInterval(cycleInterval);
      });
      
      carousel.addEventListener('mouseleave', startAutoCycle);
      
      carousel.addEventListener('focusin', () => {
        if (cycleInterval) clearInterval(cycleInterval);
      });
      
      carousel.addEventListener('focusout', startAutoCycle);
    }
  },

  // Continue Watching optimizations
  continueWatching: {
    // Enhance progress tracking accuracy
    optimizeProgress: (carousel) => {
      const cards = carousel.querySelectorAll('.card');
      
      cards.forEach(card => {
        const progressBar = card.querySelector('.progress-bar');
        const progressFill = card.querySelector('.progress-fill');
        
        if (progressBar && progressFill) {
          // Add hover effect to show exact progress
          progressBar.addEventListener('mouseenter', () => {
            const progress = progressBar.getAttribute('data-progress') || 0;
            progressBar.title = `${progress}% complete`;
          });
          
          // Add click to jump to position
          progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newProgress = Math.round((clickX / rect.width) * 100);
            
            // Update progress bar
            progressFill.style.width = `${newProgress}%`;
            progressBar.setAttribute('data-progress', newProgress);
            
            if (Console.log) {
              Console.log(`progress_jump from=${progressBar.getAttribute('data-progress')} to=${newProgress}`);
            }
          });
        }
      });
    }
  },

  // Live Now optimizations
  liveNow: {
    // Improve ticker animation efficiency
    optimizeTicker: (carousel) => {
      const track = carousel.querySelector('.track');
      if (!track) return;
      
      let tickerInterval;
      let isPaused = false;
      
      // Smooth ticker animation
      const startTicker = () => {
        if (tickerInterval) clearInterval(tickerInterval);
        
        tickerInterval = setInterval(() => {
          if (isPaused) return;
          
          if (track.scrollLeft >= track.scrollWidth - track.clientWidth) {
            // Smooth reset to beginning
            track.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Smooth scroll forward
            track.scrollBy({ left: 2, behavior: 'auto' });
          }
        }, 50); // Smoother animation
      };
      
      // Pause ticker on interaction
      const pauseTicker = () => {
        isPaused = true;
        if (tickerInterval) clearInterval(tickerInterval);
      };
      
      const resumeTicker = () => {
        isPaused = false;
        startTicker();
      };
      
      // Pause on hover/focus
      carousel.addEventListener('mouseenter', pauseTicker);
      carousel.addEventListener('mouseleave', resumeTicker);
      carousel.addEventListener('focusin', pauseTicker);
      carousel.addEventListener('focusout', resumeTicker);
      
      // Start ticker
      startTicker();
    }
  },

  // For You Mosaic optimizations
  forYouMosaic: {
    // Optimize mixed-size layout calculations
    optimizeLayout: (carousel) => {
      const cards = carousel.querySelectorAll('.card');
      const track = carousel.querySelector('.track');
      
      if (!track) return;
      
      // Calculate optimal card sizes based on content
      const optimizeCardSizes = () => {
        cards.forEach(card => {
          const size = card.getAttribute('data-size') || 'M';
          const title = card.querySelector('.meta')?.textContent || '';
          
          // Adjust card size based on title length and importance
          let optimalSize = size;
          if (title.length > 30) optimalSize = 'L';
          if (title.includes('Oscar') || title.includes('Winner')) optimalSize = 'XL';
          
          card.setAttribute('data-optimal-size', optimalSize);
          card.classList.add(`size-${optimalSize.toLowerCase()}`);
        });
      };
      
      // Responsive layout adjustments
      const adjustLayout = () => {
        const containerWidth = track.clientWidth;
        
        if (containerWidth < 600) {
          // Mobile: stack vertically
          track.style.flexDirection = 'column';
          track.style.alignItems = 'center';
        } else if (containerWidth < 900) {
          // Tablet: 2-column grid
          track.style.display = 'grid';
          track.style.gridTemplateColumns = 'repeat(2, 1fr)';
          track.style.gap = '16px';
        } else {
          // Desktop: horizontal scroll
          track.style.display = 'flex';
          track.style.flexDirection = 'row';
          track.style.gap = '16px';
        }
      };
      
      // Initialize optimizations
      optimizeCardSizes();
      adjustLayout();
      
      // Adjust on resize
      window.addEventListener('resize', adjustLayout);
    }
  },

  // Performance monitoring for all rails
  performance: {
    // Monitor rail rendering performance
    monitorRailPerformance: (container) => {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            if (Console.log) {
              Console.log(`performance_measure: ${entry.name} = ${Math.round(entry.duration)}ms`);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure'] });
      
      // Measure rail setup time
      performance.mark('rail-setup-start');
      
      // Measure after a short delay to capture initial render
      setTimeout(() => {
        performance.mark('rail-setup-end');
        performance.measure('rail-setup', 'rail-setup-start', 'rail-setup-end');
      }, 100);
    },
    
    // Optimize image loading
    optimizeImageLoading: (container) => {
      const images = container.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    },
    
    // Debounce expensive operations
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  }
};

// Apply optimizations to a rail based on its type
function applyRailOptimizations(railElement) {
  const railType = railElement.getAttribute('data-rail');
  const carousel = railElement.querySelector('.carousel');
  
  if (!carousel) return;
  
  // Apply type-specific optimizations
  switch (railType) {
    case 'hero_spotlight':
      if (RailOptimizations.heroSpotlight.optimizeCycling) {
        RailOptimizations.heroSpotlight.optimizeCycling(carousel);
      }
      break;
      
    case 'continue_watching':
      if (RailOptimizations.continueWatching.optimizeProgress) {
        RailOptimizations.continueWatching.optimizeProgress(carousel);
      }
      break;
      
    case 'live_now':
      if (RailOptimizations.liveNow.optimizeTicker) {
        RailOptimizations.liveNow.optimizeTicker(carousel);
      }
      break;
      
    case 'for_you_mosaic':
      if (RailOptimizations.forYouMosaic.optimizeLayout) {
        RailOptimizations.forYouMosaic.optimizeLayout(carousel);
      }
      break;
  }
  
  // Apply performance optimizations to all rails
  if (RailOptimizations.performance.monitorRailPerformance) {
    RailOptimizations.performance.monitorRailPerformance(railElement);
  }
  
  if (RailOptimizations.performance.optimizeImageLoading) {
    RailOptimizations.performance.optimizeImageLoading(railElement);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RailOptimizations, applyRailOptimizations };
} else {
  // Browser global
  window.RailOptimizations = RailOptimizations;
  window.applyRailOptimizations = applyRailOptimizations;
}

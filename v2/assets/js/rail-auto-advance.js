// Rail Auto-Advance Module - Handles automatic carousel advancement
export class RailAutoAdvance {
  constructor(carousel, config) {
    this.carousel = carousel;
    this.config = config;
    this.track = carousel.querySelector('.track');
    this.cards = Array.from(carousel.querySelectorAll('.card'));
    this.currentIndex = 0;
    this.autoAdvanceInterval = null;
    this.inactivityTimer = null;
    this.isUserInteracting = false;
    
    this.init();
  }

  init() {
    // Set up event listeners
    this.setupEventListeners();
    
    // Start inactivity timer
    this.resetInactivityTimer();
  }

  setupEventListeners() {
    // User interaction events
    const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll'];
    
    interactionEvents.forEach(event => {
      this.carousel.addEventListener(event, () => this.handleUserInteraction());
    });

    // Also listen on the track for scroll events
    this.track.addEventListener('scroll', () => this.handleUserInteraction());

    // Listen for focus events on cards
    this.cards.forEach(card => {
      card.addEventListener('focus', () => this.handleUserInteraction());
    });

    // Check viewport visibility
    window.addEventListener('scroll', () => this.checkViewportVisibility());
    window.addEventListener('resize', () => this.checkViewportVisibility());
  }

  handleUserInteraction() {
    this.isUserInteracting = true;
    this.stopAutoAdvance();
    this.resetInactivityTimer();
  }

  resetInactivityTimer() {
    // Clear existing timer
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Start new timer
    this.inactivityTimer = setTimeout(() => {
      this.isUserInteracting = false;
      if (this.isInViewport()) {
        this.startAutoAdvance();
      }
    }, this.config.autoAdvanceDelay);
  }

  startAutoAdvance() {
    // Don't start if already running or user is interacting
    if (this.autoAdvanceInterval || this.isUserInteracting) return;

    // Don't start if not in viewport
    if (!this.isInViewport()) return;

    console.log('Starting auto-advance for rail:', this.carousel.closest('.row')?.getAttribute('data-rail'));

    this.autoAdvanceInterval = setInterval(() => {
      this.advanceToNext();
    }, this.config.autoAdvanceInterval);

    // Show indicator
    this.showAutoAdvanceIndicator();
  }

  stopAutoAdvance() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }

    // Hide indicator
    this.hideAutoAdvanceIndicator();
  }

  advanceToNext() {
    if (this.cards.length === 0) return;

    // Calculate next index
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;

    // Scroll to next card
    const card = this.cards[this.currentIndex];
    if (card) {
      const cardLeft = card.offsetLeft;
      const trackScrollLeft = this.track.scrollLeft;
      const trackWidth = this.track.clientWidth;
      const cardWidth = card.offsetWidth;

      // Check if card is already visible
      if (cardLeft < trackScrollLeft || cardLeft + cardWidth > trackScrollLeft + trackWidth) {
        // Scroll to show the card
        this.track.scrollTo({
          left: cardLeft - 20, // 20px padding
          behavior: 'smooth'
        });
      }
    }
  }

  isInViewport() {
    const rect = this.carousel.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if carousel is at least partially visible
    return rect.top < viewportHeight && rect.bottom > 0;
  }

  checkViewportVisibility() {
    if (this.isInViewport() && !this.isUserInteracting && !this.autoAdvanceInterval) {
      this.startAutoAdvance();
    } else if (!this.isInViewport() && this.autoAdvanceInterval) {
      this.stopAutoAdvance();
    }
  }

  showAutoAdvanceIndicator() {
    if (!this.carousel.querySelector('.auto-advance-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'auto-advance-indicator';
      indicator.innerHTML = '▶ Auto-advancing';
      this.carousel.appendChild(indicator);
    }
  }

  hideAutoAdvanceIndicator() {
    const indicator = this.carousel.querySelector('.auto-advance-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  destroy() {
    this.stopAutoAdvance();
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }
}

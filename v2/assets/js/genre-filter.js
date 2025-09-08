// Genre Filter Module - Handles chip-based content filtering
export class GenreFilter {
  constructor(app) {
    this.app = app;
    this.container = null;
    this.activeGenre = 'all';
  }

  init() {
    // Create filter UI
    this.createFilterUI();
    
    // Set up event listeners
    this.attachEventListeners();
  }

  createFilterUI() {
    // Check if filter already exists
    if (document.querySelector('.v2-genre-filters')) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'v2-genre-filters';
    filterContainer.innerHTML = `
      <div class="filter-chips">
        <div class="chip active" data-genre="all">All</div>
        <div class="chip" data-genre="live">Live</div>
        <div class="chip" data-genre="sports">Sports</div>
        <div class="chip" data-genre="drama">Drama</div>
        <div class="chip" data-genre="comedy">Comedy</div>
        <div class="chip" data-genre="action">Action</div>
        <div class="chip" data-genre="documentary">Documentary</div>
        <div class="chip" data-genre="reality">Reality</div>
        <div class="chip" data-genre="news">News</div>
        <div class="chip" data-genre="animation">Animation</div>
      </div>
    `;

    // Insert before main content
    document.body.insertBefore(filterContainer, this.app.container);
    this.container = filterContainer;
  }

  attachEventListeners() {
    const chips = this.container.querySelectorAll('.chip');
    
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const genre = e.target.getAttribute('data-genre');
        this.selectGenre(genre);
      });
    });
  }

  selectGenre(genre) {
    // Update active chip
    const chips = this.container.querySelectorAll('.chip');
    chips.forEach(chip => {
      if (chip.getAttribute('data-genre') === genre) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // Update active genre
    this.activeGenre = genre;

    // Filter content
    this.app.filterByGenre(genre);

    // Log for debugging
    console.log('Genre filter applied:', genre);
  }

  getActiveGenre() {
    return this.activeGenre;
  }
}

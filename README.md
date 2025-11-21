# UCI GE Finder

A web application that helps UC Irvine students find general education (GE) courses, including the ability to find those that satisfy multiple GE requirements simultaneously.

## Features

- **Dual GE Category Search**: Select two GE categories to find courses that fulfill both requirements at once
- **Course Search**: Filter courses by name, code, or description
- **Sortable Results**: Sort courses by code, title, units, or GE categories
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

**Frontend**
- React with TypeScript
- Vite
- Tailwind CSS

**Backend**
- Python with Flask
- Redis for caching and rate limiting
- Flask-Caching for performance optimization
- Flask-Limiter for rate limiting

## Data Attribution

Course data provided by [Anteater API](https://icssc.link/about-anteaterapi).

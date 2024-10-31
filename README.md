# Clydro 🌊

## Description
Clydro is a modern sprinkler company specializing in smart irrigation systems that use soil data and weather forecasting to optimize watering schedules.

## 🛠️ Technologies & Frameworks Used

### Frontend
- **React.js** - Core frontend framework
- **React DOM** - DOM manipulation
- **React Scripts** - Development scripts and tooling
- **HTML5** - Latest semantic HTML
- **CSS3** - Modern styling with flexbox/grid
- **JavaScript (ES6+)** - Modern JavaScript features

### Testing Framework
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Web Vitals** - Performance monitoring

### Development & Build Tools
- **Node.js** - JavaScript runtime
- **npm** - Package management
- **Create React App** - Project bootstrapping
- **Webpack** - Module bundling (included in CRA)
- **Babel** - JavaScript compilation (included in CRA)
- **ESLint** - Code linting
- **Git** - Version control
- **Web Vitals** - Performance metrics

## 🚀 Getting Started

### Prerequisites
Before running this project, ensure you have:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Git

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/clydro.git
cd clydro
```

2. Install dependencies:
```bash
npm install
```

### Running the Application
Start the development server:
```bash
npm start
```
The application will open at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm start` - Runs development server
- `npm test` - Executes test suite
- `npm run build` - Creates production build
- `npm run eject` - Ejects from Create React App
- `npm run lint` - Runs ESLint checks

## 🏗️ Project Structure
```
clydro/
├── public/                 # Static files
│   ├── index.html         # Entry HTML
│   ├── favicon.ico        # Favicon
│   ├── manifest.json      # PWA manifest
│   ├── robots.txt         # SEO robots file
│   └── assets/           
│       ├── logo192.png    # App icons
│       └── logo512.png
├── src/                   # Source files
│   ├── index.js          # Application entry
│   ├── index.css         # Global styles
│   ├── App.test.js       # App tests
│   ├── setupTests.js     # Test configuration
│   ├── reportWebVitals.js# Performance reporting
│   └── logo.svg          # Logo asset
├── package.json          # Dependencies & scripts
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

## 🔧 Configuration
The application can be configured through various environment variables:
- Create a `.env` file in the root directory
- Add environment-specific variables:
```env
REACT_APP_API_URL=your_api_url
REACT_APP_ENV=development
```

## 🚀 Deployment
Build the application for production:
```bash
npm run build
```
This creates an optimized build in the `build` folder ready for deployment.

### Deployment Platforms
You can deploy this application to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Heroku

## 🧪 Testing
Run the test suite:
```bash
npm test
```
This launches the test runner in interactive watch mode.

## 📈 Performance Monitoring
The application includes Web Vitals monitoring for:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

## 🙏 Acknowledgments
- Create React App team
- React.js community